
// GITHUB COPILOT VERSON 
// import { NextRequest, NextResponse } from 'next/server';
// import crypto from 'crypto';
// import dbConnect from '@/lib/db';
// import User from '@/models/User';
// import { sendActivationEmail } from '@/lib/mail';

// export async function POST(request: NextRequest) {
//   try {
//     await dbConnect();

//     const payload = await request.json();

//     // Extract data from the nested structure
//     const {
//       employeeId,
//       name,
//       gender,
//       dob,
//       contact,
//       job,
//       salary,
//       bank,
//       documents,
//       role,
//     } = payload;

//     // Validate required fields
//     if (!employeeId || !name || !contact?.email || !job?.department || !job?.designation || !job?.joinDate || !salary?.basic) {
//       return NextResponse.json(
//         { error: 'Required fields are missing' },
//         { status: 400 }
//       );
//     }

//     const email = contact?.email;

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return NextResponse.json(
//         { error: 'Invalid email format' },
//         { status: 400 }
//       );
//     }

//     // Check if email already exists
//     const existingEmail = await User.findOne({ 'contact.email': email });
//     if (existingEmail) {
//       return NextResponse.json(
//         { error: 'Email already exists' },
//         { status: 400 }
//       );
//     }

//     // Check if employee ID already exists
//     const existingEmployeeId = await User.findOne({ employeeId });
//     if (existingEmployeeId) {
//       return NextResponse.json(
//         { error: 'Employee ID already exists' },
//         { status: 400 }
//       );
//     }

//     // Validate manager if provided
//     if (job?.manager) {
//       const managerExists = await User.findOne({ employeeId: job.manager });
//       if (!managerExists) {
//         return NextResponse.json(
//           { error: 'Manager with provided Employee ID does not exist' },
//           { status: 400 }
//         );
//       }
//     }

//     // Calculate net salary
    
//     const basicSal = parseFloat(salary?.basic) || 0;
//     const hraAmt = parseFloat(salary?.hra) || 0;
//     const transport = parseFloat(salary?.transportAllowances) || 0;
//     const medical = parseFloat(salary?.medicalAllowances) || 0;
//     const bonus = parseFloat(salary?.bonus?.amount) || 0;
//     const pfDeduction = parseFloat(salary?.deductions?.pf) || 0;
//     const taxDeduction = parseFloat(salary?.deductions?.tax) || 0;
//     const otherDeduction = parseFloat(salary?.deductions?.other?.amount) || 0;

//     const grossSalary = basicSal + hraAmt + transport + medical + bonus;
//     const totalDeductions = pfDeduction + taxDeduction + otherDeduction;
//     const netSalary = grossSalary - totalDeductions;
    
//     // Generate activation token
//     const activationToken = crypto.randomBytes(32).toString('hex');
//     const activationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

//     // Prepare salary details with nested structure matching your schema
//     const salaryDetails: any = {
//       basic: basicSal,
//       net: netSalary,
//     };

//     if (hraAmt > 0) salaryDetails.hra = hraAmt;
//     if (transport > 0) salaryDetails.transportAllowances = transport;
//     if (medical > 0) salaryDetails.medicalAllowances = medical;
    
//     if (salary?.bonus?.title && bonus > 0) {
//       salaryDetails.bonus = {
//         title: salary.bonus.title,
//         amount: bonus,
//       };
//     }

//     // Deductions nested object
//     const deductions: any = {};
//     if (pfDeduction > 0) deductions.pf = pfDeduction;
//     if (taxDeduction > 0) deductions.tax = taxDeduction;
//     if (salary?.deductions?.other?.title && otherDeduction > 0) {
//       deductions.other = {
//         title: salary.deductions.other.title,
//         amount: otherDeduction,
//       };
//     }

//     if (Object.keys(deductions).length > 0) {
//       salaryDetails.deductions = deductions;
//     }

//     // Prepare contact details
//     const contactDetails: any = {
//       email: contact.email,
//     };
//     if (contact?.phone) contactDetails.phone = contact.phone;
//     if (contact?.address) contactDetails.address = contact.address;

//     // Prepare job details
//     const jobDetails: any = {
//       department: job.department,
//       designation: job.designation,
//       joinDate: new Date(job.joinDate),
//       employmentType: job?.employmentType || 'Full-time',
//     };
//     if (job?.manager) jobDetails.manager = job.manager;

//     // Prepare bank details
//     const bankDetails: any = {};
//     if (bank?.name) bankDetails.name = bank.name;
//     if (bank?.accountNumber) bankDetails.accountNumber = bank.accountNumber;
//     if (bank?.ifsc) bankDetails.ifsc = bank.ifsc;
//     if (bank?.upi) bankDetails.upi = bank.upi;

//     // Prepare documents
//     const userDocuments: any = {};
//     if (documents?.pan) userDocuments.pan = documents.pan;
//     if (documents?.aadhar) userDocuments.aadhar = documents.aadhar;

//     // Create user object with NESTED structure matching your schema
//     const userData: any = {
//       employeeId,
//       name,
//       email,
//       role: role || 'EMPLOYEE',
//       status: 'PENDING',
//       activationToken,
//       activationExpiry,
//       contact: contactDetails,
//       job: jobDetails,
//       salary: salaryDetails,
//     };

//     // Add optional fields if provided
//     if (gender) userData.gender = gender;
//     if (dob) userData.dob = new Date(dob);
//     if (Object.keys(bankDetails).length > 0) userData.bank = bankDetails;
//     if (Object.keys(userDocuments).length > 0) userData.documents = userDocuments;

//     // Create user
//     const user = await User.create(userData);

//     // Send activation email
//     const activationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/activate?token=${activationToken}`;
    
//     await sendActivationEmail({
//       to: email,
//       name,
//       activationUrl,
//     });

//     return NextResponse.json(
//       {
//         message: 'Employee created successfully. Activation email sent.',
//         user: {
//           id: user._id,
//           employeeId: user.employeeId,
//           name: user.name,
//           email: user.contact.email,
//           role: user.role,
//           status: user.status,
//           department: user.job.department,
//           designation: user.job.designation,
//           netSalary: user.salary.net,
//         },
//       },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     console.error('Create employee error:', error);
    
//     // Handle mongoose validation errors
//     if (error.name === 'ValidationError') {
//       const messages = Object.values(error.errors).map((err: any) => err.message);
//       return NextResponse.json(
//         { error: messages.join(', ') },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { error: error.message || 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }




// NEW 
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { sendActivationEmail } from '@/lib/mail';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const payload = await request.json();

    // Extract data from the nested structure
    const {
      employeeId,
      name,
      gender,
      dob,
      contact,
      job,
      salary,
      bank,
      documents,
      role,
    } = payload;

    // Validate required fields
    if (!employeeId || !name || !contact?.email || !job?.department || !job?.designation || !job?.joinDate || !salary?.basic) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    const email = contact?.email;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ 'contact.email': email });
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Check if employee ID already exists
    const existingEmployeeId = await User.findOne({ employeeId });
    if (existingEmployeeId) {
      return NextResponse.json(
        { error: 'Employee ID already exists' },
        { status: 400 }
      );
    }

    // Validate manager if provided
    if (job?.manager) {
      const managerExists = await User.findOne({ employeeId: job.manager });
      if (!managerExists) {
        return NextResponse.json(
          { error: 'Manager with provided Employee ID does not exist' },
          { status: 400 }
        );
      }
    }

    // Parse salary values (these should already be calculated amounts from frontend)
    const basicSal = parseFloat(salary?.basic) || 0;
    const hraAmt = parseFloat(salary?.hra) || 0;
    const transport = parseFloat(salary?.transportAllowances) || 0;
    const medical = parseFloat(salary?.medicalAllowances) || 0;
    const bonus = parseFloat(salary?.bonus?.amount) || 0;
    const pfDeduction = parseFloat(salary?.deductions?.pf) || 0;
    const taxDeduction = parseFloat(salary?.deductions?.tax) || 0;
    const otherDeduction = parseFloat(salary?.deductions?.other?.amount) || 0;

    // Calculate gross and net salary
    const grossSalary = basicSal + hraAmt + transport + medical + bonus;
    const totalDeductions = pfDeduction + taxDeduction + otherDeduction;
    const netSalary = grossSalary - totalDeductions;

    // Validate salary calculations
    if (basicSal <= 0) {
      return NextResponse.json(
        { error: 'Basic salary must be greater than 0' },
        { status: 400 }
      );
    }

    if (netSalary < 0) {
      return NextResponse.json(
        { error: 'Net salary cannot be negative. Please check deductions.' },
        { status: 400 }
      );
    }
    
    // Generate activation token
    const activationToken = crypto.randomBytes(32).toString('hex');
    const activationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Prepare salary details with nested structure matching your schema
    const salaryDetails: any = {
      basic: basicSal,
      net: netSalary,
    };

    // Add allowances if they exist
    if (hraAmt > 0) salaryDetails.hra = hraAmt;
    if (transport > 0) salaryDetails.transportAllowances = transport;
    if (medical > 0) salaryDetails.medicalAllowances = medical;
    
    // Add bonus if provided
    if (salary?.bonus?.title && bonus > 0) {
      salaryDetails.bonus = {
        title: salary.bonus.title,
        amount: bonus,
      };
    }

    // Prepare deductions nested object
    const deductions: any = {};
    if (pfDeduction > 0) deductions.pf = pfDeduction;
    if (taxDeduction > 0) deductions.tax = taxDeduction;

    if (salary?.deductions?.other?.title && otherDeduction > 0) {
      deductions.other = {
        title: salary?.deductions?.other?.title,
        amount: otherDeduction,
      };
    }

    // Only add deductions object if there are deductions
    if (Object.keys(deductions).length > 0) {
      salaryDetails.deductions = deductions;
    }

    // Prepare contact details
    const contactDetails: any = {
      email: contact.email,
    };
    if (contact?.phone) contactDetails.phone = contact.phone;
    if (contact?.address) contactDetails.address = contact.address;
    if (contact?.city) contactDetails.city = contact.city;
    if (contact?.state) contactDetails.state = contact.state;
    if (contact?.pincode) contactDetails.pincode = contact.pincode;

    // Prepare job details
    const jobDetails: any = {
      department: job.department,
      designation: job.designation,
      joinDate: new Date(job.joinDate),
      employmentType: job?.employmentType || 'Full-time',
    };
    if (job?.manager) jobDetails.manager = job.manager;

    // Prepare bank details
    const bankDetails: any = {};
    if (bank?.name) bankDetails.name = bank.name;
    if (bank?.accountNumber) bankDetails.accountNumber = bank.accountNumber;
    if (bank?.ifsc) bankDetails.ifsc = bank.ifsc;
    if (bank?.upi) bankDetails.upi = bank.upi;
    if (bank?.pfAccountNumber) bankDetails.pfAccountNumber = bank.pfAccountNumber;

    // Prepare documents
    const userDocuments: any = {};
    if (documents?.pan) userDocuments.pan = documents.pan;
    if (documents?.aadhar) userDocuments.aadhar = documents.aadhar;

    // Create user object with NESTED structure matching your schema
    const userData: any = {
      employeeId,
      name,
      email,
      role: role || 'EMPLOYEE',
      status: 'PENDING',
      activationToken,
      activationExpiry,
      contact: contactDetails,
      job: jobDetails,
      salary: salaryDetails,
    };

    // Add optional fields if provided
    if (gender) userData.gender = gender;
    if (dob) userData.dob = new Date(dob);
    if (Object.keys(bankDetails).length > 0) userData.bank = bankDetails;
    if (Object.keys(userDocuments).length > 0) userData.documents = userDocuments;

    // Create user
    const user = await User.create(userData);

    // Send activation email
    const activationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/activate?token=${activationToken}`;
    
    await sendActivationEmail({
      to: email,
      name,
      activationUrl,
    });

    console.log('Employee created successfully:', {
      employeeId: user.employeeId,
      name: user.name,
      department: user.job.department,
      netSalary: user.salary.net,
    });

    return NextResponse.json(
      {
        message: 'Employee created successfully. Activation email sent.',
        user: {
          id: user._id,
          employeeId: user.employeeId,
          name: user.name,
          email: user.contact.email,
          role: user.role,
          status: user.status,
          department: user.job.department,
          designation: user.job.designation,
          basicSalary: user.salary.basic,
          netSalary: user.salary.net,
          grossSalary: grossSalary,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create employee error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: messages.join(', ') },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { error: `${field} already exists` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}