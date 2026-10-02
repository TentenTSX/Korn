import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type OrderInput = {
  user_id: number | null;
  customer_email: string;
  guest_cart_token_hash: string | null;
  total_price: number;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
};

type OrderItemInput = {
  variant_id: number;
  quantity: number;
  price_unit: number;
};

export type InvoiceData = {
  id_order: number;
  invoice_number: string;
  invoice_issued_at: Date | string;
  customer_email: string;
  total_price: number | string;
  created_at: Date | string;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
  items: Array<{
    name: string;
    size: string;
    color: string;
    quantity: number;
    price_unit: number | string;
  }>;
};

class OrderRepository {
  async findOwnerById(orderId: number) {
    const [rows] = await databaseClient.query<Rows>(
      "select user_id, total_price from orders where id_order = ?",
      [orderId],
    );
    return rows[0] as { user_id: number; total_price: number } | undefined;
  }

  async findAllByUser(userId: number) {
    const [rows] = await databaseClient.query<Rows>(
      "select o.id_order, o.total_price, o.status, o.created_at, o.invoice_number, (select p.status from payments p where p.order_id = o.id_order order by p.created_at desc limit 1) as payment_status from orders o where o.user_id = ? order by o.created_at desc",
      [userId],
    );
    return rows;
  }

  async findById(userId: number, orderId: number) {
    const [rows] = await databaseClient.query<Rows>(
      "select * from orders where user_id = ? and id_order = ?",
      [userId, orderId],
    );
    const order = rows[0];
    if (!order) return undefined;

    const [itemRows] = await databaseClient.query<Rows>(
      "select p.id_product, p.name, pv.size, pv.color, oi.quantity, oi.price_unit, (select pi.url from product_images pi where pi.product_id = p.id_product order by pi.position limit 1) as image from order_items oi join product_variants pv on pv.id_variant = oi.variant_id join products p on p.id_product = pv.product_id where oi.order_id = ? order by oi.id_order_item",
      [orderId],
    );
    return { ...order, items: itemRows } as typeof order & { items: Rows };
  }

  async findByStripeSession(sessionId: string) {
    const [rows] = await databaseClient.query<Rows>(
      "select id_order, user_id, guest_cart_token_hash, customer_email, total_price, status, payment_email_sent_at from orders where stripe_session_id = ?",
      [sessionId],
    );
    return rows[0] as
      | {
          id_order: number;
          user_id: number | null;
          guest_cart_token_hash: string | null;
          customer_email: string;
          total_price: number | string;
          status: string;
          payment_email_sent_at: Date | string | null;
        }
      | undefined;
  }

  async ensureInvoiceNumber(orderId: number) {
    const [rows] = await databaseClient.query<Rows>(
      "select id_order, invoice_number, status, created_at, invoice_issued_at from orders where id_order = ?",
      [orderId],
    );
    const order = rows[0] as
      | {
          id_order: number;
          invoice_number: string | null;
          status: string;
          created_at: Date | string;
          invoice_issued_at: Date | string | null;
        }
      | undefined;
    if (!order || order.status !== "paid") return null;
    if (order.invoice_number) {
      if (!order.invoice_issued_at) {
        await databaseClient.query<Result>(
          "update orders set invoice_issued_at = coalesce(created_at, current_timestamp) where id_order = ? and invoice_issued_at is null",
          [orderId],
        );
      }
      return order.invoice_number;
    }

    const issuedAt = new Date();
    const year = issuedAt.getFullYear();
    const invoiceNumber = `KORN-${year}-${String(order.id_order).padStart(6, "0")}`;
    await databaseClient.query<Result>(
      "update orders set invoice_number = ?, invoice_issued_at = current_timestamp where id_order = ? and invoice_number is null and status = 'paid'",
      [invoiceNumber, orderId],
    );
    const [updatedRows] = await databaseClient.query<Rows>(
      "select invoice_number from orders where id_order = ?",
      [orderId],
    );
    return (updatedRows[0]?.invoice_number as string | null) ?? null;
  }

