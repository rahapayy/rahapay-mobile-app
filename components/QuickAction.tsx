import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  FlatList,
} from "react-native";
import React, { useContext } from "react";
import COLORS from "../constants/colors";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  AirtimeIcon,
  DataIcon,
  ElectricityIcon,
  TvIcon,
} from "./common/ui/icons";
import { BoldText, LightText, RegularText } from "./common/Text";
import { Skeleton } from "@rneui/themed";
import { AuthContext } from "../services/AuthContext";

interface ActionItem {
  icon: React.ElementType;
  title: string;
  navigateTo?: string;
  isComingSoon?: boolean;
}

const QuickAction: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { width: screenWidth } = useWindowDimensions();
  const { isLoading } = useContext(AuthContext);

  // Calculate an appropriate card size based on the screen width, ensuring a minimum width
  const cardWidth = Math.max((screenWidth - 60) / 5, 80); // Minimum width set to 80
  const cardHeight = cardWidth * 1.1; // Maintain a fixed aspect ratio

  const fill = COLORS.violet300; // Define a custom icon color

  const actionItems = [
    { icon: AirtimeIcon, title: "Airtime", navigateTo: "AirtimeScreen" },
    { icon: DataIcon, title: "Data", navigateTo: "DataScreen" },
    { icon: TvIcon, title: "TV", isComingSoon: true },
    {
      icon: ElectricityIcon,
      title: "Electricity",
      isComingSoon: true,
    },
  ];

  return (
    <View className="mt-4">
      <BoldText color="black" size="medium">
        Quick Action
      </BoldText>
      <View className="flex-row items-center justify-between mt-4 mb-2">
        {actionItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              item.navigateTo && navigation.navigate(item.navigateTo)
            }
            style={[
              styles.card,
              item.isComingSoon && styles.disabledCard,
              { width: cardWidth, height: cardHeight },
            ]}
          >
            <item.icon fill={fill} width={24} height={24} />
            {item.isComingSoon && (
              <View style={styles.badgeContainer}>
                <RegularText color="black" size="xsmall" center>
                  Coming Soon!
                </RegularText>
              </View>
            )}
            <RegularText
              color={item.isComingSoon ? "mediumGrey" : "black"}
              marginTop={8}
              size="base"
            >
              {item.title}
            </RegularText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default QuickAction;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    position: "relative",
  },
  disabledCard: {
    opacity: 0.5,
  },
  badgeContainer: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: COLORS.violet200,
    padding: 3,
    borderRadius: 10
  },
});
