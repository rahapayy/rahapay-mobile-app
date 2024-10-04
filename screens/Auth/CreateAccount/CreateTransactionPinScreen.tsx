import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useRef, useState, useContext } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RFValue } from "react-native-responsive-fontsize";
import SPACING from "../../../constants/SPACING";
import COLORS from "../../../constants/colors";
import Button from "../../../components/Button";
import { ArrowLeft } from "iconsax-react-native";
import { handleShowFlash } from "../../../components/FlashMessageComponent";
import { AuthContext } from "../../../context/AuthContext";

const CreateTransactionPinScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [boxes, setBoxes] = useState(["", "", "", ""]);
  const [confirmBoxes, setConfirmBoxes] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const boxRefs = useRef<Array<TextInput | null>>(new Array(4).fill(null));
  const confirmBoxRefs = useRef<Array<TextInput | null>>(
    new Array(4).fill(null)
  );

  const [boxIsFocused, setBoxIsFocused] = useState(new Array(4).fill(false));
  const [confirmBoxIsFocused, setConfirmBoxIsFocused] = useState(
    new Array(4).fill(false)
  );

  const { createPin } = useContext(AuthContext);

  const handleInput = (
    text: string,
    index: number,
    confirm: boolean = false
  ) => {
    const currentBoxes = confirm ? confirmBoxes : boxes;
    const setCurrentBoxes = confirm ? setConfirmBoxes : setBoxes;

    const newBoxes = [...currentBoxes];

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
      if (index < 3 && text !== "") {
        confirm
          ? confirmBoxRefs.current[index + 1]?.focus()
          : boxRefs.current[index + 1]?.focus();
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
      // Call createPin only for the transaction pin
      await createPin(pin); // Ensure this is the correct endpoint for transaction PIN
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
          <TouchableOpacity onPress={handleBackPress}>
            <ArrowLeft color="#000" />
          </TouchableOpacity>

          <View style={{ marginTop: 16 }}>
            <Text style={styles.headText} allowFontScaling={false}>
              Create Your Transaction PIN
            </Text>
            <Text style={styles.subText} allowFontScaling={false}>
              Use this pin for secure transactions
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.titleText} allowFontScaling={false}>
              Enter Transaction PIN
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
                  />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.titleText} allowFontScaling={false}>
              Confirm Transaction PIN
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

export default CreateTransactionPinScreen;

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
});
