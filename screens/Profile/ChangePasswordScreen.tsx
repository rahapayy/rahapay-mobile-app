import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, Eye, EyeSlash } from "iconsax-react-native";
import SPACING from "../../constants/SPACING";
import FONT_SIZE from "../../constants/font-size";
import COLORS from "../../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import Button from "../../components/common/ui/buttons/Button";
import useApi from "../../services/apiClient";
import { handleShowFlash } from "../../components/FlashMessageComponent";

const ChangePasswordScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(true);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const [formValues, setFormValues] = useState({
    currPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const {
    mutateAsync: updatePassword,
    isLoading,
    error,
  } = useApi.patch("/user/update/credentials");

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
      updatePassword({
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
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View className="p-4">
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.leftIcon}
            >
              <ArrowLeft color={"#000"} size={24} />
            </TouchableOpacity>
            <Text style={[styles.headerText]} allowFontScaling={false}>
              Change Password
            </Text>
          </View>

          <View>
            <View>
              <Text style={styles.label} allowFontScaling={false}>
                Current Password
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#BABFC3"
                  allowFontScaling={false}
                  value={formValues.currPassword}
                  secureTextEntry={!showPassword}
                  onChangeText={(value) =>
                    handleInputChange(value, "currPassword")
                  }
                />
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  {showPassword ? (
                    <Eye color="#000" size={20} />
                  ) : (
                    <EyeSlash color="#000" size={20} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View className="mt-4">
              <Text style={styles.label} allowFontScaling={false}>
                New Password
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#BABFC3"
                  allowFontScaling={false}
                  secureTextEntry={!showPassword}
                  value={formValues.newPassword}
                  onChangeText={(value) =>
                    handleInputChange(value, "newPassword")
                  }
                />
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  {showPassword ? (
                    <Eye color="#000" size={20} />
                  ) : (
                    <EyeSlash color="#000" size={20} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View className="mt-4">
              <Text style={styles.label} allowFontScaling={false}>
                Confirm Password
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#BABFC3"
                  allowFontScaling={false}
                  secureTextEntry={!showPassword}
                  value={formValues.confirmPassword}
                  onChangeText={(value) =>
                    handleInputChange(value, "confirmPassword")
                  }
                />
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  {showPassword ? (
                    <Eye color="#000" size={20} />
                  ) : (
                    <EyeSlash color="#000" size={20} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <Button
              title={"Save Changes"}
              onPress={handleButtonClick}
              style={styles.proceedButton}
              isLoading={isLoading}
              disabled={
                !formValues.confirmPassword ||
                !formValues.newPassword ||
                !formValues.currPassword
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
