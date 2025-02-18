import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SPACING from "../../../constants/SPACING";
import COLORS from "../../../constants/colors";
import Button from "../../../components/common/ui/buttons/Button";
import { handleShowFlash } from "../../../components/FlashMessageComponent";
import { LightText, MediumText, SemiBoldText } from "../../../components/common/Text";
import OtpInput from "../../../components/common/ui/forms/OtpInput";
import Label from "../../../components/common/ui/forms/Label";
import ProgressIndicator from "../../../components/ProgressIndicator";
import { ICreatePinDto } from "@/services/dtos";
import { services } from "@/services";
import { getItem, setItem } from "@/utils/storage";

interface CreateTransactionPinScreenProps {
  navigation: NativeStackNavigationProp<any, "">;
}

const CreateTransactionPinScreen: React.FC<CreateTransactionPinScreenProps> = ({
  navigation,
}) => {
  const [boxes, setBoxes] = useState(["", "", "", ""]);
  const [confirmBoxes, setConfirmBoxes] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);

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
      const payload: ICreatePinDto = {
        securityPin: pin,
        transactionPin: pin,
      };

      const response = await services.authServiceToken.createPin(payload);
      console.log(response);
      
      handleShowFlash({
        message: "Transaction PIN created successfully!",
        type: "success",
      });

      navigation.navigate("CreatePinScreen");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message instanceof Array
          ? error.response.data.message[0]
          : error.response?.data?.message || "An unexpected error occurred";
      console.error("Create Transaction error:", errorMessage);
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
            navigation={navigation}
            currentStep={2}
            totalSteps={4}
          />

          <View style={{ marginTop: 16 }}>
            <SemiBoldText color="black" size="xlarge" marginBottom={5}>
              Create Your Transaction PIN
            </SemiBoldText>
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
