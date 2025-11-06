// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { jwtVerify } from "jose";
// import dbConnect from "@/lib/db";
// import Invoice from "@/models/Invoice";
// import mongoose from "mongoose";
// import nodemailer from "nodemailer";
// import puppeteer from "puppeteer";


// async function generateInvoicePDF(invoice: any): Promise<Buffer> {
//   const browser = await puppeteer.launch({
//     headless: true,
//     args: ["--no-sandbox", "--disable-setuid-sandbox"],
//   });

//   const page = await browser.newPage();

//   const html = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <style>
//         body { font-family: Arial, sans-serif; padding: 40px; }
//         h1 { color: #333; }
//         table { width: 100%; border-collapse: collapse; margin: 20px 0; }
//         th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
//         th { background-color: #f5f5f5; }
//         .total { background-color: #f0f0f0; font-weight: bold; }
//       </style>
//     </head>
//     <body>
//       <h1>Invoice ${invoice.invoiceNumber}</h1>
//       <p><strong>Date:</strong> ${new Date(
//         invoice.invoiceDate
//       ).toLocaleDateString()}</p>
//       <p><strong>Client:</strong> ${invoice.clientName}</p>
//       <p><strong>Total:</strong> ₹${invoice.total.toFixed(2)}</p>
//       <table>
//         <thead>
//           <tr>
//             <th>Item</th>
//             <th>Quantity</th>
//             <th>Rate</th>
//             <th>Amount</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${invoice.items
//             .map(
//               (item: any) => `
//             <tr>
//               <td>${item.item}<br/><small>${item.description}</small></td>
//               <td>${item.quantity}</td>
//               <td>₹${item.rate.toFixed(2)}</td>
//               <td>₹${item.amount.toFixed(2)}</td>
//             </tr>
//           `
//             )
//             .join("")}
//           <tr class="total">
//             <td colspan="3">Total</td>
//             <td>₹${invoice.total.toFixed(2)}</td>
//           </tr>
//         </tbody>
//       </table>
//     </body>
//     </html>
//   `;

//   await page.setContent(html);
//   const pdfBuffer = await page.pdf({ format: "A4" });

//   await browser.close();

//   return Buffer.from(pdfBuffer);
// }

// export async function POST(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     // const user = await verifyAuth(request);

//     const userId = request.headers.get("x-user-id"); // from middleware - User Id
//     const userRole = request.headers.get("x-user-role");

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     if (userRole !== "ADMIN") {
//       return NextResponse.json(
//         { error: "Access denied. Admin only." },
//         { status: 403 }
//       );
//     }

//     const { id } = await params; // invoice ID

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { error: "Invalid invoice ID" },
//         { status: 400 }
//       );
//     }

//     await dbConnect();

//     const invoice = (await Invoice.findById(id).lean()) as any;

//     if (!invoice) {
//       return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
//     }

//     // Check if user owns this invoice
//     if (invoice.createdBy.toString() !== userId) {
//       return NextResponse.json({ error: "Access denied" }, { status: 403 });
//     }

//     // Check if client email exists
//     if (!invoice.clientEmail) {
//       return NextResponse.json(
//         { error: "Client email not found" },
//         { status: 400 }
//       );
//     }

//     const pdfBuffer = await generateInvoicePDF(invoice);

//     console.log("✅ PDF generated");
    
//     await verifyEmailConfig();
    
//     await sendInvoiceEmail({
//       to: invoice.clientEmail,
//       clientName: invoice.clientName,
//       invoice,
//       pdfBuffer,
//     });

//     // Update invoice status to SENT if it was DRAFT
//     if (invoice.status === "DRAFT") {
//       await Invoice.findByIdAndUpdate(id, { status: "SENT" });
//     }

//     return NextResponse.json({
//       success: true,
//       message: `Invoice sent successfully to ${invoice.clientEmail}`,
//     });
//   } catch (error: any) {
//     console.error("❌ Email invoice error:", error);
//     return NextResponse.json(
//       { error: "Failed to send invoice email" },
//       { status: 500 }
//     );
//   }
// }






import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Invoice from '@/models/Invoice';
import { sendEmail, emailTemplates } from '@/lib/mail';
import { InvoiceDocument } from '@/components/templates/Invoice';
import React from 'react';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userRole = request.headers.get('x-user-role');

    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }


    const {id} = await params;

    await dbConnect();

    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    console.log('📧 Sending invoice email to:', invoice.clientEmail);

    const pdfFilename = `${invoice.invoiceNumber}.pdf`;

    const pdfDocument = React.createElement(InvoiceDocument, {
      data: invoice.toObject(),
    });

    await sendEmail({
      to: invoice.clientEmail,
      subject: `Invoice ${invoice.invoiceNumber}`,
      html: emailTemplates.invoice(
        invoice.clientName,
        invoice.invoiceNumber,
        invoice.total
      ),
      pdfDocument,
      pdfFilename,
    });

    // Update status
    invoice.status = 'SENT';
    invoice.sentAt = new Date();
    await invoice.save();

    console.log('✅ Invoice email sent successfully');

    return NextResponse.json({
      success: true,
      message: 'Invoice sent successfully',
      sentTo: invoice.clientEmail,
    });
  } catch (error: any) {
    console.error('❌ Error sending invoice:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send invoice' },
      { status: 500 }
    );
  }
}
