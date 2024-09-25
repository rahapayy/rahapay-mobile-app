import AsyncStorage from "@react-native-async-storage/async-storage";

// Store a string value in AsyncStorage
export const setItem = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error storing value for key "${key}": `, error);
    throw error; // Optionally throw to propagate error
  }
};

// Retrieve a string value from AsyncStorage
export const getItem = async (
  key: string,
  defaultValue: string | null = null
): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null ? value : defaultValue;
  } catch (error) {
    console.error(`Error retrieving value for key "${key}": `, error);
    return defaultValue; // Optionally return default value in case of error
  }
};

// Remove a value from AsyncStorage
export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error deleting value for key "${key}": `, error);
    throw error; // Optionally throw to propagate error
  }
};

// Store an object or array in AsyncStorage (stored as JSON)
export const setObject = async <T,>(key: string, value: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error storing object for key "${key}": `, error);
    throw error; // Optionally throw to propagate error
  }
};

// Retrieve an object or array from AsyncStorage (parsed from JSON)
export const getObject = async <T,>(
  key: string,
  defaultValue: T | null = null
): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue !== null ? JSON.parse(jsonValue) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving object for key "${key}": `, error);
    return defaultValue; // Optionally return default value in case of error
  }
};

// Clear all keys stored in AsyncStorage
export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error("Error clearing AsyncStorage: ", error);
    throw error; // Optionally throw to propagate error
  }
};

// Get all keys stored in AsyncStorage
export const getAllKeys = async (): Promise<string[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return [...keys]; // Convert readonly array to mutable array
  } catch (error) {
    console.error("Error retrieving all keys: ", error);
    return [];
  }
};
