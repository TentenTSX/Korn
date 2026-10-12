import {
  parseSender,
  sendPasswordResetEmail,
  sendPaymentConfirmationEmail,
} from "../src/modules/email/emailService";
import type { InvoiceData } from "../src/modules/order/orderRepository";

describe("emailService", () => {
  const originalEnv = { ...process.env };
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    process.env.BREVO_API_KEY = "test-brevo-key";
    process.env.EMAIL_FROM = "Korn <orders@korn.test>";
    fetchMock = jest
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response("{}", { status: 201 }));
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    jest.restoreAllMocks();
  });

  it("parses a sender with and without a display name", () => {
    expect(parseSender("Korn <orders@korn.test>")).toEqual({
      name: "Korn",
      email: "orders@korn.test",
    });
    expect(parseSender("orders@korn.test")).toEqual({
      email: "orders@korn.test",
    });
  });

  it("sends through the Brevo API when BREVO_API_KEY is set", async () => {
    await sendPasswordResetEmail("ada@example.com", "https://korn.test/reset");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.brevo.com/v3/smtp/email");
    expect(init.headers["api-key"]).toBe("test-brevo-key");
    const body = JSON.parse(init.body);
    expect(body.sender).toEqual({ name: "Korn", email: "orders@korn.test" });
    expect(body.to).toEqual([{ email: "ada@example.com" }]);
    expect(body.textContent).toContain("https://korn.test/reset");
    expect(body.attachment).toBeUndefined();
  });

  it("attaches the invoice PDF as base64", async () => {
    const invoice = {
      id_order: 7,
      customer_email: "ada@example.com",
      shipping_first_name: "Ada",
      total_price: "42.00",
      invoice_number: "INV-7",
    } as unknown as InvoiceData;

    await sendPaymentConfirmationEmail(invoice, Buffer.from("pdf"));

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.attachment).toEqual([
      { name: "INV-7.pdf", content: Buffer.from("pdf").toString("base64") },
    ]);
  });

  it("throws when Brevo rejects the email", async () => {
    fetchMock.mockResolvedValue(new Response("{}", { status: 401 }));

    await expect(
      sendPasswordResetEmail("ada@example.com", "https://korn.test/reset"),
    ).rejects.toThrow("HTTP 401");
  });
});
