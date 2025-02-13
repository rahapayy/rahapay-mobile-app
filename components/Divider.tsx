import { View, Text } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

type DividerProps = {
  length: number;
};

const Divider = ({ length }: DividerProps) => {
  return <View style={{ marginVertical: hp(length) }} />;
};

export default Divider;
