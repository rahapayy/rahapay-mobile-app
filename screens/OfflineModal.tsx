import React from "react";
import { View, StyleSheet, Modal } from "react-native";
import { Button } from "@rneui/themed"; // Assuming you're using RNEUI for buttons
import { MediumText, SemiBoldText } from "../components/common/Text"; // Adjust path as needed
import COLORS from "../constants/colors"; // Adjust path as needed

type OfflineModalProps = {
  visible: boolean;
  onRetry: () => void;
};

const OfflineModal = ({ visible, onRetry }: OfflineModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <SemiBoldText color="black" size="large" marginBottom={20}>
            No Internet Connection
          </SemiBoldText>
          <MediumText color="mediumGrey" size="small" marginBottom={30}>
            Please check your internet connection and try again.
          </MediumText>
          <Button
            title="Retry"
            onPress={onRetry}
            buttonStyle={styles.retryButton}
            titleStyle={styles.retryButtonText}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.violet600, // Adjust as per your theme
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: "Outfit-Medium", // Adjust as per your font setup
    color: "#fff",
  },
});

export default OfflineModal;