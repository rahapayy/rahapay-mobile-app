import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../utils/api";
import { AuthContext } from "./AuthContext"; 

export const NotificationContext = createContext();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const NotificationProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [hasAskedForPermission, setHasAskedForPermission] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const { mutateAsync: sendDeviceToken } = useApi.post(
    "/notification/device-token"
  );
  const { isAuthenticated } = useContext(AuthContext); // Use AuthContext to check authentication status

  useEffect(() => {
    if (isAuthenticated) {
      checkIfPermissionRequested();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (notificationsEnabled) {
      setupNotifications();
    }

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [notificationsEnabled]);

  const setupNotifications = async () => {
    const token = await registerForPushNotificationsAsync();
    if (token) {
      setExpoPushToken(token);
      sendDeviceTokenToBackend(token);
    }

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        console.log("Notification received in foreground:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response received:", response);
      });
  };

  const checkIfPermissionRequested = async () => {
    const value = await AsyncStorage.getItem("hasAskedForPermission");
    if (value === null) {
      showPermissionAlert();
    } else {
      setHasAskedForPermission(true);
    }
  };

  const showPermissionAlert = () => {
    Alert.alert(
      "Enable Notifications",
      "Would you like to enable push notifications to stay updated?",
      [
        {
          text: "No",
          onPress: () => {
            AsyncStorage.setItem("hasAskedForPermission", "true");
            setHasAskedForPermission(true);
          },
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            AsyncStorage.setItem("hasAskedForPermission", "true");
            setHasAskedForPermission(true);
            setNotificationsEnabled(true);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const sendDeviceTokenToBackend = async (token) => {
    try {
      await sendDeviceToken({
        deviceToken: token,
      });
      console.log("Device token sent to backend successfully.");
    } catch (error) {
      console.error("Error sending device token to backend:", error);
    }
  };

  async function registerForPushNotificationsAsync() {
    let token;
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert("Must use a physical device for Push Notifications");
    }

    return token;
  }

  // New function to request permissions after authentication
  const requestNotificationPermissions = () => {
    if (isAuthenticated && !hasAskedForPermission) {
      showPermissionAlert();
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        notification,
        notificationsEnabled,
        setNotificationsEnabled,
        hasAskedForPermission,
        requestNotificationPermissions, // Expose this new function
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
