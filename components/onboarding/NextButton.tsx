import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import React, { FC } from "react";
import COLORS from "../../config/colors";

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

interface NextButtonProps {
  scrollTo: () => void;
}

const NextButton: FC<NextButtonProps> = ({ scrollTo }) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // Adjust these styles according to screen width and height
  const buttonWidth = screenWidth * 0.85;
  const buttonHeight = screenHeight * 0.06;
  const buttonBottomMargin = screenHeight * 0.1;
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={scrollTo}
        style={{
          width: buttonWidth,
          height: buttonHeight,
          backgroundColor: COLORS.violet400,
          borderRadius: 8,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: buttonBottomMargin,
        }}
      >
        <Text style={styles.buttonText}>Continue</Text>
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
  buttonContainer: {
    width: 0.85 * windowWidth,
    height: 0.06 * windowHeight,
    backgroundColor: COLORS.violet400,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Outfit-Regular",
  },
});
