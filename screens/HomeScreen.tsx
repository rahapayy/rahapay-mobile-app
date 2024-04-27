import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useState } from "react";

import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../config/colors";
import Card from "../components/Card";

const HomeScreen = () => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  
  const height = screenWidth ;

  return (
    <>
      <Card />
      <SafeAreaView>

      </SafeAreaView>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    overflow: "hidden",
  },
  fundWalletButton: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: "row",
  },
  fundWalletText: {
    fontFamily: "Outfit-Regular",
    color: COLORS.violet400,
    marginLeft: 4,
    fontSize: RFValue(16),
  },
  greetingTextContainer: {
    marginLeft: 8,
  },
  greetingText: {
    fontFamily: "Outfit-SemiBold",
    color: "#fff",
    fontSize: RFValue(18),
  },
  greetingSubText: {
    fontFamily: "Outfit-Regular",
    color: "#fff",
    fontSize: RFValue(14),
  },
  availableBalanceText: {
    fontFamily: "Outfit-Regular",
    color: "#fff",
    marginLeft: 4,
    fontSize: RFValue(14),
  },
  balanceValue: {
    fontFamily: "Outfit-SemiBold",
    color: "#fff",
    fontSize: RFValue(28),
  },
});
