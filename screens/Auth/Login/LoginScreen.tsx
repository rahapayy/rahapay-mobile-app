import {
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
import { ArrowLeft, Eye, EyeSlash } from "iconsax-react-native";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../../../config/colors";
import SPACING from "../../../config/SPACING";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Button from "../../../components/Button";
import FONT_SIZE from "../../../config/font-size";

const LoginScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [showBalance, setShowBalance] = useState(true);

  const toggleBalanceVisibility = () => setShowBalance((prev) => !prev);

  const handleLogin = () => {
    navigation.navigate("HomeScreen");
  };

  const handleButtonClick = () => {
    navigation.navigate("CreateAccountScreen");
  };

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft color="#000" />
          </TouchableOpacity>

          <View className="mt-4">
            <Text style={styles.headText}>Log in</Text>
            <Text style={styles.subText}>
              Welcome back, let’s sign in to your account!
            </Text>
          </View>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? -50 : 0}
          >
            <View className="mt-10">
              <Text style={styles.label}>Email or Phone Number</Text>
              <TextInput
                style={styles.textInput}
                placeholder="First & Last name"
                placeholderTextColor={"#DFDFDF"}
              />
            </View>

            <View className="mt-4">
              <Text style={styles.label}>Password</Text>
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
              onPress={() => navigation.navigate("ResetPasswordScreen")}
              className="mt-4"
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              title={"Log in"}
              onPress={handleLogin}
              style={styles.proceedButton}
            />
            <Button
              title={"Create another account"}
              onPress={handleButtonClick}
              style={{
                backgroundColor: COLORS.violet200,
                marginTop: SPACING * 2,
              }}
            />
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

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
    marginTop: SPACING * 4,
  },
  proceedButtonText: {
    fontFamily: "Outfit-Regular",
    color: "#fff",
    fontSize: RFValue(16),
  },
  forgotPasswordText: {
    fontFamily: "Outfit-Regular",
    color: COLORS.violet600,
    fontSize: FONT_SIZE.medium,
  },
});
