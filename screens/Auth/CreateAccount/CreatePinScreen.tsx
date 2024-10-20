import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useRef, useState, useEffect, useContext } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RFValue } from "react-native-responsive-fontsize";
import SPACING from "../../../constants/SPACING";
import COLORS from "../../../constants/colors";
import Button from "../../../components/common/ui/buttons/Button";
import { ArrowLeft } from "iconsax-react-native";
import { handleShowFlash } from "../../../components/FlashMessageComponent";
import { AuthContext } from "../../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackButton from "../../../components/common/ui/buttons/BackButton";
import { LightText, MediumText } from "../../../components/common/Text";

const CreatePinScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [boxes, setBoxes] = useState(["", "", "", "", "", ""]);
  const [confirmBoxes, setConfirmBoxes] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const boxRefs = useRef<Array<TextInput | null>>(new Array(6).fill(null));
  const confirmBoxRefs = useRef<Array<TextInput | null>>(
    new Array(6).fill(null)
  );

  const [boxIsFocused, setBoxIsFocused] = useState(new Array(6).fill(false));
  const [confirmBoxIsFocused, setConfirmBoxIsFocused] = useState(
    new Array(6).fill(false)
  );

  const { createPin } = useContext(AuthContext);

  useEffect(() => {
    // Focus on the first input box when the component mounts
    boxRefs.current[0]?.focus();
  }, []);

  const handleInput = (
    text: string,
    index: number,
    confirm: boolean = false
  ) => {
    const currentBoxes = confirm ? confirmBoxes : boxes;
    const setCurrentBoxes = confirm ? setConfirmBoxes : setBoxes;

    const newBoxes = [...currentBoxes];

    // Handle input
    if (text === "") {
      newBoxes[index] = "";
      setCurrentBoxes(newBoxes);
      if (index > 0) {
        confirm
          ? confirmBoxRefs.current[index - 1]?.focus()
          : boxRefs.current[index - 1]?.focus();
      }
    } else if (/^\d{0,1}$/.test(text)) {
      newBoxes[index] = text;
      setCurrentBoxes(newBoxes);
      if (index < 5 && text !== "") {
        confirm
          ? confirmBoxRefs.current[index + 1]?.focus()
          : boxRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (
    event: { nativeEvent: { key: string } },
    index: number,
    confirm: boolean = false
  ) => {
    const currentBoxes = confirm ? confirmBoxes : boxes;
    const setCurrentBoxes = confirm ? setConfirmBoxes : setBoxes;

    if (event.nativeEvent.key === "Backspace" && currentBoxes[index] === "") {
      if (index > 0) {
        confirm
          ? confirmBoxRefs.current[index - 1]?.focus()
          : boxRefs.current[index - 1]?.focus();
      }
    }
  };

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
      // Call createPin only for the security pin
      await createPin(pin);
      handleShowFlash({
        message: "Security PIN created successfully!",
        type: "success",
      });

      // Navigate to the transaction pin screen
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

  const handleBackPress = () => {
    navigation.goBack();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ padding: 16 }}>
          <BackButton navigation={navigation} />

          <View
            style={{
              marginTop: 16,
            }}
          >
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
              <View style={styles.inputRow}>
                {boxes.map((value, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (boxRefs.current[index] = ref)}
                    style={[
                      styles.inputBox,
                      boxIsFocused[index] && styles.inputBoxFocused,
                    ]}
                    keyboardType="numeric"
                    allowFontScaling={false}
                    value={value}
                    secureTextEntry
                    onChangeText={(text) => handleInput(text, index)}
                    onKeyPress={(event) => handleKeyPress(event, index)}
                    onFocus={() =>
                      setBoxIsFocused((prevState) => [
                        ...prevState.slice(0, index),
                        true,
                        ...prevState.slice(index + 1),
                      ])
                    }
                    onBlur={() =>
                      setBoxIsFocused((prevState) => [
                        ...prevState.slice(0, index),
                        false,
                        ...prevState.slice(index + 1),
                      ])
                    }
                  />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.titleText} allowFontScaling={false}>
              Confirm Security PIN
            </Text>
            <View className="justify-center items-center">
              <View style={styles.inputRow}>
                {confirmBoxes.map((value, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (confirmBoxRefs.current[index] = ref)}
                    style={[
                      styles.inputBox,
                      confirmBoxIsFocused[index] && styles.inputBoxFocused,
                    ]}
                    keyboardType="numeric"
                    allowFontScaling={false}
                    value={value}
                    secureTextEntry
                    onChangeText={(text) => handleInput(text, index, true)}
                    onKeyPress={(event) => handleKeyPress(event, index, true)}
                    onFocus={() =>
                      setConfirmBoxIsFocused((prevState) => [
                        ...prevState.slice(0, index),
                        true,
                        ...prevState.slice(index + 1),
                      ])
                    }
                    onBlur={() =>
                      setConfirmBoxIsFocused((prevState) => [
                        ...prevState.slice(0, index),
                        false,
                        ...prevState.slice(index + 1),
                      ])
                    }
                  />
                ))}
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
  headText: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(18),
    marginBottom: 6,
  },
  subText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(10),
    color: "#0000008F",
  },
  titleText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(10),
    marginBottom: SPACING / 2,
    color: "#0000008F",
    paddingHorizontal: SPACING * 2,
  },
  inputContainer: {
    flexDirection: "column",
    // justifyContent: "center",
    // alignItems: "center",
    paddingVertical: SPACING * 2,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    marginTop: SPACING * 2,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: SPACING,
  },
  inputBox: {
    width: 40,
    height: 40,
    textAlign: "center",
    borderRadius: 10,
    margin: SPACING / 3,
    borderWidth: 1,
    borderColor: "#DFDFDF",
    fontSize: RFValue(10),
    fontWeight: "bold",
  },
  inputBoxFocused: {
    borderColor: COLORS.violet400,
    borderWidth: 1,
  },
  topContain: {
    flexDirection: "row",
    gap: SPACING,
    backgroundColor: COLORS.violet100,
    paddingHorizontal: SPACING * 2,
    paddingVertical: SPACING,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING * 2,
  },
});
