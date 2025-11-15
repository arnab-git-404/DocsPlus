// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
//   Image,
// } from "@react-pdf/renderer";

// // Professional Invoice Styles
// const styles = StyleSheet.create({
//   page: {
//     padding: 40,
//     fontSize: 10,
//     fontFamily: "Helvetica",
//     backgroundColor: "#ffffff",
//   },
//   // Header Section
//   header: {
//     marginBottom: 25,
//     paddingBottom: 15,
//     borderBottomWidth: 2,
//     borderBottomColor: "#000000",
//   },
//   headerTop: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//   },
//   leftSection: {
//     flexDirection: "row",
//     flex: 1,
//   },
//   logo: {
//     width: 70,
//     height: 70,
//     marginRight: 15,
//   },
//   companyInfo: {
//     flex: 1,
//   },
//   companyName: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 5,
//     color: "#000000",
//   },
//   companyDetails: {
//     fontSize: 9,
//     color: "#333333",
//     lineHeight: 1.4,
//   },
//   invoiceTitle: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#000000",
//     letterSpacing: 1,
//   },
//   // Invoice Info Section
//   invoiceInfoSection: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 25,
//     gap: 15,
//   },
//   infoBox: {
//     width: "48%",
//     padding: 12,
//     backgroundColor: "#f9f9f9",
//     borderWidth: 1,
//     borderColor: "#dddddd",
//     borderRadius: 4,
//   },
//   infoBoxTitle: {
//     fontSize: 11,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "#000000",
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//   },
//   infoRow: {
//     flexDirection: "row",
//     marginBottom: 5,
//     alignItems: "flex-start",
//   },
//   infoLabel: {
//     fontSize: 9,
//     fontWeight: "bold",
//     width: "40%",
//     color: "#555555",
//   },
//   infoValue: {
//     fontSize: 9,
//     width: "60%",
//     color: "#000000",
//   },
//   clientName: {
//     fontSize: 11,
//     fontWeight: "bold",
//     marginBottom: 6,
//     color: "#000000",
//   },
//   addressText: {
//     fontSize: 9,
//     color: "#000000",
//     lineHeight: 1.4,
//     marginBottom: 3,
//   },
//   divider: {
//     borderTopWidth: 1,
//     borderTopColor: "#dddddd",
//     marginVertical: 8,
//   },
//   // Items Table
//   table: {
//     marginTop: 20,
//     marginBottom: 20,
//     borderWidth: 1,
//     // borderColor: '#000000',
//   },
//   tableHeader: {
//     flexDirection: "row",
//     // backgroundColor: "#333333",
//     borderBottomWidth: 1,
//     borderBottomColor: "#000000",
//     paddingVertical: 10,
//   },
//   tableRow: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     // borderBottomColor: '#dddddd',
//     paddingVertical: 10,
//     minHeight: 40,
//     // backgroundColor: '#ffffff',
//   },
//   tableRowAlt: {
//     // backgroundColor: '#f9f9f9',
//   },
//   lastRow: {
//     borderBottomWidth: 0,
//   },
//   colSno: {
//     width: "7%",
//     paddingHorizontal: 8,
//     fontSize: 9,
//     textAlign: "center",
//   },
//   colItem: {
//     width: "23%",
//     paddingHorizontal: 8,
//     fontSize: 9,
//   },
//   colDesc: {
//     width: "28%",
//     paddingHorizontal: 8,
//     fontSize: 9,
//   },
//   colQty: {
//     width: "10%",
//     paddingHorizontal: 8,
//     fontSize: 9,
//     textAlign: "center",
//   },
//   colRate: {
//     width: "16%",
//     paddingHorizontal: 8,
//     fontSize: 9,
//     textAlign: "right",
//   },
//   colAmount: {
//     width: "16%",
//     paddingHorizontal: 8,
//     fontSize: 9,
//     textAlign: "right",
//   },
//   headerText: {
//     fontWeight: "bold",
//     // color: "#ffffff",
//     fontSize: 9,
//     textTransform: "uppercase",
//   },
//   // Summary Section
//   summarySection: {
//     marginTop: 20,
//     flexDirection: "row",
//     justifyContent: "flex-end",
//   },
//   summaryBox: {
//     width: "45%",
//     borderWidth: 1,
//     borderColor: "#000000",
//   },
//   summaryRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#dddddd",
//   },
//   summaryLastRow: {
//     borderBottomWidth: 0,
//   },
//   summaryTotalRow: {
//     backgroundColor: "#333333",
//     paddingVertical: 10,
//   },
//   summaryLabel: {
//     fontSize: 9,
//     color: "#555555",
//   },
//   summaryValue: {
//     fontSize: 9,
//     color: "#000000",
//     textAlign: "right",
//     fontWeight: "bold",
//   },
//   summaryTotalLabel: {
//     fontSize: 11,
//     fontWeight: "bold",
//     color: "#ffffff",
//   },
//   summaryTotalValue: {
//     fontSize: 11,
//     fontWeight: "bold",
//     color: "#ffffff",
//   },
//   // Terms and Notes
//   termsSection: {
//     marginTop: 25,
//     padding: 12,
//     backgroundColor: "#f9f9f9",
//     borderWidth: 1,
//     borderColor: "#dddddd",
//     borderRadius: 4,
//   },
//   sectionTitle: {
//     fontSize: 10,
//     fontWeight: "bold",
//     marginBottom: 6,
//     color: "#000000",
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//   },
//   sectionText: {
//     fontSize: 9,
//     lineHeight: 1.5,
//     color: "#333333",
//   },
//   // Footer
//   footer: {
//     position: "absolute",
//     bottom: 30,
//     left: 40,
//     right: 40,
//     paddingTop: 10,
//     borderTopWidth: 2,
//     borderTopColor: "#000000",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   footerText: {
//     fontSize: 8,
//     color: "#666666",
//   },
//   signature: {
//     marginTop: 40,
//     alignItems: "flex-end",
//   },
//   signatureLine: {
//     borderTopWidth: 1,
//     borderTopColor: "#000000",
//     width: 150,
//     marginTop: 30,
//     marginBottom: 5,
//   },
//   signatureText: {
//     fontSize: 9,
//     color: "#000000",
//     fontWeight: "bold",
//   },

