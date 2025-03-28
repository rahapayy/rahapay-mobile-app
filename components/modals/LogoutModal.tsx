import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import COLORS from "../../constants/colors";
import FONT_SIZE from "../../constants/font-size";
import { RFValue } from "react-native-responsive-fontsize";
import SPACING from "../../constants/SPACING";
import { RegularText } from "../common/Text";

const LogOutModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void; // Changed from onToggle to onConfirm
}> = ({ visible, onClose, onConfirm }) => {
  const handleLogout = () => {
    onConfirm(); // Trigger logout and navigation in ProfileScreen
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
            <RegularText color="black" size="medium" center marginBottom={14}>
              Are you sure you want to log out of RahaPay?
            </RegularText>
            <View className="flex-row gap-4">
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleLogout}
              >
                <Text style={styles.modalButtonText} allowFontScaling={false}>
                  Yes
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
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogOutModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING * 2,
    paddingVertical: SPACING * 1.5,
    borderRadius: 10,
    alignItems: "center",
  },
  subModalText: {
    fontFamily: "Outfit-Regular",
    textAlign: "center",
    fontSize: RFValue(13),
    marginBottom: SPACING * 2,
  },
  modalButton: {
    backgroundColor: COLORS.violet400,
    paddingVertical: SPACING * 1.5,
    paddingHorizontal: SPACING * 3,
    borderRadius: 5,
    marginVertical: 5,
  },
  modalButtonText: {
    fontFamily: "Outfit-Regular",
    color: COLORS.white,
    fontSize: FONT_SIZE.small,
  },
});