  async findInvoiceByOrderId(
    orderId: number,
  ): Promise<InvoiceData | undefined> {
    const [orderRows] = await databaseClient.query<Rows>(
      "select id_order, invoice_number, invoice_issued_at, customer_email, total_price, created_at, shipping_first_name, shipping_last_name, shipping_address, shipping_city, shipping_postal_code, shipping_country from orders where id_order = ? and status = 'paid' and invoice_number is not null",
      [orderId],
    );
    if (orderRows.length === 0) return undefined;

    const [itemRows] = await databaseClient.query<Rows>(
      "select p.name, pv.size, pv.color, oi.quantity, oi.price_unit from order_items oi join product_variants pv on pv.id_variant = oi.variant_id join products p on p.id_product = pv.product_id where oi.order_id = ? order by oi.id_order_item",
      [orderId],
    );
    return {
      ...(orderRows[0] as Omit<InvoiceData, "items">),
      items: itemRows as InvoiceData["items"],
    };
  }

  async markPaymentEmailSent(orderId: number) {
    await databaseClient.query<Result>(
      "update orders set payment_email_sent_at = current_timestamp, payment_email_claimed_at = null where id_order = ? and payment_email_sent_at is null",
      [orderId],
    );
  }

  async claimPaymentEmail(orderId: number) {
    const [result] = await databaseClient.query<Result>(
      "update orders set payment_email_claimed_at = current_timestamp where id_order = ? and status = 'paid' and payment_email_sent_at is null and (payment_email_claimed_at is null or payment_email_claimed_at < current_timestamp - interval 10 minute)",
      [orderId],
    );
    return result.affectedRows === 1;
  }

  async releasePaymentEmailClaim(orderId: number) {
    await databaseClient.query<Result>(
      "update orders set payment_email_claimed_at = null where id_order = ? and payment_email_sent_at is null",
      [orderId],
    );
  }

  async findItemsByStripeSession(sessionId: string) {
    const [rows] = await databaseClient.query<Rows>(
      "select oi.variant_id, oi.quantity, oi.price_unit from order_items oi join orders o on o.id_order = oi.order_id where o.stripe_session_id = ?",
      [sessionId],
    );
    return rows as Array<{
      variant_id: number;
      quantity: number;
      price_unit: number | string;
    }>;
  }

  async createWithItems(order: OrderInput, items: OrderItemInput[]) {
    const connection = await databaseClient.getConnection();
    try {
      await connection.beginTransaction();
      const [result] = await connection.query<Result>(
        "insert into orders (user_id, customer_email, guest_cart_token_hash, total_price, shipping_first_name, shipping_last_name, shipping_address, shipping_city, shipping_postal_code, shipping_country) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          order.user_id,
          order.customer_email,
          order.guest_cart_token_hash,
          order.total_price,
          order.shipping_first_name,
          order.shipping_last_name,
          order.shipping_address,
          order.shipping_city,
          order.shipping_postal_code,
          order.shipping_country,
        ],
      );

      for (const item of items) {
        await connection.query<Result>(
          "insert into order_items (order_id, variant_id, quantity, price_unit) values (?, ?, ?, ?)",
          [result.insertId, item.variant_id, item.quantity, item.price_unit],
        );
      }

      await connection.commit();
      return result.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async attachStripeSession(orderId: number, sessionId: string) {
    await databaseClient.query<Result>(
      "update orders set stripe_session_id = ? where id_order = ?",
      [sessionId, orderId],
    );
  }

  async markCheckoutFailed(orderId: number) {
    await databaseClient.query<Result>(
      "update orders set status = 'checkout_failed' where id_order = ? and status = 'pending'",
      [orderId],
    );
  }

  async markPaid(sessionId: string) {
    const [result] = await databaseClient.query<Result>(
      "update orders set status = 'paid' where stripe_session_id = ? and status <> 'paid'",
      [sessionId],
    );
    return result.affectedRows;
  }

  async markCheckoutExpired(sessionId: string) {
    await databaseClient.query<Result>(
      "update orders set status = 'checkout_expired' where stripe_session_id = ? and status = 'pending'",
      [sessionId],
    );
  }

  async transferGuestOrdersToUser(guestTokenHash: string, userId: number) {
    await databaseClient.query<Result>(
      "update orders set user_id = ?, guest_cart_token_hash = null where guest_cart_token_hash = ? and status in ('pending', 'paid')",
      [userId, guestTokenHash],
    );
  }

  async updateStatus(userId: number, orderId: number, status: string) {
    const [result] = await databaseClient.query<Result>(
      "update orders set status = ? where user_id = ? and id_order = ?",
      [status, userId, orderId],
    );
    return result.affectedRows;
  }
}

export default new OrderRepository();
