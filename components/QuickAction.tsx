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
  const { width: screenWidth } = useWindowDimensions();

  // Calculate an appropriate card size based on the screen width, ensuring a minimum width
  const cardWidth = Math.max((screenWidth - 60) / 4, 80); // Minimum width set to 80
  const cardHeight = cardWidth * 1.1; // Maintain a fixed aspect ratio

  // Updated style for card text to prevent wrapping
  const cardTextStyle = {
    ...styles.cardText,
    width: cardWidth - 36, // take into account paddingHorizontal
  };
  return (
    <View className="p-4">
      <Text style={styles.quickAction}>Quick Action</Text>
      <View className="flex-row items-center justify-between mt-4">
        {/* Cards */}
        <TouchableOpacity
          style={[styles.card, { width: cardWidth, height: cardHeight }]}
        >
          <Wifi color={COLORS.violet400} />
          <Text style={styles.cardText} numberOfLines={1} ellipsizeMode="tail">
            Airtime
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.card, { width: cardWidth, height: cardHeight }]}
        >
          <Wifi color={COLORS.violet400} />
          <Text style={styles.cardText} numberOfLines={1} ellipsizeMode="tail">
            Data
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.card, { width: cardWidth, height: cardHeight }]}
        >
          <Wifi color={COLORS.violet400} />
          <Text style={styles.cardText} numberOfLines={1} ellipsizeMode="tail">
            TV
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.card, { width: cardWidth, height: cardHeight }]}
        >
          <Wifi color={COLORS.violet400} />
          <Text style={styles.cardText} numberOfLines={1} ellipsizeMode="tail">
            Electicity
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity className="w-full bg-white p-4 justify-center items-center mt-4 rounded-2xl">
        <Text style={styles.moreText}>More</Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuickAction;

const styles = StyleSheet.create({
  quickAction: {
    fontFamily: "Outfit-SemiBold",
    fontSize: RFValue(16),
  },
  card: {
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderRadius: 20,
  },
  cardText: {
    fontSize: RFValue(12),
    fontFamily: "Outfit-Regular",
  },
  moreText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(14),
  },
});
