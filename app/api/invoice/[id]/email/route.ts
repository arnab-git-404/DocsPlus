import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import dbConnect from "@/lib/db";
import Invoice from "@/models/Invoice";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import puppeteer from "puppeteer";
import { sendInvoiceEmail, verifyEmailConfig } from "@/lib/mail";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

async function verifyAuth(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

async function generateInvoicePDF(invoice: any): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        h1 { color: #333; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f5f5f5; }
        .total { background-color: #f0f0f0; font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>Invoice ${invoice.invoiceNumber}</h1>
      <p><strong>Date:</strong> ${new Date(
        invoice.invoiceDate
      ).toLocaleDateString()}</p>
      <p><strong>Client:</strong> ${invoice.clientName}</p>
      <p><strong>Total:</strong> ₹${invoice.total.toFixed(2)}</p>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items
            .map(
              (item: any) => `
            <tr>
              <td>${item.item}<br/><small>${item.description}</small></td>
              <td>${item.quantity}</td>
              <td>₹${item.rate.toFixed(2)}</td>
              <td>₹${item.amount.toFixed(2)}</td>
            </tr>
          `
            )
            .join("")}
          <tr class="total">
            <td colspan="3">Total</td>
            <td>₹${invoice.total.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </body>
    </html>
  `;

  await page.setContent(html);
  const pdfBuffer = await page.pdf({ format: "A4" });

  await browser.close();

  return Buffer.from(pdfBuffer);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied. Admin only." },
        { status: 403 }
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid invoice ID" },
        { status: 400 }
      );
    }

    await dbConnect();

    const invoice = (await Invoice.findById(id).lean()) as any;

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Check if user owns this invoice
    if (invoice.createdBy.toString() !== user.userId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Check if client email exists
    if (!invoice.clientEmail) {
      return NextResponse.json(
        { error: "Client email not found" },
        { status: 400 }
      );
    }

    const pdfBuffer = await generateInvoicePDF(invoice);

    console.log("✅ PDF generated");
    
    await verifyEmailConfig();
    
    await sendInvoiceEmail({
      to: invoice.clientEmail,
      clientName: invoice.clientName,
      invoice,
      pdfBuffer,
    });

    // Update invoice status to SENT if it was DRAFT
    if (invoice.status === "DRAFT") {
      await Invoice.findByIdAndUpdate(id, { status: "SENT" });
    }

    return NextResponse.json({
      success: true,
      message: `Invoice sent successfully to ${invoice.clientEmail}`,
    });
  } catch (error: any) {
    console.error("❌ Email invoice error:", error);
    return NextResponse.json(
      { error: "Failed to send invoice email" },
      { status: 500 }
    );
  }
}
