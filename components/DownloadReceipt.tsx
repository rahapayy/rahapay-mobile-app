import React from "react";
import {
  ActionSheetIOS,
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
} from "react-native";
import { DocumentDownload } from "iconsax-react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import * as MediaLibrary from "expo-media-library";
import SPACING from "../constants/SPACING";
import COLORS from "../constants/colors";
import { formatDate } from "../utils/dateFormatter";
import { Transaction } from "../types/transaction";
import { RegularText } from "./common/Text";

// Function to generate HTML content for the receipt
const generateReceiptHTML = (transaction: Transaction): string => {
  const { titleColor, amountColor, statusColor } = getStatusColors(
    transaction.status
  );

  return `
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Outfit', sans-serif; padding: 20px; color: #333; text-align: center; }
          .container { border: 1px solid #E0E0E0; border-radius: 10px; padding: 40px; max-width: 90%; margin: auto; background-color: #FFFFFF; }
          .header { margin-bottom: 30px; }
          .logo { font-size: 40px; font-weight: 700; color: #5136C1; }
          .title { font-size: 32px; color: ${titleColor}; margin-top: 15px; font-weight: 600; }
          .amount { font-size: 50px; font-weight: 700; color: ${amountColor}; margin: 30px 0; }
          .divider { border-top: 2px dashed #E0E0E0; margin: 25px 0; }
          .details, .support, .footer { font-size: 24px; font-weight: 400; }
          .details-row { display: flex; justify-content: space-between; margin: 15px 0; font-size: 22px; font-weight: 400; }
          .label { color: #666; font-weight: 600; }
          .value { font-weight: 300; color: #000; }
          .status { color: ${statusColor}; font-weight: 300; font-size: 26px; }
          .support, .footer { margin-top: 30px; }
          .support a { color: #5136C1; text-decoration: none; font-size: 24px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">RahaPay</div>
            <div class="title">Transaction Receipt</div>
          </div>
          <div class="amount">₦${transaction.amount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}</div>
          <div class="divider"></div>
          <div class="details">
            <div class="details-row">
              <span class="label">Status</span>
              <span class="value status">${
                transaction.status.charAt(0).toUpperCase() +
                transaction.status.slice(1).toLowerCase()
              }</span>
            </div>
            <div class="details-row">
              <span class="label">Date</span>
              <span class="value">${formatDate(transaction.created_at)}</span>
            </div>
            ${generateTransactionSpecificDetailsHTML(transaction)}
            <div class="details-row">
              <span class="label">Transaction No.</span>
              <span class="value">${transaction.referenceId}</span>
            </div>
          </div>
          <div class="divider"></div>
          <div class="support">
            <div>Support</div>
            <a href="mailto:customerservice@rahapay.com">customerservice@rahapay.com</a>
          </div>
          <div class="footer">
            Experience a better life with RahaPay. We specialize in making bill payments easy and convenient for you.
          </div>
        </div>
      </body>
    </html>
  `;
};

// Helper function to generate transaction-specific details in HTML
const generateTransactionSpecificDetailsHTML = (
  transaction: Transaction
): string => {
  switch (transaction.tranxType) {
    case "WALLET_TRANSFER":
      return `
        <div class="details-row">
          <span class="label">Sender</span>
          <span class="value">${transaction.metadata?.sender || "N/A"}</span>
        </div>
        <div class="details-row">
          <span class="label">Recipient</span>
          <span class="value">${transaction.metadata?.recipient || "N/A"}</span>
        </div>
      `;
    case "AIRTIME_PURCHASE":
    case "DATA_PURCHASE":
      return `
        <div class="details-row">
          <span class="label">Network</span>
          <span class="value">${
            transaction.metadata?.networkType || "N/A"
          }</span>
        </div>
        <div class="details-row">
          <span class="label">Recipient Mobile</span>
          <span class="value">${
            transaction.metadata?.phoneNumber || "N/A"
          }</span>
        </div>
        <div class="details-row">
          <span class="label">Paid with</span>
          <span class="value">${transaction.purpose || "N/A"}</span>
        </div>
      `;
    case "WALLET_FUNDING":
      return `
        <div class="details-row">
          <span class="label">Funding Source</span>
          <span class="value">${transaction.purpose || "Unknown Source"}</span>
        </div>
      `;
    default:
      return `
        <div class="details-row">
          <span class="label">Transaction Type</span>
          <span class="value">${transaction.tranxType.replace("_", " ")}</span>
        </div>
      `;
  }
};

// Helper function to determine status colors
const getStatusColors = (status: string) => {
  switch (status.toLowerCase()) {
    case "success":
    case "successful": // Combine both cases since they represent the same state
      return {
        titleColor: "#222",
        amountColor: "#0A5C3E", // Very dark green for the amount
        statusColor: "#0A3D1F", // Even darker green for the status text
      };

    case "failed":
      return {
        titleColor: "#333",
        amountColor: "#DC3545",
        statusColor: "#000",
      };
    case "pending":
      return {
        titleColor: "#333",
        amountColor: "#FFC107",
        statusColor: "#000",
      };
    default:
      return { titleColor: "#333", amountColor: "#333", statusColor: "#333" };
  }
};

