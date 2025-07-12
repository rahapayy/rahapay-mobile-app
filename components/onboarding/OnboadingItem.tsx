import React, { FC, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  useWindowDimensions,
  SafeAreaView,
} from "react-native";
import { MediumText, RegularText } from "../common/Text";

interface Slide {
  id: string;
  title: string;
  description: string;
  image: any;
}

interface OnboardingItemProps {
  item: Slide;
}

const OnboardingItem: React.FC<OnboardingItemProps> = ({ item }) => {
  const { width, height } = useWindowDimensions();
  const animation = useRef(null);
  const bottomPosition = height * 0 - 60;

  return (
    <SafeAreaView style={styles.contain}>
      <View style={[styles.container, { width, bottom: bottomPosition }]}>
        <Image
          source={item.image}
          style={[styles.image, { width, resizeMode: "contain" }]}
        />
        <View className="mt-6">
          <MediumText color="black" center size="xxlarge">
            {item.title}
          </MediumText>
          <View className="px-4">
            <RegularText color="light" size="base" center marginTop={10}>
              {item.description}
            </RegularText>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingItem;

const styles = StyleSheet.create({
  contain: {},
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 0.7,
    justifyContent: "center",
  },
});
