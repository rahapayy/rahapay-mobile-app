import { StyleSheet } from "react-native";
import React, { useContext } from "react";
import Card from "../components/wallet/Card";
import QuickAction from "../components/QuickAction";
import RecentTransaction from "../components/RecentServiceTransaction";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthContext } from "../services/AuthContext";
import RefreshSpinner from "../components/RefreshSpinner";
import { ScrollView } from "react-native-gesture-handler";

const HomeScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { userInfo } = useContext(AuthContext);
  // console.log(userInfo);

  return (
    <>
      <Card navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <QuickAction navigation={navigation} />
        <RecentTransaction navigation={navigation} />
      </ScrollView>
    </>
  );
};

export default HomeScreen;
