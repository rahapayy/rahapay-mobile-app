import { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import ReactNativeModal from "react-native-modal";

interface IModalProp {
  children: ReactNode;
  isVisible: boolean;
  closeModal?: () => void;
  onDismiss?: () => void;
  height?: "half" | "full";
}

export function ButtomSheetModal({
  children,
  isVisible,
  closeModal,
  onDismiss,
}: Readonly<IModalProp>) {
  return (
    <ReactNativeModal
      isVisible={isVisible}
      hasBackdrop={true}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      onSwipeComplete={closeModal}
      swipeDirection={"down"}
      propagateSwipe
      animationIn={"slideInUp"}
      // animationOut={"slideInDown"}
      animationInTiming={600}
      animationOutTiming={600}
      style={{ justifyContent: "flex-end", margin: 0 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="max-h-[90%] bg-white rounded-t-2xl px-6 pb-30"
      >
        <View className="py-4 justify-center items-center">
          <View className="bg-black h-1 w-14 rounded-full"></View>
        </View>
        <ScrollView>{children}</ScrollView>
        <View className="h-6" />
      </KeyboardAvoidingView>
    </ReactNativeModal>
  );
}
