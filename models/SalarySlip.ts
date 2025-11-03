import mongoose, { Schema, Document } from 'mongoose';

export interface ISalarySlip extends Document {
  employee: {
    userId: mongoose.Types.ObjectId;
    name: string;
    email: string;
    designation: string;
    employeeId?: string;
  };
  company: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    email: string;
    website?: string;
    logo?: string;
  };
  salary: {
    month: string;
    year: number;
    basicSalary: number;
    allowances: {
      hra: number;
      transport: number;
      medical: number;
      other: number;
    };
    deductions: {
      pf: number;
      tax: number;
      other: number;
    };
    grossSalary: number;
    netSalary: number;
  };
  signature?: string; // Base64 or URL
  watermark: boolean;
  generatedBy: mongoose.Types.ObjectId;
  status: 'DRAFT' | 'GENERATED' | 'SENT';
  createdAt: Date;
  updatedAt: Date;
}

const SalarySlipSchema = new Schema<ISalarySlip>(
  {
    employee: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      designation: {
        type: String,
        required: true,
      },
      employeeId: String,
    },
    company: {
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: String,
      state: String,
      pincode: String,
      phone: String,
      email: String,
      website: String,
      logo: String,
    },
    salary: {
      month: {
        type: String,
        required: true,
      },
      year: {
        type: Number,
        required: true,
      },
      basicSalary: {
        type: Number,
        required: true,
      },
      allowances: {
        hra: { type: Number, default: 0 },
        transport: { type: Number, default: 0 },
        medical: { type: Number, default: 0 },
        other: { type: Number, default: 0 },
      },
      deductions: {
        pf: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        other: { type: Number, default: 0 },
      },
      grossSalary: {
        type: Number,
        required: true,
      },
      netSalary: {
        type: Number,
        required: true,
      },
    },
    signature: String,
    watermark: {
      type: Boolean,
      default: true,
    },
    generatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'GENERATED', 'SENT'],
      default: 'DRAFT',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.SalarySlip || mongoose.model<ISalarySlip>('SalarySlip', SalarySlipSchema);