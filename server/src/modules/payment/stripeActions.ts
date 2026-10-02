import Stripe from "stripe";
import ActionError from "../ActionError";
import type CartOwner from "../cart/CartOwner";
import cartRepository from "../cart/cartRepository";
import { sendPaymentConfirmationEmail } from "../email/emailService";
import { createInvoicePdf } from "../invoice/invoiceService";
import orderActions from "../order/orderActions";
import orderRepository from "../order/orderRepository";
import paymentRepository from "./paymentRepository";

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error("STRIPE_SECRET_KEY is not configured.");
  return new Stripe(secretKey);
}

function getClientUrl() {
  const clientUrl = process.env.CLIENT_URL?.replace(/\/$/, "");
  if (!clientUrl) throw new Error("CLIENT_URL is not configured.");
  return clientUrl;
}

const createCheckoutSessionAction = async (
  owner: CartOwner,
  input: {
    customer_email: string;
    shipping_first_name: string;
    shipping_last_name: string;
    shipping_address: string;
    shipping_city: string;
    shipping_postal_code: string;
    shipping_country: string;
  },
) => {
  const order = await orderActions.createOrderAction(owner, input);

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      customer_email: input.customer_email.trim().toLowerCase(),
      client_reference_id: String(order.orderId),
      metadata: { order_id: String(order.orderId) },
      expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
      success_url: `${getClientUrl()}/checkout?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getClientUrl()}/checkout?cancelled=1&order_id=${order.orderId}`,
      line_items: order.items.map((item) => {
        const options = [item.color, item.size].filter(Boolean).join(" / ");
        return {
          quantity: item.quantity,
          price_data: {
            currency: "eur",
            unit_amount: Math.round(item.price_unit * 100),
            product_data: {
              name: item.name,
              ...(options ? { description: options } : {}),
            },
          },
        };
      }),
    });
    if (!session.url) throw new Error("Stripe did not return a checkout URL.");
    await orderRepository.attachStripeSession(order.orderId, session.id);
    return {
      orderId: order.orderId,
      totalPrice: order.totalPrice,
      url: session.url,
    };
  } catch (error) {
    await orderRepository.markCheckoutFailed(order.orderId);
    throw error;
  }
};

const getCheckoutSessionAction = async (
  owner: CartOwner,
  sessionId: string,
) => {
  if (!sessionId || sessionId.length > 255) {
    throw new ActionError("BAD_REQUEST", "Session de paiement invalide.");
  }
  const order = await orderRepository.findByStripeSession(sessionId);
  if (!order) throw new ActionError("NOT_FOUND", "Commande introuvable.");
  const canAccess =
    owner.kind === "user"
      ? owner.userId === order.user_id
      : owner.guestTokenHash === order.guest_cart_token_hash;
  if (!canAccess) throw new ActionError("FORBIDDEN", "Accès interdit.");

  const session = await getStripe().checkout.sessions.retrieve(sessionId);
  return {
    orderId: order.id_order,
    totalPrice: Number(order.total_price),
    paymentStatus: session.payment_status,
    sessionStatus: session.status,
  };
};

async function completePaidSession(session: Stripe.Checkout.Session) {
  const order = await orderRepository.findByStripeSession(session.id);
  if (!order) throw new Error("Stripe session is not linked to an order.");
  if (
    session.currency !== "eur" ||
    (session.amount_total !== null &&
      Math.round(Number(order.total_price) * 100) !== session.amount_total)
  ) {
    throw new Error("Stripe payment does not match the order total.");
  }
  if (
    session.currency !== "eur" ||
    (session.amount_total !== null &&
      Math.round(Number(order.total_price) * 100) !== session.amount_total)
  ) {
    throw new Error("Stripe payment amount does not match the order.");
  }

  const changedRows = await orderRepository.markPaid(session.id);
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : (session.payment_intent?.id ?? session.id);
  await paymentRepository.recordStripePayment(
    order.id_order,
    (session.amount_total ?? Number(order.total_price) * 100) / 100,
    session.id,
    paymentIntentId,
  );

  await orderRepository.ensureInvoiceNumber(Number(order.id_order));
  if (!order.payment_email_sent_at) {
    const invoice = await orderRepository.findInvoiceByOrderId(
      Number(order.id_order),
    );
    if (!invoice) throw new Error("Paid order invoice could not be loaded.");
    const pdf = await createInvoicePdf(invoice);
    await sendPaymentConfirmationEmail(invoice, pdf);
    await orderRepository.markPaymentEmailSent(Number(order.id_order));
  }

  if (changedRows > 0) {
    const owner: CartOwner | null = order.user_id
      ? { kind: "user", userId: order.user_id }
      : order.guest_cart_token_hash
        ? { kind: "guest", guestTokenHash: order.guest_cart_token_hash }
        : null;
    if (owner) {
      const items = await orderRepository.findItemsByStripeSession(session.id);
      await cartRepository.removePurchasedItems(
        owner,
        items.map((item) => ({
          variant_id: item.variant_id,
          quantity: Number(item.quantity),
        })),
      );
    }
  }

  await orderRepository.ensureInvoiceNumber(Number(order.id_order));
  if (!order.payment_email_sent_at) {
    const claimed = await orderRepository.claimPaymentEmail(
      Number(order.id_order),
    );
    if (claimed) {
      try {
        const invoice = await orderRepository.findInvoiceByOrderId(
          Number(order.id_order),
        );
        if (!invoice)
          throw new Error("Paid order invoice could not be loaded.");
        const invoicePdf = await createInvoicePdf(invoice);
        await sendPaymentConfirmationEmail(invoice, invoicePdf);
        await orderRepository.markPaymentEmailSent(Number(order.id_order));
      } catch (error) {
        await orderRepository.releasePaymentEmailClaim(Number(order.id_order));
        throw error;
      }
    }
  }
}

const handleStripeWebhookAction = async (
  rawBody: Buffer | undefined,
  signature: string | undefined,
) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!rawBody || !signature || !webhookSecret) {
    throw new ActionError("BAD_REQUEST", "Webhook Stripe invalide.");
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    );
  } catch {
    throw new ActionError("BAD_REQUEST", "Signature Stripe invalide.");
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === "paid") await completePaidSession(session);
  } else if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    await orderRepository.markCheckoutExpired(session.id);
  }
};

export default {
  createCheckoutSessionAction,
  getCheckoutSessionAction,
  handleStripeWebhookAction,
};
