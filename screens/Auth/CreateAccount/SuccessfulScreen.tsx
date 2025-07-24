import { SafeAreaView, StyleSheet, View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import Button from "../../../components/common/ui/buttons/Button";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import FONT_SIZE from "../../../constants/font-size";
import SPACING from "../../../constants/SPACING";
import { MediumText, LightText } from "../../../components/common/Text";
import { useAuth } from "@/services/AuthContext";
import { services } from "@/services";
import { handleShowFlash } from "@/components/FlashMessageComponent";
import { removeItem, getItem, setItem } from "@/utils/storage";

const SuccessfulScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
  route: any;
}> = ({ navigation, route }) => {
  const {
    setIsAuthenticated,
    setUserInfo,
    isLoading,
    setIsLoading,
    setIsFreshLogin,
  } = useAuth();

  const handleCompletion = async () => {
    try {
      setIsLoading(true);

      // Clear lock-related storage to prevent lock screen
      await Promise.all([
        removeItem("IS_LOCKED"),
        removeItem("SECURITY_LOCK"),
        removeItem("BACKGROUND_TIMESTAMP"),
        removeItem("WAS_TERMINATED"),
        removeItem("LOCK_TIMESTAMP"),
      ]);
      console.log("Cleared lock-related storage in SuccessfulScreen");

      // Verify tokens exist
      const accessToken = await getItem("ACCESS_TOKEN", true);
      if (!accessToken) {
        throw new Error("No access token found after signup");
      }

      // Fetch user details and update auth state
      const userResponse = await services.authServiceToken.getUserDetails();
      setUserInfo(userResponse.data);
      setIsAuthenticated(true);
      setIsFreshLogin(true);
      console.log(
        "Signup completion successful, set isFreshLogin: true, isAuthenticated: true"
      );

      // Store the user email and user info for future use
      await Promise.all([
        setItem("LAST_USER_EMAIL", userResponse.data.email, true),
        setItem("USER_INFO", JSON.stringify(userResponse.data), true),
      ]);

      handleShowFlash({
        message: "Account setup complete! Welcome to RahaPay!",
        type: "success",
      });
    } catch (error: any) {
      console.error(error);
      console.error("Failed to fetch user details:", error);
      handleShowFlash({
        message: "Failed to complete setup. Please try again.",
        type: "danger",
      });
    } finally {
      setIsLoading(false);
    }
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
          title="Continue"
          onPress={handleCompletion}
          style={styles.button}
          textColor="#fff"
          isLoading={isLoading}
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
  animation: { width: 350, height: 350 },
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
    justifyContent: "center",
    alignItems: "center",
  },
  button: { width: "100%" },
});

export default SuccessfulScreen;
