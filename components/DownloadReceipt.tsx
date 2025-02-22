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
      <Text style={styles.buttonText} allowFontScaling={false}>
        Download Receipt
      </Text>
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
    borderStyle: "dotted",
    borderColor: "#000",
    paddingVertical: SPACING,
    paddingHorizontal: SPACING * 3,
    borderRadius: 8,
    marginTop: SPACING * 2,
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
