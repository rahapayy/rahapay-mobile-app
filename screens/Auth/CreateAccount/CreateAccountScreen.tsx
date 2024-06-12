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
import { ArrowLeft, Eye, EyeSlash } from "iconsax-react-native";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../../../config/colors";
import SPACING from "../../../config/SPACING";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Button from "../../../components/Button";
import useApi from "../../../utils/api";
import { AuthContext } from "../../../context/AuthContext";
import { handleShowFlash } from "../../../components/FlashMessageComponent";

const CreateAccountScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [fullName, setfullName] = useState("");
  const [email, setemail] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [password, setpassword] = useState("");
  const [showBalance, setShowBalance] = useState(true);

  // Create a boolean that checks if all fields have been entered
  const isFormComplete = fullName && email && phoneNumber && password;

  const toggleBalanceVisibility = () => setShowBalance((prev) => !prev);

  const handleButtonClick = () => {
    navigation.navigate("VerifyEmailScreen");
  };
  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft color="#000" />
          </TouchableOpacity>

          <View className="mt-4">
            <Text style={styles.headText} allowFontScaling={false}>
              Create an Account
            </Text>
            <Text style={styles.subText} allowFontScaling={false}>
              Let’s set up your account in minutes
            </Text>
          </View>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? -50 : 0}
          >
            <View className="mt-10">
              <Text style={styles.label} allowFontScaling={false}>
                Full Name
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="First & Last name"
                allowFontScaling={false}
                placeholderTextColor={"#DFDFDF"}
                value={fullName}
                onChangeText={setfullName}
              />
            </View>
            <View className="mt-4">
              <Text style={styles.label} allowFontScaling={false}>
                Email Address
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Example@email.com"
                placeholderTextColor={"#DFDFDF"}
                allowFontScaling={false}
                value={email}
                onChangeText={setemail}
              />
            </View>

            <View className="mt-4">
              <Text style={styles.label} allowFontScaling={false}>
                Phone Number
              </Text>
              <View style={styles.inputContainer}>
                <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <Image
                    source={require("../../../assets/images/flag-for-nigeria.png")}
                    alt=""
                    className="w-6 h-6"
                  />
                  <View>
                    <Text style={styles.numberText} allowFontScaling={false}>
                      {" "}
                      +234{" "}
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.vertical} />
                <TextInput
                  style={styles.input}
                  placeholder="8038929383"
                  placeholderTextColor="#BABFC3"
                  keyboardType="numeric"
                  allowFontScaling={false}
                  value={phoneNumber}
                  onChangeText={setphoneNumber}
                />
              </View>
            </View>
            <View className="mt-4">
              <Text style={styles.label} allowFontScaling={false}>
                Create Password
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#BABFC3"
                  allowFontScaling={false}
                  value={password}
                  onChangeText={setpassword}
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
            <Button
              title={"Proceed"}
              onPress={handleButtonClick}
              style={[
                styles.proceedButton,
                // If the form is not complete, add styles.proceedButtonDisabled
                !isFormComplete && styles.proceedButtonDisabled,
              ]}
              textColor="#fff"
              disabled={!isFormComplete} // Disable the button if the form is incomplete
            />
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
    fontSize: RFValue(20),
    marginBottom: 10,
  },
  subText: {
    fontFamily: "Outfit-ExtraLight",
    fontSize: RFValue(13),
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
    fontSize: RFValue(12),
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
    fontSize: RFValue(12),
    borderRadius: 10,
    padding: 18,
    width: "100%",
    borderWidth: 1,
    borderColor: "#DFDFDF",
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: RFValue(12),
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
  proceedButtonDisabled: {
    backgroundColor: COLORS.violet200,
  },
});