//   // Watermark for PDF
//   watermarkContainer: {
//     position: "absolute",
//     top: "50%",
//     left: "20%",
//     transform: "translate(-50%, -50%) rotate(-0deg)",
//     opacity: 0.08,
//     zIndex: -1,
//   },
//   watermarkText: {
//     fontSize: 80,
//     fontWeight: "bold",
//     color: "#000000",
//     letterSpacing: 4,
//   },

//   // OR for image watermark
//   watermarkImage: {
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     width: 400,
//     height: 400,
//     opacity: 0.05,
//     zIndex: -1,
//   },
// });

// export const InvoiceDocument = ({ data }: { data: any }) => {
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-IN", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(amount);
//   };

//   const formatNumber = (num: number) => {
//     return new Intl.NumberFormat("en-IN", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(num);
//   };

//   return (
//     <Document
//       title={`${data.invoiceNumber}`}
//       author="Arnab Mukherjee"
//       subject="Official Offer Letter"
//     >
//       <Page size="A4" style={styles.page}>
//         {/* Watermark - Company Name Only */}
//         {data.watermark !== false && (
//           <View style={styles.watermarkContainer} fixed >
//             <Text style={styles.watermarkText}>
//               {data.companyName || "HACKENCE SERVICES"}
//             </Text>
//           </View>
//         )}

//         {/* Header */}
//         <View style={styles.header}>
//           <View style={styles.headerTop}>
//             <View style={styles.leftSection}>

//               <Image
//                 style={styles.logo}
//                 src={`${process.env.NEXT_PUBLIC_APP_URL}/logo.v3.jpeg`}
//               />

//               <View style={styles.companyInfo}>
//                 <Text style={styles.companyName}>{data.companyName}</Text>
//                 <Text style={styles.companyDetails}>
//                   {data.companyAddress}, {data.companyCity}
//                 </Text>
//                 <Text style={styles.companyDetails}>
//                   {data.companyState} - {data.companyPincode}
//                 </Text>
//                 <Text style={styles.companyDetails}>
//                   Phone: {data.companyPhone}
//                 </Text>
//                 <Text style={styles.companyDetails}>
//                   Email: {data.companyEmail}
//                 </Text>
//                 {data.companyWebsite && (
//                   <Text style={styles.companyDetails}>
//                     Web: {data.companyWebsite}
//                   </Text>
//                 )}
//               </View>
//             </View>
//             <View>

//               <Text style={styles.invoiceTitle}>INVOICE</Text>
//             </View>
//           </View>
//         </View>

//         {/* Invoice and Client Info */}
//         <View style={styles.invoiceInfoSection}>
//           {/* Bill To */}
//           <View style={styles.infoBox}>
//             <Text style={styles.infoBoxTitle}>Bill To</Text>
//             <Text style={styles.clientName}>{data.clientName}</Text>
//             <Text style={styles.addressText}>{data.clientAddress}</Text>
//             <Text style={styles.addressText}>
//               {data.clientCity}, {data.clientState} - {data.clientPincode}
//             </Text>

//             <View style={styles.divider} />

//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>Phone:</Text>
//               <Text style={styles.infoValue}>{data.clientPhone}</Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>Email:</Text>
//               <Text style={styles.infoValue}>{data.clientEmail}</Text>
//             </View>
//             {data.clientGSTIN && (
//               <View style={styles.infoRow}>
//                 <Text style={styles.infoLabel}>GSTIN:</Text>
//                 <Text style={styles.infoValue}>{data.clientGSTIN}</Text>
//               </View>
//             )}
//           </View>

//           {/* Invoice Details */}
//           <View style={styles.infoBox}>
//             <Text style={styles.infoBoxTitle}>Invoice Details</Text>
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>Invoice No:</Text>
//               <Text style={[styles.infoValue, { fontWeight: "bold" }]}>
//                 {data.invoiceNumber}
//               </Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>Date:</Text>
//               <Text style={styles.infoValue}>
//                 {formatDate(data.invoiceDate)}
//               </Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>Status:</Text>
//               <Text
//                 style={[
//                   styles.infoValue,
//                   {
//                     color:
//                       data.status === "PAID"
//                         ? "#059669"
//                         : data.status === "SENT"
//                         ? "#0284c7"
//                         : "#dc2626",
//                     fontWeight: "bold",
//                   },
//                 ]}
//               >
//                 {data.status}
//               </Text>
//             </View>
//             <View style={styles.infoRow}>
//               <Text style={styles.infoLabel}>Payment:</Text>
//               <Text style={styles.infoValue}>{data.paymentMethod}</Text>
//             </View>

//             {/* Bank Details */}
//             {(data.bankName || data.upiId) && (
//               <>
//                 <View style={styles.divider} />
//                 <Text
//                   style={[
//                     styles.infoBoxTitle,
//                     { fontSize: 9, marginBottom: 5, marginTop: 5 },
//                   ]}
//                 >
//                   Payment Info
//                 </Text>
//                 {data.bankName && (
//                   <>
//                     <View style={styles.infoRow}>
//                       <Text style={styles.infoLabel}>Bank:</Text>
//                       <Text style={styles.infoValue}>{data.bankName}</Text>
//                     </View>
//                     <View style={styles.infoRow}>
//                       <Text style={styles.infoLabel}>A/C No:</Text>
//                       <Text style={styles.infoValue}>{data.accountNumber}</Text>
//                     </View>
//                     <View style={styles.infoRow}>
//                       <Text style={styles.infoLabel}>IFSC:</Text>
//                       <Text style={styles.infoValue}>{data.ifscCode}</Text>
//                     </View>
//                   </>
//                 )}
//                 {data.upiId && (
//                   <View style={styles.infoRow}>
//                     <Text style={styles.infoLabel}>UPI ID:</Text>
//                     <Text style={styles.infoValue}>{data.upiId}</Text>
//                   </View>
//                 )}
//               </>
//             )}
//           </View>
//         </View>

