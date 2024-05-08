import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../config/colors";
import SPACING from "../config/SPACING";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const { height: screenHeight } = Dimensions.get("window");

const WelcomeScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.animationContainer}>
        <LottieView
          source={require("../assets/animation/welcome-1.json")}
          autoPlay
          loop
          style={styles.welcomeAnimation}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.headText}>Welcome to RahaPay!</Text>
        <Text style={styles.subText}>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas
          temporibus pariatur aut debitis deserunt et?
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("CreateAccountScreen")}
          style={styles.createAccountButton}
        >
          <Text style={styles.createAccountText}>Create an Account</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate("LoginScreen")}
          style={styles.loginButton}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeAnimation: {
    width: 500,
    height: 500,
  },
  textContainer: {
    paddingHorizontal: SPACING,
    marginBottom: SPACING * 3,
  },
  headText: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(28),
    marginBottom: SPACING,
    textAlign: "center",
  },
  subText: {
    fontFamily: "Outfit-Regular",
    textAlign: "center",
  },
  buttonContainer: {
    paddingHorizontal: SPACING,
    marginBottom: SPACING,
  },
  createAccountButton: {
    paddingVertical: SPACING * 1.8,
    backgroundColor: COLORS.violet400,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING,
  },
  createAccountText: {
    fontFamily: "Outfit-Regular",
    color: "#fff",
    fontSize: RFValue(14),
  },
  loginButton: {
    paddingVertical: SPACING * 1.8,
    borderWidth: 1,
    borderColor: COLORS.violet400,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING,
  },
  loginText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(14),
  },
});
