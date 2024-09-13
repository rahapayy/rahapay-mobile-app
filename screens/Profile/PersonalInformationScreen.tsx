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
import React, { useContext, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft } from "iconsax-react-native";
import SPACING from "../../config/SPACING";
import FONT_SIZE from "../../config/font-size";
import COLORS from "../../config/colors";
import { RFValue } from "react-native-responsive-fontsize";
import Button from "../../components/Button";
import { AuthContext } from "../../context/AuthContext";
import useApi from "../../utils/api";
import { handleShowFlash } from "../../components/FlashMessageComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const PersonalInformationScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { userDetails, fetchUserDetails } = useContext(AuthContext);
  const { mutateAsync: updateUser, isLoading } = useApi.patch(
    "/user/update/profile"
  );
  const [formValues, setFormValues] = useState({
    fullName: userDetails?.fullName,
    phone: userDetails?.phone,
    email: userDetails?.email,
  });

  function handleInputChange(value: string, fieldKey: keyof typeof formValues) {
    setFormValues({ ...formValues, [fieldKey]: value });
  }
  function handleButtonClick() {
    updateUser({
      fullName: formValues.fullName,
      phoneNumber: formValues.phone,
      email: formValues.email,
    })
      .then(() => {
        handleShowFlash({
          message: "Profile updated successfully!",
          type: "success",
        });
        navigation.goBack();
        AsyncStorage.getItem("access_token").then((token) => {
          if (token) {
            fetchUserDetails(token);
          }
        });
      })
      .catch((error) => {
        const err = error as {
          response?: { data?: { message?: string } };
          message: string;
        };
        const errorMessage =
          err.response?.data?.message || err.message || "An error occurred";

        handleShowFlash({
          message: errorMessage,
          type: "danger",
        });
      });
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAwareScrollView>
        <View>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.leftIcon}
            >
              <ArrowLeft color={"#000"} size={24} />
            </TouchableOpacity>
            <Text style={[styles.headerText]} allowFontScaling={false}>
              Edit Profile
            </Text>
          </View>
        </View>

        <View className="justify-center items-center gap-4 mt-4">
          <Image
            source={require("../../assets/images/avatar.png")}
            className="w-16 h-16"
          />
          <Text style={styles.nameText} allowFontScaling={false}>
            {userDetails.fullName}
          </Text>
        </View>

        <View className="p-4">
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
                onChangeText={(value) => handleInputChange(value, "fullName")}
                defaultValue={userDetails?.fullName}
              />
            </View>

            <View className="mt-4">
              <Text style={styles.label} allowFontScaling={false}>
                Phone Number
              </Text>
              <View style={styles.inputContainer}>
                <Image
                  source={require("../../assets/images/flag-for-nigeria.png")}
                  alt=""
                  className="w-6 h-6"
                />
                <View>
                  <Text style={styles.numberText} allowFontScaling={false}>
                    {" "}
                    +234{" "}
                  </Text>
                </View>
                <View style={styles.vertical} />
                <TextInput
                  style={styles.input}
                  placeholder="8038929383"
                  placeholderTextColor="#BABFC3"
                  keyboardType="numeric"
                  allowFontScaling={false}
                  onChangeText={(value) => handleInputChange(value, "phone")}
                  defaultValue={userDetails?.phoneNumber}
                />
              </View>
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
                onChangeText={(value) => handleInputChange(value, "email")}
                defaultValue={userDetails?.email}
              />
            </View>
            <Button
              title={"Save Changes"}
              onPress={handleButtonClick}
              isLoading={isLoading}
              disabled={
                userDetails?.fullName === formValues.fullName &&
                userDetails?.phone === formValues.phone &&
                userDetails?.email === formValues.email
              }
              style={styles.proceedButton}
              textColor="#fff"
            />
          </KeyboardAvoidingView>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default PersonalInformationScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING * 2,
    paddingTop: Platform.OS === "ios" ? SPACING * 2 : SPACING * 2,
    paddingBottom: SPACING * 3,
  },
  leftIcon: {
    marginRight: SPACING,
  },
  headerText: {
    color: "#000",
    fontSize: FONT_SIZE.medium,
    fontFamily: "Outfit-Regular",
    flex: 1,
  },
  headerTextDark: {
    color: COLORS.white,
  },
  headTextContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    fontSize: FONT_SIZE.medium,
    fontFamily: "Outfit-Medium",
    paddingVertical: SPACING * 2,
  },
  container: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING,
    paddingVertical: SPACING,
    borderRadius: SPACING,
    marginTop: SPACING * 4,
  },
  headText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(18),
    marginBottom: SPACING,
  },
  titleText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(16),
    paddingVertical: SPACING,
  },
  descriptionText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(14),
    color: "#9BA1A8",
  },
  completedText: {
    fontFamily: "Outfit-Regular",
    color: "#06C270",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderStyle: "dotted",
    borderColor: "#000",
    paddingVertical: SPACING,
    paddingHorizontal: SPACING * 3,
    borderRadius: 8,
    marginTop: SPACING * 2,
  },
  buttonText: {
    marginLeft: SPACING,
    color: "#000",
    fontFamily: "Outfit-Regular",
    fontSize: FONT_SIZE.medium,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#DFDFDF",
    padding: 18,
    fontSize: RFValue(12),
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
  nameText: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(14),
  },
});