//         {/* Items Table */}
//         <View style={styles.table}>
//           {/* Table Header */}
//           <View style={styles.tableHeader}>
//             <Text style={[styles.colSno, styles.headerText]}>#</Text>
//             <Text style={[styles.colItem, styles.headerText]}>Item</Text>
//             <Text style={[styles.colDesc, styles.headerText]}>Description</Text>
//             <Text style={[styles.colQty, styles.headerText]}>Qty</Text>
//             <Text style={[styles.colRate, styles.headerText]}>Rate</Text>
//             <Text style={[styles.colAmount, styles.headerText]}>Amount</Text>
//           </View>

//           {/* Table Rows */}
//           {data.items.map((item: any, index: number) => (
//             <View
//               key={item._id}
//               style={[
//                 styles.tableRow,
//                 index % 2 === 1 ? styles.tableRowAlt : {},
//                 index === data.items.length - 1 ? styles.lastRow : {},
//               ]}
//             >
//               <Text style={styles.colSno}>{index + 1}</Text>
//               <Text style={[styles.colItem, { fontWeight: "bold" }]}>
//                 {item.item}
//               </Text>
//               <Text style={styles.colDesc}>{item.description}</Text>
//               <Text style={styles.colQty}>{item.quantity}</Text>
//               <Text style={styles.colRate}>₹{formatNumber(item.rate)}</Text>
//               <Text style={[styles.colAmount, { fontWeight: "bold" }]}>
//                 ₹{formatNumber(item.amount)}
//               </Text>
//             </View>
//           ))}
//         </View>

//         {/* Summary Section */}
//         <View style={styles.summarySection}>
//           <View style={styles.summaryBox}>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Subtotal:</Text>
//               <Text style={styles.summaryValue}>
//                 {formatCurrency(data.subtotal)}
//               </Text>
//             </View>

//             {data.discountAmount > 0 && (
//               <View style={styles.summaryRow}>
//                 <Text style={styles.summaryLabel}>
//                   Discount ({data.discount}
//                   {data.discountType === "PERCENTAGE" ? "%" : ""}):
//                 </Text>
//                 <Text style={[styles.summaryValue, { color: "#dc2626" }]}>
//                   - {formatCurrency(data.discountAmount)}
//                 </Text>
//               </View>
//             )}

//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>CGST ({data.cgst}%):</Text>
//               <Text style={styles.summaryValue}>
//                 {formatCurrency(data.cgstAmount)}
//               </Text>
//             </View>

//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>SGST ({data.sgst}%):</Text>
//               <Text style={styles.summaryValue}>
//                 {formatCurrency(data.sgstAmount)}
//               </Text>
//             </View>

//             <View
//               style={[
//                 styles.summaryRow,
//                 styles.summaryTotalRow,
//                 styles.summaryLastRow,
//               ]}
//             >
//               <Text style={styles.summaryTotalLabel}>TOTAL AMOUNT</Text>
//               <Text style={styles.summaryTotalValue}>
//                 {formatCurrency(data.total)}
//               </Text>
//             </View>
//           </View>
//         </View>


//           {/* Terms */}
//           {data.terms && (
//             <View style={styles.termsSection}>
//               <Text style={styles.sectionTitle}>Terms & Conditions</Text>
//               <Text style={styles.sectionText}>{data.terms}</Text>
//             </View>
//           )}

//           {/* Notes */}
//           {data.notes && (
//             <View style={[styles.termsSection, { marginTop: 15 }]}>
//               <Text style={styles.sectionTitle}>Notes</Text>
//               <Text style={styles.sectionText}>{data.notes}</Text>
//             </View>
//           )}

//           {/* Signature */}
//           <View style={styles.signature}>
//             <View style={styles.signatureLine}></View>
//             <Text style={styles.signatureText}>Authorized Signature</Text>
//             <Text
//               style={[
//                 styles.signatureText,
//                 { fontWeight: "normal", fontSize: 8, marginTop: 2 },
//               ]}
//             >
//               {data.companyName}
//             </Text>
//           </View>

//           {/* Footer */}
//           <View style={styles.footer}>
//             <Text style={styles.footerText}>Invoice: {data.invoiceNumber}</Text>
//             <Text style={styles.footerText}>
//               Generated: {formatDate(new Date().toISOString())}
//             </Text>
//             <Text style={styles.footerText}>Thank you for your business!</Text>
//           </View>
        
//       </Page>
//     </Document>
//   );
// };




// This is Dual Page Invoice Support ===========================================================================================

// import {
//   Document,
//   Font,
//   Page,
//   Text,
//   View,
//   StyleSheet,
//   Image,
// } from "@react-pdf/renderer";

