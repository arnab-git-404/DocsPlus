# 💼 DocsPlus - Complete HR Management System

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React PDF](https://img.shields.io/badge/React_PDF-E33332?style=for-the-badge&logo=adobe-acrobat-reader&logoColor=white)

A comprehensive HR management system for generating salary slips, invoices, and offer letters with PDF export and email capabilities.

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

---

## ✨ Features

### 👨‍💼 Admin Features

- 📊 **Dashboard Analytics**
  - Real-time statistics
  - Employee count tracking
  - Salary slip generation metrics
  - Visual charts and graphs

- 👥 **Employee Management**
  - Add, edit, and delete employees
  - Bulk import via CSV
  - Advanced search and filtering
  - Pagination support
  - Employee status management (Active/Inactive/Pending)

- 💰 **Salary Slip Generation**
  - Dynamic salary calculations
  - Percentage or fixed allowances/deductions
  - PDF generation with company branding
  - Bulk generation for multiple employees
  - Email delivery system
  - Download and print options

- 🧾 **Invoice Management**
  - Create and manage invoices
  - Auto-generate invoice numbers
  - PDF export with watermark
  - Email invoices to clients
  - Track payment status

- 📧 **Offer Letter System**
  - Professional offer letter templates
  - Customizable content
  - PDF generation
  - Email delivery to candidates

### 👨‍💻 Employee Features

- 🏠 **Personal Dashboard**
  - Overview of salary information
  - Recent salary slips
  - Profile management

- 📄 **Salary Slip Access**
  - View all salary slips
  - Download as PDF
  - Monthly/yearly filtering

- 👤 **Profile Management**
  - Update personal information
  - Change password
  - View employment details

### 🔐 Security Features

- ✅ **Authentication & Authorization**
  - Cookies + JWT-based authentication
  - Role-based access control (Admin/Employee)
  - Secure password hashing with bcrypt
  - Email verification system
  - Password reset functionality

- 🛡️ **Data Protection**
  - HTTP-only cookies
  - CSRF protection
  - Input validation
  - SQL injection prevention

---

## 🎬 Demo

🔗 **Live Demo**: https://office-docsplus.vercel.app

### Test Credentials
- **Admin**
  - Email: admin@example.com
    - Password: Admin@123
- **Employee**
  - Email: employee@example.com
    - Password: Employee@123
---


## 📸 Screenshots

<details>
<summary>Click to view screenshots</summary>

### Company Employee Dashboard
![Company Employee Dashboard](image-5.png)

### Admin Dashboard
![Admin Dashboard](image.png)

### Employee Management
![Employee Management](image-1.png)

### Salary Slip Generation
![Salary Slip](image-2.png)

### Offer Letter System
![Offer Letter](image-3.png)

### Invoice System
![Invoice](image-4.png)

</details>

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **PDF Generation**: @react-pdf/renderer
- **Forms**: React Hook Form
- **State Management**: Context API
- **HTTP Client**: Fetch API

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Email Service**: Nodemailer

### DevOps & Tools
- **Version Control**: Git
- **Package Manager**: npm/yarn
- **Deployment**: Vercel (recommended)
- **Environment Management**: dotenv

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Git

### Step-by-Step Setup

1. **Clone the repository**
```bash
git clone https://github.com/arnab-git-404/DocsPlus.git
cd DocsPlus
```
2. **Install dependencies**
```bash
npm install
# or
yarn install
```
3. **Set up environment variables**
Create a `.env.local` file in the root directory and add the following variables:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/docsplus
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/docsplus

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
SMTP_FROM=noreply@yourcompany.com

# Company Details
COMPANY_NAME=Your Company Name
COMPANY_EMAIL=info@yourcompany.com
COMPANY_PHONE=+1234567890
COMPANY_ADDRESS=123 Business St, City, Country
COMPANY_WEBSITE=www.yourcompany.com
```
4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```
5. **Access the application**
Open your browser and navigate to `http://localhost:3000`
---
## ⚙️ Configuration

Ensure all necessary environment variables are set in the `.env.local` file as described in the installation section.

### Email Setup (Gmail Example)
To use Gmail for sending emails, you may need to enable "Less secure app access" or use an App Password if you have 2-Step Verification enabled.
1. Go to your Google Account settings.
2. Navigate to Security > App Passwords.
3. Generate a new app password for "Mail" and use it as `SMTP_PASS` in your `.env.local` file.
---
## 📖 Usage
### Admin Panel
📖 Usage
For Admins
### Creating Employees
1. Navigate to Employees → Add New Employee
2. Fill in employee details across tabs:
    - Basic Info (name, email, DOB)
    - Contact Info (phone, address)
    - Job Details (department, designation)
    - Salary Details (basic, allowances, deductions)
    - Bank Details
    - Documents (PAN, Aadhar)
3. Submit to send activation email
### Generating Salary Slips
1. Go to Salary Slips → Generate New
2. Select employees (individual or bulk)
3. Choose month and year
4. Review and confirm
5. Download or email slips
### Creating Invoices
1. Navigate to Invoices → New Invoice
2. Fill client and invoice details
3. Add line items
4. Generate PDF
5. Send via email or download
### For Employees
#### Viewing Salary Slips
1. Login to employee dashboard
2. View current month's slip
3. Access My Salary Slips for history
4. Download any slip as PDF
#### Updating Profile
1. Go to Profile
2. Update personal information
3. Save changes

---
## 📚 API Documentation
``` 
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
POST /api/auth/activate
POST /api/auth/password/request-reset-password
POST /api/auth/password/reset-password/:token
```
```
GET  /api/employees
GET  /api/employees/:id
POST /api/employees
PUT  /api/employees/:id
DELETE /api/employees/:id
```
```
GET  /api/salary-slips
POST /api/salary-slips/generate
GET  /api/salary-slips/:id
DELETE /api/salary-slips/:id
```

```
GET  /api/invoices
POST /api/invoices
GET  /api/invoices/:id
PUT  /api/invoices/:id
DELETE /api/invoices/:id
```
```
GET  /api/offer-letters
POST /api/offer-letters
GET  /api/offer-letters/:id
PUT  /api/offer-letters/:id
DELETE /api/offer-letters/:id
```
---
## 🗂️ Project Structure

```
slip-generator/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   └── activate/
│   ├── api/                 # API routes
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── password/
│   │   ├── employee/
│   │   ├── invoice/
│   │   ├── offer-letter/
│   │   └── salary-slip/
│   ├── dashboard/           # Dashboard pages
│   │   ├── admin/
│   │   └── employee/
│   │   └── profile/
│   └── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── templates/           # PDF templates
│   │   ├── SalarySlip.tsx
│   │   ├── Invoice.tsx
│   │   └── OfferLetter.tsx
│   ├── Navbar.tsx
│   └── ThemeProvider.tsx
├── contexts/
│   └── AuthContext.tsx      # Authentication context
├── lib/
│   ├── db.ts               # MongoDB connection
│   ├── mail.ts             # Email service
│   └── utils.ts            # Utility functions
├── models/
│   ├── User.ts
│   ├── SalarySlip.ts
│   ├── Invoice.ts
│   └── OfferLetter.ts
├── public/
│   └── logo.jpeg           # Company logo
├── .env.local
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json
```
---
## 🤝 Contributing
Contributions are welcome! Please follow these steps to contribute:
1. Fork the repository
```
git clone https://github.com/arnab-git-404/DocsPlus.git

```
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request
Please ensure your code adheres to the existing style and includes appropriate tests.
---
## 📄 License
MIT License

Copyright (c) 2025 Hackence Services

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
