import React, { Dispatch, ReactNode, SetStateAction } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";

const BottomSheet = ({
  isOpen,
  setIsOpen,
  children,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}) => {
  function onClose() {
    setIsOpen(!isOpen);
  }
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex h-screen items-center relative bg-[#676F79]/60">
          <TouchableWithoutFeedback>
            <ScrollView
              style={styles.modalView}
              className="bg-brand-border-two rounded-t-xl px-5 pt-2 pb-10 h-fit w-full absolute bottom-0 right-0 left-0"
            >
              <TouchableOpacity style={styles.closeBar} onPress={onClose} />
              {children}
            </ScrollView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const height = Dimensions.get("screen").height;

const styles = StyleSheet.create({
  centeredView: {
    display: "flex",
    flexDirection: "column",
    // flex: 1,
    justifyContent: "center",
    backgroundColor: "676F79",
  },
  modalView: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: Platform.OS === "ios" ? height - 50 : height,
    overflow: "scroll",
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
  },
  closeBar: {
    width: 80,
    height: 4,
    backgroundColor: "#E5E1F6",
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 30,
  },
});

export default BottomSheet;
