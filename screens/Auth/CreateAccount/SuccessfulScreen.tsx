import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import LottieView from "lottie-react-native";
import Button from "../../../components/Button";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import FONT_SIZE from "../../../constants/font-size";
import SPACING from "../../../constants/SPACING";
import { AuthContext } from "../../../context/AuthContext";

const SuccessfulScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { setIsUserAuthenticated } = useContext(AuthContext);
  const handleButtonClick = () => {
    // Navigate directly to the AppStack
    setIsUserAuthenticated(true);
    setTimeout(() => {
      navigation.navigate("AppStack");
    }, 0);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View className="mt-20">
          <LottieView
            source={require("../../../assets/animation/success.json")}
            autoPlay
            loop
            style={styles.animation}
          />
          <Text style={styles.headText}>Congratulations!</Text>
          <Text style={styles.subText}>
            Great news! Your RahaPay account has been created successfully.
          </Text>
        </View>
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
    width: 300,
    height: 300,
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
