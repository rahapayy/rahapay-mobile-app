import { StyleSheet } from "react-native";
import React, { useContext } from "react";
import Card from "../components/wallet/Card";
import QuickAction from "../components/QuickAction";
import RecentTransaction from "../components/RecentServiceTransaction";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthContext } from "../services/AuthContext";
import { ScrollView } from "react-native-gesture-handler";
import Banner from "../components/Banner";
import {
  GLOBAL_PADDING_BOTTOM,
  GLOBAL_PADDING_HORIZONTAL,
  SPACING,
} from "../constants/ui";

const HomeScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { userInfo } = useContext(AuthContext);
  // console.log(userInfo);

  return (
    <>
      <Card navigation={navigation} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          paddingHorizontal: GLOBAL_PADDING_HORIZONTAL,
          marginTop: SPACING,
        }}
      >
        <QuickAction navigation={navigation} />
        <Banner />
        <RecentTransaction navigation={navigation} />
      </ScrollView>
    </>
  );
};

export default HomeScreen;
