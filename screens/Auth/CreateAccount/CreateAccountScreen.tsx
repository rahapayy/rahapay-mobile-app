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
import { handleShowFlash } from "../../../components/FlashMessageComponent";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const CreateAccountScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [fullName, setfullName] = useState("");
  const [email, setemail] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [password, setpassword] = useState("");
  const [showBalance, setShowBalance] = useState(false);
  const countryCode = "+234";
  const [isLoading, setIsLoading] = useState(false);

  // Create a boolean that checks if all fields have been entered
  const isFormComplete =
    fullName && email && phoneNumber && password && countryCode;

  const toggleBalanceVisibility = () => setShowBalance((prev) => !prev);

  const handleButtonClick = async () => {
    setIsLoading(true);
    if (isFormComplete) {
      try {
        const response = await mutateAsync({
          fullName,
          email,
          phoneNumber,
          countryCode,
          password,
        });

        // handleShowFlash({
        //   message: "Account created successfully!",
        //   type: "success",
        // });

        navigation.navigate("VerifyEmailScreen", { email });
      } catch (error) {
        // Extract the message from the error response
        const err = error as {
          response?: { data?: { message?: string } };
          message: string;
        };
        const errorMessage =
          err.response?.data?.message || err.message || "An error occurred";
        console.error("API Error:", err.response?.data || err.message); // Log the full error response
        handleShowFlash({
          message: errorMessage,
          type: "danger",
        });
      } finally {
        setIsLoading(false); // Reset isLoading to false after API call
      }
    }
  };

  const { mutateAsync } = useApi.post("/auth/onboarding");
  return (
    <SafeAreaView>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === "ios" ? 20 : 0}
      >
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
            <View className="mt-4">
              <Text style={styles.label} allowFontScaling={false}>
                Referral
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Referral (Optional)"
                placeholderTextColor={"#DFDFDF"}
                allowFontScaling={false}
              />
            </View>
            <Button
              title="Proceed"
              onPress={handleButtonClick}
              isLoading={isLoading}
              style={[
                styles.proceedButton,
                // If the form is not complete, add styles.proceedButtonDisabled
                !isFormComplete && styles.proceedButtonDisabled,
              ]}
              textColor="#fff"
              disabled={!isFormComplete || isLoading} // Disable the button if the form is incomplete or if loading
            />
        </View>
      </KeyboardAwareScrollView>
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
    padding: SPACING * 1.5,
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
    padding: SPACING * 1.5,
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