// const styles = StyleSheet.create({
//   page: {
//     padding: 40,
//     fontSize: 10,
//     fontFamily: "Helvetica",
//     backgroundColor: "#ffffff",
//     position: 'relative',
//   },
//   // Header Section
//   header: {
//     marginBottom: 25,
//     paddingBottom: 15,
//     borderBottomWidth: 2,
//     borderBottomColor: "#000000",
//   },
//   headerTop: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//   },
//   leftSection: {
//     flexDirection: "row",
//     flex: 1,
//   },
//   logo: {
//     width: 70,
//     height: 70,
//     marginRight: 15,
//   },
//   companyInfo: {
//     flex: 1,
//   },
//   companyName: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 5,
//     color: "#000000",
//   },
//   companyDetails: {
//     fontSize: 9,
//     color: "#333333",
//     lineHeight: 1.4,
//   },
//   invoiceTitle: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#000000",
//     letterSpacing: 1,
//   },
//   // Invoice Info Section
//   invoiceInfoSection: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 25,
//     gap: 15,
//   },
//   infoBox: {
//     width: "48%",
//     padding: 12,
//     backgroundColor: "#f9f9f9",
//     borderWidth: 1,
//     borderColor: "#dddddd",
//     borderRadius: 4,
//   },
//   infoBoxTitle: {
//     fontSize: 11,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "#000000",
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//   },
//   infoRow: {
//     flexDirection: "row",
//     marginBottom: 5,
//     alignItems: "flex-start",
//   },
//   infoLabel: {
//     fontSize: 9,
//     fontWeight: "bold",
//     width: "40%",
//     color: "#555555",
//   },
//   infoValue: {
//     fontSize: 9,
//     width: "60%",
//     color: "#000000",
//   },
//   clientName: {
//     fontSize: 11,
//     fontWeight: "bold",
//     marginBottom: 6,
//     color: "#000000",
//   },
//   addressText: {
//     fontSize: 9,
//     color: "#000000",
//     lineHeight: 1.4,
//     marginBottom: 3,
//   },
//   divider: {
//     borderTopWidth: 1,
//     borderTopColor: "#dddddd",
//     marginVertical: 8,
//   },
//   // Items Table
//   table: {
//     marginTop: 20,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: "#000000",
//   },
//   tableHeader: {
//     flexDirection: "row",
//     backgroundColor: "#f5f5f5",
//     borderBottomWidth: 2,
//     borderBottomColor: "#000000",
//     paddingVertical: 10,
//   },
//   tableRow: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: '#dddddd',
//     paddingVertical: 10,
//     minHeight: 40,
//   },
//   tableRowAlt: {
//     backgroundColor: '#fafafa',
//   },
//   lastRow: {
//     borderBottomWidth: 0,
//   },
//   colSno: {
//     width: "7%",
//     paddingHorizontal: 8,
//     fontSize: 9,
//     textAlign: "center",
//   },
//   colItem: {
//     width: "23%",
//     paddingHorizontal: 8,
//     fontSize: 9,
//   },
//   colDesc: {
//     width: "28%",
//     paddingHorizontal: 8,
//     fontSize: 9,
//   },
//   colQty: {
//     width: "10%",
//     paddingHorizontal: 8,
//     fontSize: 9,
//     textAlign: "center",
//   },
//   colRate: {
//     width: "16%",
//     paddingHorizontal: 8,
//     fontSize: 9,
//     textAlign: "right",
//   },
//   colAmount: {
//     width: "16%",
//     paddingHorizontal: 8,
//     fontSize: 9,
//     textAlign: "right",
//   },
//   headerText: {
//     fontWeight: "bold",
//     color: "#000000",
//     fontSize: 9,
//     textTransform: "uppercase",
//   },
//   // Summary Section
//   summarySection: {
//     marginTop: 20,
//     flexDirection: "row",
//     justifyContent: "flex-end",
//   },
//   summaryBox: {
//     width: "45%",
//     borderWidth: 1,
//     borderColor: "#000000",
//   },
//   summaryRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#dddddd",
//   },
//   summaryLastRow: {
//     borderBottomWidth: 0,
//   },
//   summaryTotalRow: {
//     backgroundColor: "#333333",
//     paddingVertical: 10,
//   },
//   summaryLabel: {
//     fontSize: 9,
//     color: "#555555",
//   },
//   summaryValue: {
//     fontSize: 9,
//     color: "#000000",
//     textAlign: "right",
//     fontWeight: "bold",
//   },
//   summaryTotalLabel: {
//     fontSize: 11,
//     fontWeight: "bold",
//     color: "#ffffff",
//   },
//   summaryTotalValue: {
//     fontSize: 11,
//     fontWeight: "bold",
//     color: "#ffffff",
//   },
//   // Terms and Notes
//   termsSection: {
//     marginTop: 25,
//     padding: 12,
//     backgroundColor: "#f9f9f9",
//     borderWidth: 1,
//     borderColor: "#dddddd",
//     borderRadius: 4,
//   },
//   sectionTitle: {
//     fontSize: 10,
//     fontWeight: "bold",
//     marginBottom: 6,
//     color: "#000000",
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//   },
//   sectionText: {
//     fontSize: 9,
//     lineHeight: 1.5,
//     color: "#333333",
//   },
//   // Footer
//   footer: {
//     position: "absolute",
//     bottom: 30,
//     left: 40,
//     right: 40,
//     paddingTop: 10,
//     borderTopWidth: 2,
//     borderTopColor: "#000000",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   footerText: {
//     fontSize: 8,
//     color: "#666666",
//   },
//   signature: {
//     marginTop: 40,
//     alignItems: "flex-end",
//     marginBottom: 80, // Add space for footer
//   },
//   signatureLine: {
//     borderTopWidth: 1,
//     borderTopColor: "#000000",
//     width: 150,
//     marginTop: 30,
//     marginBottom: 5,
//   },
//   signatureText: {
//     fontSize: 9,
//     color: "#000000",
//     fontWeight: "bold",
//   },

//   // Watermark for PDF
//   watermarkContainer: {
//     position: "absolute",
//     top: "50%",
//     left: "15%",
//     // transform: "translate(-50%, -50%) rotate(-45deg)",
//     opacity: 0.08,
//     zIndex: 0,
//     display:"flex",
//     justifyContent:"center",
//     alignItems:"center"
//   },
//   watermarkText: {
//     fontSize: 70,
//     fontWeight: "bold",
//     color: "#000000",
//     letterSpacing: 5,
//   },

