import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type User = {
  id_user: number;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
};

class authRepository {
  async findByEmail(email: string) {
    const [rows] = await databaseClient.query<Rows>(
      "select * from users where email = ?",
      [email],
    );
    return rows[0] as User | undefined;
  }

  async findById(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "select id_user, first_name, last_name, email, created_at from users where id_user = ?",
      [id],
    );
    return rows[0] as Omit<User, "password_hash"> | undefined;
  }

  async create(user: {
    first_name: string;
    last_name: string;
    email: string;
    passwordHash: string;
  }) {
    const [result] = await databaseClient.query<Result>(
      `INSERT INTO users
      (first_name, last_name, email, password_hash)
     VALUES (?, ?, ?, ?)`,
      [user.first_name, user.last_name, user.email, user.passwordHash],
    );
    return this.findById(result.insertId);
  }
}

export default new authRepository();
