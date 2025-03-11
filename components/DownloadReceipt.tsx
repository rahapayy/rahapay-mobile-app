// import React from "react";
// import {
//   Alert,
//   PermissionsAndroid,
//   Platform,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { DocumentDownload } from "iconsax-react-native";
// import * as FileSystem from "expo-file-system";
// import * as Sharing from "expo-sharing";
// import * as Print from "expo-print"; // For generating PDF
// import SPACING from "../constants/SPACING";
// import FONT_SIZE from "../constants/font-size";
// import COLORS from "../constants/colors"; // Assuming this includes your color scheme
// import { formatDate } from "../utils/dateFormatter";
// import { Transaction } from "../types/transaction";
// import { RegularText } from "./common/Text";

// // Function to generate HTML content for the PDF receipt
// const generateReceiptHTML = (transaction: Transaction): string => {
//   const { titleColor, amountColor, statusColor } = getStatusColors(transaction.status);

//   return `
//     <html>
//       <head>
//         <style>
//           body {
//             font-family: Arial, sans-serif;
//             padding: 20px;
//             color: #333;
//           }
//           .container {
//             border: 1px solid #E0E0E0;
//             border-radius: 10px;
//             padding: 20px;
//             max-width: 600px;
//             margin: auto;
//             background-color: #FFFFFF;
//           }
//           .header {
//             text-align: center;
//             margin-bottom: 20px;
//           }
//           .logo {
//             font-size: 24px;
//             font-weight: bold;
//             color: #5136C1; /* RahaPay violet */
//           }
//           .title {
//             font-size: 18px;
//             color: ${titleColor};
//             margin-top: 10px;
//           }
//           .amount {
//             font-size: 28px;
//             font-weight: bold;
//             color: ${amountColor};
//             text-align: center;
//             margin: 20px 0;
//           }
//           .divider {
//             border-top: 1px dashed #E0E0E0;
//             margin: 15px 0;
//           }
//           .details, .support, .footer {
//             font-size: 14px;
//           }
//           .details-row {
//             display: flex;
//             justify-content: space-between;
//             margin: 8px 0;
//           }
//           .label {
//             color: #8E9AAF;
//           }
//           .value {
//             font-weight: 500;
//             color: #000;
//           }
//           .status {
//             color: ${statusColor};
//             font-weight: bold;
//           }
//           .support, .footer {
//             text-align: center;
//             margin-top: 20px;
//           }
//           .support a {
//             color: #5136C1;
//             text-decoration: none;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <div class="logo">RahaPay</div>
//             <div class="title">Transaction Receipt</div>
//           </div>
//           <div class="amount">₦${transaction.amount.toLocaleString("en-US", {
//             minimumFractionDigits: 2,
//           })}</div>
//           <div class="divider"></div>
//           <div class="details">
//             <div class="details-row">
//               <span class="label">Status</span>
//               <span class="value status">${
//                 transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1).toLowerCase()
//               }</span>
//             </div>
//             <div class="details-row">
//               <span class="label">Date</span>
//               <span class="value">${formatDate(transaction.created_at)}</span>
//             </div>
//             ${generateTransactionSpecificDetailsHTML(transaction)}
//             <div class="details-row">
//               <span class="label">Transaction No.</span>
//               <span class="value">${transaction.referenceId}</span>
//             </div>
//           </div>
//           <div class="divider"></div>
//           <div class="support">
//             <div>Support</div>
//             <a href="mailto:customerservice@rahapay.com">customerservice@rahapay.com</a>
//           </div>
//           <div class="footer">
//             Experience a better life with RahaPay. For now, we specialize in making bill payments easy and convenient for you. We're working hard to bring you more services soon.
//           </div>
//         </div>
//       </body>
//     </html>
//   `;
// };

// // Helper function to generate transaction-specific details in HTML
// const generateTransactionSpecificDetailsHTML = (transaction: Transaction): string => {
//   switch (transaction.tranxType) {
//     case "WALLET_TRANSFER":
//       return `
//         <div class="details-row">
//           <span class="label">Sender</span>
//           <span class="value">${transaction.metadata?.sender || "N/A"}</span>
//         </div>
//         <div class="details-row">
//           <span class="label">Recipient</span>
//           <span class="value">${transaction.metadata?.recipient || "N/A"}</span>
//         </div>
//       `;
//     case "AIRTIME_PURCHASE":
//     case "DATA_PURCHASE":
//       return `
//         <div class="details-row">
//           <span class="label">Network</span>
//           <span class="value">${transaction.metadata?.networkType || "N/A"}</span>
//         </div>
//         <div class="details-row">
//           <span class="label">Recipient Mobile</span>
//           <span class="value">${transaction.metadata?.phoneNumber || "N/A"}</span>
//         </div>
//         <div class="details-row">
//           <span class="label">Paid with</span>
//           <span class="value">${transaction.purpose || "N/A"}</span>
//         </div>
//       `;
//     case "WALLET_FUNDING":
//       return `
//         <div class="details-row">
//           <span class="label">Funding Source</span>
//           <span class="value">${transaction.purpose || "Unknown Source"}</span>
//         </div>
//       `;
//     default:
//       return `
//         <div class="details-row">
//           <span class="label">Transaction Type</span>
//           <span class="value">${transaction.tranxType.replace("_", " ")}</span>
//         </div>
//       `;
//   }
// };

