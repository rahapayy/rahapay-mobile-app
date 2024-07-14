import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RFValue } from "react-native-responsive-fontsize";
import SPACING from "../../../config/SPACING";
import COLORS from "../../../config/colors";
import Button from "../../../components/Button";
import { ArrowLeft } from "iconsax-react-native";
import { TextInput } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import useApi from "../../../utils/api";
import { handleShowFlash } from "../../../components/FlashMessageComponent";

type ConfirmPinScreenRouteParams = {
  pin: string;
};

const ConfirmPinScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const route =
    useRoute<RouteProp<{ params: ConfirmPinScreenRouteParams }, "params">>();
  const prevPin = route.params.pin;

  const [boxes, setBoxes] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const boxRefs = useRef<Array<TextInput | null>>(new Array(4).fill(null));

  const [boxIsFocused, setBoxIsFocused] = useState(new Array(4).fill(false));

  const handleInput = (text: string, index: number) => {
    if (/^\d{0,1}$/.test(text)) {
      const newBoxes = [...boxes];
      newBoxes[index] = text;
      setBoxes(newBoxes);

      // Check if all input boxes are cleared
      const allBoxesCleared = newBoxes.every((box) => box === "");

      if (text === "" && index > 0) {
        boxRefs.current[index - 1]?.focus();
      } else if (index < 4 && !allBoxesCleared) {
        boxRefs.current[index + 1]?.focus();
      } else if (allBoxesCleared) {
        // If all boxes are cleared, focus on the first box
        boxRefs.current[0]?.focus();
      }
    }
  };
  const { mutateAsync } = useApi.post("/auth/create-pin");

  const handleButtonClick = async () => {
    setLoading(true);
    try {
      const pin = boxes.join("");
      if (pin !== prevPin) {
        handleShowFlash({
          message: "Pins are not the same",
          type: "danger",
        });
      } else {
        await mutateAsync({ securityPin: pin });

        // Here you would navigate to another screen or reset the state as required
        navigation.navigate("SuccessfulScreen");
        // Show success message
        handleShowFlash({
          message: "Security pin added successfully!",
          type: "success",
        });
        setBoxes(["", "", "", ""]);
      }
    } catch (error: any) {
      handleShowFlash({
        message: "Failed to add pin. Please try again later.",
        type: "danger",
      });
      // Optionally log the error too
      console.error("Failed to update pin:", error.message);
      console.error({ error });
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="p-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color="#000" />
        </TouchableOpacity>

        <View className="mt-4 justify-center items-center">
          <View style={styles.topContain}>
            <Image
              source={require("../../../assets/images/star.png")}
              className="w-3 h-3"
            />
            <Image
              source={require("../../../assets/images/star.png")}
              className="w-3 h-3"
            />
            <Image
              source={require("../../../assets/images/star.png")}
              className="w-3 h-3"
            />
            <Image
              source={require("../../../assets/images/star.png")}
              className="w-3 h-3"
            />
          </View>
          <Text style={styles.headText} allowFontScaling={false}>
            Confirm Your Security PIN
          </Text>
          <Text style={styles.subText} allowFontScaling={false}>
            Use this pin to process your transactions
          </Text>
        </View>

        {/* Input boxes */}

        <View style={styles.inputContainer}>
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
                value={value ? "*" : ""}
                onChangeText={(text) => handleInput(text, index)}
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
          title={"Create Pin"}
          onPress={handleButtonClick}
          isLoading={loading}
          className="mt-4"
          textColor="#fff"
        />
      </View>
    </SafeAreaView>
  );
};

export default ConfirmPinScreen;

const styles = StyleSheet.create({
  headText: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(20),
    marginBottom: 10,
  },
  subText: {
    fontFamily: "Outfit-ExtraLight",
    fontSize: RFValue(13),
  },
  inputContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SPACING * 2,
    borderRadius: 15,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: RFValue(19),
    fontWeight: "bold",
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
  starText: {
    fontSize: RFValue(29),
    color: COLORS.violet400,
  },
});
