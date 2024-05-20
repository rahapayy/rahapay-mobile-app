import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
} from "react-native";
import React, { useState } from "react";
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

const ProfileScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [biometricModalVisible, setBiometricModalVisible] = useState(false);

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
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View className="p-4">
          <Text style={styles.headText} allowFontScaling={false}>
            Profile
          </Text>

          <View className="w-full bg-white p-4 rounded-lg mt-6 flex-row items-center">
            <Image
              source={require("../assets/images/avatar.png")}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.name} allowFontScaling={false}>
                John Doe
              </Text>
              <Text style={styles.subName} allowFontScaling={false}>
                @johndoe
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
          <View className="mt-4">
            <Text style={styles.titleHeadText}>Account</Text>
            <View className="w-full bg-white p-4 rounded-lg mt-4">
              <TouchableOpacity
                onPress={() => navigation.navigate("PersonalInformationScreen")}
                className="flex-row items-center mb-4"
              >
                <Profile variant="Bold" color={COLORS.violet400} size={24} />
                <Text style={styles.titleText} allowFontScaling={false}>
                  Personal Information
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("ReferralScreen")}
                className="flex-row items-center"
              >
                <People variant="Bold" color={COLORS.violet400} size={24} />
                <Text style={styles.titleText} allowFontScaling={false}>
                  Referrals
                </Text>
              </TouchableOpacity>
            </View>

            {/* Security */}
            <View className="mt-4">
              <Text style={styles.titleHeadText}>Security</Text>
              <View className="w-full bg-white p-4 rounded-lg mt-4">
                <TouchableOpacity
                  onPress={() => navigation.navigate("ChangePasswordScreen")}
                  className="flex-row items-center mb-4"
                >
                  <Lock variant="Bold" color={COLORS.violet400} size={24} />
                  <Text style={styles.titleText} allowFontScaling={false}>
                    Change Password
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("ChangePinScreen")}
                  className="flex-row items-center mb-4"
                >
                  <Lock variant="Bold" color={COLORS.violet400} size={24} />
                  <Text style={styles.titleText} allowFontScaling={false}>
                    Change Pin
                  </Text>
                </TouchableOpacity>
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
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
            <View className="mt-4">
              <Text style={styles.titleHeadText}>Security</Text>
              <View className="w-full bg-white p-4 rounded-lg mt-4">
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("EnableNotificationScreen")
                  }
                  className="flex-row items-center mb-4"
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
                  className="flex-row items-center mb-4"
                >
                  <Lock variant="Bold" color={COLORS.violet400} size={24} />
                  <Text style={styles.titleText} allowFontScaling={false}>
                    Help & Support
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center">
                  <Message2 variant="Bold" color={COLORS.violet400} size={24} />
                  <Text style={styles.titleText} allowFontScaling={false}>
                    Close Account
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Close Account */}
            <TouchableOpacity className="mb-10 mt-10 flex-row items-center justify-center">
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
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  headText: {
    fontFamily: "Outfit-Regular",
    fontSize: FONT_SIZE.large,
  },
  avatar: {
    width: 50,
    height: 50,
    marginRight: 8,
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
  },
  titleText: {
    fontFamily: "Outfit-Medium",
    fontSize: FONT_SIZE.small,
    marginLeft: SPACING,
  },
  logoutButton: {
    color: "#FF2E2E",
    fontFamily: "Outfit-Medium",
    fontSize: FONT_SIZE.small,
  },
});
