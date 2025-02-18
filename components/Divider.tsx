import { View, Text } from "react-native";
import React from "react";
import { Dimensions } from 'react-native';

type DividerProps = {
  length: number;
};

const Divider = ({ length }: DividerProps) => {
  const { height } = Dimensions.get('window');
  return <View style={{ marginVertical: (height * length) / 100 }} />;
};

export default Divider;
