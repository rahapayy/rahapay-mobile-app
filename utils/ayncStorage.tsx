import AsyncStorage from "@react-native-async-storage/async-storage";

// Store a string value in AsyncStorage
export const setItem = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log(`Error storing value for key "${key}": `, error);
    // You can handle the error more specifically if needed
  }
};

// Retrieve a string value from AsyncStorage
export const getItem = async (key: string, defaultValue: string | null = null): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? value : defaultValue;
  } catch (error) {
    console.log(`Error retrieving value for key "${key}": `, error);
    return defaultValue;
  }
};

// Remove a value from AsyncStorage
export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(`Error deleting value for key "${key}": `, error);
  }
};

// Store an object or array in AsyncStorage (stored as JSON)
export const setObject = async (key: string, value: object): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.log(`Error storing object for key "${key}": `, error);
  }
};

// Retrieve an object or array from AsyncStorage (parsed from JSON)
export const getObject = async (key: string, defaultValue: object | null = null): Promise<object | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : defaultValue;
  } catch (error) {
    console.log(`Error retrieving object for key "${key}": `, error);
    return defaultValue;
  }
};

// Clear all keys stored in AsyncStorage
export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.log("Error clearing AsyncStorage: ", error);
  }
};

// Get all keys stored in AsyncStorage
export const getAllKeys = async (): Promise<string[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return [...keys]; // Convert readonly array to mutable array
  } catch (error) {
    console.log("Error retrieving all keys: ", error);
    return [];
  }
};
