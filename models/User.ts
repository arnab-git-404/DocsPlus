import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
  employeeId: string;
  name: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'EMPLOYEE';
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE';
  activationToken?: string;
  activationExpiry?: Date;
  passwordResetToken?: string;
  passwordResetExpiry?: Date;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema = new Schema<IEmployee>(
  {
    employeeId: {
      type: String,
      unique: true,
      required: [true, 'Employee ID is required'],
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: ['ADMIN', 'EMPLOYEE'],
      default: 'EMPLOYEE',
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACTIVE', 'INACTIVE'],
      default: 'PENDING',
    },
    activationToken: {
      type: String,
      select: false,
    },
    activationExpiry: {
      type: Date,
      select: false,
    },
    passwordResetToken: { type: String },
    passwordResetExpiry: { type: Date },
    // createdBy: {
    //   type:  Schema.Types.ObjectId,
    //   ref: 'Employee',
    // },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// EmployeeSchema.index({ email: 1 });
// EmployeeSchema.index({ employeeId: 1 });
EmployeeSchema.index({ activationToken: 1 });
EmployeeSchema.index({ passwordResetToken: 1 });

export default mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);

