import React from "react";
import { TouchableOpacity } from "react-native";
import { ArrowLeft } from "iconsax-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Define a generic type for the navigation prop
interface BackButtonProps<
  StackParamList extends Record<string, object | undefined>
> {
  navigation: NativeStackNavigationProp<StackParamList>;
  color?: string;
}

const BackButton = <StackParamList extends Record<string, object | undefined>>({
  navigation,
  color = "#000",
}: BackButtonProps<StackParamList>) => {
  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <ArrowLeft color={color} size={24} />
    </TouchableOpacity>
  );
};

export default BackButton;
