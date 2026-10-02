import databaseClient from "../../../database/client";
import type { Result } from "../../../database/client";

class NewsletterRepository {
  async subscribe(email: string) {
    const [result] = await databaseClient.query<Result>(
      "insert into newsletter_subscribers (email) values (?) on duplicate key update email = email",
      [email],
    );
    return result.affectedRows === 1;
  }
}

export default new NewsletterRepository();
