import { StyleSheet } from "react-native";
import React, { useContext } from "react";
import Card from "../components/wallet/Card";
import QuickAction from "../components/QuickAction";
import RecentTransaction from "../components/RecentServiceTransaction";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthContext } from "../services/AuthContext";

const HomeScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { userInfo } = useContext(AuthContext);
  // console.log(userInfo);
  
  return (
    <>
      <Card navigation={navigation} />
      <QuickAction navigation={navigation} />
      <RecentTransaction navigation={navigation} />
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
