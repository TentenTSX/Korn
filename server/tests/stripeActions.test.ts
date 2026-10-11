import Stripe from "stripe";
import cartRepository from "../src/modules/cart/cartRepository";
import * as emailService from "../src/modules/email/emailService";
import * as invoiceService from "../src/modules/invoice/invoiceService";
import orderRepository from "../src/modules/order/orderRepository";
import paymentRepository from "../src/modules/payment/paymentRepository";
import stripeActions from "../src/modules/payment/stripeActions";

jest.mock("stripe");
const StripeMock = jest.mocked(Stripe);

const baseOrder = {
  id_order: 1,
  user_id: 1,
  guest_cart_token_hash: null,
  customer_email: "ada@example.com",
  total_price: "59.97",
  status: "pending",
  payment_email_sent_at: null,
};

const baseItems = [{ variant_id: 1, quantity: 3, price_unit: 19.99 }];

function mockWebhookEvent(event: unknown) {
  StripeMock.mockImplementation(
    () =>
      ({
        webhooks: {
          constructEvent: jest.fn().mockReturnValue(event),
        },
      }) as unknown as Stripe,
  );
}

function paidSessionEvent(overrides: Record<string, unknown> = {}) {
  return {
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_1",
        payment_status: "paid",
        currency: "eur",
        amount_total: 5997,
        payment_intent: "pi_1",
        ...overrides,
      },
    },
  };
}

