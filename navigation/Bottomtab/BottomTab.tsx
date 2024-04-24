import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Home,
  Profile,
  MoreSquare,
  WalletAdd1,
  Cards,
} from "iconsax-react-native";
import HomeScreen from "../../screens/HomeScreen";
import ServicesScreen from "../../screens/ServicesScreen";
import WalletScreen from "../../screens/WalletScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import CardsScreen from "../../screens/CardsScreen";

const Tab = createBottomTabNavigator();

const customColors = {
  tabBarBackground: "#fff", 
  activeTintColor: "#5136C1", 
  inactiveTintColor: "#8E9AAF", 
};

const BottomTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: customColors.tabBarBackground,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          height: "10%",
        },
        tabBarActiveTintColor: customColors.activeTintColor,
        tabBarInactiveTintColor: customColors.inactiveTintColor,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Home size={27} color={color} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{
          tabBarIcon: ({ color }) => <MoreSquare size={27} color={color} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarIcon: ({ color }) => <WalletAdd1 size={27} color={color} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Cards"
        component={CardsScreen}
        options={{
          tabBarIcon: ({ color }) => <Cards size={27} color={color} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <Profile size={27} color={color} />,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarLabel: {
    fontSize: 14,
    fontWeight: "600",
    paddingBottom: 5,
  },
});

export default BottomTab;