// // Helper function to determine status colors
// const getStatusColors = (status: string) => {
//   switch (status.toLowerCase()) {
//     case "success":
//       return { titleColor: "#333", amountColor: "#28A745", statusColor: "#28A745" }; // Green
//     case "failed":
//       return { titleColor: "#333", amountColor: "#DC3545", statusColor: "#DC3545" }; // Red
//     case "pending":
//       return { titleColor: "#333", amountColor: "#FFC107", statusColor: "#FFC107" }; // Yellow
//     default:
//       return { titleColor: "#333", amountColor: "#333", statusColor: "#333" }; // Default gray
//   }
// };

// // Function to request storage permission (Android only)
// const requestStoragePermission = async (): Promise<boolean> => {
//   if (Platform.OS !== "android") return true;

//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//       {
//         title: "Storage Permission",
//         message: "App needs access to your storage to download receipts",
//         buttonNeutral: "Ask Me Later",
//         buttonNegative: "Cancel",
//         buttonPositive: "OK",
//       }
//     );
//     return granted === PermissionsAndroid.RESULTS.GRANTED;
//   } catch (err) {
//     console.warn(err);
//     return false;
//   }
// };

// // Main download receipt function (now generates PDF)
// const downloadReceipt = async (transaction: Transaction): Promise<void> => {
//   const hasPermission = await requestStoragePermission();
//   if (!hasPermission) {
//     Alert.alert(
//       "Permission Denied",
//       "You need to grant storage permission to download receipts"
//     );
//     return;
//   }

//   try {
//     const html = generateReceiptHTML(transaction);
//     const fileName = `receipt_${transaction.tranxType}_${transaction.referenceId}.pdf`;
//     const { uri } = await Print.printToFileAsync({ html });

//     if (Platform.OS === "ios") {
//       await Sharing.shareAsync(uri);
//     } else {
//       const downloadDir = `${FileSystem.documentDirectory}Download/`;
//       const downloadPath = `${downloadDir}${fileName}`;
//       const dirInfo = await FileSystem.getInfoAsync(downloadDir);

//       if (!dirInfo.exists) {
//         await FileSystem.makeDirectoryAsync(downloadDir, { intermediates: true });
//       }

//       await FileSystem.moveAsync({
//         from: uri,
//         to: downloadPath,
//       });

//       Alert.alert(
//         "Download Complete",
//         `Receipt saved to Downloads folder as ${fileName}`,
//         [{ text: "OK" }]
//       );
//     }
//   } catch (error) {
//     console.error("Error generating receipt:", error);
//     Alert.alert("Download Failed", "There was an error generating your receipt");
//   }
// };

// // Component props type
// interface DownloadReceiptButtonProps {
//   transaction: Transaction;
// }

// // Updated DownloadReceiptButton Component
// const DownloadReceiptButton: React.FC<DownloadReceiptButtonProps> = ({ transaction }) => {
//   return (
//     <TouchableOpacity
//       style={styles.button}
//       onPress={() => downloadReceipt(transaction)}
//       activeOpacity={0.8}
//     >
//       <DocumentDownload color={COLORS.white} size={24} />
//       <RegularText color="white" size="large" marginLeft={SPACING}>
//         Download Receipt
//       </RegularText>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   button: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#5136C1", // RahaPay violet
//     paddingVertical: SPACING * 1.5,
//     paddingHorizontal: SPACING * 3,
//     borderRadius: 12,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     marginTop: SPACING * 2,
//   },
// });

// export { DownloadReceiptButton, downloadReceipt };

import React from "react";
import {
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DocumentDownload } from "iconsax-react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import SPACING from "../constants/SPACING";
import FONT_SIZE from "../constants/font-size";
import { formatDate } from "../utils/dateFormatter";
import { Transaction } from "../types/transaction";
import { RegularText } from "./common/Text";

// Function to generate receipt content
const generateReceiptContent = (transaction: Transaction): string => {
  // Format the receipt content as plain text matching the UI structure
  const content = `
----------------------------------------
           RahaPay
      Transaction Receipt
----------------------------------------

Amount: ₦${transaction.amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
  })}
Status: ${
    transaction.status.charAt(0).toUpperCase() +
    transaction.status.slice(1).toLowerCase()
  }
Date: ${formatDate(transaction.created_at)}

----------------------------------------

${generateTransactionSpecificDetails(transaction)}
Transaction No.: ${transaction.referenceId}

----------------------------------------
Support
customerservice@rahapay.com
----------------------------------------

Experience a better life with RahaPay. For now, we specialize in
making bill payments easy and convenient for you. We're working
hard to bring you more services soon.
`;

  return content;
};

