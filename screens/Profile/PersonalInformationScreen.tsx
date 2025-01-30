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
import React, { useContext, useState, useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, Copy, Edit2 } from "iconsax-react-native";
import SPACING from "../../constants/SPACING";
import FONT_SIZE from "../../constants/font-size";
import COLORS from "../../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import Button from "../../components/common/ui/buttons/Button";
// import { AuthContext } from "../../context/AuthContext";
import useApi from "../../utils/api";
import { handleShowFlash } from "../../components/FlashMessageComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { BoldText, LightText, MediumText } from "../../components/common/Text";
import useWallet from "../../hooks/use-wallet";
import * as Clipboard from "expo-clipboard";
import { AuthContext } from "../../services/AuthContext";

const PersonalInformationScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { userDetails, fetchUserDetails } = useContext(AuthContext);
  const { account } = useWallet();
  const fullName = userDetails?.fullName || "";
  const initials = fullName
    .split(" ")
    .map((n: any[]) => n[0])
    .join("")
    .toUpperCase();
  const { mutateAsync: updateUser, isLoading } = useApi.patch(
    "/user/update/profile"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    fullName: userDetails?.fullName,
    phone: userDetails?.phoneNumber,
    email: userDetails?.email,
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      AsyncStorage.getItem("access_token").then((token) => {
        if (token) {
          fetchUserDetails(token);
        }
      });
    });

    return unsubscribe;
  }, [navigation, fetchUserDetails]);

  useEffect(() => {
    setFormValues({
      fullName: userDetails?.fullName,
      phone: userDetails?.phoneNumber,
      email: userDetails?.email,
    });
  }, [userDetails]);

  function handleInputChange(value: string, fieldKey: keyof typeof formValues) {
    setFormValues({ ...formValues, [fieldKey]: value });
  }

  function handleEditToggle() {
    if (isEditing) {
      handleSaveChanges();
    } else {
      setIsEditing(true);
    }
  }

  async function handleSaveChanges() {
    try {
      await updateUser({
        fullName: formValues.fullName,
        phoneNumber: formValues.phone,
        email: formValues.email,
      });
      handleShowFlash({
        message: "Profile updated successfully!",
        type: "success",
      });
      setIsEditing(false);
      const token = await AsyncStorage.getItem("access_token");
      if (token) {
        await fetchUserDetails(token);
      }
    } catch (error) {
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
    }
  }

  const copyToClipboard = async (textToCopy: string) => {
    await Clipboard.setStringAsync(textToCopy);
    handleShowFlash({
      message: "Copied to clipboard!",
      type: "success",
    });
  };

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
            <TouchableOpacity
              onPress={handleEditToggle}
              style={styles.editIcon}
            >
              {isEditing ? (
                <BoldText color="primary" size="small">
                  Save
                </BoldText>
              ) : (
                <Edit2 color={COLORS.violet400} size={24} />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View className="p-4 flex-row justify-between items-center">
          <View style={styles.avatar}>
            <BoldText color="white">{initials}</BoldText>
          </View>
          <View>
            <BoldText color="dark" size="large" right>
              {userDetails.fullName}
            </BoldText>
            <LightText color="light" size="base">
              {userDetails.email}
            </LightText>
          </View>
        </View>

        <View className="p-4 mt-6">
          <BoldText color="dark" size="small">
            PERSONAL INFORMATION
          </BoldText>

          <View className="mt-4 bg-white p-4 rounded-lg">
            <View className="flex-row justify-between items-center mb-6">
              <LightText color="light" size="small">
                First Name
              </LightText>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={formValues.fullName.split(" ")[0]}
                  onChangeText={(value) =>
                    handleInputChange(
                      `${value} ${formValues.fullName.split(" ")[1]}`,
                      "fullName"
                    )
                  }
                />
              ) : (
                <MediumText color="dark" size="base">
                  {userDetails.fullName.split(" ")[0]}
                </MediumText>
              )}
            </View>
            <View className="flex-row justify-between items-center mb-6">
              <LightText color="light" size="small">
                Last Name
              </LightText>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={formValues.fullName.split(" ")[1]}
                  onChangeText={(value) =>
                    handleInputChange(
                      `${formValues.fullName.split(" ")[0]} ${value}`,
                      "fullName"
                    )
                  }
                />
              ) : (
                <MediumText color="dark" size="base">
                  {userDetails.fullName.split(" ")[1]}
                </MediumText>
              )}
            </View>
            {userDetails.userName && (
              <View className="flex-row justify-between items-center mb-6">
                <LightText color="light" size="small">
                  RahaPay Tag
                </LightText>
                <View className="flex-row items-center">
                  <MediumText color="dark" size="medium">
                    {userDetails.userName}
                  </MediumText>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(userDetails.userName)}
                    style={{ marginLeft: 8 }}
                  >
                    <Copy color={COLORS.violet400} size={20} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            <View className="flex-row justify-between items-center mb-6">
              <LightText color="light" size="small">
                Phone Number
              </LightText>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={formValues.phone}
                  onChangeText={(value) => handleInputChange(value, "phone")}
                  keyboardType="phone-pad"
                />
              ) : (
                <MediumText color="dark" size="base">
                  {userDetails.phoneNumber}
                </MediumText>
              )}
            </View>
            <View className="flex-row justify-between items-center">
              <LightText color="light" size="small">
                RahaPay Account Number
              </LightText>
              <View className="flex-row items-center">
                <MediumText color="dark" size="base">
                  {account.accountNumber}
                </MediumText>
                <TouchableOpacity
                  onPress={() => copyToClipboard(account.accountNumber)}
                  style={{ marginLeft: 8 }}
                >
                  <Copy color={COLORS.violet400} size={20} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {userDetails.userName ? (
            <>
              <View className="mt-4">
                <BoldText color="dark" size="small">
                  RAHAPAY TAG
                </BoldText>
              </View>
              <View className="mt-4 bg-white p-4 rounded-lg">
                <MediumText color="dark" size="medium">
                  Your RahaPay Tag
                </MediumText>
                <View className="mb-2" />
                <LightText color="light" size="small">
                  Your RahaPay Tag enables easy transactions. Share to receive
                  payments.
                </LightText>
                <Button
                  title="Edit RahaPay Tag"
                  onPress={() => {
                    navigation.navigate("EditTagScreen");
                  }}
                  style={{
                    width: "60%",
                    alignSelf: "center",
                    marginTop: 20,
                  }}
                  textColor="#fff"
                />
              </View>
            </>
          ) : (
            <>
              <View className="mt-4">
                <BoldText color="dark" size="small">
                  RAHAPAY TAG
                </BoldText>
              </View>
              <View className="mt-4 bg-white p-4 rounded-lg">
                <MediumText color="dark" size="medium">
                  Your RahaPay Tag
                </MediumText>
                <View className="mb-2" />
                <LightText color="light" size="small">
                  Your RahaPay Tag enables easy transactions. Share to receive
                  payments.
                </LightText>
                <Button
                  title="Create RahaPay Tag"
                  onPress={() => {
                    navigation.navigate("CreateTagScreen");
                  }}
                  style={{
                    width: "60%",
                    alignSelf: "center",
                    marginTop: 20,
                  }}
                  textColor="#fff"
                />
              </View>
            </>
          )}
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
    justifyContent: "space-between",
    paddingHorizontal: SPACING * 2,
    paddingTop: Platform.OS === "ios" ? SPACING * 2 : SPACING * 2,
    paddingBottom: SPACING * 3,
  },
  leftIcon: {
    marginRight: SPACING,
  },
  editIcon: {
    padding: SPACING,
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: COLORS.violet300,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  avatarText: {
    fontFamily: "Outfit-SemiBold",
    color: "#fff",
    fontSize: RFValue(14),
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.violet200,
    borderRadius: 5,
    padding: 5,
    fontSize: RFValue(12),
    fontFamily: "Outfit-Regular",
    // color: COLORS.dark,
  },
});

{
  /* <View className="justify-center items-center gap-4 mt-4">
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.nameText} allowFontScaling={false}>
            {userDetails.fullName}
          </Text>
          <Text style={styles.nameText} allowFontScaling={false}>
            {userDetails.email}
          </Text>
        </View> */
}

{
  /* <View className="p-4">
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
        </View> */
}
