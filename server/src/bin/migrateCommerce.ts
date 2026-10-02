import "dotenv/config";
import mysql from "mysql2/promise";
import type { RowDataPacket } from "mysql2/promise";

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

async function migrateCommerce() {
  if (!DB_NAME) throw new Error("DB_NAME must be configured.");
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: Number.parseInt(DB_PORT ?? "3306", 10),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  });

  const hasColumn = async (table: string, column: string) => {
    const [rows] = await connection.query<RowDataPacket[]>(
      "select count(*) as count from information_schema.columns where table_schema = database() and table_name = ? and column_name = ?",
      [table, column],
    );
    return Number(rows[0].count) > 0;
  };

  const hasIndex = async (table: string, index: string) => {
    const [rows] = await connection.query<RowDataPacket[]>(
      "select count(*) as count from information_schema.statistics where table_schema = database() and table_name = ? and index_name = ?",
      [table, index],
    );
    return Number(rows[0].count) > 0;
  };

  try {
    await connection.query("alter table carts modify user_id int null");
    if (!(await hasColumn("carts", "guest_token_hash"))) {
      await connection.query(
        "alter table carts add column guest_token_hash char(64) null",
      );
    }
    if (!(await hasIndex("carts", "unique_guest_cart"))) {
      await connection.query(
        "alter table carts add unique index unique_guest_cart (guest_token_hash)",
      );
    }

    await connection.query("alter table orders modify user_id int null");
    if (!(await hasColumn("orders", "customer_email"))) {
      await connection.query(
        "alter table orders add column customer_email varchar(255) null",
      );
    }
    await connection.query(
      "update orders o join users u on u.id_user = o.user_id set o.customer_email = u.email where o.customer_email is null",
    );
    await connection.query(
      "alter table orders modify customer_email varchar(255) not null",
    );
    if (!(await hasColumn("orders", "guest_cart_token_hash"))) {
      await connection.query(
        "alter table orders add column guest_cart_token_hash char(64) null",
      );
    }
    if (!(await hasColumn("orders", "stripe_session_id"))) {
      await connection.query(
        "alter table orders add column stripe_session_id varchar(255) null",
      );
    }
    if (!(await hasColumn("orders", "invoice_number"))) {
      await connection.query(
        "alter table orders add column invoice_number varchar(40) null",
      );
    }
    if (!(await hasColumn("orders", "invoice_issued_at"))) {
      await connection.query(
        "alter table orders add column invoice_issued_at timestamp null",
      );
    }
    if (!(await hasColumn("orders", "payment_email_claimed_at"))) {
      await connection.query(
        "alter table orders add column payment_email_claimed_at timestamp null",
      );
    }
    if (!(await hasColumn("orders", "payment_email_sent_at"))) {
      await connection.query(
        "alter table orders add column payment_email_sent_at timestamp null",
      );
    }
    if (!(await hasIndex("orders", "stripe_session_id"))) {
      await connection.query(
        "alter table orders add unique index stripe_session_id (stripe_session_id)",
      );
    }
    if (!(await hasIndex("orders", "invoice_number"))) {
      await connection.query(
        "alter table orders add unique index invoice_number (invoice_number)",
      );
    }

    if (!(await hasColumn("payments", "stripe_session_id"))) {
      await connection.query(
        "alter table payments add column stripe_session_id varchar(255) null",
      );
    }
    if (!(await hasIndex("payments", "stripe_session_id"))) {
      await connection.query(
        "alter table payments add unique index stripe_session_id (stripe_session_id)",
      );
    }

    console.info("Guest cart and Stripe columns are ready.");
  } finally {
    await connection.end();
  }
}

void migrateCommerce().catch((error: unknown) => {
  console.error("Commerce migration failed.", error);
  process.exitCode = 1;
});
