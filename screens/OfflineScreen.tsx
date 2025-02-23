import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { Button } from "@rneui/themed"; // Assuming you're using RNEUI for buttons
import { MediumText, SemiBoldText } from "../components/common/Text"; // Adjust path as needed
import COLORS from "../constants/colors"; // Adjust path as needed

type OfflineScreenProps = {
  onRetry: () => void;
};

const OfflineScreen = ({ onRetry }: OfflineScreenProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <SemiBoldText color="black" size="xlarge" marginBottom={20}>
          No Internet Connection
        </SemiBoldText>
        <MediumText color="mediumGrey" size="base" marginBottom={30}>
          Please check your internet connection and try again.
        </MediumText>
        <Button
          title="Retry"
          onPress={onRetry}
          buttonStyle={styles.retryButton}
          titleStyle={styles.retryButtonText}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white, // Adjust as per your theme
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: COLORS.violet600, // Adjust as per your theme
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: "Outfit-Medium", // Adjust as per your font setup
    color: "#fff",
  },
});

export default OfflineScreen;