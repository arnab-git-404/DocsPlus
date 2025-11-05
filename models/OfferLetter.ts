import mongoose, { Schema, Document } from 'mongoose';

export interface IOfferLetter extends Document {
  offerNumber: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  candidateAddress: string;
  position: string;
  department: string;
  joiningDate: Date;
  salary: number;
  workingHours: string;
  probationPeriod: string;
  noticePeriod: string;
  benefits: string[];
  responsibilities: string[];
  terms: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED';
  offerDate: Date;
  expiryDate: Date;
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyState: string;
  companyPincode: string;
  companyEmail: string;
  companyPhone: string;
  companyWebsite?: string;
  signerName: string;
  signerDesignation: string;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  sentAt?: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OfferLetterSchema = new Schema<IOfferLetter>(
  {
    offerNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    candidateName: {
      type: String,
      required: true,
    },
    candidateEmail: {
      type: String,
      required: true,
    },
    candidatePhone: {
      type: String,
      required: true,
    },
    candidateAddress: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    workingHours: {
      type: String,
      default: '9:00 AM - 6:00 PM',
    },
    probationPeriod: {
      type: String,
      default: '3 months',
    },
    noticePeriod: {
      type: String,
      default: '30 days',
    },
    benefits: [
      {
        type: String,
      },
    ],
    responsibilities: [
      {
        type: String,
      },
    ],
    terms: {
      type: String,
      default: 'This offer is subject to background verification and document submission.',
    },
    status: {
      type: String,
      enum: ['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED'],
      default: 'DRAFT',
    },
    offerDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    companyAddress: {
      type: String,
      required: true,
    },
    companyCity: {
      type: String,
      required: true,
    },
    companyState: {
      type: String,
      required: true,
    },
    companyPincode: {
      type: String,
      required: true,
    },
    companyEmail: {
      type: String,
      required: true,
    },
    companyPhone: {
      type: String,
      required: true,
    },
    companyWebsite: {
      type: String,
    },
    signerName: {
      type: String,
      required: true,
    },
    signerDesignation: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    sentAt: {
      type: Date,
    },
    acceptedAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

OfferLetterSchema.index({ candidateEmail: 1 });
OfferLetterSchema.index({ status: 1 });
OfferLetterSchema.index({ createdBy: 1 });
OfferLetterSchema.index({ createdAt: -1 });

if (mongoose.models.OfferLetter) {
  delete mongoose.models.OfferLetter;
}

export default mongoose.model<IOfferLetter>('OfferLetter', OfferLetterSchema);