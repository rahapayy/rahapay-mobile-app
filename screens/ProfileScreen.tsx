import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Switch,
} from "react-native";
import React, { useContext, useState } from "react";
import FONT_SIZE from "../constants/font-size";
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
import { RFValue } from "react-native-responsive-fontsize";
import SPACING from "../constants/SPACING";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import BiometricModal from "../components/modals/BiometricModal";
import CloseAccountModal from "../components/modals/CloseAccountModal";
import LogOutModal from "../components/modals/LogoutModal";
import {
  BoldText,
  LightText,
  MediumText,
  SemiBoldText,
} from "../components/common/Text";
import { AuthContext, useAuth } from "../services/AuthContext";

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

  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [biometricModalVisible, setBiometricModalVisible] = useState(false);
  const [isCloseAccountModalVisible, setIsCloseAccountModalVisible] =
    useState(false);

  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const toggleBiometricSwitch = () => {
    setBiometricModalVisible(true);
  };

  const handleModalClose = () => {
    setBiometricModalVisible(false);
  };

  const handleToggleBiometrics = () => {
    setIsBiometricEnabled(!isBiometricEnabled);
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

  const handleLogout = () => {
    logOut();
  };

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

          {/* <TouchableOpacity
              onPress={() =>
                navigation.navigate("AgentAccountVerificationScreen")
              }
              style={styles.verifyButton}
            >
              <Verify variant="Bold" color="#fff" />
              <Text style={styles.verifyText} allowFontScaling={false}>
                Become an agent
              </Text>
            </TouchableOpacity> */}

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
                {/* <ArrowRight color="black" size={20} /> */}
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
                <TouchableOpacity
                  onPress={() => navigation.navigate("SelectPinChangeScreen")}
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
              onPress={handleLogout}
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
        onToggle={handleToggleLogout}
        onClose={handleCloseLogout}
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
  verifyButton: {
    backgroundColor: COLORS.violet400,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: "row",
    marginTop: SPACING,
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
    // justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING,
  },
  titleText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(12),
    marginLeft: SPACING,
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
  logoutButton: {
    color: "#FF2E2E",
    fontFamily: "Outfit-Medium",
    fontSize: FONT_SIZE.small,
    marginRight: SPACING,
  },
});