//   // Content wrapper
//   contentWrapper: {
//     position: 'relative',
//     zIndex: 1,
//   },
// });

// export const InvoiceDocument = ({ data }: { data: any }) => {
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-IN", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const formatCurrency = (amount: number) => {
//     const formatted = new Intl.NumberFormat("en-IN", {
//       // style: "currency",
//       // currency: "INR",
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(amount)
//     return `Rs. ${formatted}`;
//   };

//   const formatNumber = (num: number) => {
//     return new Intl.NumberFormat("en-IN", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(num);
//   };

//   return (
//     <Document
//       title={`${data.invoiceNumber}`}
//       author="Arnab Mukherjee"
//       subject="Official Invoice"
//     >
//       <Page size="A4" style={styles.page}>
//         {/* Watermark - Company Name Only */}
//         {data.watermark !== false && (
//           <View style={styles.watermarkContainer} fixed>
//             <Text style={styles.watermarkText}>
//               {data.companyName || "DocsPlus"}
//             </Text>
//           </View>
//         )}

//         {/* Content Wrapper */}
//         <View style={styles.contentWrapper}>
//           {/* Header */}
//           <View style={styles.header}>
//             <View style={styles.headerTop}>
//               <View style={styles.leftSection}>
//                 <Image
//                   style={styles.logo}
//                   src={data.logo || `${process.env.NEXT_PUBLIC_APP_URL}/logo.v3.jpeg`}
//                 />

//                 <View style={styles.companyInfo}>
//                   <Text style={styles.companyName}>{data.companyName}</Text>
//                   <Text style={styles.companyDetails}>
//                     {data.companyAddress}, {data.companyCity}
//                   </Text>
//                   <Text style={styles.companyDetails}>
//                     {data.companyState} - {data.companyPincode}
//                   </Text>
//                   <Text style={styles.companyDetails}>
//                     Phone: {data.companyPhone}
//                   </Text>
//                   <Text style={styles.companyDetails}>
//                     Email: {data.companyEmail}
//                   </Text>
//                   {data.companyWebsite && (
//                     <Text style={styles.companyDetails}>
//                       Web: {data.companyWebsite}
//                     </Text>
//                   )}
//                 </View>
//               </View>
//               <View>
//                 <Text style={styles.invoiceTitle}>INVOICE</Text>
//               </View>
//             </View>
//           </View>

//           {/* Invoice and Client Info */}
//           <View style={styles.invoiceInfoSection}>
//             {/* Bill To */}
//             <View style={styles.infoBox}>
//               <Text style={styles.infoBoxTitle}>Bill To</Text>
//               <Text style={styles.clientName}>{data.clientName}</Text>
//               <Text style={styles.addressText}>{data.clientAddress}</Text>
//               <Text style={styles.addressText}>
//                 {data.clientCity}, {data.clientState} - {data.clientPincode}
//               </Text>

//               <View style={styles.divider} />

//               <View style={styles.infoRow}>
//                 <Text style={styles.infoLabel}>Phone:</Text>
//                 <Text style={styles.infoValue}>{data.clientPhone}</Text>
//               </View>
//               {data.clientEmail && (
//                 <View style={styles.infoRow}>
//                   <Text style={styles.infoLabel}>Email:</Text>
//                   <Text style={styles.infoValue}>{data.clientEmail}</Text>
//                 </View>
//               )}
//               {data.clientGSTIN && (
//                 <View style={styles.infoRow}>
//                   <Text style={styles.infoLabel}>GSTIN:</Text>
//                   <Text style={styles.infoValue}>{data.clientGSTIN}</Text>
//                 </View>
//               )}
//             </View>

//             {/* Invoice Details */}
//             <View style={styles.infoBox}>
//               <Text style={styles.infoBoxTitle}>Invoice Details</Text>
//               <View style={styles.infoRow}>
//                 <Text style={styles.infoLabel}>Invoice No:</Text>
//                 <Text style={[styles.infoValue, { fontWeight: "bold" }]}>
//                   {data.invoiceNumber}
//                 </Text>
//               </View>
//               <View style={styles.infoRow}>
//                 <Text style={styles.infoLabel}>Date:</Text>
//                 <Text style={styles.infoValue}>
//                   {formatDate(data.invoiceDate)}
//                 </Text>
//               </View>
//               <View style={styles.infoRow}>
//                 <Text style={styles.infoLabel}>Status:</Text>
//                 <Text
//                   style={[
//                     styles.infoValue,
//                     {
//                       color:
//                         data.status === "PAID"
//                           ? "#059669"
//                           : data.status === "SENT"
//                           ? "#0284c7"
//                           : "#dc2626",
//                       fontWeight: "bold",
//                     },
//                   ]}
//                 >
//                   {data.status}
//                 </Text>
//               </View>
//               {data.paymentMethod && (
//                 <View style={styles.infoRow}>
//                   <Text style={styles.infoLabel}>Payment:</Text>
//                   <Text style={styles.infoValue}>{data.paymentMethod}</Text>
//                 </View>
//               )}

