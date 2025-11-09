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
    fontSize: 11,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    position: 'relative',
  },
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
    alignSelf: "center",
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
    color: "#000000",
  },
  companyAddress: {
    fontSize: 9,
    color: "#555555",
    textAlign: "center",
    lineHeight: 1.3,
  },
  letterhead: {
    fontSize: 10,
    color: "#333333",
    marginBottom: 3,
  },
  offerNumber: {
    fontSize: 10,
    color: "#000000",
    marginBottom: 15,
    fontWeight: "bold",
  },
  date: {
    marginBottom: 20,
    fontSize: 10,
    color: "#000000",
  },
  recipientAddress: {
    marginBottom: 20,
    fontSize: 10,
    lineHeight: 1.4,
  },
  recipientLine: {
    marginBottom: 3,
    color: "#000000",
  },
  subject: {
    marginBottom: 15,
    marginTop: 10,
    fontSize: 11,
    fontWeight: "bold",
    textDecoration: "underline",
  },
  paragraph: {
    marginBottom: 12,
    lineHeight: 1.5,
    textAlign: "justify",
    color: "#000000",
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    color: "#000000",
  },
  table: {
    marginVertical: 15,
    borderWidth: 1,
    borderColor: "#000000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    minHeight: 30,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  tableHeader: {
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
  },
  tableCell: {
    flex: 1,
    padding: 8,
    fontSize: 10,
    justifyContent: "center",
  },
  tableCellBorder: {
    borderRightWidth: 1,
    borderRightColor: "#000000",
  },
  tableLabel: {
    fontWeight: "bold",
    color: "#000000",
  },
  tableValue: {
    color: "#000000",
  },
  list: {
    marginLeft: 20,
    marginBottom: 12,
  },
  listItem: {
    marginBottom: 6,
    lineHeight: 1.4,
    fontSize: 10,
    color: "#000000",
  },
  footer: {
    marginTop: 30,
  },
  closing: {
    marginBottom: 40,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    width: 180,
    marginTop: 10,
    marginBottom: 3,
  },
  signerName: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000000",
  },
  signerTitle: {
    fontSize: 10,
    color: "#000000",
    marginTop: 2,
  },
  acceptanceSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#000000",
  },
  acceptanceTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#000000",
  },
  acceptanceSignature: {
    marginTop: 30,
  },
  pageFooter: {
    position: "absolute",
    fontSize: 8,
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#666666",
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
    paddingTop: 5,
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

interface OfferLetterData {
  offerNumber: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  candidateAddress: string;
  position: string;
  department: string;
  joiningDate: string;
  salary: number;
  workingHours: string;
  probationPeriod: string;
  noticePeriod: string;
  benefits?: string[];
  responsibilities?: string[];
  terms: string;
  offerDate: string;
  expiryDate: string;
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
  companyLogo?: string;
  watermark?: string;
}

export const OfferLetterDocument = ({ data }: { data: OfferLetterData }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat("en-IN", {
      // style: "currency",
      // currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

    return `Rs. ${formatted}`;
  };


  return (
    <Document>
      <Page size="A4" style={styles.page}>

        
          <View style={styles.watermarkContainer} fixed>
            <Text style={styles.watermarkText}>
              {/* {data.companyNamee || "HACKENCE SERVICES"} */}
              {"HACKENCE SERVICES"}

            </Text>
          </View>
      


        {/* Letterhead */}
        <View style={styles.header}>
          <Image
            style={styles.logo}
            src={`${process.env.NEXT_PUBLIC_APP_URL}/logo.v3.jpeg`}
          />
          <Text style={styles.companyName}>{data.companyName}</Text>
          <Text style={styles.companyAddress}>
            {data.companyAddress}, {data.companyCity}, {data.companyState} -{" "}
            {data.companyPincode}
          </Text>
          <Text style={styles.companyAddress}>
            Email: {data.companyEmail} | Phone: {data.companyPhone}
          </Text>
          {data.companyWebsite && (
            <Text style={styles.companyAddress}>
              Website: {data.companyWebsite}
            </Text>
          )}
        </View>

        {/* Reference Number */}
        <Text style={styles.offerNumber}>Ref No: {data.offerNumber}</Text>

        {/* Date */}
        <Text style={styles.date}>Date: {formatDate(data.offerDate)}</Text>

        {/* Recipient */}
        <View style={styles.recipientAddress}>
          <Text style={styles.recipientLine}>{data.candidateName}</Text>
          <Text style={styles.recipientLine}>{data.candidateAddress}</Text>
          <Text style={styles.recipientLine}>Email: {data.candidateEmail}</Text>
          <Text style={styles.recipientLine}>Phone: {data.candidatePhone}</Text>
        </View>

        {/* Subject */}
        <Text style={styles.subject}>
          Subject: Offer of Employment - {data.position}
        </Text>

        {/* Opening */}
        <Text style={styles.paragraph}>Dear {data.candidateName},</Text>

        <Text style={styles.paragraph}>
          Further to your application and subsequent interviews, we are pleased
          to offer you employment with {data.companyName} on the following terms
          and conditions:
        </Text>

        {/* Employment Details */}
        <Text style={styles.sectionHeading}>1. Employment Details</Text>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text
              style={[
                styles.tableCell,
                styles.tableCellBorder,
                styles.tableLabel,
              ]}
            >
              Particulars
            </Text>
            <Text style={[styles.tableCell, styles.tableLabel]}>Details</Text>
          </View>
          <View style={styles.tableRow}>
            <Text
              style={[
                styles.tableCell,
                styles.tableCellBorder,
                styles.tableLabel,
              ]}
            >
              Position
            </Text>
            <Text style={styles.tableCell}>{data.position}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text
              style={[
                styles.tableCell,
                styles.tableCellBorder,
                styles.tableLabel,
              ]}
            >
              Department
            </Text>
            <Text style={styles.tableCell}>{data.department}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text
              style={[
                styles.tableCell,
                styles.tableCellBorder,
                styles.tableLabel,
              ]}
            >
              Date of Joining
            </Text>
            <Text style={styles.tableCell}>{formatDate(data.joiningDate)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text
              style={[
                styles.tableCell,
                styles.tableCellBorder,
                styles.tableLabel,
              ]}
            >
              Employment Type
            </Text>
            <Text style={styles.tableCell}>Full-Time</Text>
          </View>
          <View style={styles.tableRow}>
            <Text
              style={[
                styles.tableCell,
                styles.tableCellBorder,
                styles.tableLabel,
              ]}
            >
              Working Hours
            </Text>
            <Text style={styles.tableCell}>{data.workingHours}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text
              style={[
                styles.tableCell,
                styles.tableCellBorder,
                styles.tableLabel,
              ]}
            >
              Probation Period
            </Text>
            <Text style={styles.tableCell}>{data.probationPeriod}</Text>
          </View>
          <View style={[styles.tableRow, styles.lastRow]}>
            <Text
              style={[
                styles.tableCell,
                styles.tableCellBorder,
                styles.tableLabel,
              ]}
            >
              Notice Period
            </Text>
            <Text style={styles.tableCell}>{data.noticePeriod}</Text>
          </View>
        </View>

        {/* Compensation */}
        <Text style={styles.sectionHeading}>2. Compensation</Text>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.lastRow]}>
            <Text
              style={[
                styles.tableCell,
                styles.tableCellBorder,
                styles.tableLabel,
              ]}
            >
              Annual Gross Salary (CTC)
            </Text>
            <Text style={[styles.tableCell, styles.tableLabel]}>
              {formatCurrency(data.salary)}
            </Text>
          </View>
        </View>

        {/* Benefits */}
        {data.benefits && data.benefits.length > 0 && (
          <>
            <Text style={styles.sectionHeading}>
              3. Benefits and Entitlements
            </Text>
            <View style={styles.list}>
              {data.benefits.map((benefit: string, index: number) => (
                <Text key={index} style={styles.listItem}>
                  • {benefit}
                </Text>
              ))}
            </View>
          </>
        )}

        {/* Responsibilities */}
        {data.responsibilities && data.responsibilities.length > 0 && (
          <>
            <Text style={styles.sectionHeading}>
              4. Duties and Responsibilities
            </Text>
            <Text style={styles.paragraph}>
              Your primary responsibilities will include:
            </Text>
            <View style={styles.list}>
              {data.responsibilities.map(
                (responsibility: string, index: number) => (
                  <Text key={index} style={styles.listItem}>
                    • {responsibility}
                  </Text>
                )
              )}
            </View>
          </>
        )}

        {/* Terms */}
        <Text style={styles.sectionHeading}>5. Terms and Conditions</Text>
        <Text style={styles.paragraph}>{data.terms}</Text>

        {/* Notes */}
        {data.notes && (
          <>
            <Text style={styles.sectionHeading}>6. Additional Information</Text>
            <Text style={styles.paragraph}>{data.notes}</Text>
          </>
        )}

        {/* Acceptance Clause */}
        <Text style={styles.paragraph}>
          Please confirm your acceptance of this offer by signing and returning
          a copy of this letter by {formatDate(data.expiryDate)}. We look
          forward to welcoming you to our organization.
        </Text>

        {/* Closing */}
        <View style={styles.footer}>
          <Text style={styles.closing}>Yours sincerely,</Text>
          <View style={styles.signatureLine}></View>
          <Text style={styles.signerName}>{data.signerName}</Text>
          <Text style={styles.signerTitle}>{data.signerDesignation}</Text>
          <Text style={styles.signerTitle}>{data.companyName}</Text>
        </View>

        {/* Acceptance */}
        <View style={styles.acceptanceSection}>
          <Text style={styles.acceptanceTitle}>ACCEPTANCE</Text>
          <Text style={styles.paragraph}>
            I, {data.candidateName}, hereby accept the terms and conditions of
            employment as stated above.
          </Text>

          <View style={styles.acceptanceSignature}>
            <View style={styles.signatureLine}></View>
            <Text style={styles.signerName}>Signature</Text>
            <Text style={styles.signerTitle}>Name: {data.candidateName}</Text>
            <Text style={styles.signerTitle}>Date: _______________</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.pageFooter}>
          {data.offerNumber} | This is a computer-generated document and does
          not require a physical signature
        </Text>
      </Page>
    </Document>
  );
};




