import { View, Text, ImageBackground } from "react-native";
import React from "react";
import { SemiBoldText } from "../common/Text";
import Button from "../common/ui/buttons/Button";
import { SPACING } from "../../constants/ui";
import AtIcon from "../../assets/svg/@ at the rate 1.svg";

const Banner = () => {
  return (
    <View className="py-6">
      <View className="rounded-lg overflow-hidden">
        <ImageBackground
          source={require("../../assets/images/bg.png")}
          className="p-4"
          resizeMode="cover"
        >
          <View className="">
            <SemiBoldText color="white" size="base">
              Create a tag to personalize your account to invite others and earn
              rewards!
            </SemiBoldText>
          </View>

          <Button
            textColor="black"
            title="Create tag"
            style={{
              backgroundColor: "white",
              width: 150,
              height: 38,
              marginTop: SPACING * 2,
            }}
          />
          <View className="absolute right-0 bottom-0">
            <AtIcon />
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

export default Banner;
