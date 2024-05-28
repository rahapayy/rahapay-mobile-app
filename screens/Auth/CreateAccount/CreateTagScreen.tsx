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

const CreateTagScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [showBalance, setShowBalance] = useState(true);

  const toggleBalanceVisibility = () => setShowBalance((prev) => !prev);

  const handleButtonClick = () => {
    navigation.navigate("CreatePinScreen");
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
              Create a RahaPay Tag
            </Text>
            <Text style={styles.subText} allowFontScaling={false}>
              Send and receive money from your loved ones with your RahaPay tag
            </Text>
          </View>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? -50 : 0}
          >
            <View className="mt-6">
              <Text style={styles.label} allowFontScaling={false}>
                Set Username
              </Text>
              <View style={styles.inputContainer}>
                <Text style={{}} allowFontScaling={false}>
                  @{" "}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="eg. john"
                  placeholderTextColor="#BABFC3"
                  allowFontScaling={false}
                />
              </View>
            </View>
            <Button
              title={"Set My Tag"}
              onPress={handleButtonClick}
              style={styles.proceedButton}
              textColor="#fff"
            />
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateTagScreen;

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
});
