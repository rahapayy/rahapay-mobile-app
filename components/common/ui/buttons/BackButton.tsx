import React from "react";
import { TouchableOpacity } from "react-native";
import { ArrowLeft } from "iconsax-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Define a generic type for the navigation prop with both StackParamList and RouteName
interface BackButtonProps<
  StackParamList extends Record<string, object | undefined>,
  RouteName extends keyof StackParamList
> {
  navigation: NativeStackNavigationProp<StackParamList, RouteName>;
  color?: string;
  onPress?: () => void | Promise<void>;
}

const BackButton = <
  StackParamList extends Record<string, object | undefined>,
  RouteName extends keyof StackParamList
>({
  navigation,
  color = "#000",
  onPress,
}: BackButtonProps<StackParamList, RouteName>) => {
  return (
    <TouchableOpacity onPress={onPress ? onPress : () => navigation.goBack()}>
      <ArrowLeft color={color} size={32} />
    </TouchableOpacity>
  );
};

export default BackButton;
