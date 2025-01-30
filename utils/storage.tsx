import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

// Define secure keys
const SECURE_KEYS = new Set<string>([
  "accessToken",
  "refreshToken",
]);

// Helper function to check secure keys
const isSecureKey = (key: string): boolean => SECURE_KEYS.has(key);

// Store a string value in appropriate storage
export const setItem = async (key: string, value: string): Promise<void> => {
  try {
    if (isSecureKey(key)) {
      await SecureStore.setItemAsync(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  } catch (error) {
    console.error(`Error storing value for key "${key}": `, error);
    throw error;
  }
};

// Retrieve a string value from appropriate storage
export const getItem = async (
  key: string,
  defaultValue: string | null = null
): Promise<string | null> => {
  try {
    const value = isSecureKey(key)
      ? await SecureStore.getItemAsync(key)
      : await AsyncStorage.getItem(key);
      
    return value !== null ? value : defaultValue;
  } catch (error) {
    console.error(`Error retrieving value for key "${key}": `, error);
    return defaultValue;
  }
};

// Remove a value from appropriate storage
export const removeItem = async (key: string): Promise<void> => {
  try {
    if (isSecureKey(key)) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  } catch (error) {
    console.error(`Error deleting value for key "${key}": `, error);
    throw error;
  }
};

// Store an object/array in appropriate storage
export const setObject = async <T,>(key: string, value: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error storing object for key "${key}": `, error);
    throw error;
  }
};

// Retrieve an object/array from appropriate storage
export const getObject = async <T,>(
  key: string,
  defaultValue: T | null = null
): Promise<T | null> => {
  try {
    const jsonValue = await getItem(key);
    return jsonValue ? JSON.parse(jsonValue) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving object for key "${key}": `, error);
    return defaultValue;
  }
};

// Save multiple items with secure/non-secure handling
export const multiSet = async (keyValuePairs: [string, any][]) => {
  try {
    const securePairs: Promise<void>[] = [];
    const nonSecurePairs: [string, string][] = [];

    // Separate secure and non-secure pairs
    keyValuePairs.forEach(([key, value]) => {
      const jsonValue = JSON.stringify(value);
      if (isSecureKey(key)) {
        securePairs.push(SecureStore.setItemAsync(key, jsonValue));
      } else {
        nonSecurePairs.push([key, jsonValue]);
      }
    });

    // Process storage operations in parallel
    await Promise.all([
      AsyncStorage.multiSet(nonSecurePairs),
      ...securePairs,
    ]);
  } catch (error) {
    console.error('Error saving multiple items', error);
  }
};

// Remove multiple items with secure/non-secure handling
export const multiRemove = async (keys: string[]) => {
  try {
    const secureKeys: string[] = [];
    const nonSecureKeys: string[] = [];

    // Separate secure and non-secure keys
    keys.forEach(key => {
      isSecureKey(key) ? secureKeys.push(key) : nonSecureKeys.push(key);
    });

    // Process removals in parallel
    await Promise.all([
      AsyncStorage.multiRemove(nonSecureKeys),
      ...secureKeys.map(key => SecureStore.deleteItemAsync(key)),
    ]);
  } catch (error) {
    console.error('Error removing multiple items', error);
  }
};

// Clear all storage including secure items
export const clearStorage = async (): Promise<void> => {
  try {
    // Clear AsyncStorage
    await AsyncStorage.clear();
    // Remove all secure items
    await Promise.all(
      Array.from(SECURE_KEYS).map(key => SecureStore.deleteItemAsync(key))
    );
  } catch (error) {
    console.error("Error clearing storage: ", error);
    throw error;
  }
};

// Get all AsyncStorage keys (secure keys not included)
export const getAllKeys = async (): Promise<string[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return [...keys]; // Convert readonly array to mutable array
  } catch (error) {
    console.error("Error retrieving all keys: ", error);
    return [];
  }
};

// Storage keys enumeration
export const StorageKeys = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
};