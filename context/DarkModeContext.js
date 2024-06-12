import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Load dark mode preference from storage on component mount
    const loadDarkModePreference = async () => {
      try {
        const storedDarkMode = await AsyncStorage.getItem("darkMode");
        if (storedDarkMode !== null) {
          setIsDarkMode(storedDarkMode === "true");
        }
      } catch (error) {
        console.error("Error loading dark mode preference:", error);
      }
    };

    loadDarkModePreference();
  }, []);

  const toggleDarkMode = () => {
    // Toggle dark mode and save preference to storage
    setIsDarkMode((prev) => {
      const newDarkMode = !prev;
      AsyncStorage.setItem("darkMode", newDarkMode.toString());
      return newDarkMode;
    });
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  return useContext(DarkModeContext);
};
