import { TouchableOpacity, Text, View } from "react-native";
import React from "react";
import { ArrowLeft } from "iconsax-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { COLORS } from "../../../../constants/ui";

export default function BackButton({
  color,
  navigation,
}: {
  color?: string;
  navigation: NativeStackNavigationProp<any, "">;
}) {
  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <View
        style={{
          // padding: 4,
          // backgroundColor: "#FFD9C7",
          // width: 35,
          // height: 35,
          // justifyContent: "center",
          // alignItems: "center",
          // borderRadius: 10,
        }}
        // className="bg-violet-200"
      >
        <ArrowLeft color={color ?? COLORS.elementary.black} size={24} />
      </View>
    </TouchableOpacity>
  );
}
