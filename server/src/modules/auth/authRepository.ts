import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type User = {
  id_user: number;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  google_id: string | null;
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
    return rows[0] as Omit<User, "password_hash" | "google_id"> | undefined;
  }

  async findByGoogleId(googleId: string) {
    const [rows] = await databaseClient.query<Rows>(
      "select * from users where google_id = ?",
      [googleId],
    );
    return rows[0] as User | undefined;
  }

  async linkGoogleId(userId: number, googleId: string) {
    await databaseClient.query<Result>(
      "update users set google_id = ? where id_user = ?",
      [googleId, userId],
    );
  }

  async create(user: {
    first_name: string;
    last_name: string;
    email: string;
    passwordHash: string;
    googleId?: string;
  }) {
    const [result] = await databaseClient.query<Result>(
      `INSERT INTO users
      (first_name, last_name, email, password_hash, google_id)
     VALUES (?, ?, ?, ?, ?)`,
      [
        user.first_name,
        user.last_name,
        user.email,
        user.passwordHash,
        user.googleId ?? null,
      ],
    );
    return this.findById(result.insertId);
  }

  async updatePassword(userId: number, passwordHash: string) {
    await databaseClient.query<Result>(
      "update users set password_hash = ? where id_user = ?",
      [passwordHash, userId],
    );
  }

  async createPasswordReset(
    userId: number,
    tokenHash: string,
    expiresAt: Date,
  ) {
    await databaseClient.query<Result>(
      "insert into password_resets (user_id, token_hash, expires_at) values (?, ?, ?)",
      [userId, tokenHash, expiresAt],
    );
  }

  async findPasswordReset(tokenHash: string) {
    const [rows] = await databaseClient.query<Rows>(
      "select user_id, expires_at from password_resets where token_hash = ?",
      [tokenHash],
    );
    return rows[0] as
      | { user_id: number; expires_at: Date | string }
      | undefined;
  }

  async deletePasswordResetsForUser(userId: number) {
    await databaseClient.query<Result>(
      "delete from password_resets where user_id = ?",
      [userId],
    );
  }
}

export default new authRepository();
