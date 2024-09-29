import React, { FC, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  useWindowDimensions,
  SafeAreaView,
} from "react-native";
import COLORS from "../../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";

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
  const bottomPosition = height * 0 - 10;

  return (
    <SafeAreaView style={styles.contain}>
      <View style={[styles.container, { width, bottom: bottomPosition }]}>
        <Image
          source={item.image}
          style={[styles.image, { width, resizeMode: "contain" }]}
        />
        <View style={{ flex: 0.2 }}>
          <Text style={[styles.title]}>{item.title}</Text>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={[styles.description]}>{item.description}</Text>
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
    flex: 0.5,
    justifyContent: "center",
  },
  title: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(28),
    marginBottom: 10,
    color: "#000",
    textAlign: "center",
    marginTop: 16,
  },
  description: {
    fontFamily: "Outfit-Regular",
    color: "#6A737D",
    textAlign: "center",
    fontSize: RFValue(14),
    width: 300,
  },
});
