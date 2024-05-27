import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import COLORS from "../config/colors";
import Receipt from "../assets/svg/receipt-text.svg";
import SPACING from "../config/SPACING";
import { RFValue } from "react-native-responsive-fontsize";
import * as Animatable from "react-native-animatable";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const TransactionCompletedScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View className="mt-20 justify-center items-center">
          {/* Circle */}
          <View style={styles.circleContain}>
            <Animatable.View
              animation="pulse"
              duration={2000}
              iterationCount="infinite"
            >
              <Receipt />
            </Animatable.View>
          </View>
          <View className="items-center mt-8">
            <Text style={styles.headText} allowFontScaling={false}>
              Transaction Completed
            </Text>
            <Text style={styles.subText} allowFontScaling={false}>
              Order Has been Processed Successful{" "}
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("HomeScreen")}
            style={styles.createAccountButton}
          >
            <Text style={styles.createAccountText} allowFontScaling={false}>
              Done
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("AirtimeScreen")}
            style={styles.loginButton}
          >
            <Text style={styles.loginText} allowFontScaling={false}>
              Pay Another Bill
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TransactionCompletedScreen;

const styles = StyleSheet.create({
  circleContain: {
    backgroundColor: COLORS.violet200,
    width: 250,
    height: 250,
    borderRadius: SPACING * 15,
    justifyContent: "center",
    alignItems: "center",
  },
  headText: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(18),
  },
  subText: {
    fontFamily: "Outfit-Regular",
    color: "#ADADAD",
    fontSize: RFValue(14),
  },
  buttonContainer: {
    paddingHorizontal: SPACING,
    paddingBottom: SPACING * 2,
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
    backgroundColor: COLORS.violet200,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING,
  },
  loginText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(14),
    color: "#A07CFF",
  },
});