beforeEach(() => {
  process.env.STRIPE_SECRET_KEY = "sk_test_123";
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_123";
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("stripeActions.handleStripeWebhookAction", () => {
  test("rejects when the raw body, signature or webhook secret is missing", async () => {
    await expect(
      stripeActions.handleStripeWebhookAction(undefined, "sig"),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  test("rejects an invalid signature", async () => {
    StripeMock.mockImplementation(
      () =>
        ({
          webhooks: {
            constructEvent: jest.fn().mockImplementation(() => {
              throw new Error("bad signature");
            }),
          },
        }) as unknown as Stripe,
    );

    await expect(
      stripeActions.handleStripeWebhookAction(Buffer.from("{}"), "bad-sig"),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  test("marks the expired checkout session as expired", async () => {
    mockWebhookEvent({
      type: "checkout.session.expired",
      data: { object: { id: "cs_1" } },
    });
    const expireSpy = jest
      .spyOn(orderRepository, "markCheckoutExpired")
      .mockResolvedValue(undefined as never);

    await stripeActions.handleStripeWebhookAction(Buffer.from("{}"), "sig");

    expect(expireSpy).toHaveBeenCalledWith("cs_1");
  });

  test("rejects a paid session that isn't linked to an order", async () => {
    mockWebhookEvent(paidSessionEvent());
    jest
      .spyOn(orderRepository, "findByStripeSession")
      .mockResolvedValue(undefined);

    await expect(
      stripeActions.handleStripeWebhookAction(Buffer.from("{}"), "sig"),
    ).rejects.toThrow("Stripe session is not linked to an order.");
  });

  test("rejects when the paid amount does not match the order total", async () => {
    mockWebhookEvent(paidSessionEvent({ amount_total: 1000 }));
    jest
      .spyOn(orderRepository, "findByStripeSession")
      .mockResolvedValue(baseOrder as never);

    await expect(
      stripeActions.handleStripeWebhookAction(Buffer.from("{}"), "sig"),
    ).rejects.toThrow("Stripe payment does not match the order total.");
  });

  test("marks the order paid, decrements stock, clears the cart, and sends the confirmation email", async () => {
    mockWebhookEvent(paidSessionEvent());
    jest
      .spyOn(orderRepository, "findByStripeSession")
      .mockResolvedValue(baseOrder as never);
    jest.spyOn(orderRepository, "markPaid").mockResolvedValue(1);
    jest.spyOn(paymentRepository, "recordStripePayment").mockResolvedValue(1);
    jest
      .spyOn(orderRepository, "ensureInvoiceNumber")
      .mockResolvedValue("INV-0001");
    const decrementSpy = jest
      .spyOn(orderRepository, "decrementVariantStock")
      .mockResolvedValue(undefined);
    jest
      .spyOn(orderRepository, "findItemsByStripeSession")
      .mockResolvedValue(baseItems as never);
    const removeSpy = jest
      .spyOn(cartRepository, "removePurchasedItems")
      .mockResolvedValue(undefined as never);
    jest.spyOn(orderRepository, "claimPaymentEmail").mockResolvedValue(true);
    jest
      .spyOn(orderRepository, "findInvoiceByOrderId")
      .mockResolvedValue({ invoice: true } as never);
    jest
      .spyOn(invoiceService, "createInvoicePdf")
      .mockResolvedValue(Buffer.from("pdf"));
    const sendEmailSpy = jest
      .spyOn(emailService, "sendPaymentConfirmationEmail")
      .mockResolvedValue(undefined as never);
    const markSentSpy = jest
      .spyOn(orderRepository, "markPaymentEmailSent")
      .mockResolvedValue(undefined as never);

    await stripeActions.handleStripeWebhookAction(Buffer.from("{}"), "sig");

    expect(decrementSpy).toHaveBeenCalledWith([{ variant_id: 1, quantity: 3 }]);
    expect(removeSpy).toHaveBeenCalledWith({ kind: "user", userId: 1 }, [
      { variant_id: 1, quantity: 3 },
    ]);
    expect(sendEmailSpy).toHaveBeenCalledTimes(1);
    expect(markSentSpy).toHaveBeenCalledTimes(1);
  });

  test("does not decrement stock or touch the cart again on a webhook retry", async () => {
    mockWebhookEvent(paidSessionEvent());
    jest.spyOn(orderRepository, "findByStripeSession").mockResolvedValue({
      ...baseOrder,
      payment_email_sent_at: new Date(),
    } as never);
    jest.spyOn(orderRepository, "markPaid").mockResolvedValue(0);
    jest.spyOn(paymentRepository, "recordStripePayment").mockResolvedValue(1);
    jest
      .spyOn(orderRepository, "ensureInvoiceNumber")
      .mockResolvedValue("INV-0001");
    const decrementSpy = jest
      .spyOn(orderRepository, "decrementVariantStock")
      .mockResolvedValue(undefined);
    const removeSpy = jest
      .spyOn(cartRepository, "removePurchasedItems")
      .mockResolvedValue(undefined as never);

    await stripeActions.handleStripeWebhookAction(Buffer.from("{}"), "sig");

    expect(decrementSpy).not.toHaveBeenCalled();
    expect(removeSpy).not.toHaveBeenCalled();
  });

  test("does not send a second confirmation email when the claim lock is already held", async () => {
    mockWebhookEvent(paidSessionEvent());
    jest
      .spyOn(orderRepository, "findByStripeSession")
      .mockResolvedValue(baseOrder as never);
    jest.spyOn(orderRepository, "markPaid").mockResolvedValue(1);
    jest.spyOn(paymentRepository, "recordStripePayment").mockResolvedValue(1);
    jest
      .spyOn(orderRepository, "ensureInvoiceNumber")
      .mockResolvedValue("INV-0001");
    jest
      .spyOn(orderRepository, "decrementVariantStock")
      .mockResolvedValue(undefined);
    jest
      .spyOn(orderRepository, "findItemsByStripeSession")
      .mockResolvedValue(baseItems as never);
    jest
      .spyOn(cartRepository, "removePurchasedItems")
      .mockResolvedValue(undefined as never);
    jest.spyOn(orderRepository, "claimPaymentEmail").mockResolvedValue(false);
    const sendEmailSpy = jest.spyOn(
      emailService,
      "sendPaymentConfirmationEmail",
    );

    await stripeActions.handleStripeWebhookAction(Buffer.from("{}"), "sig");

    expect(sendEmailSpy).not.toHaveBeenCalled();
  });

  test("releases the email claim and rethrows if sending the confirmation email fails", async () => {
    mockWebhookEvent(paidSessionEvent());
    jest
      .spyOn(orderRepository, "findByStripeSession")
      .mockResolvedValue(baseOrder as never);
    jest.spyOn(orderRepository, "markPaid").mockResolvedValue(1);
    jest.spyOn(paymentRepository, "recordStripePayment").mockResolvedValue(1);
    jest
      .spyOn(orderRepository, "ensureInvoiceNumber")
      .mockResolvedValue("INV-0001");
    jest
      .spyOn(orderRepository, "decrementVariantStock")
      .mockResolvedValue(undefined);
    jest
      .spyOn(orderRepository, "findItemsByStripeSession")
      .mockResolvedValue(baseItems as never);
    jest
      .spyOn(cartRepository, "removePurchasedItems")
      .mockResolvedValue(undefined as never);
    jest.spyOn(orderRepository, "claimPaymentEmail").mockResolvedValue(true);
    jest
      .spyOn(orderRepository, "findInvoiceByOrderId")
      .mockResolvedValue({ invoice: true } as never);
    jest
      .spyOn(invoiceService, "createInvoicePdf")
      .mockRejectedValue(new Error("pdf failed"));
    const releaseSpy = jest
      .spyOn(orderRepository, "releasePaymentEmailClaim")
      .mockResolvedValue(undefined as never);

    await expect(
      stripeActions.handleStripeWebhookAction(Buffer.from("{}"), "sig"),
    ).rejects.toThrow("pdf failed");
    expect(releaseSpy).toHaveBeenCalledWith(1);
  });
});
