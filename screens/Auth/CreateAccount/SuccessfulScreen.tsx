import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import FONT_SIZE from "../../../config/font-size";
import SPACING from "../../../config/SPACING";
import Button from "../../../components/Button";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const SuccessfulScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const handleButtonClick = () => {
    navigation.navigate("LoginScreen");
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="p-4 mt-10 justify-center items-center">
        <LottieView
          source={require("../../../assets/animation/success.json")}
          autoPlay
          loop
          style={{ width: 300, height: 300 }}
        />
        <Text style={styles.headText} allowFontScaling={false}>
          Congratutions!
        </Text>
        <Text style={styles.subText} allowFontScaling={false}>
          Great news! Your RahaPay account has been created successfully.
        </Text>

        <Button
          title={"Continue"}
          onPress={handleButtonClick}
          className="mt-32 w-full"
        />
      </View>
    </SafeAreaView>
  );
};

export default SuccessfulScreen;

const styles = StyleSheet.create({
  headText: {
    fontFamily: "Outfit-Medium",
    fontSize: FONT_SIZE.extraLarge,
  },
  subText: {
    fontFamily: "Outfit-Regular",
    marginTop: SPACING,
    fontSize: FONT_SIZE.medium,
    textAlign: "center",
  },
});
