import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";
import COLORS from "../config/colors";

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  useEffect(() => {
    // Set a timeout to ensure the splash screen lasts for a certain duration
    const timeout = setTimeout(onFinish, 4000); // Adjust timing as needed
    return () => clearTimeout(timeout);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <Animatable.Image
        animation="zoomIn"
        duration={2000} // Set duration to 2 seconds
        easing="ease-out" // Smooth out the zoom effect
        iterationCount={1}
        source={require("../assets/images/logo.png")}
        style={styles.logo}
        onAnimationEnd={onFinish} // Trigger onFinish after animation ends
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.violet600,
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default SplashScreen;