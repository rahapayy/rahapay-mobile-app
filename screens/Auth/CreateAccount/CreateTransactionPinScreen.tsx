import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useContext } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RFValue } from "react-native-responsive-fontsize";
import SPACING from "../../../constants/SPACING";
import COLORS from "../../../constants/colors";
import Button from "../../../components/common/ui/buttons/Button";
import { handleShowFlash } from "../../../components/FlashMessageComponent";
import { AuthContext } from "../../../services/AuthContext";
import BackButton from "../../../components/common/ui/buttons/BackButton";
import { LightText, MediumText } from "../../../components/common/Text";
import OtpInput from "../../../components/common/ui/forms/OtpInput";
import Label from "../../../components/common/ui/forms/Label";
import ProgressIndicator from "../../../components/ProgressIndicator";

interface CreateTransactionPinScreenProps {
  navigation: NativeStackNavigationProp<any, "">;
}

const CreateTransactionPinScreen: React.FC<CreateTransactionPinScreenProps> = ({
  navigation,
}) => {
  const [boxes, setBoxes] = useState(["", "", "", ""]);
  const [confirmBoxes, setConfirmBoxes] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const { createPin } = useContext(AuthContext);

  const handleConfirmPin = async () => {
    setLoading(true);
    const pin = boxes.join("");
    const confirmPin = confirmBoxes.join("");

    if (pin !== confirmPin) {
      handleShowFlash({
        message: "Pins do not match. Please try again.",
        type: "danger",
      });
      setLoading(false);
      return;
    }

    try {
      await createPin(pin);
      handleShowFlash({
        message: "Transaction PIN created successfully!",
        type: "success",
      });

      navigation.navigate("CreatePinScreen");
    } catch (error) {
      console.error("Error creating transaction PIN:", error);
      handleShowFlash({
        message: "Failed to create transaction PIN. Please try again.",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ padding: 16, flex: 1 }}>
          <ProgressIndicator
            navigation={undefined}
            currentStep={2}
            totalSteps={4}
          />

          <View style={{ marginTop: 16 }}>
            <MediumText color="black" size="xlarge" marginBottom={5}>
              Create Your Transaction PIN
            </MediumText>
            <LightText color="mediumGrey" size="base">
              Use this pin for secure transactions
            </LightText>
          </View>

          <View className="flex-1">
            <View style={styles.inputContainer}>
              <Label text="Enter Transaction PIN" marked={false} />
              <View className="justify-center items-center ">
                <OtpInput
                  length={4}
                  value={boxes}
                  onChange={setBoxes}
                  secureTextEntry
                  autoFocus={true}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Label text="Confirm Transaction PIN" marked={false} />
              <View className="justify-center items-center">
                <OtpInput
                  length={4}
                  value={confirmBoxes}
                  onChange={setConfirmBoxes}
                  secureTextEntry
                  autoFocus={false}
                />
              </View>
            </View>
          </View>

          <Button
            title="Confirm"
            onPress={handleConfirmPin}
            isLoading={loading}
            style={{ marginTop: SPACING * 4 }}
            textColor="#fff"
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default CreateTransactionPinScreen;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "column",
    paddingVertical: SPACING * 1.5,
    paddingHorizontal: SPACING * 2,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    marginTop: SPACING * 2,
  },
});
