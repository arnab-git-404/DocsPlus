import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  // Watermark
  watermark: {
    position: "absolute",
    fontSize: 80,
    color: "#f0f0f0",
    transform: "rotate(-45deg)",
    top: "40%",
    left: "15%",
    opacity: 0.1,
    fontWeight: "bold",
  },
  // Header Section
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
    textAlign: "center",
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
    alignSelf: "center",
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000000",
  },
  companyDetails: {
    fontSize: 9,
    color: "#555555",
    lineHeight: 1.4,
  },
  slipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  // Info Section
  infoSection: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 4,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 6,
    justifyContent: "space-between",
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  infoColumn: {
    width: "48%",
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 9,
    color: "#555555",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000000",
  },
  // Salary Table
  table: {
    marginVertical: 15,
    borderWidth: 1,
    borderColor: "#000000",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#333333",
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
    minHeight: 35,
  },
  tableRowAlt: {
    backgroundColor: "#f9f9f9",
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  tableColHeader: {
    padding: 10,
    fontSize: 10,
    fontWeight: "bold",
    color: "#ffffff",
    textTransform: "uppercase",
  },
  tableCol: {
    padding: 10,
    fontSize: 10,
    color: "#000000",
  },
  tableLabelCol: {
    width: "50%",
    borderRightWidth: 1,
    borderRightColor: "#dddddd",
  },
  tableAmountCol: {
    width: "25%",
    textAlign: "right",
    borderRightWidth: 1,
    borderRightColor: "#dddddd",
  },
  tableLastCol: {
    width: "25%",
    textAlign: "right",
  },
  // Summary Section
  summarySection: {
    marginTop: 15,
    borderWidth: 2,
    borderColor: "#000000",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
  },
  summaryLastRow: {
    borderBottomWidth: 0,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000000",
  },
  summaryValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000000",
  },
  netSalaryRow: {
    backgroundColor: "#333333",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },
  netSalaryLabel: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#ffffff",
    textTransform: "uppercase",
  },
  netSalaryValue: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#ffffff",
  },
  // Footer
  footer: {
    marginTop: 40,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#dddddd",
  },
  noteText: {
    fontSize: 8,
    color: "#666666",
    fontStyle: "italic",
    marginBottom: 5,
    lineHeight: 1.4,
  },
  signature: {
    marginTop: 40,
    alignItems: "flex-end",
  },
  signatureImage: {
    width: 120,
    height: 40,
    marginBottom: 5,
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "#000000",
    width: 150,
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 9,
    color: "#000000",
    fontWeight: "bold",
  },
  pageFooter: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: "#000000",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pageFooterText: {
    fontSize: 8,
    color: "#666666",
  },

   // Watermark for PDF
  watermarkContainer: {
    position: "absolute",
    top: "50%",
    left: "15%",
    // transform: "translate(-50%, -50%) rotate(-45deg)",
    opacity: 0.08,
    zIndex: 0,
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
  },
  watermarkText: {
    fontSize: 70,
    fontWeight: "bold",
    color: "#000000",
    letterSpacing: 5,
  },

  // Content wrapper
  contentWrapper: {
    position: 'relative',
    zIndex: 1,
  },


});

interface SalarySlipData {
  _id: string;
  employee: {
    userId: string;
    name: string;
    email: string;
    designation: string;
    employeeId: string;
  };
  company: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    email: string;
    website: string;
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
  signature?: string;
  watermark: boolean;
  status: string;
  createdAt: string;
  companyLogo?: string;
  
}

