import { SafeAreaView, View } from "react-native";
import React from "react";
import ComingSoon from "../assets/svg/Coming Soon.svg";
import { MediumText, RegularText } from "../components/common/Text";

const CardsScreen = () => {
  return (
    <SafeAreaView className="flex-1">
      <View className="p-4">
        <MediumText color="black" size="large">
          Create Virtual Card
        </MediumText>
      </View>

      <View className="flex-1 justify-center items-center p-4 mb-14">
        <ComingSoon />
        <RegularText color="black" size="base" center>
          We are creating something amazing. Stay tuned!
        </RegularText>
      </View>
    </SafeAreaView>
  );
};

export default CardsScreen;
