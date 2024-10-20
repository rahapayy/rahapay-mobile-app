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
import COLORS from "../constants/colors";
import SPACING from "../constants/SPACING";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Button from "../components/common/ui/buttons/Button";
import { LightText, MediumText } from "../components/common/Text";

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
        <MediumText
          color="primary"
          size="xxlarge"
          center
          marginBottom={SPACING}
        >
          Welcome to RahaPay!
        </MediumText>
        <LightText color="mediumGrey" center>
          Your one-stop solution for seamless online transactions. We aim to
          make financial operations simple and efficient.
        </LightText>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={"Create an account"}
          onPress={() => navigation.navigate("CreateAccountScreen")}
          style={{
            marginBottom: 10,
          }}
          textColor="#fff"
        />
        <Button
          title={"Log In"}
          onPress={() => navigation.navigate("LoginScreen")}
          borderOnly
          textColor={COLORS.violet400}
        />
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
    paddingHorizontal: SPACING * 2,
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
    marginBottom: SPACING * 3,
    justifyContent: "center",
    alignItems: "center",
  },
});
