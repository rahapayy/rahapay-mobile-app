import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import React, { FC } from "react";
import COLORS from "../../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import { RegularText } from "../common/Text";

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

interface NextButtonProps {
  scrollTo: () => void;
  onLoginPress: () => void;
  onCreateAccountPress: () => void;
}

const NextButton: FC<NextButtonProps> = ({
  scrollTo,
  onLoginPress,
  onCreateAccountPress,
}) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // Adjust these styles according to screen width and height
  const buttonWidth = screenWidth * 0.92;
  const buttonHeight = screenHeight * 0.06;
  const buttonBottomMargin = screenHeight * 0.1;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onCreateAccountPress}
        style={[
          styles.button,
          {
            width: buttonWidth,
            height: buttonHeight,
            backgroundColor: COLORS.violet400,
            marginBottom: 10,
          },
        ]}
      >
        <Text style={styles.buttonText}>Create an Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onLoginPress}
        style={[
          styles.button,
          {
            width: buttonWidth,
            height: buttonHeight,
            borderColor: COLORS.violet300,
            borderWidth: 1,
            marginBottom: buttonBottomMargin,
          },
        ]}
      >
        <RegularText color="black">Login</RegularText>
      </TouchableOpacity>
    </View>
  );
};

export default NextButton;

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: RFValue(14),
    fontFamily: "Outfit-Regular",
  },
});
