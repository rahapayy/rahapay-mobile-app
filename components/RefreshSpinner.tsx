import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { SPACING } from "../constants/ui";
import COLORS from "../constants/colors";

const RefreshSpinner: React.FC = () => {
  return (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator size="small" color={COLORS.violet400} />
    </View>
  );
};

const styles = StyleSheet.create({
  spinnerContainer: {
    backgroundColor: "white",
    padding: SPACING,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
    borderRadius: 50,
  },
});

export default RefreshSpinner;
