import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTab from "../navigation/Bottomtab/BottomTab";
import ServicesScreen from "../screens/ServicesScreen";
import WalletScreen from "../screens/WalletScreen";
import CardsScreen from "../screens/CardsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AirtimeScreen from "../screens/Services/AirtimeScreen";
import DataScreen from "../screens/Services/DataScreen";
import ElectricityScreen from "../screens/Services/ElectricityScreen";
import TransferToUser from "../screens/Services/TransferToUser";
import TvSubscriptionScreen from "../screens/Services/TvSubscriptionScreen";

const Stack = createNativeStackNavigator();
const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={BottomTab}
        options={{
          headerShown: false,
        }}
      />
      {/* <Stack.Screen
        name="ServicesScreen"
        component={ServicesScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="WalletScreen"
        component={WalletScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CardsScreen"
        component={CardsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name="AirtimeScreen"
        component={AirtimeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DataScreen"
        component={DataScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ElectricityScreen"
        component={ElectricityScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TransferToUserScreen"
        component={TransferToUser}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TvSubscriptionScreen"
        component={TvSubscriptionScreen}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen name="" component={} options={{ headerShown: false }} />
      <Stack.Screen name="" component={} options={{ headerShown: false }} /> */}
    </Stack.Navigator>
  );
};

export default AppStack;
