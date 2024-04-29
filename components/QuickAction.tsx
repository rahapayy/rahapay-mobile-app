import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import React from "react";
import { Wifi } from "iconsax-react-native";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../config/colors";

const QuickAction = () => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const height = screenWidth;
  return (
    <View className="p-4">
      <Text style={styles.quickAction}>Quick Action</Text>
      <View className="flex-row items-center justify-between mt-4">
        {/* Cards */}
        <TouchableOpacity
          style={[styles.card, { width: (screenWidth - 60) / 4 }]}
        >
          <Wifi color={COLORS.violet400} />
          <Text style={styles.cardText}>Airtime</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.card, { width: (screenWidth - 60) / 4 }]}
        >
          <Wifi color={COLORS.violet400} />
          <Text style={styles.cardText}>Data</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.card, { width: (screenWidth - 60) / 4 }]}
        >
          <Wifi color={COLORS.violet400} />
          <Text style={styles.cardText}>TV</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.card, { width: (screenWidth - 60) / 4 }]}
        >
          <Wifi color={COLORS.violet400} />
          <Text style={styles.cardText}>Electicity</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity className="w-full bg-white p-4 justify-center items-center mt-4 rounded-xl">
        <Text style={styles.moreText}>More</Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuickAction;

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
  moreText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(14),
  },
});
