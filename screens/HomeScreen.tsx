import { StyleSheet } from "react-native";
import React from "react";
import Card from "../components/Card";
import QuickAction from "../components/QuickAction";
import RecentTransaction from "../components/RecentServiceTransaction";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const HomeScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
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
