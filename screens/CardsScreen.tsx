import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import FONT_SIZE from "../config/font-size";
import ComingSoon from "../assets/svg/Coming Soon.svg";

const CardsScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View className="p-6">
          <Text style={styles.headText}>Create Virtual Card</Text>
        </View>

        <View className="justify-center items-center">
          <ComingSoon />
          <Text style={styles.comingsoonText}>
            We are creating something amazing. Stay tuned!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CardsScreen;

const styles = StyleSheet.create({
  headText: {
    fontFamily: "Outfit-Regular",
    fontSize: FONT_SIZE.large,
  },
  comingsoonText: {
    fontFamily: "Outfit-Regular",
    fontSize: FONT_SIZE.medium,
    textAlign: "center",
  },
});
