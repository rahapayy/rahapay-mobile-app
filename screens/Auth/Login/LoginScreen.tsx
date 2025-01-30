import React, { useContext } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../../../constants/colors";
import SPACING from "../../../constants/SPACING";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Button from "../../../components/common/ui/buttons/Button";
import { handleShowFlash } from "../../../components/FlashMessageComponent";
import { AuthContext } from "../../../services/AuthContext";
import { AxiosError } from "axios";
import BackButton from "../../../components/common/ui/buttons/BackButton";
import {
  BoldText,
  LightText,
  MediumText,
} from "../../../components/common/Text";
import Label from "../../../components/common/ui/forms/Label";
import BasicInput from "../../../components/common/ui/forms/BasicInput";

const validationSchema = Yup.object().shape({
  id: Yup.string()
    .test("email-or-phone", "Enter a valid email or phone number", (value) => {
      if (!value) return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]{10}$/;
      return emailRegex.test(value) || phoneRegex.test(value);
    })
    .required("Email or phone number is required"),
  password: Yup.string().required("Password is required"),
});

const LoginScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { login } = useContext(AuthContext);

  const handleLogin = async (
    values: { id: string; password: string },
    { setSubmitting }
  ) => {
    try {
      await login(values.id, values.password);
      handleShowFlash({ message: "Logged in successfully!", type: "success" });
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 404) errorMessage = "User not found.";
        else if (error.response.status === 401)
          errorMessage = "Incorrect password.";
        else errorMessage = "Server error. Try again later.";
      }
      handleShowFlash({ message: errorMessage, type: "danger" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 p-4">
        <BackButton navigation={navigation} />
        <View className="mt-8">
          <MediumText color="black" size="xlarge" marginBottom={5}>
            Login
          </MediumText>
          <LightText color="mediumGrey" size="base">
            Welcome back, let's sign in to your account!
          </LightText>
        </View>

        <Formik
          initialValues={{ id: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
              >
                <View className="flex-1">
                  <View className="mt-10">
                    <Label text="Email or Phone Number" marked={false} />
                    <BasicInput
                      value={values.id}
                      onChangeText={handleChange("id")}
                      onBlur={handleBlur("id")}
                      placeholder="Email or Phone Number"
                      autoCapitalize="none"
                      autoComplete="off"
                      autoCorrect={false}
                    />
                    {touched.id && errors.id && (
                      <Text style={styles.errorText}>{errors.id}</Text>
                    )}
                  </View>

                  <View className="mt-4">
                    <Label text="Password" marked={false} />
                    <BasicInput
                      value={values.password}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      placeholder="Password"
                      secureTextEntry
                      autoCapitalize="none"
                      autoComplete="off"
                      autoCorrect={false}
                    />
                    {touched.password && errors.password && (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("ResetPasswordScreen")}
                    className="mt-4 justify-center items-end"
                  >
                    <BoldText color="primary" size="base">
                      Forgot Password?
                    </BoldText>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
              <View className="">
                <Button
                  title="Login"
                  onPress={handleSubmit}
                  isLoading={isSubmitting}
                  style={styles.proceedButton}
                  textColor="#fff"
                  disabled={isSubmitting}
                />
                <View className="flex-row justify-center items-center mt-6">
                  <LightText color="mediumGrey" size="base">
                    Don't have an account?{" "}
                  </LightText>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("CreateAccountScreen")}
                  >
                    <BoldText color="primary" size="base">
                      Create Account
                    </BoldText>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  proceedButton: {
    marginTop: SPACING * 4,
  },
  errorText: {
    color: COLORS.red300,
    fontSize: RFValue(10),
    marginTop: 5,
    fontFamily: "Outfit-Regular",
  },
});
