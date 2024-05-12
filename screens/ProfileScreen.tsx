import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import FONT_SIZE from "../config/font-size";

const ProfileScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View className="p-6">
          <Text style={styles.headText}>Profile</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  headText: {
    fontFamily: "Outfit-Regular",
    fontSize: FONT_SIZE.large,
  },
});
