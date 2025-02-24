import React, {
  createContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { services } from '../services/apiClient';
import { useAuth } from '../services/AuthContext';

export const NotificationContext = createContext();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const NotificationProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [hasAskedForPermission, setHasAskedForPermission] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const { isAuthenticated, userInfo } = useAuth(); // userInfo contains backend user data

  // Load persisted state and check permissions on mount
  useEffect(() => {
    const loadPersistedState = async () => {
      try {
        const enabled = await AsyncStorage.getItem('notificationsEnabled');
        if (enabled !== null) {
          setNotificationsEnabled(JSON.parse(enabled));
        }
        await loadPersistedNotifications();

        if (isAuthenticated) {
          await checkIfPermissionRequested();
          await checkAndUpdateDeviceToken(); // Check device token on load
        }
      } catch (error) {
        console.error('Error loading persisted state:', error);
      }
    };
    loadPersistedState();
  }, [isAuthenticated, userInfo]); // Add userInfo to dependencies

  // Persist notificationsEnabled whenever it changes
  useEffect(() => {
    AsyncStorage.setItem('notificationsEnabled', JSON.stringify(notificationsEnabled)).catch((error) =>
      console.error('Error saving notificationsEnabled:', error)
    );
  }, [notificationsEnabled]);

  // Setup notifications when enabled
  useEffect(() => {
    if (notificationsEnabled) {
      setupNotifications();
    }

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
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
      console.log('Device token:', token);
      await checkAndUpdateDeviceToken(token); // Check and send token after setup
    }

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
      setNotifications((prev) => {
        const updated = [...prev, notification];
        persistNotifications(updated);
        console.log('Updated notifications (foreground):', updated);
        return updated;
      });
      console.log('Notification received in foreground:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification response received:', response);
      if (response?.notification) {
        setNotifications((prev) => {
          const updated = [...prev, response.notification];
          persistNotifications(updated);
          console.log('Updated notifications (response):', updated);
          return updated;
        });
      }
    });
  };

  // New function to check and update device token
  const checkAndUpdateDeviceToken = async (newToken?: string) => {
    if (!notificationsEnabled || !isAuthenticated || !userInfo) return;

    const backendDeviceToken = userInfo.deviceToken; // From AuthContext
    const currentToken = newToken || expoPushToken;

    // If no device token in backend or it differs from current token
    if (!backendDeviceToken || (currentToken && backendDeviceToken !== currentToken)) {
      const tokenToSend = currentToken || (await registerForPushNotificationsAsync());
      if (tokenToSend) {
        await sendDeviceTokenToBackend(tokenToSend);
        setExpoPushToken(tokenToSend); // Update local state
      }
    }
  };

  const persistNotifications = async (notificationsToPersist) => {
    try {
      await AsyncStorage.setItem('persistedNotifications', JSON.stringify(notificationsToPersist));
    } catch (error) {
      console.error('Error persisting notifications:', error);
    }
  };

  const loadPersistedNotifications = async () => {
    try {
      const saved = await AsyncStorage.getItem('persistedNotifications');
      if (saved) {
        setNotifications(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const checkIfPermissionRequested = async () => {
    const value = await AsyncStorage.getItem('hasAskedForPermission');
    if (value === null) {
      showPermissionAlert();
    } else {
      setHasAskedForPermission(true);
    }
  };

  const showPermissionAlert = () => {
    Alert.alert(
      'Enable Notifications',
      'Would you like to enable push notifications to stay updated?',
      [
        {
          text: 'No',
          onPress: () => {
            AsyncStorage.setItem('hasAskedForPermission', 'true');
            setHasAskedForPermission(true);
          },
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            AsyncStorage.setItem('hasAskedForPermission', 'true');
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
      const response = await services.notificationService.sendDeviceToken(token);
      console.log('Device token sent to backend:', response);
    } catch (error) {
      console.error('Error sending device token to backend:', error);
      Alert.alert('Error', 'Failed to sync device token with server.');
    }
  };

  async function registerForPushNotificationsAsync() {
    let token;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert('Must use a physical device for Push Notifications');
    }

    return token;
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
        checkAndUpdateDeviceToken, // Expose for manual triggering if needed
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};