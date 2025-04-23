import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Switch,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  Document,
  FingerScan,
  I24Support,
  Key,
  Lock,
  Logout,
  Message2,
  Notification,
  People,
  Profile,
} from "iconsax-react-native";
import COLORS from "../constants/colors";
import SPACING from "../constants/SPACING";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import BiometricModal from "../components/modals/BiometricModal";
import CloseAccountModal from "../components/modals/CloseAccountModal";
import { BoldText, LightText, MediumText } from "../components/common/Text";
import { useAuth } from "../services/AuthContext";
import { getItem, setItem } from "@/utils/storage";
import LogOutModal from "@/components/modals/LogoutModal";
import { handleShowFlash } from "@/components/FlashMessageComponent";
import { services } from "@/services";
import Loading from "@/components/common/ui/loading/loader";

const options = [
  {
    title: "Change transaction pin",
    type: "transactionPin",
  },
];

const ProfileScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { userInfo, logOut } = useAuth();

  const fullName = userInfo?.fullName || "";
  const firstName = fullName.split(" ")[0];
  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  const [isCloseAccountModalVisible, setIsCloseAccountModalVisible] =
    useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [biometricModalVisible, setBiometricModalVisible] = useState(false);
  const [isRequestingPinReset, setIsRequestingPinReset] = useState(false);

  // Load biometric preference on mount
  useEffect(() => {
    const loadBiometricPreference = async () => {
      const storedValue = await getItem("BIOMETRIC_ENABLED");
      setIsBiometricEnabled(storedValue === "true");
    };
    loadBiometricPreference();
  }, []);

  const toggleBiometricSwitch = () => {
    setBiometricModalVisible(true);
  };

  const handleModalClose = () => {
    setBiometricModalVisible(false);
  };

  const handleToggleBiometrics = async (newValue: boolean) => {
    setIsBiometricEnabled(newValue);
    await setItem("BIOMETRIC_ENABLED", newValue.toString());
    setBiometricModalVisible(false);
  };

  const handleToggleLogout = () => {
    setIsLogoutModalVisible(true);
  };

  const handleCloseLogout = () => {
    setIsLogoutModalVisible(false);
  };

  const handleOpenCloseAccountModal = () => {
    setIsCloseAccountModalVisible(true);
  };

  const handleCloseAccountModalClose = () => {
    setIsCloseAccountModalVisible(false);
  };

  const handleConfirmCloseAccount = () => {
    // Handle account closure logic here
    setIsCloseAccountModalVisible(false);
  };

  const handleConfirmLogout = () => {
    logOut(); // Perform logout
    setIsLogoutModalVisible(false); // Close modal
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: "LoginScreen" }], // Replace with your login screen name
    // }); // Reset navigation stack to login screen
  };

  const handleChangePin = async (type: string) => {
    if (type === "transactionPin") {
      setIsRequestingPinReset(true);
      try {
        await services.userService.requestTransactionPinReset();
        handleShowFlash({ message: "OTP sent successfully!", type: "success" });
        navigation.navigate("VerifyOtp", { type: "transactionPin" });
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message instanceof Array
            ? error.response.data.message[0]
            : error.response?.data?.message || "Failed to send OTP";
        handleShowFlash({ message: errorMessage, type: "danger" });
      } finally {
        setIsRequestingPinReset(false);
      }
    } else {
      navigation.navigate("VerifyOtp", { type });
    }
  };

  if (isRequestingPinReset) {
    return <Loading size="large" color={COLORS.violet400} />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <MediumText color="black" size="large">
            My Profile
          </MediumText>

          <View className="bg-white flex-row p-4 mt-6 rounded-xl items-center">
            <View>
              <TouchableOpacity style={styles.avatar} className="rounded-full">
                <BoldText color="black" size="medium">
                  {initials}
                </BoldText>
              </TouchableOpacity>
            </View>
            <View>
              <MediumText color="black">{fullName}</MediumText>
              <LightText color="light">{userInfo?.email}</LightText>
            </View>
          </View>

          {/* Settings Section */}
          <View className="mt-4">
            <MediumText color="light">Account</MediumText>
            <View style={styles.settingsContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate("PersonalInformationScreen")}
                style={styles.settingsItem}
              >
                <View className="flex-row items-center">
                  <Profile
                    variant="Bold"
                    color={COLORS.violet400}
                    size={24}
                    style={{ marginRight: SPACING }}
                  />
                  <LightText color="black" size="base">
                    Personal Information
                  </LightText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("ReferralScreen")}
                style={styles.settingsItem}
              >
                <People
                  variant="Bold"
                  color={COLORS.violet400}
                  size={24}
                  style={{ marginRight: SPACING }}
                />
                <LightText color="black" size="base">
                  Referrals
                </LightText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("TransferDispute")}
                style={styles.settingsItem}
              >
                <Document
                  variant="Bold"
                  color={COLORS.violet400}
                  size={24}
                  style={{ marginRight: SPACING }}
                />
                <LightText color="black" size="base">
                  Reports
                </LightText>
              </TouchableOpacity>
            </View>

            {/* Security */}
            <View className="mt-4">
              <MediumText color="light">Security</MediumText>
              <View style={styles.settingsContainer}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("ChangePasswordScreen")}
                  style={styles.settingsItem}
                >
                  <Key
                    variant="Bold"
                    color={COLORS.violet400}
                    size={24}
                    style={{ marginRight: SPACING }}
                  />
                  <LightText color="black" size="base">
                    Change Password
                  </LightText>
                </TouchableOpacity>
                {options.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleChangePin(item.type)}
                    style={styles.settingsItem}
                  >
                    <Lock
                      variant="Bold"
                      color={COLORS.violet400}
                      size={24}
                      style={{ marginRight: SPACING }}
                    />
                    <LightText color="black" size="base">
                      Change Pin
                    </LightText>
                  </TouchableOpacity>
                ))}
                <View style={styles.switchContainer}>
                  <View style={styles.switchLabel}>
                    <FingerScan
                      variant="Bold"
                      color={COLORS.violet400}
                      size={24}
                      style={{ marginRight: SPACING }}
                    />
                    <LightText color="black" size="base">
                      Biometrics
                    </LightText>
                  </View>
                  <Switch
                    thumbColor={COLORS.white}
                    trackColor={{
                      false: COLORS.black100,
                      true: COLORS.violet400,
                    }}
                    value={isBiometricEnabled}
                    onValueChange={toggleBiometricSwitch}
                  />
                </View>
              </View>
            </View>

            {/* Others */}
            <View className="mt-4">
              <MediumText color="light">Others</MediumText>
              <View style={styles.settingsContainer}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("EnableNotificationScreen")
                  }
                  style={styles.settingsItem}
                >
                  <Notification
                    variant="Bold"
                    color={COLORS.violet400}
                    size={24}
                    style={{ marginRight: SPACING }}
                  />
                  <LightText color="black" size="base">
                    Notification
                  </LightText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("HelpAndSupportScreen")}
                  style={styles.settingsItem}
                >
                  <I24Support
                    variant="Bold"
                    color={COLORS.violet400}
                    size={24}
                    style={{ marginRight: SPACING }}
                  />
                  <LightText color="black" size="base">
                    Help & Support
                  </LightText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleOpenCloseAccountModal}
                  style={styles.settingsItem}
                >
                  <Message2
                    variant="Bold"
                    color={COLORS.violet400}
                    size={24}
                    style={{ marginRight: SPACING }}
                  />
                  <LightText color="black" size="base">
                    Close Account
                  </LightText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Logout */}
            <TouchableOpacity
              onPress={handleToggleLogout}
              style={styles.logoutContainer}
            >
              <MediumText color="error" size="large">
                Logout
              </MediumText>
              <Logout color="#FF2E2E" style={{ marginLeft: SPACING }} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <BiometricModal
        visible={biometricModalVisible}
        onClose={handleModalClose}
        onToggle={handleToggleBiometrics}
        isEnabled={isBiometricEnabled}
      />
      <CloseAccountModal
        visible={isCloseAccountModalVisible}
        onClose={handleCloseAccountModalClose}
        onConfirm={handleConfirmCloseAccount}
      />
      <LogOutModal
        visible={isLogoutModalVisible}
        onClose={handleCloseLogout}
        onConfirm={handleConfirmLogout}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    padding: SPACING * 2,
  },
  scrollViewContent: {
    paddingBottom: SPACING * 6,
  },
  profileContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    padding: SPACING,
    borderRadius: SPACING,
    marginTop: SPACING * 3,
    alignItems: "center",
  },
  avatar: {
    width: 55,
    height: 55,
    borderColor: COLORS.violet400,
    borderWidth: 2,
    backgroundColor: COLORS.violet100,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING * 1.5,
  },
  settingsContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING,
    borderRadius: SPACING,
    marginTop: SPACING,
    gap: SPACING,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutContainer: {
    marginTop: SPACING * 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
