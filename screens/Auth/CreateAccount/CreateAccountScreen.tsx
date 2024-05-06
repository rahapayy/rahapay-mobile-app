import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { AddCircle, ArrowLeft, Eye, EyeSlash } from "iconsax-react-native";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../../../config/colors";
import SPACING from "../../../config/SPACING";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const CreateAccountScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [showBalance, setShowBalance] = useState(true);

  const toggleBalanceVisibility = () => setShowBalance((prev) => !prev);
  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft color="#000" />
          </TouchableOpacity>

          <View className="mt-4">
            <Text style={styles.headText}>Create an Account</Text>
            <Text style={styles.subText}>
              Let’s set up your account in minutes
            </Text>
          </View>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? -50 : 0}
          >
            <View className="mt-10">
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="First & Last name"
                placeholderTextColor={"#DFDFDF"}
              />
            </View>
            <View className="mt-4">
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Example@email.com"
                placeholderTextColor={"#DFDFDF"}
              />
            </View>

            <View className="mt-4">
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputContainer}>
                <Image
                  source={require("../../../assets/images/flag-for-nigeria.png")}
                  alt=""
                  className="w-6 h-6"
                />
                <View>
                  <Text style={styles.numberText}> +234 </Text>
                </View>
                <View style={styles.vertical} />
                <TextInput
                  style={styles.input}
                  placeholder="8038929383"
                  placeholderTextColor="#BABFC3"
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View className="mt-4">
              <Text style={styles.label}>Create Password</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#BABFC3"
                />
                <TouchableOpacity onPress={toggleBalanceVisibility}>
                  {showBalance ? (
                    <Eye color="#000" size={20} />
                  ) : (
                    <EyeSlash color="#000" size={20} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("VerifyEmailScreen")}
              style={styles.proceedButton}
            >
              <Text style={styles.proceedButtonText}>Proceed</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateAccountScreen;

const styles = StyleSheet.create({
  headText: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(24),
    marginBottom: 10,
  },
  subText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(16),
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#DFDFDF",
    padding: 18,
  },
  label: {
    fontFamily: "Outfit-Regular",
    marginBottom: 10,
    fontSize: RFValue(14),
  },
  vertical: {
    backgroundColor: COLORS.black100,
    width: 1,
    height: "100%",
    marginHorizontal: SPACING,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: RFValue(14),
    borderRadius: 10,
    padding: 18,
    width: "100%",
    borderWidth: 1,
    borderColor: "#DFDFDF",
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: RFValue(14),
  },
  numberText: {
    fontFamily: "Outfit-Regular",
  },
  proceedButton: {
    backgroundColor: COLORS.violet400,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING * 4,
  },
  proceedButtonText: {
    fontFamily: "Outfit-Regular",
    color: "#fff",
    fontSize: RFValue(16),
  },
});
