import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoiceItem {
  item: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface IInvoice extends Document {
  invoiceNumber: string;
  invoiceDate: Date;
  
  // Client Details
  clientName: string;
  clientAddress: string;
  clientCity: string;
  clientState: string;
  clientPincode: string;
  clientPhone: string;
  clientEmail?: string;
  clientGSTIN?: string;
  
  
  // Company Location Selection
  companyLocation: 'BIHAR' | 'KOLKATA';

  // Company Details (Hackence Services)
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyState: string;
  companyPincode: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  companyGSTIN?: string;
  
  // Invoice Items
  items: IInvoiceItem[];
  
  // Calculations
  subtotal: number;
  discount: number;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountAmount: number;
  cgst: number; // Central GST %
  sgst: number; // State GST %
  cgstAmount: number;
  sgstAmount: number;
  total: number;
  
  // Payment Details
  paymentMethod?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  upiId?: string;
  
  // Additional
  notes?: string;
  terms?: string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'CANCELLED';
  
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceItemSchema = new Schema({
  item: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  rate: { type: Number, required: true, min: 0 },
  amount: { type: Number, required: true },
});

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: {
      type: String,
      unique: true,
      required:true,
      index: true,
    },
    invoiceDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    
    // Client Details
    clientName: { type: String, required: true },
    clientAddress: { type: String, required: true },
    clientCity: { type: String, required: true },
    clientState: { type: String, required: true },
    clientPincode: { type: String, required: true },
    clientPhone: { type: String, required: true },
    clientEmail: { type: String },
    clientGSTIN: { type: String },
    
    // Company Location Selection
    companyLocation: {
      type: String,
      enum: ['BIHAR', 'KOLKATA'],
      required: true,
      default: 'BIHAR',
    },

    // Company Details
    companyName: {
      type: String,
    },
    companyAddress: {
      type: String,
    },
    companyCity: {
      type: String,
    },
    companyState: {
      type: String,
    },
    companyPincode: {
      type: String,
    },
    companyPhone: {
      type: String,
    },
    companyEmail: {
      type: String,
    },
    companyWebsite: {
      type: String,
    },
    companyGSTIN: { type: String },
    
    // Invoice Items
    items: [InvoiceItemSchema],
    
    // Calculations
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    discountType: {
      type: String,
      enum: ['PERCENTAGE', 'FIXED'],
      default: 'FIXED',
    },
    discountAmount: { type: Number, default: 0 },
    cgst: { type: Number, default: 9 }, // 9%
    sgst: { type: Number, default: 9 }, // 9%
    cgstAmount: { type: Number, default: 0 },
    sgstAmount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    
    // Payment Details
    paymentMethod: { type: String },
    bankName: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    upiId: { type: String },
    
    // Additional
    notes: { type: String },
    terms: { 
      type: String,
      default: 'Payment is due within 15 days of invoice date.',
    },
    status: {
      type: String,
      enum: ['DRAFT', 'SENT', 'PAID', 'CANCELLED'],
      default: 'DRAFT',
    },
    
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique invoice number
// InvoiceSchema.pre('save', async function (next) {
//   if (this.isNew && !this.invoiceNumber) {
//     const date = new Date();
//     const year = date.getFullYear().toString().slice(-2);
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
//     // Find last invoice of current month
//     const lastInvoice = await mongoose.model('Invoice')
//       .findOne({
//         invoiceNumber: new RegExp(`^INV-${year}${month}`),
//       })
//       .sort({ invoiceNumber: -1 })
//       .lean();
    
//     let sequence = 1;
//     if (lastInvoice) {
//       const lastSequence = parseInt(lastInvoice.invoiceNumber.split('-')[2]);
//       sequence = lastSequence + 1;
//     }
    
//     this.invoiceNumber = `INV-${year}${month}-${sequence.toString().padStart(4, '0')}`;
//   }
//   next();
// });

// UPDATED 

// InvoiceSchema.pre('save', async function (next) {
//   if (this.isNew && !this.invoiceNumber) {
//     try {
//       const date = new Date();
//       const year = date.getFullYear().toString().slice(-2);
//       const month = (date.getMonth() + 1).toString().padStart(2, '0');
      
//       // Use this.constructor to avoid circular reference
//       const InvoiceModel = this.constructor as any;
      
//       // Find last invoice of current month
//       const lastInvoice = await InvoiceModel
//         .findOne({
//           invoiceNumber: new RegExp(`^INV-${year}${month}`),
//         })
//         .sort({ invoiceNumber: -1 })
//         .lean()
//         .exec();
      
//       let sequence = 1;
//       if (lastInvoice && lastInvoice.invoiceNumber) {
//         const parts = lastInvoice.invoiceNumber.split('-');
//         if (parts.length === 3) {
//           const lastSequence = parseInt(parts[2]);
//           if (!isNaN(lastSequence)) {
//             sequence = lastSequence + 1;
//           }
//         }
//       }
      
//       this.invoiceNumber = `INV-${year}${month}-${sequence.toString().padStart(4, '0')}`;
//       console.log('Generated invoice number:', this.invoiceNumber);
//     } catch (error) {
//       console.error('Error generating invoice number:', error);
//       return next(error as Error);
//     }
//   }
//   next();
// });

// Add index for better query performance
InvoiceSchema.index({ createdBy: 1, status: 1 });
InvoiceSchema.index({ invoiceDate: -1 });


if (mongoose.models.Invoice) {
  delete mongoose.models.Invoice;
}


export default mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);