// Request storage permission (Android only)
const requestStoragePermission = async (): Promise<boolean> => {
  if (Platform.OS !== "android") return true;
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Storage Permission",
        message: "App needs access to your storage to save receipts",
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

// Request media library permission
const requestMediaLibraryPermission = async (): Promise<boolean> => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  return status === "granted";
};

// Function to save the receipt as a PDF
const saveAsPDF = async (transaction: Transaction): Promise<void> => {
  try {
    const html = generateReceiptHTML(transaction);
    const fileNameBase = `receipt_${transaction.tranxType}_${transaction.referenceId}`;
    const pdfFileName = `${fileNameBase}.pdf`;
    const { uri: pdfUri } = await Print.printToFileAsync({ html });

    if (Platform.OS === "ios") {
      await Sharing.shareAsync(pdfUri);
    } else {
      const downloadDir = `${FileSystem.documentDirectory}Download/`;
      const pdfPath = `${downloadDir}${pdfFileName}`;
      const dirInfo = await FileSystem.getInfoAsync(downloadDir);

      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(downloadDir, {
          intermediates: true,
        });
      }

      await FileSystem.moveAsync({ from: pdfUri, to: pdfPath });

      Alert.alert(
        "Download Complete",
        `Receipt saved as PDF to Downloads folder as ${pdfFileName}.`,
        [{ text: "OK" }]
      );
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    Alert.alert(
      "Download Failed",
      "There was an error generating your PDF receipt"
    );
  }
};

// Function to save the receipt as an image (placeholder for now)
const saveAsImage = async (transaction: Transaction): Promise<void> => {
  try {
    // Since Expo doesn't natively support HTML-to-image conversion,
    // this is a placeholder. In a real app, you might use a WebView with react-native-view-shot.
    Alert.alert(
      "Image Saving Not Supported",
      "Saving as an image is not directly supported in this app yet. Please save as PDF instead.",
      [{ text: "OK" }]
    );
  } catch (error) {
    console.error("Error generating image:", error);
    Alert.alert(
      "Download Failed",
      "There was an error generating your image receipt"
    );
  }
};

// Component props type
interface DownloadReceiptButtonProps {
  transaction: Transaction;
}

// Updated DownloadReceiptButton Component with Action Sheet
const DownloadReceiptButton: React.FC<DownloadReceiptButtonProps> = ({
  transaction,
}) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const showActionSheet = async () => {
    const hasStoragePermission = await requestStoragePermission();
    const hasMediaPermission = await requestMediaLibraryPermission();

    if (!hasStoragePermission || !hasMediaPermission) {
      Alert.alert(
        "Permission Denied",
        "You need to grant storage and media permissions to save receipts"
      );
      return;
    }

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: "Share Receipt",
          options: ["PDF", "Image", "Cancel"],
          cancelButtonIndex: 2,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            saveAsPDF(transaction);
          } else if (buttonIndex === 1) {
            saveAsImage(transaction);
          }
        }
      );
    } else {
      // For Android, show a custom modal
      setModalVisible(true);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={showActionSheet}
        activeOpacity={0.8}
      >
        <DocumentDownload color={COLORS.white} size={24} />
        <RegularText color="white" size="large" marginLeft={SPACING}>
          Download Receipt
        </RegularText>
      </TouchableOpacity>

      {/* Custom Modal for Android */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Share Receipt</Text>
            <Pressable
              style={styles.modalOption}
              onPress={() => {
                setModalVisible(false);
                saveAsPDF(transaction);
              }}
            >
              <Text style={styles.modalOptionText}>PDF</Text>
            </Pressable>
            <Pressable
              style={styles.modalOption}
              onPress={() => {
                setModalVisible(false);
                saveAsImage(transaction);
              }}
            >
              <Text style={styles.modalOptionText}>Image</Text>
            </Pressable>
            <Pressable
              style={styles.modalCancel}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5136C1",
    paddingVertical: SPACING * 1.5,
    paddingHorizontal: SPACING * 3,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginTop: SPACING * 2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 10,
  },
  modalTitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingVertical: 10,
  },
  modalOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  modalOptionText: {
    fontSize: 18,
    color: "#007AFF",
    textAlign: "center",
  },
  modalCancel: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 5,
    backgroundColor: "white",
    borderRadius: 10,
    marginHorizontal: 10,
  },
  modalCancelText: {
    fontSize: 18,
    color: "#007AFF",
    textAlign: "center",
  },
});

export { DownloadReceiptButton, saveAsPDF, saveAsImage };
