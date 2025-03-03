import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Alert,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, Notification, SmsNotification } from "iconsax-react-native";
import SPACING from "../../constants/SPACING";
import FONT_SIZE from "../../constants/font-size";
import COLORS from "../../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import { useNotification } from "../../context/NotificationContext";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EnableNotificationScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { notificationsEnabled, setNotificationsEnabled } = useNotification();
  const [isSmsNotificationEnabled, setIsSmsNotificationEnabled] =
    useState(false);

  useEffect(() => {
    const syncInitialState = async () => {
      try {
        // Load persisted SMS notification preference
        const smsEnabled = await AsyncStorage.getItem(
          "isSmsNotificationEnabled"
        );
        if (smsEnabled !== null) {
          setIsSmsNotificationEnabled(JSON.parse(smsEnabled));
        }
        // No need to override notificationsEnabled here; trust the context
      } catch (error) {
        console.error("Error syncing initial state:", error);
      }
    };
    syncInitialState();
  }, []);

  const togglePushNotificationSwitch = async (newValue: boolean) => {
    if (newValue) {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        const { status: newStatus } =
          await Notifications.requestPermissionsAsync();
        if (newStatus === "granted") {
          setNotificationsEnabled(true);
        } else {
          Alert.alert(
            "Permission Denied",
            "Notifications cannot be enabled without permission."
          );
          return; // Keep switch off if permission denied
        }
      } else {
        setNotificationsEnabled(true);
      }
    } else {
      Alert.alert(
        "Confirm Disable",
        "Are you sure you want to disable push notifications?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Yes", onPress: () => setNotificationsEnabled(false) },
        ]
      );
    }
  };

  const toggleSmsNotificationSwitch = async (newValue: boolean) => {
    setIsSmsNotificationEnabled(newValue);
    try {
      await AsyncStorage.setItem(
        "isSmsNotificationEnabled",
        JSON.stringify(newValue)
      );
    } catch (error) {
      console.error("Error saving SMS notification preference:", error);
    }
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
            <Text style={styles.headerText} allowFontScaling={false}>
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
                trackColor={{ false: COLORS.black100, true: COLORS.violet400 }}
                value={notificationsEnabled} // Reflects context state
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
                trackColor={{ false: COLORS.black100, true: COLORS.violet400 }}
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
