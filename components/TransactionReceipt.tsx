import React from "react";
import {
  Alert,
  Image,
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
import { BoldText, LightText, MediumText, RegularText } from "./common/Text";

// Function to generate receipt content
const generateReceiptContent = (transaction: Transaction): string => {
  // Format the receipt content as plain text
  const content = `
RAHAPAY TRANSACTION RECEIPT
---------------------------
Transaction Type: ${transaction.tranxType.replace("_", " ")}
Amount: ₦ ${transaction.amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
  })}
Date: ${formatDate(transaction.created_at)}
Reference ID: ${transaction.referenceId}
Status: ${transaction.status.toUpperCase()}

${generateTransactionSpecificDetails(transaction)}

Support: customerservice@rahapay.com

Enjoy a better life with RahaPay. Get free transfers, withdrawals, bill payments,
instant loans, and good annual interest on your savings. RahaPay is licensed by
the Central Bank of Nigeria and insured by the NDIC.
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
      return "";
  }
};

// Same permission and download functions as before
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
  // Check permission first (Android only)
  const hasPermission = await requestStoragePermission();
  if (!hasPermission) {
    Alert.alert(
      "Permission Denied",
      "You need to grant storage permission to download receipts"
    );
    return;
  }

  try {
    // Generate receipt content
    const content = generateReceiptContent(transaction);

    // Create the file name based on transaction details
    const fileName = `receipt_${transaction.tranxType}_${transaction.referenceId}.txt`;

    // Get the file path (in app's cache directory)
    const filePath = `${FileSystem.cacheDirectory}${fileName}`;

    // Write the receipt content to the file
    await FileSystem.writeAsStringAsync(filePath, content);

    // Share or save the file
    if (Platform.OS === "ios") {
      // On iOS, use sharing
      await Sharing.shareAsync(filePath);
    } else {
      // On Android, save to downloads
      const downloadDir = `${FileSystem.documentDirectory}Download/`;

      // Create downloads directory if it doesn't exist
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
interface TransactionReceiptProps {
  transaction: Transaction;
}

// Transaction Receipt Card Component
const TransactionReceipt: React.FC<TransactionReceiptProps> = ({
  transaction,
}) => {
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadReceipt(transaction);
    } finally {
      setIsDownloading(false);
    }
  };

  // Determine the transaction specific fields
  let transactionDetails = null;
  switch (transaction.tranxType) {
    case "AIRTIME_PURCHASE":
      transactionDetails = (
        <>
          <InfoRow
            label="Mobile Network Operators"
            value={transaction.metadata?.networkType || "N/A"}
          />
          <InfoRow
            label="Recipient Mobile"
            value={transaction.metadata?.phoneNumber || "N/A"}
          />
          <InfoRow label="Transaction Type" value="Airtime" />
        </>
      );
      break;
    case "DATA_PURCHASE":
      transactionDetails = (
        <>
          <InfoRow
            label="Mobile Network Operators"
            value={transaction.metadata?.networkType || "N/A"}
          />
          <InfoRow
            label="Recipient Mobile"
            value={transaction.metadata?.phoneNumber || "N/A"}
          />
          <InfoRow label="Transaction Type" value="Data" />
        </>
      );
      break;
    case "WALLET_TRANSFER":
      transactionDetails = (
        <>
          <InfoRow
            label="Sender"
            value={transaction.metadata?.sender || "N/A"}
          />
          <InfoRow
            label="Recipient"
            value={transaction.metadata?.recipient || "N/A"}
          />
          <InfoRow label="Transaction Type" value="Wallet Transfer" />
        </>
      );
      break;
    case "WALLET_FUNDING":
      transactionDetails = (
        <>
          <InfoRow
            label="Funding Source"
            value={transaction.purpose || "Unknown Source"}
          />
          <InfoRow label="Transaction Type" value="Wallet Funding" />
        </>
      );
      break;
    default:
      transactionDetails = (
        <InfoRow
          label="Transaction Type"
          value={transaction.tranxType.replace("_", " ")}
        />
      );
  }

  return (
    <View style={styles.receiptContainer}>
      {/* Header Section */}
      <View style={styles.receiptHeader}>
        {/* If you have a RahaPay logo, use Image; otherwise, use Text */}
        {/* <View style={styles.logoContainer}>
          <Text style={styles.logoText}>RahaPay</Text>
        </View>
        <Text style={styles.receiptTitle}>Transaction Receipt</Text> */}
      </View>

      {/* Amount Section */}
      <View style={styles.amountContainer}>
        <BoldText color="primary" size="xlarge">
          ₦
          {transaction.amount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}
        </BoldText>
        <MediumText color="black" size="large" marginTop={5}>
          {transaction.status.charAt(0).toUpperCase() +
            transaction.status.slice(1).toLowerCase()}
        </MediumText>
        <RegularText color="light">
          {formatDate(transaction.created_at)}
        </RegularText>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Transaction Details */}
      <View style={styles.detailsContainer}>
        {transactionDetails}
        <InfoRow label="Transaction No." value={transaction.referenceId} />
      </View>

      {/* Support Section */}
      <View style={styles.supportContainer}>
        <MediumText color="light" size="medium">
          Support
        </MediumText>
        <RegularText color="primary">customerservice@rahapay.com</RegularText>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <RegularText center color="mediumGrey" size="small">
          Experience a better life with RahaPay. For now, we specialize in
          making bill payments easy and convenient for you. We're working hard
          to bring you more services soon.
        </RegularText>
      </View>

      {/* Download Button */}
      {/* <TouchableOpacity
        style={styles.downloadButton}
        onPress={handleDownload}
        disabled={isDownloading}
        activeOpacity={0.7}
      >
        <DocumentDownload size={20} color="#3E7BFA" />
        <Text style={styles.downloadButtonText}>
          {isDownloading ? "Downloading..." : "Download Receipt"}
        </Text>
      </TouchableOpacity> */}
    </View>
  );
};

// Helper component for showing label-value pairs
const InfoRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <View style={styles.infoRow}>
    <RegularText color="light">{label}</RegularText>
    <MediumText size="small" color="black">
      {value}
    </MediumText>
  </View>
);

const styles = StyleSheet.create({
  receiptContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: SPACING * 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: SPACING * 2,
  },
  receiptHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING * 3,
  },
  logoContainer: {
    justifyContent: "center",
  },
  logoText: {
    fontSize: FONT_SIZE.large,
    fontFamily: "Outfit-Bold",
    color: "#3E7BFA", // Using a blue color that matches your likely brand color
  },
  receiptTitle: {
    fontSize: FONT_SIZE.large,
    fontFamily: "Outfit-SemiBold",
    color: "#333",
  },
  amountContainer: {
    alignItems: "center",
    marginBottom: SPACING * 3,
  },
  amountText: {
    fontFamily: "Outfit-Bold",
    color: "#3E7BFA", // Using RahaPay blue
    marginBottom: SPACING,
  },
  statusText: {
    fontSize: FONT_SIZE.large,
    fontFamily: "Outfit-SemiBold",
    color: "#333",
    marginBottom: SPACING,
  },
  dateText: {
    fontSize: FONT_SIZE.medium,
    fontFamily: "Outfit-Regular",
    color: "#777",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: SPACING * 2,
  },
  detailsContainer: {
    marginBottom: SPACING * 3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SPACING,
  },
  infoLabel: {
    fontSize: FONT_SIZE.medium,
    fontFamily: "Outfit-Regular",
    color: "#777",
  },
  infoValue: {
    fontSize: FONT_SIZE.medium,
    fontFamily: "Outfit-Medium",
    color: "#333",
    textAlign: "right",
    maxWidth: "60%",
  },
  supportContainer: {
    alignItems: "center",
    marginBottom: SPACING * 2,
  },
  supportTitle: {
    fontSize: FONT_SIZE.medium,
    fontFamily: "Outfit-Medium",
    color: "#777",
    marginBottom: SPACING / 2,
  },
  supportEmail: {
    fontSize: FONT_SIZE.medium,
    fontFamily: "Outfit-Regular",
    color: "#3E7BFA", // Using RahaPay blue
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    paddingTop: SPACING * 2,
    marginBottom: SPACING * 2,
  },
  footerText: {
    fontSize: FONT_SIZE.small,
    fontFamily: "Outfit-Regular",
    color: "#777",
    textAlign: "center",
    lineHeight: FONT_SIZE.small * 1.4,
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#3E7BFA", // Using RahaPay blue
    borderStyle: "solid",
    borderRadius: 8,
    paddingVertical: SPACING,
    paddingHorizontal: SPACING * 3,
    alignSelf: "center",
  },
  downloadButtonText: {
    marginLeft: SPACING,
    color: "#3E7BFA", // Using RahaPay blue
    fontFamily: "Outfit-Medium",
    fontSize: FONT_SIZE.medium,
  },
});

export { TransactionReceipt, downloadReceipt };
