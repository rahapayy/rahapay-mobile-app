import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
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
import { BoldText, RegularText } from "./common/Text";
import { AuthContext } from "../services/AuthContext";

interface ActionItem {
  icon: React.ElementType;
  title: string;
  navigateTo?: string;
}

const QuickAction: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { width: screenWidth } = useWindowDimensions();
  const { isLoading } = useContext(AuthContext);

  // Set a fixed card size to maintain consistency across screens
  const cardSize = Math.min((screenWidth - 64) / 4, 100);
  const fill = COLORS.violet300;

  const actionItems = [
    { icon: AirtimeIcon, title: "Airtime", navigateTo: "AirtimeScreen" },
    { icon: DataIcon, title: "Data", navigateTo: "DataScreen" },
    { icon: TvIcon, title: "TV", navigateTo: "TvSubscriptionScreen" },
    { icon: ElectricityIcon, title: "Electricity", navigateTo: "ElectricityScreen" },
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
            className={`bg-white justify-center items-center rounded-2xl`}
            style={{ width: cardSize, height: cardSize * 1.1 }}
          >
            <item.icon fill={fill} width={24} height={24} />
            <RegularText
              color="black"
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
