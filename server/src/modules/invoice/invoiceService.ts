import PDFDocument from "pdfkit";
import type { InvoiceData } from "../order/orderRepository";

const money = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

export function createInvoicePdf(invoice: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const document = new PDFDocument({ size: "A4", margin: 52 });
    const chunks: Buffer[] = [];
    document.on("data", (chunk: Buffer) => chunks.push(chunk));
    document.on("end", () => resolve(Buffer.concat(chunks)));
    document.on("error", reject);

    const issuedDate = new Date(invoice.invoice_issued_at).toLocaleDateString(
      "fr-FR",
    );
    document
      .fontSize(24)
      .fillColor("#191817")
      .text("KORN", { continued: true });
    document.fontSize(18).text("FACTURE", { align: "right" });
    document.moveDown(0.5);
    document
      .fontSize(10)
      .fillColor("#706c67")
      .text(`Facture ${invoice.invoice_number}`)
      .text(`Date : ${issuedDate}`)
      .text(`Commande : #${invoice.id_order}`);

    document.moveDown(1.5).fillColor("#191817").fontSize(12).text("Facturé à");
    document
      .fontSize(10)
      .text(`${invoice.shipping_first_name} ${invoice.shipping_last_name}`)
      .text(invoice.customer_email)
      .text(invoice.shipping_address)
      .text(
        `${invoice.shipping_postal_code} ${invoice.shipping_city}, ${invoice.shipping_country}`,
      );

    document.moveDown(2);
    const tableTop = document.y;
    document.fontSize(10).fillColor("#191817");
    document.text("Article", 52, tableTop, { width: 240 });
    document.text("Qté", 310, tableTop, { width: 42, align: "right" });
    document.text("Prix unitaire", 365, tableTop, {
      width: 75,
      align: "right",
    });
    document.text("Total", 455, tableTop, { width: 88, align: "right" });
    document
      .moveTo(52, tableTop + 19)
      .lineTo(543, tableTop + 19)
      .strokeColor("#dedbd5")
      .stroke();

    let rowY = tableTop + 30;
    for (const item of invoice.items) {
      const option = [item.color, item.size].filter(Boolean).join(" / ");
      document
        .fontSize(10)
        .fillColor("#191817")
        .text(`${item.name}${option ? ` (${option})` : ""}`, 52, rowY, {
          width: 240,
        });
      document.text(String(item.quantity), 310, rowY, {
        width: 42,
        align: "right",
      });
      document.text(money.format(Number(item.price_unit)), 365, rowY, {
        width: 75,
        align: "right",
      });
      document.text(
        money.format(Number(item.price_unit) * item.quantity),
        455,
        rowY,
        { width: 88, align: "right" },
      );
      rowY += 26;
    }

    document
      .moveTo(52, rowY + 2)
      .lineTo(543, rowY + 2)
      .strokeColor("#dedbd5")
      .stroke();
    document
      .fontSize(12)
      .fillColor("#191817")
      .text(
        `Total payé : ${money.format(Number(invoice.total_price))}`,
        330,
        rowY + 14,
        {
          width: 213,
          align: "right",
        },
      );
    document
      .fontSize(9)
      .fillColor("#706c67")
      .text("Facture acquittée. Merci pour votre commande.", 52, 755, {
        width: 491,
        align: "center",
      });
    document.end();
  });
}
