import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { handleShowFlash } from "../../components/FlashMessageComponent";
import { services } from "../../services";
import { useAuth } from "../../services/AuthContext";
import { setItem } from "../../utils/storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LockStackParamList } from "../../types/RootStackParams";
import { useLock } from "../../context/LockContext";
import { BoldText, RegularText } from "@/components/common/Text";

import { BasicPasswordInput } from "@/components/common/ui/forms/BasicPasswordInput";
import { COLORS } from "@/constants/ui";
import Button from "@/components/common/ui/buttons/Button";

type PasswordReauthScreenProps = NativeStackScreenProps<
  LockStackParamList,
  "PasswordReauthScreen"
>;

const PasswordReauthScreen: React.FC<PasswordReauthScreenProps> = ({
  navigation,
}) => {
  const { setIsAuthenticated, setUserInfo, userInfo } = useAuth();
  const { handleUnlock } = useLock(); // Use the LockContext to get handleUnlock
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [maskedId, setMaskedId] = useState("");

  const fullName = userInfo?.fullName || "";
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    // Mask the user's email or phone number
    if (userInfo?.email) {
      const [username, domain] = userInfo.email.split("@");
      const maskedUsername = username.slice(0, 2) + "****" + username.slice(-2);
      setMaskedId(`${maskedUsername}@${domain}`);
    } else if (userInfo?.phoneNumber) {
      const maskedPhone = userInfo.phoneNumber.replace(
        /^(\d{3})(\d{3})(\d{4})$/,
        "$1****$3"
      );
      setMaskedId(maskedPhone);
    }
  }, [userInfo]);

  const handlePasswordLogin = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        id: userInfo?.email || userInfo?.phoneNumber || "",
        password,
      };
      const response = await services.authService.login(payload);
      if (response) {
        await setItem("ACCESS_TOKEN", response.data.accessToken, true);
        await setItem("REFRESH_TOKEN", response.data.refreshToken, true);

        const userResponse = await services.authServiceToken.getUserDetails();
        setIsAuthenticated(true);
        setUserInfo(userResponse.data);
        handleShowFlash({
          message: "Logged in successfully!",
          type: "success",
        });
        handleUnlock(); // Use handleUnlock from context
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message instanceof Array
          ? error.response.data.message[0]
          : error.response?.data?.message || "An unexpected error occurred";
      handleShowFlash({
        message: errorMessage,
        type: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Enter Password</Text>

      <View style={styles.avatar}>
        <BoldText color="white" size="large">
          {initials}
        </BoldText>
      </View>
      {/* User ID (masked) */}
      <RegularText color="black">{maskedId}</RegularText>
      <BasicPasswordInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
      />
      <Button
        onPress={handlePasswordLogin}
        title="Login"
        textColor="white"
        isLoading={isSubmitting}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  backText: {
    fontSize: 16,
    color: "#00C4B4",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#00C4B4",
    padding: 10,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: COLORS.brand.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
});

export default PasswordReauthScreen;
