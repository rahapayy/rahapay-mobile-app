import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import COLORS from "../../constants/colors";
import FONT_SIZE from "../../constants/font-size";
import { RFValue } from "react-native-responsive-fontsize";
import SPACING from "../../constants/SPACING";

const BiometricModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onToggle: () => void;
  isEnabled: boolean;
}> = ({ visible, onClose, onToggle, isEnabled }) => {
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
              <TouchableOpacity style={styles.modalButton} onPress={onToggle}>
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
