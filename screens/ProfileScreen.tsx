import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import FONT_SIZE from "../config/font-size";

const ProfileScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View className="p-4">
          <Text style={styles.headText}>Profile</Text>

          <View className="w-full bg-white p-4 rounded-lg mt-6">
            <Image
              source={require("../assets/images/avatar.png")}
              style={styles.avatar}
            />
            <Text>John Doe</Text>
            <Text>johndoe11@rahapay.com</Text>
          </View>
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
  avatar: {
    width: 50,
    height: 50,
    marginRight: 8,
  },
});