//               {/* Bank Details */}
//               {(data.bankName || data.upiId) && (
//                 <>
//                   <View style={styles.divider} />
//                   <Text
//                     style={[
//                       styles.infoBoxTitle,
//                       { fontSize: 9, marginBottom: 5, marginTop: 5 },
//                     ]}
//                   >
//                     Payment Info
//                   </Text>
//                   {data.bankName && (
//                     <>
//                       <View style={styles.infoRow}>
//                         <Text style={styles.infoLabel}>Bank:</Text>
//                         <Text style={styles.infoValue}>{data.bankName}</Text>
//                       </View>
//                       {data.accountNumber && (
//                         <View style={styles.infoRow}>
//                           <Text style={styles.infoLabel}>A/C No:</Text>
//                           <Text style={styles.infoValue}>{data.accountNumber}</Text>
//                         </View>
//                       )}
//                       {data.ifscCode && (
//                         <View style={styles.infoRow}>
//                           <Text style={styles.infoLabel}>IFSC:</Text>
//                           <Text style={styles.infoValue}>{data.ifscCode}</Text>
//                         </View>
//                       )}
//                     </>
//                   )}
//                   {data.upiId && (
//                     <View style={styles.infoRow}>
//                       <Text style={styles.infoLabel}>UPI ID:</Text>
//                       <Text style={styles.infoValue}>{data.upiId}</Text>
//                     </View>
//                   )}
//                 </>
//               )}
//             </View>
//           </View>

//           {/* Items Table */}
//           <View style={styles.table} wrap={false}>
//             {/* Table Header */}
//             <View style={styles.tableHeader}>
//               <Text style={[styles.colSno, styles.headerText]}>#</Text>
//               <Text style={[styles.colItem, styles.headerText]}>Item</Text>
//               <Text style={[styles.colDesc, styles.headerText]}>Description</Text>
//               <Text style={[styles.colQty, styles.headerText]}>Qty</Text>
//               <Text style={[styles.colRate, styles.headerText]}>Rate</Text>
//               <Text style={[styles.colAmount, styles.headerText]}>Amount</Text>
//             </View>

//             {/* Table Rows */}
//             {data.items.map((item: any, index: number) => (
//               <View
//                 key={item._id || index}
//                 style={[
//                   styles.tableRow,
//                   index % 2 === 1 ? styles.tableRowAlt : {},
//                   index === data.items.length - 1 ? styles.lastRow : {},
//                 ]}
//               >
//                 <Text style={styles.colSno}>{index + 1}</Text>
//                 <Text style={[styles.colItem, { fontWeight: "bold" }]}>
//                   {item.item}
//                 </Text>
//                 <Text style={styles.colDesc}>{item.description}</Text>
//                 <Text style={styles.colQty}>{item.quantity}</Text>
//                 <Text style={styles.colRate}>{formatNumber(item.rate)}</Text>
//                 <Text style={[styles.colAmount, { fontWeight: "bold" }]}>
//                   {formatCurrency(item.amount)}
//                 </Text>
//               </View>
//             ))}
//           </View>

//           {/* Summary Section */}
//           <View style={styles.summarySection} wrap={false}>
//             <View style={styles.summaryBox}>
//               <View style={styles.summaryRow}>
//                 <Text style={styles.summaryLabel}>Subtotal:</Text>
//                 <Text style={styles.summaryValue}>
//                   {formatCurrency(data.subtotal)}
//                 </Text>
//               </View>

//               {data.discountAmount > 0 && (
//                 <View style={styles.summaryRow}>
//                   <Text style={styles.summaryLabel}>
//                     Discount ({data.discount}
//                     {data.discountType === "PERCENTAGE" ? "%" : ""}):
//                   </Text>
//                   <Text style={[styles.summaryValue, { color: "#dc2626" }]}>
//                     - {formatCurrency(data.discountAmount)}
//                   </Text>
//                 </View>
//               )}

//               <View style={styles.summaryRow}>
//                 <Text style={styles.summaryLabel}>CGST ({data.cgst}%):</Text>
//                 <Text style={styles.summaryValue}>
//                   {formatCurrency(data.cgstAmount)}
//                 </Text>
//               </View>

//               <View style={styles.summaryRow}>
//                 <Text style={styles.summaryLabel}>SGST ({data.sgst}%):</Text>
//                 <Text style={styles.summaryValue}>
//                   {formatCurrency(data.sgstAmount)}
//                 </Text>
//               </View>

//               <View
//                 style={[
//                   styles.summaryRow,
//                   styles.summaryTotalRow,
//                   styles.summaryLastRow,
//                 ]}
//               >
//                 <Text style={styles.summaryTotalLabel}>TOTAL AMOUNT</Text>
//                 <Text style={styles.summaryTotalValue}>
//                   {formatCurrency(data.total)}
//                 </Text>
//               </View>
//             </View>
//           </View>

//           {/* Terms and Notes - Keep together */}
//           <View wrap={false}>
//             {/* Terms */}
//             {data.terms && (
//               <View style={styles.termsSection}>
//                 <Text style={styles.sectionTitle}>Terms & Conditions</Text>
//                 <Text style={styles.sectionText}>{data.terms}</Text>
//               </View>
//             )}

//             {/* Notes */}
//             {data.notes && (
//               <View style={[styles.termsSection, { marginTop: 15 }]}>
//                 <Text style={styles.sectionTitle}>Notes</Text>
//                 <Text style={styles.sectionText}>{data.notes}</Text>
//               </View>
//             )}

//             {/* Signature */}
//             <View style={styles.signature}>
//               <View style={styles.signatureLine}></View>
//               <Text style={styles.signatureText}>Authorized Signature</Text>
//               <Text
//                 style={[
//                   styles.signatureText,
//                   { fontWeight: "normal", fontSize: 8, marginTop: 2 },
//                 ]}
//               >
//                 {data.companyName}
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Footer - Fixed on all pages */}
//         <View style={styles.footer} fixed>
//           <Text style={styles.footerText}>Invoice: {data.invoiceNumber}</Text>
//           <Text style={styles.footerText}>
//             Generated: {formatDate(new Date().toISOString())}
//           </Text>
//           <Text style={styles.footerText}>Thank you for your business!</Text>
//         </View>
//       </Page>
//     </Document>
//   );
// };



