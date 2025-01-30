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

interface CreatePinScreenProps {
  navigation: NativeStackNavigationProp<any, "">;
}

const CreatePinScreen: React.FC<CreatePinScreenProps> = ({ navigation }) => {
  const [boxes, setBoxes] = useState(["", "", "", "", "", ""]);
  const [confirmBoxes, setConfirmBoxes] = useState(["", "", "", "", "", ""]);
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
        message: "Security PIN created successfully!",
        type: "success",
      });

      navigation.navigate("SuccessfulScreen");
    } catch (error) {
      console.error("Error creating security PIN:", error);
      handleShowFlash({
        message: "Failed to create security PIN. Please try again.",
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
          <BackButton navigation={navigation} />

          <View className="flex-1">
            <View style={{ marginTop: 16 }}>
              <MediumText color="black" size="xlarge" marginBottom={5}>
                Create Your Security PIN
              </MediumText>
              <LightText color="mediumGrey" size="base">
                This PIN will be used to secure your account and authorize
                important actions
              </LightText>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.titleText} allowFontScaling={false}>
                Enter Security PIN
              </Text>
              <View className="justify-center items-center">
                <OtpInput
                  length={6}
                  value={boxes}
                  onChange={setBoxes}
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.titleText} allowFontScaling={false}>
                Confirm Security PIN
              </Text>
              <View className="justify-center items-center">
                <OtpInput
                  length={6}
                  value={confirmBoxes}
                  onChange={setConfirmBoxes}
                  secureTextEntry
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

export default CreatePinScreen;

const styles = StyleSheet.create({
  titleText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(10),
    marginBottom: SPACING / 2,
    color: "#0000008F",
    paddingHorizontal: SPACING * 2,
  },
  inputContainer: {
    flexDirection: "column",
    paddingVertical: SPACING * 2,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    marginTop: SPACING * 2,
  },
});
