import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import Button from "../../../components/common/ui/buttons/Button";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import FONT_SIZE from "../../../constants/font-size";
import SPACING from "../../../constants/SPACING";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  MediumText,
  LightText,
} from "../../../components/common/Text";
import { useAuth } from "@/services/AuthContext";

const SuccessfulScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { setIsAuthenticated, userInfo } = useAuth();
  const handleButtonClick = async () => {
    // Set user as authenticated
    await setIsAuthenticated(true);

    // Store user info and access token in AsyncStorage
    await AsyncStorage.multiSet([
      ["userInfo", JSON.stringify(userInfo)],
      ["access_token", userInfo?.accessToken || ""],
    ]);

   
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View className="mt-20 flex-1">
          <LottieView
            source={require("../../../assets/animation/success.json")}
            autoPlay
            loop
            style={styles.animation}
          />
        </View>
      </View>
      <View className="justify-center items-center mb-12">
        <MediumText color="black" size="xlarge" marginBottom={15}>
          Congratulations!
        </MediumText>
        <LightText color="mediumGrey" center>
          Great news! Your RahaPay account has been created successfully.
        </LightText>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={"Continue"}
          onPress={handleButtonClick}
          style={styles.button}
          textColor="#fff"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  animation: {
    width: 350,
    height: 350,
  },
  headText: {
    fontFamily: "Outfit-Medium",
    fontSize: FONT_SIZE.extraLarge,
    marginTop: 16,
    textAlign: "center",
  },
  subText: {
    fontFamily: "Outfit-ExtraLight",
    fontSize: FONT_SIZE.medium,
    marginTop: 8,
    textAlign: "center",
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: SPACING * 4,
  },
  button: {
    width: "100%",
  },
});

export default SuccessfulScreen;
