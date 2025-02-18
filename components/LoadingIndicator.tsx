import React from "react";
import { View, StyleSheet, Image } from "react-native";

const LoadingIndicator = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/animation/splash-animation.gif")} 
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5136C1", // Background color matching your splash screen
  },
  animation: {
    width: 287, // Adjusted to cover the full width
    height: 88,
  },
});

export default LoadingIndicator;
