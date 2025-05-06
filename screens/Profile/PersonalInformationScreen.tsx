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
  ActivityIndicator,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, Copy, Edit2 } from "iconsax-react-native";
import SPACING from "../../constants/SPACING";
import FONT_SIZE from "../../constants/font-size";
import COLORS from "../../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import Button from "../../components/common/ui/buttons/Button";
import { handleShowFlash } from "../../components/FlashMessageComponent";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { BoldText, LightText, MediumText } from "../../components/common/Text";
import useWallet from "../../hooks/use-wallet";
import * as Clipboard from "expo-clipboard";
import { useAuth } from "../../services/AuthContext";
import { handleError } from "@/services/handleError";
import { useUpdateProfile } from "@/services/hooks/user";

const PersonalInformationScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { userInfo } = useAuth();
  const { account } = useWallet();
  const updateProfileMutation = useUpdateProfile();

  const fullName = userInfo?.fullName || "";
  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  const [formValues, setFormValues] = useState({
    fullName: userInfo?.fullName || "",
    phone: userInfo?.phoneNumber || "",
    email: userInfo?.email || "",
  });
  const [isEditing, setIsEditing] = useState(false);

  function handleInputChange(value: string, fieldKey: keyof typeof formValues) {
    setFormValues({ ...formValues, [fieldKey]: value });
  }

  async function handleSaveChanges() {
    if (!formValues.fullName || !formValues.phone || !formValues.email) {
      handleShowFlash({
        message: "Please fill all required fields",
        type: "warning",
      });
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        fullName: formValues.fullName,
        phoneNumber: formValues.phone,
        email: formValues.email,
      });

      handleShowFlash({
        message: "Profile updated successfully!",
        type: "success",
      });
      setIsEditing(false);
    } catch (error) {
      const errorMessage = handleError(error);
      handleShowFlash({
        message: errorMessage,
        type: "danger",
      });
    }
  }

  // Sync form with latest user info
  useEffect(() => {
    setFormValues({
      fullName: userInfo?.fullName || "",
      phone: userInfo?.phoneNumber || "",
      email: userInfo?.email || "",
    });
  }, [userInfo]);

  function handleEditToggle() {
    if (isEditing) {
      handleSaveChanges();
    } else {
      setIsEditing(true);
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
              disabled={updateProfileMutation.isPending}
            >
              {isEditing ? (
                <View style={styles.saveButton}>
                  {updateProfileMutation.isPending ? (
                    <ActivityIndicator color={COLORS.violet400} size="small" />
                  ) : (
                    <BoldText color="primary" size="small">
                      Save
                    </BoldText>
                  )}
                </View>
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
            <View style={{ alignSelf: "flex-end" }}>
              <BoldText color="dark" size="large">
                {userInfo?.fullName}
              </BoldText>
            </View>
            <LightText color="light" size="base">
              {userInfo?.email}
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
                Full Name
              </LightText>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={formValues.fullName}
                  onChangeText={(value) => handleInputChange(value, "fullName")}
                />
              ) : (
                <MediumText color="dark" size="base">
                  {userInfo?.fullName}
                </MediumText>
              )}
            </View>
            {userInfo?.userName && (
              <View className="flex-row justify-between items-center mb-6">
                <LightText color="light" size="small">
                  RahaPay Tag
                </LightText>
                <View className="flex-row items-center">
                  <MediumText color="dark" size="medium">
                    {userInfo?.userName}
                  </MediumText>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(userInfo?.userName)}
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
                  {userInfo?.phoneNumber}
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

          {userInfo?.userName ? (
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
  saveButton: {
    minWidth: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