import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Compact Invoice Styles - Single Page Optimized and Upper One is Two page with Payment Details 
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    position: 'relative',
  },
  // Header Section - Compact
  header: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  leftSection: {
    flexDirection: "row",
    flex: 1,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 3,
    color: "#000000",
  },
  companyDetails: {
    fontSize: 10,
    color: "#333333",
    lineHeight: 1.5,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    letterSpacing: 1,
    marginBottom: 5,
  },
  invoiceMetaRow: {
    flexDirection: "row",
    gap: 15,
    marginTop: 3,
  },
  invoiceMetaItem: {
    fontSize: 9,
  },
  invoiceLabel: {
    fontWeight: "bold",
    color: "#555555",
  },
  invoiceValue: {
    color: "#000000",
  },
  // Bill To Section - Compact
  billToSection: {
    marginBottom: 15,
    padding: 8,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#dddddd",
  },
  billToTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000000",
    textTransform: "uppercase",
  },
  clientName: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 3,
    color: "#000000",
  },
  clientDetails: {
    fontSize: 10,
    color: "#000000",
    lineHeight: 1.3,
  },
  // Items Table - Compact
  table: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#000000",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
    paddingVertical: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    paddingVertical: 6,
    minHeight: 30,
  },
  tableRowAlt: {
    backgroundColor: '#fafafa',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  colSno: {
    width: "6%",
    paddingHorizontal: 5,
    fontSize: 8,
    textAlign: "center",
  },
  colItem: {
    width: "24%",
    paddingHorizontal: 5,
    fontSize: 8,
  },
  colDesc: {
    width: "32%",
    paddingHorizontal: 5,
    fontSize: 8,
  },
  colQty: {
    width: "8%",
    paddingHorizontal: 5,
    fontSize: 8,
    textAlign: "center",
  },
  colRate: {
    width: "15%",
    paddingHorizontal: 5,
    fontSize: 8,
    textAlign: "right",
  },
  colAmount: {
    width: "15%",
    paddingHorizontal: 5,
    fontSize: 8,
    textAlign: "right",
  },
  headerText: {
    fontWeight: "bold",
    color: "#000000",
    fontSize: 8,
    textTransform: "uppercase",
  },
  // Summary Section - Compact
  summarySection: {
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  summaryBox: {
    width: "40%",
    borderWidth: 1,
    borderColor: "#000000",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
  },
  summaryLastRow: {
    borderBottomWidth: 0,
  },
  summaryTotalRow: {
    backgroundColor: "#333333",
    paddingVertical: 7,
  },
  summaryLabel: {
    fontSize: 8,
    color: "#555555",
  },
  summaryValue: {
    fontSize: 8,
    color: "#000000",
    textAlign: "right",
    fontWeight: "bold",
  },
  summaryTotalLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#ffffff",
  },
  summaryTotalValue: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#ffffff",
  },
  // Terms - Compact
  termsSection: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#dddddd",
  },
  sectionTitle: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#000000",
    textTransform: "uppercase",
  },
  sectionText: {
    fontSize: 7,
    lineHeight: 1.4,
    color: "#333333",
  },
  // Footer - Compact
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#000000",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 7,
    color: "#666666",
  },
  signature: {
    marginTop: 15,
    marginBottom: 35,
    alignItems: "flex-end",
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "#000000",
    width: 120,
    marginTop: 20,
    marginBottom: 3,
  },
  signatureText: {
    fontSize: 8,
    color: "#000000",
    fontWeight: "bold",
  },
  // Test Watermark Container ------
  // watermarkContainer: {
  //   position: "absolute",
  //   top: "50%",
  //   left: "10%",
  //   transform: "translate(-50%, -50%) rotate(-45deg)",
  //   opacity: 0.06,
  //   zIndex: 0,
  //   display:"flex",
  //   justifyContent:"center",
  //   alignItems:"center"
  // },
  watermarkText: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#000000",
    letterSpacing: 5,

  },

  //Image watermark Container ----
 watermarkContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  watermarkImage: {
    width: 500,
    height: 300,
    opacity: 0.5,
  },

  contentWrapper: {
    position: 'relative',
    zIndex: 1,
  },
  digitalSignature: {
  width: 100,
    height: 50,
    marginRight: 10,
    marginBottom: -20,

  }
});

