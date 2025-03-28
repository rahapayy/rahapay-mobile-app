import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SPACING from "../../constants/SPACING";
import FONT_SIZE from "../../constants/font-size";
import COLORS from "../../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import Button from "../../components/common/ui/buttons/Button";
import { handleShowFlash } from "../../components/FlashMessageComponent";
import { services } from "@/services";
import { BasicPasswordInput } from "@/components/common/ui/forms/BasicPasswordInput";
import BackButton from "@/components/common/ui/buttons/BackButton";
import { RegularText } from "@/components/common/Text";
import Label from "@/components/common/ui/forms/Label";

const ChangePasswordScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const [formValues, setFormValues] = useState({
    currPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  function handleInputChange(value: string, fieldKey: keyof typeof formValues) {
    setFormValues({ ...formValues, [fieldKey]: value });
  }

  async function handleButtonClick() {
    if (formValues.newPassword !== formValues.confirmPassword) {
      handleShowFlash({
        message: "New password must match confirmation password",
        type: "danger",
      });
    } else {
      setIsLoading(true); // Start loading
      try {
        const data = await services.userService
          .updateCredentials({
            type: "password",
            current: formValues.currPassword,
            new: formValues.newPassword,
          })
          .then(() => {
            handleShowFlash({
              message: "Password updated successfully!",
              type: "success",
            });
            navigation.goBack();
          })
          .catch((error) => {
            // Handle error without showing the error message to the user
            console.error("Failed to update password:", error.message);
            handleShowFlash({
              message: "Failed to update password. Please try again.",
              type: "danger",
            });
          });
      } catch (error: any) {
        // Handle error without showing the error message to the user
        console.error("Failed to update password:", error.message);
        handleShowFlash({
          message: "Failed to update password. Please try again.",
          type: "danger",
        });
      } finally {
        setIsLoading(false); // Stop loading
      }
    }
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View className="px-4">
          <View style={styles.header}>
            <BackButton navigation={navigation} />
            <RegularText color="black" size="large">
              Change Password
            </RegularText>
          </View>

          <View>
            <View>
              <Label text="Current Password" marked={false} />
              <BasicPasswordInput
                style={styles.input}
                placeholder="Password"
                value={formValues.currPassword}
                onChangeText={(value) =>
                  handleInputChange(value, "currPassword")
                }
              />
            </View>
            <View className="mt-4">
              <Label text="New Password" marked={false} />
              <BasicPasswordInput
                style={styles.input}
                placeholder="Password"
                value={formValues.newPassword}
                onChangeText={(value) =>
                  handleInputChange(value, "newPassword")
                }
              />
            </View>
            <View className="mt-4">
              <Label text="Confirm Password" marked={false} />

              <BasicPasswordInput
                style={styles.input}
                placeholder="Password"
                value={formValues.confirmPassword}
                onChangeText={(value) =>
                  handleInputChange(value, "confirmPassword")
                }
              />
            </View>
            <Button
              title={"Save Changes"}
              onPress={handleButtonClick}
              style={styles.proceedButton}
              isLoading={isLoading} // Use isLoading state to manage button loading
              disabled={
                !formValues.confirmPassword ||
                !formValues.newPassword ||
                !formValues.currPassword ||
                isLoading // Disable button while loading
              }
              textColor="#fff"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? SPACING * 2 : SPACING * 2,
    paddingBottom: SPACING * 3,
    gap: 4,
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
  label: {
    fontFamily: "Outfit-Regular",
    marginBottom: 10,
    fontSize: RFValue(12),
  },
  proceedButton: {
    marginTop: SPACING * 4,
  },
});
