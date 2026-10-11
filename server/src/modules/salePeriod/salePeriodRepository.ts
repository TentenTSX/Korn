import databaseClient from "../../../database/client";
import type { Rows } from "../../../database/client";

class SalePeriodRepository {
  async findActive() {
    const [rows] = await databaseClient.query<Rows>(
      "select name, slug, code, discount_percent, start_date, end_date from sale_periods where curdate() between start_date and end_date order by start_date desc limit 1",
    );
    return rows[0] as
      | {
          name: string;
          slug: string;
          code: string;
          discount_percent: number;
          start_date: string;
          end_date: string;
        }
      | undefined;
  }

  async findActiveByCode(code: string) {
    const [rows] = await databaseClient.query<Rows>(
      "select name, slug, code, discount_percent, start_date, end_date from sale_periods where code = ? and curdate() between start_date and end_date limit 1",
      [code],
    );
    return rows[0] as
      | {
          name: string;
          slug: string;
          code: string;
          discount_percent: number;
          start_date: string;
          end_date: string;
        }
      | undefined;
  }
}

export default new SalePeriodRepository();
