// import mongoose, { Schema, Document } from 'mongoose';

// export interface IEmployee extends Document {
//   employeeId: string;
//   name: string;
//   email: string;
//   password?: string;
//   role: 'ADMIN' | 'EMPLOYEE';
//   status: 'PENDING' | 'ACTIVE' | 'INACTIVE';
//   activationToken?: string;
//   activationExpiry?: Date;
//   passwordResetToken?: string;
//   passwordResetExpiry?: Date;
//   createdBy?: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const EmployeeSchema = new Schema<IEmployee>(
//   {
//     employeeId: {
//       type: String,
//       unique: true,
//       required: [true, 'Employee ID is required'],
//       trim: true,
//     },
//     name: {
//       type: String,
//       required: [true, 'Name is required'],
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: [true, 'Email is required'],
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       select: false,
//     },
//     role: {
//       type: String,
//       enum: ['ADMIN', 'EMPLOYEE'],
//       default: 'EMPLOYEE',
//     },
//     status: {
//       type: String,
//       enum: ['PENDING', 'ACTIVE', 'INACTIVE'],
//       default: 'PENDING',
//     },
//     activationToken: {
//       type: String,
//       select: false,
//     },
//     activationExpiry: {
//       type: Date,
//       select: false,
//     },
//     passwordResetToken: { type: String },
//     passwordResetExpiry: { type: Date },
//     // createdBy: {
//     //   type:  Schema.Types.ObjectId,
//     //   ref: 'Employee',
//     // },
//   },
//   {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
// );

// // EmployeeSchema.index({ email: 1 });
// // EmployeeSchema.index({ employeeId: 1 });
// EmployeeSchema.index({ activationToken: 1 });
// EmployeeSchema.index({ passwordResetToken: 1 });

// export default mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface IEmployee extends Document {
  employeeId: string;
  name: string;
  gender?: "Male" | "Female" | "Other";
  dob?: Date;
  contact: {
    email: string;
    phone?: string;
    address?: string;
  };
  job: {
    department: string;
    designation: string;
    joinDate: Date;
    employmentType: "Full-time" | "Part-time" | "Contract" | "Intern";
    manager?: string;
  };
  salary: {
    basic: number;
    hra: number;
    transportAllowances: number;
    medicalAllowances: number;
    deductions: number;
    bonus: number;
    net: number;
  };
  bank?: {
    name?: string;
    accountNumber?: string;
    ifsc?: string;
    upi?: string;
  };
  documents?: {
    pan?: string;
    aadhar?: string;
  };
  password?: string;
  role: "ADMIN" | "EMPLOYEE";
  status: "PENDING" | "ACTIVE" | "INACTIVE";
  activationToken?: string;
  activationExpiry?: Date;
  passwordResetToken?: string;
  passwordResetExpiry?: Date;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema = new Schema<IEmployee>(
  {
    employeeId: {
      type: String,
      unique: true,
      required: [true, "Employee ID is required"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    dob: {
      type: Date,
    },
    contact: {
      email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
    },
    job: {
      department: {
        type: String,
        required: [true, "Department is required"],
        trim: true,
      },
      designation: {
        type: String,
        required: [true, "Designation is required"],
        trim: true,
      },
      joinDate: {
        type: Date,
        required: [true, "Join date is required"],
        default: Date.now,
      },
      employmentType: {
        type: String,
        enum: ["Full-time", "Part-time", "Contract", "Intern"],
        default: "Full-time",
      },
      manager: {
        type: String,
        trim: true,
      },
    },
    salary: {
      basic: {
        type: Number,
        required: [true, "Basic salary is required"],
        default: 0,
      },
      hra: {
        type: Number,
        default: 0,
      },
      transportAllowances: {
        type: Number,
        default: 0,
      },
      medicalAllowances: {
        type: Number,
        default: 0,
      },
      deductions: {
        pf: {
          type: Number,
          default: 0,
        },
        tax: {
          type: Number,
          default: 0,
        },
        others: {
          title: {
            type: String,
            trim: true,
            default: "",
          },
          amount: {
            type: Number,
            default: 0,
          },
        },
      },
      bonus: {
        title:{
          type: String,
          trim: true,
          default: "",
        },
        amount: {
          type: Number,
          default: 0,
        }
      },
      net: {
          type: Number,
          default: 0,
        },
    },
    bank: {
      name: {
        type: String,
        trim: true,
      },
      accountNumber: {
        type: String,
        trim: true,
      },
      ifsc: {
        type: String,
        trim: true,
        uppercase: true,
      },
      upi: {
        type: String,
        trim: true,
        lowercase: true,
      },
    },
    documents: {
      pan: {
        type: String,
        trim: true,
        uppercase: true,
        index: true,
      },
      aadhar: {
        type: String,
        trim: true,
        index: true,
      },
    },
    password: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: ["ADMIN", "EMPLOYEE"],
      default: "EMPLOYEE",
    },
    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "INACTIVE"],
      default: "PENDING",
    },
    activationToken: {
      type: String,
      select: false,
    },
    activationExpiry: {
      type: Date,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpiry: {
      type: Date,
      select: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// // Auto-calculate net salary before save
// EmployeeSchema.pre("save", function (next) {
//   if (this.isModified("salary")) {
//     const { basic, hra, transportAllowances, medicalAllowances, deductions } = this.salary;
//     this.salary.net = basic + hra + transportAllowances + medicalAllowances - deductions;
//   }
//   next();
// });

// Indexes
// EmployeeSchema.index({ "contact.email": 1 });
// EmployeeSchema.index({ employeeId: 1 });
EmployeeSchema.index({ activationToken: 1 });
EmployeeSchema.index({ passwordResetToken: 1 });
EmployeeSchema.index({ status: 1 });
EmployeeSchema.index({ "job.department": 1 });

export default mongoose.models.Employee ||
  mongoose.model<IEmployee>("Employee", EmployeeSchema);
