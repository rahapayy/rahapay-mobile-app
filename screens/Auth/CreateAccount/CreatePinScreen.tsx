import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RFValue } from "react-native-responsive-fontsize";
import SPACING from "../../../config/SPACING";
import COLORS from "../../../config/colors";
import Button from "../../../components/Button";
import { ArrowLeft } from "iconsax-react-native";
import useApi from "../../../utils/api";
import { handleShowFlash } from "../../../components/FlashMessageComponent";

const CreatePinScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [boxes, setBoxes] = useState(["", "", "", ""]);
  const [confirmBoxes, setConfirmBoxes] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"create" | "confirm">("create");

  const boxRefs = useRef<Array<TextInput | null>>(new Array(4).fill(null));
  const confirmBoxRefs = useRef<Array<TextInput | null>>(
    new Array(4).fill(null)
  );

  const [boxIsFocused, setBoxIsFocused] = useState(new Array(4).fill(false));

  useEffect(() => {
    if (step === "confirm") {
      confirmBoxRefs.current[0]?.focus();
    } else {
      boxRefs.current[0]?.focus();
    }
  }, [step]);

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
      if (index < 3 && text !== "") {
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

  const createPinMutation = useApi.post("/auth/create-pin");

  const handleCreatePin = () => {
    setStep("confirm");
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
      const response = await createPinMutation.mutateAsync({
        securityPin: parseInt(pin, 10),
        transactionPin: parseInt(pin, 10),
      });
      console.log("API response:", response);
      handleShowFlash({
        message: "Pins created successfully!",
        type: "success",
      });
      navigation.navigate("SuccessfulScreen");
    } catch (error) {
      console.error("Error creating PIN:", error);
      handleShowFlash({
        message: "Failed to create pins. Please try again.",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color="#000" />
        </TouchableOpacity>

        <View
          style={{
            marginTop: 16,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={styles.topContain}>
            {[...Array(4)].map((_, i) => (
              <Image
                key={i}
                source={require("../../../assets/images/star.png")}
                style={{ width: 12, height: 12 }}
              />
            ))}
          </View>
          <Text style={styles.headText} allowFontScaling={false}>
            {step === "create"
              ? "Create Your Security PIN"
              : "Confirm Your Security PIN"}
          </Text>
          <Text style={styles.subText} allowFontScaling={false}>
            Use this pin to process your transactions
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            {(step === "create" ? boxes : confirmBoxes).map((value, index) => (
              <TextInput
                key={index}
                ref={(ref) =>
                  step === "create"
                    ? (boxRefs.current[index] = ref)
                    : (confirmBoxRefs.current[index] = ref)
                }
                style={[
                  styles.inputBox,
                  boxIsFocused[index] && styles.inputBoxFocused,
                ]}
                keyboardType="numeric"
                allowFontScaling={false}
                value={value ? "*" : ""}
                onChangeText={(text) =>
                  handleInput(text, index, step === "confirm")
                }
                onKeyPress={(event) =>
                  handleKeyPress(event, index, step === "confirm")
                }
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

        <Button
          title={step === "create" ? "Continue" : "Confirm"}
          onPress={step === "create" ? handleCreatePin : handleConfirmPin}
          isLoading={loading}
          style={{ marginTop: 16 }}
          textColor="#fff"
        />
      </View>
    </SafeAreaView>
  );
};

export default CreatePinScreen;

const styles = StyleSheet.create({
  headText: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(20),
    marginBottom: 10,
  },
  subText: {
    fontFamily: "Outfit-ExtraLight",
    fontSize: RFValue(13),
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SPACING * 2,
    borderRadius: 15,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: SPACING,
  },
  inputBox: {
    flex: 1,
    textAlign: "center",
    paddingVertical: SPACING * 2,
    paddingHorizontal: SPACING,
    borderRadius: 10,
    margin: SPACING,
    borderWidth: 1,
    borderColor: "#DFDFDF",
    fontSize: RFValue(19),
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
