import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/RootStackParams";

type EducationDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "EducationDetailsScreen"
>;

const EducationDetailsScreen: React.FC<EducationDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const { exam, plan_id, amount, serviceType } = route.params;

  return (
    <View>
      <Text>EducationDetailsScreen</Text>
    </View>
  );
};

export default EducationDetailsScreen;

const styles = StyleSheet.create({});
