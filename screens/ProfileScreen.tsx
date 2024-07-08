import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
  Image,
  Platform,
} from "react-native";
import React, { useContext, useState } from "react";
import FONT_SIZE from "../config/font-size";
import {
  FingerScan,
  Lock,
  Logout,
  Message2,
  Notification,
  People,
  Profile,
  Verify,
} from "iconsax-react-native";
import COLORS from "../config/colors";
import { RFValue } from "react-native-responsive-fontsize";
import SPACING from "../config/SPACING";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import BiometricModal from "../components/modals/BiometricModal";
import CloseAccountModal from "../components/modals/CloseAccountModal";
import { AuthContext } from "../context/AuthContext";

const ProfileScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  // const { userInfo, logout } = useContext(AuthContext);
  const { userDetails, logout } = useContext(AuthContext);

  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [biometricModalVisible, setBiometricModalVisible] = useState(false);
  const [isCloseAccountModalVisible, setIsCloseAccountModalVisible] =
    useState(false);

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
    logout();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.headText} allowFontScaling={false}>
            Profile
          </Text>

          <View style={styles.profileContainer}>
            <Image
              source={require("../assets/images/avatar.png")}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.name} allowFontScaling={false}>
                {userDetails?.fullName}
              </Text>
              <Text style={styles.subName} allowFontScaling={false}>
                {userDetails?.userName}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AgentAccountVerificationScreen")
            }
            style={styles.verifyButton}
          >
            <Verify variant="Bold" color="#fff" />
            <Text style={styles.verifyText} allowFontScaling={false}>
              Become an agent
            </Text>
          </TouchableOpacity>

          {/* Settings Section */}
          <View>
            <Text style={styles.titleHeadText}>Account</Text>
            <View style={styles.settingsContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate("PersonalInformationScreen")}
                style={styles.settingsItem}
              >
                <Profile variant="Bold" color={COLORS.violet400} size={24} />
                <Text style={styles.titleText} allowFontScaling={false}>
                  Personal Information
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("ReferralScreen")}
                style={styles.settingsItem}
              >
                <People variant="Bold" color={COLORS.violet400} size={24} />
                <Text style={styles.titleText} allowFontScaling={false}>
                  Referrals
                </Text>
              </TouchableOpacity>
            </View>

            {/* Security */}
            <View>
              <Text style={styles.titleHeadText}>Security</Text>
              <View style={styles.settingsContainer}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("ChangePasswordScreen")}
                  style={styles.settingsItem}
                >
                  <Lock variant="Bold" color={COLORS.violet400} size={24} />
                  <Text style={styles.titleText} allowFontScaling={false}>
                    Change Password
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("ChangePinScreen")}
                  style={styles.settingsItem}
                >
                  <Lock variant="Bold" color={COLORS.violet400} size={24} />
                  <Text style={styles.titleText} allowFontScaling={false}>
                    Change Pin
                  </Text>
                </TouchableOpacity>
                <View style={styles.switchContainer}>
                  <View style={styles.switchLabel}>
                    <FingerScan
                      variant="Bold"
                      color={COLORS.violet400}
                      size={24}
                    />
                    <Text style={styles.titleText} allowFontScaling={false}>
                      Biometrics
                    </Text>
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
            <View>
              <Text style={styles.titleHeadText}>Others</Text>
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
                  />
                  <Text style={styles.titleText} allowFontScaling={false}>
                    Notification
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("HelpAndSupportScreen")}
                  style={styles.settingsItem}
                >
                  <Lock variant="Bold" color={COLORS.violet400} size={24} />
                  <Text style={styles.titleText} allowFontScaling={false}>
                    Help & Support
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleOpenCloseAccountModal}
                  style={styles.settingsItem}
                >
                  <Message2 variant="Bold" color={COLORS.violet400} size={24} />
                  <Text style={styles.titleText} allowFontScaling={false}>
                    Close Account
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Logout */}
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutContainer}
            >
              <Text style={styles.logoutButton} allowFontScaling={false}>
                Logout
              </Text>
              <Logout color="#FF2E2E" />
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
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    padding: SPACING * 2,
  },
  headText: {
    fontFamily: "Outfit-Regular",
    fontSize: FONT_SIZE.large,
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
    width: 50,
    height: 50,
    marginRight: SPACING,
  },
  name: {
    fontFamily: "Outfit-Medium",
    fontSize: FONT_SIZE.small,
  },
  subName: {
    fontFamily: "Outfit-Regular",
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
  verifyText: {
    fontFamily: "Outfit-Regular",
    color: COLORS.white,
    marginLeft: 4,
    fontSize: RFValue(14),
  },
  titleHeadText: {
    fontFamily: "Outfit-Regular",
    fontSize: FONT_SIZE.medium,
    color: "#9BA1A8",
    marginTop: SPACING * 2,
  },
  settingsContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING,
    borderRadius: SPACING,
    marginTop: SPACING,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING,
  },
  titleText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(14),
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
