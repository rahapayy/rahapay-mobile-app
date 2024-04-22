import React from "react";
import { createTheme, ThemeProvider } from "@rneui/themed";
import Component from "./components/MyComponent";
import HomeScreen from "./screens/HomeScreen";
import SwipeButton from "./components/SwipeButton";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const theme = createTheme({
  lightColors: {},
  darkColors: {},
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* <Component /> */}
      {/* <HomeScreen /> */}
      
      <GestureHandlerRootView style={{ flex: 1 }}>
      <SwipeButton />
    </GestureHandlerRootView>
    </ThemeProvider>
  );
}
