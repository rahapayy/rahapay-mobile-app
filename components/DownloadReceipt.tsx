import React from "react";
import {
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
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
  // Format the receipt content as plain text
  const content = `
TRANSACTION RECEIPT
-------------------
Transaction Type: ${transaction.tranxType.replace("_", " ")}
Amount: ₦ ${transaction.amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
  })}
Date: ${formatDate(transaction.created_at)}
Reference ID: ${transaction.referenceId}
Status: ${transaction.status.toUpperCase()}

${generateTransactionSpecificDetails(transaction)}

Thank you for using our service!
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
});

export { DownloadReceiptButton, downloadReceipt };