export const SalarySlipDocument = ({ data }: { data: SalarySlipData }) => {
  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat("en-IN", {
      // style: "currency",
      // currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return `Rs. ${formatted}`
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // const totalAllowances =
  //   data.salary.allowances.hra +
  //   data.salary.allowances.transport +
  //   data.salary.allowances.medical +
  //   data.salary.allowances.other;

  // const totalDeductions =
  //   data.salary.deductions.pf +
  //   data.salary.deductions.tax +
  //   data.salary.deductions.other;

  const totalAllowances =
    Number(data.salary.allowances.hra || 0) +
    Number(data.salary.allowances.transport || 0) +
    Number(data.salary.allowances.medical || 0) +
    Number(data.salary.allowances.other || 0);

  const totalDeductions =
    Number(data.salary.deductions.pf || 0) +
    Number(data.salary.deductions.tax || 0) +
    Number(data.salary.deductions.other || 0);


  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}

{data.watermark !== false && (
          <View style={styles.watermarkContainer} fixed>
            <Text style={styles.watermarkText}>
              {data.company.name || "DocsPlus"}
            </Text>
          </View>
        )}

        {/* Header */}
        <View style={styles.header}>
          <Image
            style={styles.logo}
            src={`${process.env.NEXT_PUBLIC_APP_URL}/logo.v3.jpeg`}
          />
          <Text style={styles.companyName}>{data.company.name}</Text>
          <Text style={styles.companyDetails}>
            {data.company.address}, {data.company.city}, {data.company.state} -{" "}
            {data.company.pincode}
          </Text>
          <Text style={styles.companyDetails}>
            Phone: {data.company.phone} | Email: {data.company.email}
          </Text>
          {data.company.website && (
            <Text style={styles.companyDetails}>
              Website: {data.company.website}
            </Text>
          )}
        </View>

        <Text style={styles.slipTitle}>Salary Slip</Text>

        {/* Employee Info */}
        <View style={styles.infoSection}  >
          <View style={styles.infoGrid}>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Employee Name</Text>
              <Text style={styles.infoValue}>{data.employee.name}</Text>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Employee ID</Text>
              <Text style={styles.infoValue}>{data.employee.employeeId}</Text>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Designation</Text>
              <Text style={styles.infoValue}>{data.employee.designation}</Text>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{data.employee.email}</Text>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Pay Period</Text>
              <Text style={styles.infoValue}>
                {data.salary.month} {data.salary.year}
              </Text>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Payment Date</Text>
              <Text style={styles.infoValue}>{formatDate(data.createdAt)}</Text>
            </View>
          </View>
        </View>

        {/* Salary Details Table */}
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableHeader}>
            <View style={[styles.tableLabelCol, styles.tableColHeader]}>
              <Text>Description</Text>
            </View>
            <View style={[styles.tableAmountCol, styles.tableColHeader]}>
              <Text>Earnings</Text>
            </View>
            <View style={[styles.tableLastCol, styles.tableColHeader]}>
              <Text>Deductions</Text>
            </View>
          </View>

          {/* Basic Salary */}
          <View style={styles.tableRow}>
            <View style={[styles.tableLabelCol, styles.tableCol]}>
              <Text style={{ fontWeight: "bold" }}>Basic Salary</Text>
            </View>
            <View style={[styles.tableAmountCol, styles.tableCol]}>
              <Text>{formatCurrency(data.salary.basicSalary)}</Text>
            </View>
            <View style={[styles.tableLastCol, styles.tableCol]}>
              <Text>-</Text>
            </View>
          </View>

          {/* HRA */}
          {data.salary.allowances.hra > 0 && (
            <View style={[styles.tableRow, styles.tableRowAlt]}>
              <View style={[styles.tableLabelCol, styles.tableCol]}>
                <Text>House Rent Allowance (HRA)</Text>
              </View>
              <View style={[styles.tableAmountCol, styles.tableCol]}>
                <Text>{formatCurrency(data.salary.allowances.hra)}</Text>
              </View>
              <View style={[styles.tableLastCol, styles.tableCol]}>
                <Text>-</Text>
              </View>
            </View>
          )}

          {/* Transport Allowance */}
          {data.salary.allowances.transport > 0 && (
            <View style={styles.tableRow}>
              <View style={[styles.tableLabelCol, styles.tableCol]}>
                <Text>Transport Allowance</Text>
              </View>
              <View style={[styles.tableAmountCol, styles.tableCol]}>
                <Text>{formatCurrency(data.salary.allowances.transport)}</Text>
              </View>
              <View style={[styles.tableLastCol, styles.tableCol]}>
                <Text>-</Text>
              </View>
            </View>
          )}

          {/* Medical Allowance */}
          {data.salary.allowances.medical > 0 && (
            <View style={[styles.tableRow, styles.tableRowAlt]}>
              <View style={[styles.tableLabelCol, styles.tableCol]}>
                <Text>Medical Allowance</Text>
              </View>
              <View style={[styles.tableAmountCol, styles.tableCol]}>
                <Text>{formatCurrency(data.salary.allowances.medical)}</Text>
              </View>
              <View style={[styles.tableLastCol, styles.tableCol]}>
                <Text>-</Text>
              </View>
            </View>
          )}

          {/* Other Allowances */}
          {data.salary.allowances.other > 0 && (
            <View style={styles.tableRow}>
              <View style={[styles.tableLabelCol, styles.tableCol]}>
                <Text>Other Allowances</Text>
              </View>
              <View style={[styles.tableAmountCol, styles.tableCol]}>
                <Text>{formatCurrency(data.salary.allowances.other)}</Text>
              </View>
              <View style={[styles.tableLastCol, styles.tableCol]}>
                <Text>-</Text>
              </View>
            </View>
          )}

          {/* Provident Fund */}
          {data.salary.deductions.pf > 0 && (
            <View style={[styles.tableRow, styles.tableRowAlt]}>
              <View style={[styles.tableLabelCol, styles.tableCol]}>
                <Text>Provident Fund (PF)</Text>
              </View>
              <View style={[styles.tableAmountCol, styles.tableCol]}>
                <Text>-</Text>
              </View>
              <View style={[styles.tableLastCol, styles.tableCol]}>
                <Text>{formatCurrency(data.salary.deductions.pf)}</Text>
              </View>
            </View>
          )}

          {/* Tax Deduction */}
          {data.salary.deductions.tax > 0 && (
            <View style={styles.tableRow}>
              <View style={[styles.tableLabelCol, styles.tableCol]}>
                <Text>Tax Deducted at Source (TDS)</Text>
              </View>
              <View style={[styles.tableAmountCol, styles.tableCol]}>
                <Text>-</Text>
              </View>
              <View style={[styles.tableLastCol, styles.tableCol]}>
                <Text>{formatCurrency(data.salary.deductions.tax)}</Text>
              </View>
            </View>
          )}

          {/* Other Deductions */}
          {data.salary.deductions.other > 0 && (
            <View style={[styles.tableRow, styles.tableRowAlt]}>
              <View style={[styles.tableLabelCol, styles.tableCol]}>
                <Text>Other Deductions</Text>
              </View>
              <View style={[styles.tableAmountCol, styles.tableCol]}>
                <Text>-</Text>
              </View>
              <View style={[styles.tableLastCol, styles.tableCol]}>
                <Text>{formatCurrency(data.salary.deductions.other)}</Text>
              </View>
            </View>
          )}

          {/* Totals Row */}
          <View
            style={[
              styles.tableRow,
              { backgroundColor: "#e5e5e5", borderTopWidth: 2 },
            ]}
          >
            <View style={[styles.tableLabelCol, styles.tableCol]}>
              <Text style={{ fontWeight: "bold" }}>TOTAL</Text>
            </View>
            <View style={[styles.tableAmountCol, styles.tableCol]}>
              <Text style={{ fontWeight: "bold" }}>
                {formatCurrency(data.salary.basicSalary + totalAllowances)}
              </Text>
            </View>
            <View style={[styles.tableLastCol, styles.tableCol]}>
              <Text style={{ fontWeight: "bold" }}>
                {formatCurrency(totalDeductions)}
              </Text>
            </View>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summarySection}  wrap={false} >
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Gross Salary</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(data.salary.grossSalary)}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryLastRow]}>
            <Text style={styles.summaryLabel}>Total Deductions</Text>
            <Text style={[styles.summaryValue, { color: "#dc2626" }]}>
              - {formatCurrency(totalDeductions)}
            </Text>
          </View>
          <View style={styles.netSalaryRow}>
            <Text style={styles.netSalaryLabel}>Net Salary</Text>
            <Text style={styles.netSalaryValue}>
              {formatCurrency(data.salary.netSalary)}
            </Text>
          </View>
        </View>

        {/* Footer Notes */}
        <View style={styles.footer}>
          <Text style={styles.noteText}>
            Note: This is a computer-generated salary slip and does not require
            a physical signature.
          </Text>
          <Text style={styles.noteText}>
            All amounts are in Indian Rupees (INR). Please verify the details
            and contact HR for any discrepancies.
          </Text>

          {/* Signature */}
          {data.signature && (
            <View style={styles.signature}>
              <Image style={styles.signatureImage} src={data.signature} />
              <View style={styles.signatureLine}></View>
              <Text style={styles.signatureText}>Authorized Signatory</Text>
              <Text
                style={[
                  styles.signatureText,
                  { fontWeight: "normal", fontSize: 8 },
                ]}
              >
                {data.company.name}
              </Text>
            </View>
          )}
        </View>

        {/* Page Footer */}
        <View style={styles.pageFooter}>
          <Text style={styles.pageFooterText}>
            Generated: {formatDate(data.createdAt)}
          </Text>
          <Text style={styles.pageFooterText}>Status: {data.status}</Text>
          <Text style={styles.pageFooterText}>{data.company.name}</Text>
        </View>
      </Page>
    </Document>
  );
};
