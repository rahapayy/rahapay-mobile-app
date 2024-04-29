import { StyleSheet } from "react-native";
import React from "react";
import Card from "../components/Card";
import QuickAction from "../components/QuickAction";
import RecentTransaction from "../components/RecentTransaction";

const HomeScreen = () => {
  return (
    <>
      <Card />
      <QuickAction />
      <RecentTransaction />
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
