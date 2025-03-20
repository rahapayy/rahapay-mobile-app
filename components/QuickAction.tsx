import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import React from "react";
import COLORS from "../constants/colors";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  AirtimeIcon,
  DataIcon,
  ElectricityIcon,
  TvIcon,
} from "./common/ui/icons";
import { BoldText, RegularText } from "./common/Text";
import { useAuth } from "../services/AuthContext";

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
  const { isLoading } = useAuth();

  // Set a fixed card size to maintain consistency across screens
  const cardSize = Math.min((screenWidth - 64) / 4, 100);
  const fill = COLORS.violet300;

  const actionItems = [
    { icon: AirtimeIcon, title: "Airtime", navigateTo: "AirtimeScreen" },
    { icon: DataIcon, title: "Data", navigateTo: "DataScreen" },
    { icon: TvIcon, title: "TV", navigateTo: "TvSubscriptionScreen" },
    {
      icon: ElectricityIcon,
      title: "Electricity",
      isComingSoon: true,
    },
  ];
  // const actionItems = [
  //   { icon: AirtimeIcon, title: "Airtime", navigateTo: "AirtimeScreen" },
  //   { icon: DataIcon, title: "Data", navigateTo: "DataScreen" },
  //   { icon: TvIcon, title: "TV", navigatTo: true },
  //   {
  //     icon: ElectricityIcon,
  //     title: "Electricity",
  //     isComingSoon: true,
  //   },
  // ];

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
            className={`bg-white justify-center items-center rounded-2xl`}
            style={{ width: cardSize, height: cardSize * 1.1 }}
          >
            <item.icon fill={fill} width={24} height={24} />
            {item.isComingSoon && (
              <View style={styles.badgeContainer}>
                <RegularText color="black" size="xsmall" center>
                  Coming Soon!
                </RegularText>
              </View>
            )}
            <RegularText color="black" marginTop={8} size="base">
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
  disabledCard: {
    opacity: 0.5,
  },
  badgeContainer: {
    position: "absolute",
    top: -10,
    right: 0,
    backgroundColor: COLORS.violet200,
    padding: 3,
    borderRadius: 10,
  },
});
