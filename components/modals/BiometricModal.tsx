import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import COLORS from "../../constants/colors";
import FONT_SIZE from "../../constants/font-size";
import { RFValue } from "react-native-responsive-fontsize";
import SPACING from "../../constants/SPACING";
import * as LocalAuthentication from "expo-local-authentication";
import { handleShowFlash } from "../FlashMessageComponent";

const BiometricModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onToggle: (newValue: boolean) => Promise<void>;
  isEnabled: boolean;
}> = ({ visible, onClose, onToggle, isEnabled }) => {

  const handleBiometricToggle = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        handleShowFlash({
          message: "Biometric hardware not available on this device.",
          type: "danger",
        });
        onClose();
        return;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        handleShowFlash({
          message: "No biometric credentials enrolled.",
          type: "danger",
        });
        onClose();
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to toggle biometrics",
        fallbackLabel: "Use PIN", // Optional: fallback to PIN if biometric fails
      });

      if (result.success) {
        await onToggle(!isEnabled); // Toggle the biometric state
        handleShowFlash({
          message: `Biometrics ${isEnabled ? "disabled" : "enabled"}`,
          type: "success",
        });
      } else {
        handleShowFlash({
          message: "Biometric authentication failed.",
          type: "danger",
        });
      }
    } catch (error) {
      handleShowFlash({
        message: "An error occurred during biometric authentication.",
        type: "danger",
      });
      console.error(error);
    }
  };
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View className="px-10 justify-center items-center">
            <Text style={styles.modalText} allowFontScaling={false}>
              {isEnabled ? "Disable Biometrics?" : "Biometric Authentication"}
            </Text>
            <Text style={styles.subModalText} allowFontScaling={false}>
              {isEnabled
                ? "Disable fingerprint authentication for both Login and Transactions?"
                : "Enable fingerprint authentication for both Login and Transactions?"}
            </Text>
            <View className="flex-row gap-4">
              <TouchableOpacity style={styles.modalButton} onPress={handleBiometricToggle}>
                <Text style={styles.modalButtonText} allowFontScaling={false}>
                  {isEnabled ? "Disable" : "Yes, Enable"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: "transparent",
                    borderWidth: 1,
                    borderColor: COLORS.red500,
                  },
                ]}
                onPress={onClose}
              >
                <Text
                  style={[styles.modalButtonText, { color: "#FF2E2E" }]}
                  allowFontScaling={false}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BiometricModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontFamily: "Outfit-Medium",
    fontSize: FONT_SIZE.medium,
    marginBottom: SPACING,
  },
  subModalText: {
    fontFamily: "Outfit-Regular",
    textAlign: "center",
    fontSize: RFValue(12),
    marginBottom: SPACING * 2,
  },
  modalButton: {
    backgroundColor: COLORS.violet400,
    paddingVertical: SPACING * 1.5,
    paddingHorizontal: SPACING * 1.5,
    borderRadius: 5,
    marginVertical: 5,
  },
  modalButtonText: {
    fontFamily: "Outfit-Regular",
    color: COLORS.white,
    fontSize: FONT_SIZE.small,
  },
});