// Helper function to generate transaction-specific details
const generateTransactionSpecificDetails = (
  transaction: Transaction
): string => {
  switch (transaction.tranxType) {
    case "WALLET_TRANSFER":
      return `Sender: ${transaction.metadata?.sender || "N/A"}
Recipient: ${transaction.metadata?.recipient || "N/A"}`;

    case "AIRTIME_PURCHASE":
    case "DATA_PURCHASE":
      return `Network: ${transaction.metadata?.networkType || "N/A"}
Recipient Mobile: ${transaction.metadata?.phoneNumber || "N/A"}
Paid with: ${transaction.purpose || "N/A"}`;

    case "WALLET_FUNDING":
      return `Funding Source: ${transaction.purpose || "Unknown Source"}`;

    default:
      return `Transaction Type: ${transaction.tranxType.replace("_", " ")}`;
  }
};

// Function to request storage permission (Android only)
const requestStoragePermission = async (): Promise<boolean> => {
  if (Platform.OS !== "android") return true;

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Storage Permission",
        message: "App needs access to your storage to download receipts",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

// Main download receipt function
const downloadReceipt = async (transaction: Transaction): Promise<void> => {
  const hasPermission = await requestStoragePermission();
  if (!hasPermission) {
    Alert.alert(
      "Permission Denied",
      "You need to grant storage permission to download receipts"
    );
    return;
  }

  try {
    const content = generateReceiptContent(transaction);
    const fileName = `receipt_${transaction.tranxType}_${transaction.referenceId}.txt`;
    const filePath = `${FileSystem.cacheDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(filePath, content);

    if (Platform.OS === "ios") {
      await Sharing.shareAsync(filePath);
    } else {
      const downloadDir = `${FileSystem.documentDirectory}Download/`;
      const dirInfo = await FileSystem.getInfoAsync(downloadDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(downloadDir, {
          intermediates: true,
        });
      }

      const downloadPath = `${downloadDir}${fileName}`;
      await FileSystem.copyAsync({
        from: filePath,
        to: downloadPath,
      });

      Alert.alert(
        "Download Complete",
        `Receipt saved to Downloads folder as ${fileName}`,
        [{ text: "OK" }]
      );
    }
  } catch (error) {
    console.error("Error downloading receipt:", error);
    Alert.alert(
      "Download Failed",
      "There was an error downloading your receipt"
    );
  }
};

// Component props type
interface DownloadReceiptButtonProps {
  transaction: Transaction;
}

// Component for the download button
const DownloadReceiptButton: React.FC<DownloadReceiptButtonProps> = ({
  transaction,
}) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => downloadReceipt(transaction)}
    >
      <DocumentDownload color="#000" />
      <RegularText color="black" size="large" marginLeft={5}>
        Download Receipt
      </RegularText>
    </TouchableOpacity>
  );
};

// InfoRow Component to match the UI structure (for reference, not used in text)
const InfoRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#000",
    paddingVertical: SPACING,
    paddingHorizontal: SPACING * 3,
    borderRadius: 8,
    marginTop: SPACING * 5,
  },
  buttonText: {
    marginLeft: SPACING,
    color: "#000",
    fontFamily: "Outfit-Regular",
    fontSize: FONT_SIZE.medium,
  },
  receiptContainer: {
    backgroundColor: "#fff",
    padding: SPACING * 2,
    borderRadius: 8,
  },
  receiptHeader: {
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: SPACING,
  },
  logoText: {
    fontSize: FONT_SIZE.large,
    fontFamily: "Outfit-Bold",
    color: "#5136C1",
  },
  receiptTitle: {
    fontSize: FONT_SIZE.large,
    fontFamily: "Outfit-Medium",
    color: "#000",
  },
  amountContainer: {
    alignItems: "center",
    marginVertical: SPACING * 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: SPACING,
  },
  detailsContainer: {
    marginVertical: SPACING,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: SPACING / 2,
  },
  infoLabel: {
    fontFamily: "Outfit-Regular",
    fontSize: FONT_SIZE.medium,
    color: "#8E9AAF",
  },
  infoValue: {
    fontFamily: "Outfit-Medium",
    fontSize: FONT_SIZE.medium,
    color: "#000",
  },
  supportContainer: {
    alignItems: "center",
    marginTop: SPACING * 2,
  },
  footer: {
    marginTop: SPACING * 2,
    alignItems: "center",
  },
});

export { DownloadReceiptButton, downloadReceipt };
