import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  FlatList,
} from "react-native";
import React, { useContext } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../constants/colors";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { More } from "iconsax-react-native";
import SPACING from "../constants/SPACING";
import {
  AirtimeIcon,
  DataIcon,
  ElectricityIcon,
  TvIcon,
} from "./common/ui/icons";
import { BoldText, RegularText } from "./common/Text";
import { Skeleton } from "@rneui/themed";
import { AuthContext } from "../services/AuthContext";

interface ActionItem {
  icon: React.ElementType;
  title: string;
  navigateTo: string;
}

const QuickAction: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { width: screenWidth } = useWindowDimensions();
  const { isLoading } = useContext(AuthContext);

  // Calculate an appropriate card size based on the screen width, ensuring a minimum width
  const cardWidth = Math.max((screenWidth - 60) / 4, 80); // Minimum width set to 80
  const cardHeight = cardWidth * 1.1; // Maintain a fixed aspect ratio

  const fill = COLORS.violet300; // Define a custom icon color

  const actionItems = [
    { icon: AirtimeIcon, title: "Airtime", navigateTo: "AirtimeScreen" },
    { icon: DataIcon, title: "Data", navigateTo: "DataScreen" },
    { icon: TvIcon, title: "TV", navigateTo: "TvSubscriptionScreen" },
    {
      icon: ElectricityIcon,
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
      <item.icon fill={fill} color={COLORS.violet300} width={24} height={24} />
      <RegularText color="black" marginTop={5} size="base">
        {item.title}
      </RegularText>
    </TouchableOpacity>
  );

  return (
    <View className="p-4">
      <BoldText color="black" size="medium">
        Quick Action
      </BoldText>
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
  moreText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(14),
  },
});
