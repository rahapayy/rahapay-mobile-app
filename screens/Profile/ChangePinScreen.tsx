import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft } from "iconsax-react-native";
import SPACING from "../../constants/SPACING";
import FONT_SIZE from "../../constants/font-size";
import COLORS from "../../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import Button from "../../components/common/ui/buttons/Button";
import { handleShowFlash } from "../../components/FlashMessageComponent";
import { services } from "@/services";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RegularText } from "@/components/common/Text";
import Label from "@/components/common/ui/forms/Label";
import { BasicPasswordInput } from "@/components/common/ui/forms/BasicPasswordInput";
import BasicInput from "@/components/common/ui/forms/BasicInput";
// import OtpInput from "../../components/common/ui/forms/OtpInput";

const ChangePinScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const route =
    useRoute<
      RouteProp<
        { params: { type: "transactionPin" | "securityPin" } },
        "params"
      >
    >();
  const pinType = route.params.type;

  const [showPin, setShowPin] = useState(true);
  const togglePinVisibility = () => setShowPin((prev) => !prev);
  const [formValues, setFormValues] = useState({
    currPin: "",
    newPin: "",
    confirmPin: "",
  });
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state

  function handleInputChange(value: string, fieldKey: keyof typeof formValues) {
    setFormValues({ ...formValues, [fieldKey]: value });
  }

  async function handleButtonClick() {
    if (formValues.newPin !== formValues.confirmPin) {
      handleShowFlash({
        message: "New pin must match confirmation pin",
        type: "danger",
      });
    } else {
      setIsLoading(true); // Start loading
      try {
        const response = await services.userService
          .updateCredentials({
            type: pinType,
            current: formValues.currPin,
            new: formValues.newPin,
          })
          .then(() => {
            handleShowFlash({
              message: "Transaction pin changed successfully!",
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

            console.error("Failed to update pin:", errorMessage); // Log the error message
            handleShowFlash({
              message: errorMessage,
              type: "danger",
            });
          });
      } catch (error: any) {
        console.error("Failed to update pin:", error.message); // Log the error message
        handleShowFlash({
          message: "Failed to update pin. Please try again.",
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
        <View className="p-4">
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.leftIcon}
            >
              <ArrowLeft color={"#000"} size={24} />
            </TouchableOpacity>
            <RegularText color="black" size="large">
              Change {pinType === "transactionPin" ? "Transaction" : "Security"}{" "}
              Pin
            </RegularText>
          </View>

          <View className="">
            <View>
              <Label text="Current Pin" marked={false} />
              <BasicPasswordInput
                style={styles.input}
                placeholder="Enter current pin"
                value={formValues.currPin}
                onChangeText={(value) => handleInputChange(value, "currPin")}
              />
            </View>
            <View className="mt-4">
              <Label text="New Pin" marked={false} />
              <BasicPasswordInput
                style={styles.input}
                placeholder="Enter new pin"
                value={formValues.newPin}
                onChangeText={(value) => handleInputChange(value, "newPin")}
              />
            </View>
            <View className="mt-4">
              <Label text="Confirm Pin" marked={false} />
              <BasicPasswordInput
                style={styles.input}
                placeholder="Enter confirmation pin"
                value={formValues.confirmPin}
                onChangeText={(value) => handleInputChange(value, "confirmPin")}
              />
            </View>
            <Button
              title={"Save Changes"}
              isLoading={isLoading} // Pass isLoading state to Button component
              disabled={
                !formValues.confirmPin ||
                !formValues.newPin ||
                !formValues.currPin ||
                isLoading // Disable button while loading
              }
              onPress={handleButtonClick}
              style={styles.proceedButton}
              textColor="#fff"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePinScreen;

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
