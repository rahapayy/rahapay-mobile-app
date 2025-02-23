import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export const setItem = async (
  key: keyof typeof StorageKeys,
  value: string,
  secure: boolean = false
): Promise<void> => {
  try {
    if (secure) {
      await SecureStore.setItemAsync(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  } catch (error) {
    console.log("Error storing value: ", error);
  }
};

export const getItem = async (
  key: keyof typeof StorageKeys,
  secure: boolean = false
): Promise<string | null> => {
  try {
    if (secure) {
      return await SecureStore.getItemAsync(key);
    } else {
      return await AsyncStorage.getItem(key);
    }
  } catch (error) {
    console.log("Error retrieving value: ", error);
    return null;
  }
};

export const removeItem = async (
  key: keyof typeof StorageKeys,
  secure: boolean = false
): Promise<void> => {
  try {
    if (secure) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  } catch (error) {
    console.log("Error deleting value: ", error);
  }
};

export const StorageKeys = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  ONBOARDED: "onboarded",
};
