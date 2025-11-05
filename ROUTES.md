# Slip Generator - Route Map

## Public Routes
- `/` - Home/Landing page
- `/login` - User login
- `/register` - User registration

## Protected Dashboard Routes
- `/dashboard` - Dashboard home/overview

### Invoices
- `/dashboard/invoices` - List all invoices
- `/dashboard/invoices/create` - Create invoice form
- `/dashboard/invoices/edit/[id]` - Edit invoice
- `/dashboard/invoices/view/[id]` - View invoice (with actions)
- `/dashboard/invoices/preview/[id]` - Preview with download button

### Offer Letters
- `/dashboard/offer-letters` - List all offer letters
- `/dashboard/offer-letters/create` - Create offer letter form
- `/dashboard/offer-letters/edit/[id]` - Edit offer letter
- `/dashboard/offer-letters/view/[id]` - View offer letter (with actions)
- `/dashboard/offer-letters/preview/[id]` - Preview with download button

### Salary Slips
- `/dashboard/salary-slips` - List all salary slips
- `/dashboard/salary-slips/create` - Create salary slip form
- `/dashboard/salary-slips/edit/[id]` - Edit salary slip
- `/dashboard/salary-slips/view/[id]` - View salary slip (with actions)
- `/dashboard/salary-slips/preview/[id]` - Preview with download button

### Settings & Profile
- `/dashboard/settings` - Application settings
- `/dashboard/profile` - User profile

## PDF Preview (Full Screen)
- `/preview?type=invoice&id=[id]` - Full-screen invoice PDF
- `/preview?type=offer-letter&id=[id]` - Full-screen offer letter PDF
- `/preview?type=salary-slip&id=[id]` - Full-screen salary slip PDF

## API Routes
### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Invoices
- `GET /api/invoice` - Get all invoices
- `POST /api/invoice` - Create invoice
- `GET /api/invoice/[id]` - Get single invoice
- `PUT /api/invoice/[id]` - Update invoice
- `DELETE /api/invoice/[id]` - Delete invoice

### Offer Letters
- `GET /api/offer-letter` - Get all offer letters
- `POST /api/offer-letter` - Create offer letter
- `GET /api/offer-letter/[id]` - Get single offer letter
- `PUT /api/offer-letter/[id]` - Update offer letter
- `DELETE /api/offer-letter/[id]` - Delete offer letter

### Salary Slips
- `GET /api/salary-slip` - Get all salary slips
- `POST /api/salary-slip` - Create salary slip
- `GET /api/salary-slip/[id]` - Get single salary slip
- `PUT /api/salary-slip/[id]` - Update salary slip
- `DELETE /api/salary-slip/[id]` - Delete salary slip