import { StyleSheet, View } from "react-native";
import React, { useContext } from "react";
import Card from "../components/wallet/Card";
import QuickAction from "../components/QuickAction";
import RecentTransaction from "../components/RecentServiceTransaction";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../services/AuthContext";
import { ScrollView } from "react-native-gesture-handler";
import Banner from "../components/Banner";
import { GLOBAL_PADDING_HORIZONTAL } from "../constants/ui";
import SPACING from "@/constants/SPACING";

const HomeScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { userInfo } = useAuth();
  // console.log(userInfo);

  return (
    <>
      <Card navigation={navigation} />
      <View
        style={{
          paddingHorizontal: GLOBAL_PADDING_HORIZONTAL,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <QuickAction navigation={navigation} />
          <Banner navigation={navigation} />
          <RecentTransaction navigation={navigation} />
        </ScrollView>
      </View>
    </>
  );
};

export default HomeScreen;
