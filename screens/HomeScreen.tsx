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
import { Wifi } from "iconsax-react-native";
import QuickAction from "../components/QuickAction";
import RecentTransaction from "../components/RecentTransaction";

const HomeScreen = () => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const height = screenWidth;

  return (
    <>
      <Card />
      <QuickAction />
      <RecentTransaction />
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  quickAction: {
    fontFamily: "Outfit-SemiBold",
    fontSize: RFValue(18),
  },
  card: {
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderRadius: 10,
  },
  cardText: {
    fontSize: RFValue(10),
    fontFamily: "Outfit-Regular",
  },
});
