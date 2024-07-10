import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  FlatList,
} from "react-native";
import React from "react";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../config/colors";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Airtime from "../assets/svg/smartphone-rotate-angle_svgrepo.com.svg";
import Tv from "../assets/svg/tv_svgrepo.com.svg";
import Electricity from "../assets/svg/electricity_svgrepo.com.svg";
import Data from "../assets/svg/signal_svgrepo.com.svg";
import { More } from "iconsax-react-native";
import SPACING from "../config/SPACING";

interface ActionItem {
  icon: React.ElementType;
  title: string;
  navigateTo: string;
}

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

  const actionItems = [
    { icon: Airtime, title: "Airtime", navigateTo: "AirtimeScreen" },
    { icon: Data, title: "Data", navigateTo: "DataScreen" },
    { icon: Tv, title: "TV", navigateTo: "TvSubscriptionScreen" },
    {
      icon: Electricity,
      title: "Electricity",
      navigateTo: "ElectricityScreen",
    },
    { icon: More, title: "More", navigateTo: "Services" },
  ];

  const renderCard = ({ item }: { item: ActionItem }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate(item.navigateTo)}
      style={[styles.card, { width: cardWidth, height: cardHeight }]}
    >
      <item.icon color={COLORS.violet300} size={26} />
      <Text
        style={styles.cardText}
        numberOfLines={1}
        ellipsizeMode="tail"
        allowFontScaling={false}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="p-4">
      <Text style={styles.quickAction} allowFontScaling={false}>
        Quick Action
      </Text>
      <View className="flex-row items-center justify-between mt-4">
        {/* Cards */}

        <FlatList
          data={actionItems}
          renderItem={renderCard}
          keyExtractor={(item, index) => index.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 4 }}
        />
      </View>
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
    margin: SPACING / 2,
    borderRadius: 20,
  },
  cardText: {
    fontSize: RFValue(12),
    fontFamily: "Outfit-Regular",
    marginTop: SPACING,
  },
  moreText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(14),
  },
});
