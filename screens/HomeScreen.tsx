import { StyleSheet } from "react-native";
import React from "react";
import Card from "../components/Card";
import QuickAction from "../components/QuickAction";
import RecentTransaction from "../components/RecentTransaction";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const HomeScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  return (
    <>
      <Card />
      <QuickAction navigation={navigation} />
      <RecentTransaction />
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
