import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
// import { getUserFromHeaders } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // const user = getUserFromHeaders(request);

    const userRole = request.headers.get('x-user-role');

    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    await dbConnect();

    const employees = await User.find({ role: 'EMPLOYEE' })
      .select('-password -resetPasswordToken -resetPasswordExpires -activationToken -activationExpires')
      .sort({ createdAt: -1 })
      .lean();

    // Generate CSV
    const headers = [
      'Employee ID',
      'Name',
      'Email',
      'Designation',
      'Department',
      'Joining Date',
      'Salary',
      'Status',
      'Created At',
    ];

    const rows = employees.map((emp) => [
      emp.employeeId,
      emp.name,
      emp.email,
      emp.designation,
      emp.department,
      new Date(emp.joiningDate).toLocaleDateString('en-US'),
      emp.salary,
      emp.status,
      new Date(emp.createdAt).toLocaleDateString('en-US'),
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    // Return as downloadable file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="employees_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error: any) {
    console.error('Error exporting employees:', error);
    return NextResponse.json(
      { error: 'Failed to export employees' },
      { status: 500 }
    );
  }
}