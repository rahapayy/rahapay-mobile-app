import React, { FC, useRef, useState } from "react";
import { View, StyleSheet, FlatList, Animated, ViewToken } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import slides from "../../slides";
import OnboardingItem from "./OnboadingItem";
import Paginator from "./Paginator";
import NextButton from "./NextButton";
import { setItem } from "../../utils/ayncStorage";

interface Slide {
  id: string;
  title: string;
  description: string;
  image: any;
}

const Onboarding: React.FC<{
  navigation: NativeStackNavigationProp<any, "WelcomeScreen">;
}> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollx = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList<Slide> | null>(null);

  const scrollTo = async () => {
    if (currentIndex < slides.length - 1 && slidesRef.current) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await setItem("onboarded", "1");
      navigation.navigate("WelcomeScreen");
    }
  };

  const viewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (
        viewableItems &&
        viewableItems.length > 0 &&
        viewableItems[0].index !== null
      ) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <View style={styles.container}>
      <View style={{ flex: 3 }}>
        <FlatList
          data={slides}
          renderItem={({ item }) => <OnboardingItem item={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollx } } }],
            {
              useNativeDriver: false,
            }
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>

      <Paginator data={slides} scrollx={scrollx} />
      <NextButton scrollTo={scrollTo} />
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    alignItems: "center",
    justifyContent: "center",
  },
});
