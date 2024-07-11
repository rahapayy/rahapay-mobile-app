import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import COLORS from "../config/colors";

const { height } = Dimensions.get("window");

interface SelectDataPlanModalProps {
  visible: boolean;
  onClose: () => void;
}

const SelectDataPlanModal: React.FC<SelectDataPlanModalProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <TouchableOpacity style={styles.overlay} onPress={onClose} />
        <View style={styles.modalView}>
          <Text style={styles.modalText} allowFontScaling={false}>
            Select Data Plan
          </Text>
          {/* Add your plan options here */}
        </View>
      </View>
    </Modal>
  );
};

export default SelectDataPlanModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "100%",
    height: height * 0.4,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    fontFamily: "Outfit-SemiBold",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: COLORS.violet200,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 20,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
