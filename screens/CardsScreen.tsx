import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import FONT_SIZE from "../config/font-size";

const CardsScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View className="p-6">
          <Text style={styles.headText}>Create Virtual Card</Text>
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
});
