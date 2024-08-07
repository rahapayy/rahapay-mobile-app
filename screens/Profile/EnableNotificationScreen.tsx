import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import React, { useContext, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, Notification, SmsNotification } from "iconsax-react-native";
import SPACING from "../../config/SPACING";
import FONT_SIZE from "../../config/font-size";
import COLORS from "../../config/colors";
import { RFValue } from "react-native-responsive-fontsize";
import { NotificationContext } from "../../hooks/NotificationContext";

const EnableNotificationScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [isPushNotificationEnabled, setIsPushNotificationEnabled] =
    useState(true);
  const [isSmsNotificationEnabled, setIsSmsNotificationEnabled] =
    useState(false);

  const { expoPushToken, notification, setExpoPushToken } =
    useContext(NotificationContext);

  // Toggle switches for push and sms notifications
  const togglePushNotificationSwitch = async () => {
    const newState = !isPushNotificationEnabled;
    setIsPushNotificationEnabled(newState);

    if (newState) {
      // Logic to enable push notifications - register and get new token
      // As registerForPushNotificationsAsync is defined in the NotificationContext we should ensure it's imported to use here
      const newToken = await registerForPushNotificationsAsync();
      setExpoPushToken(newToken);
    } else {
      // Logic to disable push notifications
      // This might involve informing your backend server to not send notifications anymore or disabling them in some other way
      setExpoPushToken(""); // Clear the push token
    }
  };
  const toggleSmsNotificationSwitch = () => {
    setIsSmsNotificationEnabled((previousState) => !previousState);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.leftIcon}
            >
              <ArrowLeft color={"#000"} size={24} />
            </TouchableOpacity>
            <Text style={[styles.headerText]} allowFontScaling={false}>
              Notification
            </Text>
          </View>

          <View style={styles.container}>
            <View style={styles.switchContainer}>
              <View style={styles.switchLabel}>
                <Notification
                  variant="Bold"
                  color={COLORS.violet400}
                  size={24}
                />
                <Text style={styles.titleText} allowFontScaling={false}>
                  Enable Push Notification
                </Text>
              </View>
              <Switch
                thumbColor={COLORS.white}
                trackColor={{
                  false: COLORS.black100,
                  true: COLORS.violet400,
                }}
                value={isPushNotificationEnabled}
                onValueChange={togglePushNotificationSwitch}
              />
            </View>
            <View style={styles.switchContainer}>
              <View style={styles.switchLabel}>
                <SmsNotification
                  variant="Bold"
                  color={COLORS.violet400}
                  size={24}
                />
                <Text style={styles.titleText} allowFontScaling={false}>
                  Enable SMS Notification
                </Text>
              </View>
              <Switch
                thumbColor={COLORS.white}
                trackColor={{
                  false: COLORS.black100,
                  true: COLORS.violet400,
                }}
                value={isSmsNotificationEnabled}
                onValueChange={toggleSmsNotificationSwitch}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EnableNotificationScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING * 2,
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
  container: {
    paddingHorizontal: SPACING,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING,
    borderRadius: SPACING,
  },
  switchLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(12),
    marginLeft: SPACING,
  },
});
function registerForPushNotificationsAsync() {
  throw new Error("Function not implemented.");
}
