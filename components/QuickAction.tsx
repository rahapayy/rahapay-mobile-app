import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import React from "react";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../config/colors";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Airtime from "../assets/svg/smartphone-rotate-angle_svgrepo.com.svg";
import Tv from "../assets/svg/tv_svgrepo.com.svg";
import Electricity from "../assets/svg/electricity_svgrepo.com.svg";
import Data from "../assets/svg/signal_svgrepo.com.svg";

const QuickAction: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { width: screenWidth } = useWindowDimensions();

  // Calculate an appropriate card size based on the screen width, ensuring a minimum width
  const cardWidth = Math.max((screenWidth - 60) / 4, 80); // Minimum width set to 80
  const cardHeight = cardWidth * 1.1; // Maintain a fixed aspect ratio

  // Updated style for card text to prevent wrapping
  const cardTextStyle = {
    ...styles.cardText,
    width: cardWidth - 36, // take into account paddingHorizontal
  };

  const handleButtonClick = () => {
    navigation.navigate("Services");
  };
  return (
    <View className="p-4">
      <Text style={styles.quickAction} allowFontScaling={false}>
        Quick Action
      </Text>
      <View className="flex-row items-center justify-between mt-4">
        {/* Cards */}
        <TouchableOpacity
          onPress={() => navigation.navigate("AirtimeScreen")}
          style={[styles.card, { width: cardWidth, height: cardHeight }]}
        >
          <Airtime />
          <Text
            style={styles.cardText}
            numberOfLines={1}
            ellipsizeMode="tail"
            allowFontScaling={false}
          >
            Airtime
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("DataScreen")}
          style={[styles.card, { width: cardWidth, height: cardHeight }]}
        >
          <Data />
          <Text
            style={styles.cardText}
            numberOfLines={1}
            ellipsizeMode="tail"
            allowFontScaling={false}
          >
            Data
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("TvSubscriptionScreen")}
          style={[styles.card, { width: cardWidth, height: cardHeight }]}
        >
          <Tv />
          <Text
            style={styles.cardText}
            numberOfLines={1}
            ellipsizeMode="tail"
            allowFontScaling={false}
          >
            TV
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("ElectricityScreen")}
          style={[styles.card, { width: cardWidth, height: cardHeight }]}
        >
          <Electricity />
          <Text
            style={styles.cardText}
            numberOfLines={1}
            ellipsizeMode="tail"
            allowFontScaling={false}
          >
            Electicity
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={handleButtonClick}
        className="w-full bg-white p-3 justify-center items-center mt-4 rounded-lg"
      >
        <Text style={styles.moreText} allowFontScaling={false}>
          More
        </Text>
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
