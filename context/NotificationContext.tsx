import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import * as Device from "expo-device";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Subscription } from "expo-modules-core";
import { services } from "../services/apiClient";
import { useAuth } from "../services/AuthContext";

interface NotificationWithTimestamp {
  notification: Notifications.Notification;
  receivedAt: string;
}

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  notifications: NotificationWithTimestamp[];
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  hasAskedForPermission: boolean;
  requestNotificationPermissions: () => void;
  checkAndUpdateDeviceToken: (newToken?: string) => Promise<void>;
  error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [notifications, setNotifications] = useState<
    NotificationWithTimestamp[]
  >([]);
  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(false);
  const [hasAskedForPermission, setHasAskedForPermission] =
    useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();
  const { isAuthenticated, userInfo } = useAuth();

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        const enabled = await AsyncStorage.getItem("notificationsEnabled");
        if (enabled !== null) {
          setNotificationsEnabled(JSON.parse(enabled));
        }
        await loadPersistedNotifications();

        if (isAuthenticated && userInfo) {
          await checkIfPermissionRequested();
          if (notificationsEnabled) {
            await setupNotifications();
          }
        }
      } catch (error) {
        console.error("Error initializing notifications:", error);
        setError(error instanceof Error ? error : new Error(String(error)));
      }
    };
    initializeNotifications();
  }, [isAuthenticated, userInfo]);

  useEffect(() => {
    AsyncStorage.setItem(
      "notificationsEnabled",
      JSON.stringify(notificationsEnabled)
    ).catch((error) =>
      console.error("Error saving notificationsEnabled:", error)
    );
  }, [notificationsEnabled]);

  useEffect(() => {
    if (notificationsEnabled) {
      setupNotifications();
    }

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [notificationsEnabled]);

  const setupNotifications = async () => {
    try {
      const token = await registerForPushNotificationsAsync();
      setExpoPushToken(token);
      console.log("Device token generated:", token);
      await checkAndUpdateDeviceToken(token);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
      console.error("Setup notifications failed:", e);
    }

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        setNotifications((prev) => {
          if (!notification || !notification.request) return prev; // Guard against invalid notification
          if (
            prev.some(
              (n) =>
                n.notification.request.identifier ===
                notification.request.identifier
            )
          ) {
            return prev; // Skip duplicates
          }
          const newEntry = {
            notification,
            receivedAt: new Date().toISOString(),
          };
          const updated = [newEntry, ...prev].sort(
            (a, b) =>
              new Date(b.receivedAt).getTime() -
              new Date(a.receivedAt).getTime()
          );
          persistNotifications(updated);
          console.log("Updated notifications (foreground):", updated);
          return updated;
        });
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response received:", response);
        if (response?.notification && response.notification.request) {
          setNotifications((prev) => {
            if (
              prev.some(
                (n) =>
                  n.notification.request.identifier ===
                  response.notification.request.identifier
              )
            ) {
              return prev; // Skip duplicates
            }
            const newEntry = {
              notification: response.notification,
              receivedAt: new Date().toISOString(),
            };
            const updated = [newEntry, ...prev].sort(
              (a, b) =>
                new Date(b.receivedAt).getTime() -
                new Date(a.receivedAt).getTime()
            );
            persistNotifications(updated);
            console.log("Updated notifications (response):", updated);
            return updated;
          });
        }
      });
  };

  const checkAndUpdateDeviceToken = async (newToken?: string) => {
    if (!notificationsEnabled || !isAuthenticated || !userInfo) return;

    const backendDeviceToken = userInfo.deviceToken;
    let currentToken = newToken || expoPushToken || null;

    if (!currentToken) {
      try {
        currentToken = await registerForPushNotificationsAsync();
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
        console.log("Failed to generate a token for sending:", e);
        return;
      }
    }

    if (
      !backendDeviceToken ||
      (currentToken && backendDeviceToken !== currentToken)
    ) {
      await sendDeviceTokenToBackend(currentToken);
      setExpoPushToken(currentToken);
    }
  };

  const persistNotifications = async (
    notificationsToPersist: NotificationWithTimestamp[]
  ) => {
    try {
      await AsyncStorage.setItem(
        "persistedNotifications",
        JSON.stringify(notificationsToPersist)
      );
    } catch (error) {
      console.error("Error persisting notifications:", error);
    }
  };

  const loadPersistedNotifications = async () => {
    try {
      const saved = await AsyncStorage.getItem("persistedNotifications");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Filter out invalid entries
        const validNotifications = parsed
          .filter(
            (item: any) =>
              item &&
              item.notification &&
              item.notification.request &&
              typeof item.receivedAt === "string"
          )
          .sort(
            (a: NotificationWithTimestamp, b: NotificationWithTimestamp) =>
              new Date(b.receivedAt).getTime() -
              new Date(a.receivedAt).getTime()
          );
        setNotifications(validNotifications);
        // console.log("Loaded notifications:", validNotifications);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
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

  const sendDeviceTokenToBackend = async (token: string) => {
    try {
      const response = await services.notificationService.sendDeviceToken(
        token
      );
      console.log("Device token sent successfully:", response);
    } catch (error: any) {
      console.error(
        "Failed to send token:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        "Failed to sync device token. Retrying in 5 seconds..."
      );
      setTimeout(() => sendDeviceTokenToBackend(token), 5000);
    }
  };

  async function registerForPushNotificationsAsync(): Promise<string> {
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
        throw new Error("Permission not granted to get push token!");
      }
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({ projectId })
      ).data;
      return pushTokenString;
    } else {
      throw new Error("Must use physical device for push notifications");
    }
  }

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
        notifications,
        notificationsEnabled,
        setNotificationsEnabled,
        hasAskedForPermission,
        requestNotificationPermissions,
        checkAndUpdateDeviceToken,
        error,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
