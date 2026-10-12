import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

export interface BookingInvoiceData {
  reference: string;
  guestName: string;
  phone: string;
  email?: string | null;
  hotel?: string | null;
  notes?: string | null;
  serviceName: string;
  durationMinutes: number;
  date: string;
  time: string;
  guests: number;
  price?: number | null;
  telegramUsername?: string | null;
}

export async function generateBookingPdfBuffer(data: BookingInvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 45,
        info: {
          Title: `Teuk Spa Invoice - ${data.reference}`,
          Author: "Teuk Massage & Spa",
          Subject: "Spa Reservation Invoice",
        },
      });

      const buffers: Buffer[] = [];
      doc.on("data", (buffer) => buffers.push(buffer));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(err));

      const pricePerPerson = data.price ?? 0;
      const guestsCount = data.guests || 1;
      const totalAmount = pricePerPerson * guestsCount;

      // ─── 1. TOP HEADER BANNER (Luxury Dark Forest) ───
      doc
        .rect(0, 0, 595.28, 125)
        .fill("#0E110C");

      // Gold Accent Line
      doc
        .rect(0, 122, 595.28, 3)
        .fill("#C9A84C");

      // Brand Logo / Header Text
      const logoPath = path.join(process.cwd(), "public", "uploads", "logo.png");
      if (fs.existsSync(logoPath)) {
        try {
          doc.image(logoPath, 45, 25, { width: 120 });
        } catch {
          doc
            .fillColor("#FAF7F2")
            .fontSize(22)
            .font("Helvetica-Bold")
            .text("TEUK MASSAGE & SPA", 45, 40);
        }
      } else {
        doc
          .fillColor("#FAF7F2")
          .fontSize(22)
          .font("Helvetica-Bold")
          .text("TEUK MASSAGE & SPA", 45, 40);
      }

      // Header Right Info
      doc
        .fillColor("#C9A84C")
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("RESERVATION INVOICE", 380, 35, { align: "right", width: 170 })
        .fillColor("#E8E2D5")
        .fontSize(13)
        .font("Helvetica-Bold")
        .text(data.reference, 380, 50, { align: "right", width: 170 })
        .fillColor("#A6A29A")
        .fontSize(9)
        .font("Helvetica")
        .text(`Date: ${data.date}`, 380, 68, { align: "right", width: 170 })
        .text("Status: CONFIRMED", 380, 82, { align: "right", width: 170 });

      // ─── 2. SPA & GUEST DETAILS ───
      const startY = 150;

      // Left Column: Spa Information
      doc
        .fillColor("#C9A84C")
        .fontSize(9)
        .font("Helvetica-Bold")
        .text("SANCTUARY LOCATION", 45, startY)
        .fillColor("#2C2C2C")
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Teuk Massage & Spa", 45, startY + 15)
        .fillColor("#555555")
        .fontSize(9)
        .font("Helvetica")
        .text("Street 08 (Near Pub Street & Old Market)", 45, startY + 28)
        .text("Siem Reap, Kingdom of Cambodia", 45, startY + 41)
        .text("WhatsApp / Phone: +855 17 708 35459", 45, startY + 54)
        .text("Telegram Concierge: @TeukSpaBookingBot", 45, startY + 67);

      // Right Column: Guest Information
      doc
        .fillColor("#C9A84C")
        .fontSize(9)
        .font("Helvetica-Bold")
        .text("GUEST DETAILS", 330, startY)
        .fillColor("#2C2C2C")
        .fontSize(11)
        .font("Helvetica-Bold")
        .text(data.guestName, 330, startY + 15)
        .fillColor("#555555")
        .fontSize(9)
        .font("Helvetica")
        .text(`Phone: ${data.phone}`, 330, startY + 30);

      let guestExtraY = startY + 43;
      if (data.telegramUsername) {
        doc.text(`Telegram: @${data.telegramUsername}`, 330, guestExtraY);
        guestExtraY += 13;
      }
      if (data.hotel) {
        doc.text(`Hotel / Room: ${data.hotel}`, 330, guestExtraY);
        guestExtraY += 13;
      }
      if (data.email) {
        doc.text(`Email: ${data.email}`, 330, guestExtraY);
        guestExtraY += 13;
      }

      // ─── 3. RESERVATION LINE ITEMS TABLE ───
      const tableTop = 250;

      // Table Header Background
      doc
        .rect(45, tableTop, 505.28, 26)
        .fill("#1B2217");

      doc
        .fillColor("#FAF7F2")
        .fontSize(9)
        .font("Helvetica-Bold")
        .text("TREATMENT / RITUAL", 55, tableTop + 8)
        .text("SCHEDULE", 240, tableTop + 8)
        .text("DURATION", 345, tableTop + 8)
        .text("GUESTS", 415, tableTop + 8)
        .text("TOTAL", 485, tableTop + 8, { align: "right", width: 55 });

      // Table Row Background
      const rowTop = tableTop + 26;
      doc
        .rect(45, rowTop, 505.28, 48)
        .fill("#F9F7F2");

      doc
        .rect(45, rowTop + 48, 505.28, 1)
        .fill("#E0DBD1");

      doc
        .fillColor("#1B2217")
        .fontSize(10)
        .font("Helvetica-Bold")
        .text(data.serviceName, 55, rowTop + 12, { width: 175 })
        .fillColor("#666666")
        .fontSize(8)
        .font("Helvetica")
        .text("Natural Herbal Wellness Ritual", 55, rowTop + 27)
        .fillColor("#2C2C2C")
        .fontSize(9)
        .font("Helvetica")
        .text(`${data.date}`, 240, rowTop + 12)
        .fillColor("#C9A84C")
        .font("Helvetica-Bold")
        .text(`@ ${data.time}`, 240, rowTop + 25)
        .fillColor("#2C2C2C")
        .font("Helvetica")
        .text(`${data.durationMinutes} mins`, 345, rowTop + 18)
        .text(`${guestsCount} ${guestsCount > 1 ? "Guests" : "Guest"}`, 415, rowTop + 18)
        .fillColor("#1B2217")
        .fontSize(11)
        .font("Helvetica-Bold")
        .text(`$${totalAmount.toFixed(2)}`, 485, rowTop + 18, { align: "right", width: 55 });

      // Special Notes (if any)
      let notesY = rowTop + 58;
      if (data.notes) {
        doc
          .rect(45, notesY, 505.28, 28)
          .fill("#F2EFE8");
        doc
          .fillColor("#555555")
          .fontSize(8.5)
          .font("Helvetica-Oblique")
          .text(`Guest Preference / Notes: "${data.notes}"`, 55, notesY + 8, { width: 485 });
        notesY += 36;
      }

      // ─── 4. TOTALS & PAYMENT TERMS ───
      const summaryY = notesY + 10;

      // Payment Box Left
      doc
        .rect(45, summaryY, 280, 85)
        .fill("#F4F6F2");

      doc
        .rect(45, summaryY, 3, 85)
        .fill("#C9A84C");

      doc
        .fillColor("#1B2217")
        .fontSize(9)
        .font("Helvetica-Bold")
        .text("PAYMENT TERMS: PAY AT SPA", 58, summaryY + 12)
        .fillColor("#555555")
        .fontSize(8.5)
        .font("Helvetica")
        .text("• No deposit or credit card prepayment required.", 58, summaryY + 28)
        .text("• Payment is completed upon arrival at reception.", 58, summaryY + 41)
        .text("• Accepted: Cash (USD / KHR), ABA KHQR, Visa & MasterCard.", 58, summaryY + 54)
        .text("• Cancellation: Free cancellation anytime prior to arrival.", 58, summaryY + 67);

      // Financial Calculation Right
      doc
        .fillColor("#555555")
        .fontSize(9)
        .font("Helvetica")
        .text("Subtotal:", 360, summaryY + 12)
        .text(`$${totalAmount.toFixed(2)}`, 470, summaryY + 12, { align: "right", width: 70 })
        .text("Applicable Taxes (0%):", 360, summaryY + 28)
        .text("$0.00", 470, summaryY + 28, { align: "right", width: 70 })
        .rect(360, summaryY + 44, 185, 1)
        .fill("#E0DBD1");

      doc
        .fillColor("#1B2217")
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Total Amount Due:", 360, summaryY + 55)
        .fillColor("#C9A84C")
        .fontSize(15)
        .text(`$${totalAmount.toFixed(2)} USD`, 450, summaryY + 53, { align: "right", width: 90 });

      // ─── 5. SANCTUARY CARE & NOTICE ───
      const noticeY = summaryY + 105;

      doc
        .rect(45, noticeY, 505.28, 55)
        .fill("#FAF8F5")
        .strokeColor("#E6DFD3")
        .lineWidth(1)
        .stroke();

      doc
        .fillColor("#C9A84C")
        .fontSize(9)
        .font("Helvetica-Bold")
        .text("🌿 YOUR SANCTUARY EXPERIENCE", 58, noticeY + 10)
        .fillColor("#555555")
        .fontSize(8)
        .font("Helvetica")
        .text(
          "• Please arrive 10-15 minutes prior to your session to enjoy a complimentary traditional herbal foot soak.",
          58,
          noticeY + 24
        )
        .text(
          "• Fresh organic lemongrass and ginger tea will be served in our relaxation lounge following your ritual.",
          58,
          noticeY + 36
        );

      // ─── 6. FOOTER ───
      doc
        .rect(45, 760, 505.28, 0.5)
        .fill("#C9A84C");

      doc
        .fillColor("#888888")
        .fontSize(8)
        .font("Helvetica")
        .text(
          "Teuk Massage & Spa · Traditional Khmer Healing & Organic Botanicals · Siem Reap, Cambodia",
          45,
          770,
          { align: "center", width: 505.28 }
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