export const InvoiceDocument = ({ data }: { data: any }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    return `Rs. ${formatted}`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <Document
      title={`${data.invoiceNumber}`}
      author="Arnab Mukherjee"
      subject="Official Invoice"
    >
      <Page size="A4" style={styles.page}>
        {/* Text Watermark */}
        {/* {data.watermark !== false && (
          <View style={styles.watermarkContainer} fixed>
            <Text style={styles.watermarkText}>
              {data.companyName || "HACKENCE SERVICES"}
              Arnab Mukherjee
            </Text>
          </View>
        )} */}

{/* Image WaterMark  */}
 {data.watermark !== false && (
          <View style={styles.watermarkContainer} fixed>
            <Image
              src={data.logo || "/Hackence-bg.png"}
              style={styles.watermarkImage}
            />
           
          </View>
        )}


        {/* Content Wrapper */}
        <View style={styles.contentWrapper}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              {/* Left - Company Info */}
              <View style={styles.leftSection}>
                <Image
                  style={styles.logo}
                  src={data.logo || `${process.env.NEXT_PUBLIC_APP_URL}/logo.v3.jpeg`}
                />
                <View style={styles.companyInfo}>
                  <Text style={styles.companyName}>{data.companyName}</Text>
                  <Text style={styles.companyDetails}>
                    {data.companyAddress}, {data.companyCity}, {data.companyState} - {data.companyPincode}
                  </Text>
                  <Text style={styles.companyDetails}>
                    Phone: {data.companyPhone}
                  </Text>
                  <Text style={styles.companyDetails}>
                   Email: {data.companyEmail}
                  </Text>
                  {data.companyWebsite && (
                    <Text style={styles.companyDetails}>
                      Web: {data.companyWebsite}
                    </Text>
                  )}
                </View>
              </View>

              {/* Right - Invoice Title & Meta */}
              <View style={styles.rightSection}>
                <Text style={styles.invoiceTitle}>INVOICE</Text>
                <View style={styles.invoiceMetaRow}>
                  <Text style={styles.invoiceMetaItem}>
                    <Text style={styles.invoiceLabel}>No: </Text>
                    <Text style={styles.invoiceValue}>{data.invoiceNumber}</Text>
                  </Text>
                  <Text style={styles.invoiceMetaItem}>
                    <Text style={styles.invoiceLabel}>Date: </Text>
                    <Text style={styles.invoiceValue}>{formatDate(data.invoiceDate)}</Text>
                  </Text>
                </View>
                <Text style={[styles.invoiceMetaItem, { marginTop: 3, textAlign: "right" }]}>
                  <Text style={styles.invoiceLabel}>Status: </Text>
                  <Text style={[
                    styles.invoiceValue,
                    {
                      color: data.status === "PAID" ? "#059669" : 
                             data.status === "SENT" ? "#0284c7" : "#dc2626",
                      fontWeight: "bold"
                    }
                  ]}>
                    {data.status}
                  </Text>
                </Text>
              </View>
            </View>
          </View>

          {/* Bill To Section */}
          <View style={styles.billToSection}>
            <Text style={styles.billToTitle}>Bill To</Text>
            <Text style={styles.clientName}>{data.clientName}</Text>
            <Text style={styles.clientDetails}>
              {data.clientAddress}, {data.clientCity}, {data.clientState} - {data.clientPincode}
            </Text>
            <Text style={styles.clientDetails}>
              Phone: {data.clientPhone}
              {data.clientEmail && ` | Email: ${data.clientEmail}`}
              {data.clientGSTIN && ` | GSTIN: ${data.clientGSTIN}`}
            </Text>
          </View>

          {/* Items Table */}
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.colSno, styles.headerText]}>#</Text>
              <Text style={[styles.colItem, styles.headerText]}>Item</Text>
              <Text style={[styles.colDesc, styles.headerText]}>Description</Text>
              <Text style={[styles.colQty, styles.headerText]}>Qty</Text>
              <Text style={[styles.colRate, styles.headerText]}>Rate</Text>
              <Text style={[styles.colAmount, styles.headerText]}>Amount</Text>
            </View>

            {/* Table Rows */}
            {data.items.map((item: any, index: number) => (
              <View
                key={item._id || index}
                style={[
                  styles.tableRow,
                  index % 2 === 1 ? styles.tableRowAlt : {},
                  index === data.items.length - 1 ? styles.lastRow : {},
                ]}
              >
                <Text style={styles.colSno}>{index + 1}</Text>
                <Text style={[styles.colItem, { fontWeight: "bold" }]}>
                  {item.item}
                </Text>
                <Text style={styles.colDesc}>{item.description}</Text>
                <Text style={styles.colQty}>{item.quantity}</Text>
                <Text style={styles.colRate}>{formatNumber(item.rate)}</Text>
                <Text style={[styles.colAmount, { fontWeight: "bold" }]}>
                  {formatCurrency(item.amount)}
                </Text>
              </View>
            ))}
          </View>

          {/* Summary Section */}
          <View style={styles.summarySection}>
            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal:</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(data.subtotal)}
                </Text>
              </View>

              {data.discountAmount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    Discount ({data.discount}
                    {data.discountType === "PERCENTAGE" ? "%" : ""}):
                  </Text>
                  <Text style={[styles.summaryValue, { color: "#dc2626" }]}>
                    - {formatCurrency(data.discountAmount)}
                  </Text>
                </View>
              )}

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>CGST ({data.cgst}%):</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(data.cgstAmount)}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>SGST ({data.sgst}%):</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(data.sgstAmount)}
                </Text>
              </View>

              <View
                style={[
                  styles.summaryRow,
                  styles.summaryTotalRow,
                  styles.summaryLastRow,
                ]}
              >
                <Text style={styles.summaryTotalLabel}>TOTAL</Text>
                <Text style={styles.summaryTotalValue}>
                  {formatCurrency(data.total)}
                </Text>
              </View>
            </View>
          </View>

          {/* Terms & Notes in 2 columns */}
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
            {/* Terms */}
            {data.terms && (
              <View style={[styles.termsSection, { flex: 1, margin: 0 }]}>
                <Text style={styles.sectionTitle}>Terms & Conditions</Text>
                <Text style={styles.sectionText}>{data.terms}</Text>
              </View>
            )}

            {/* Notes */}
            {data.notes && (
              <View style={[styles.termsSection, { flex: 1, margin: 0 }]}>
                <Text style={styles.sectionTitle}>Notes</Text>
                <Text style={styles.sectionText}>{data.notes}</Text>
              </View>
            )}
          </View>

          {/* Signature */}
          <View style={styles.signature}>
               <Image
                  style={styles.digitalSignature}
                  
                  // src={data.logo || `${process.env.NEXT_PUBLIC_APP_URL}/logo.v3.jpeg`}
                  src={'/arnabSignature.png'}
                />
             
            <View style={styles.signatureLine}></View>
            <Text style={styles.signatureText}>Authorized Signature</Text>
            <Text
              style={[
                styles.signatureText,
                { fontWeight: "normal", fontSize: 7, marginTop: 2 },
              ]}
            >
              {data.companyName}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Invoice: {data.invoiceNumber}</Text>
          <Text style={styles.footerText}>
            Generated: {formatDate(new Date().toISOString())}
          </Text>
          <Text style={styles.footerText}>Thank you for your business!</Text>
        </View>
      </Page>
    </Document>
  );
};