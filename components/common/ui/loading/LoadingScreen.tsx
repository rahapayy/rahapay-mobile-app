import { View, StyleSheet } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";

export default function LoadingScreen() {
  return (
    <View style={styles.loaderOverlay}>
      <LottieView
        source={require("@/assets/animation/loader.json")}
        autoPlay
        loop
        style={{ width: 200, height: 200 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 0,
  },
});
