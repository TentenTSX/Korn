import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

class PaymentRepository {
  async findByOrder(orderId: number) {
    const [rows] = await databaseClient.query<Rows>(
      "select * from payments where order_id = ? order by created_at desc",
      [orderId],
    );
    return rows;
  }

  async create(orderId: number, amount: number, paymentMethod: string) {
    const [result] = await databaseClient.query<Result>(
      "insert into payments (order_id, amount, payment_method) values (?, ?, ?)",
      [orderId, amount, paymentMethod],
    );
    return result.insertId;
  }

  async recordStripePayment(
    orderId: number,
    amount: number,
    sessionId: string,
    paymentIntentId: string,
  ) {
    const [result] = await databaseClient.query<Result>(
      "insert into payments (order_id, amount, status, payment_method, transaction_id, stripe_session_id) values (?, ?, 'paid', 'card', ?, ?) on duplicate key update status = 'paid', amount = values(amount), transaction_id = values(transaction_id)",
      [orderId, amount, paymentIntentId, sessionId],
    );
    return result.insertId;
  }
}

export default new PaymentRepository();
