import React from "react";
import { StyleSheet, Text, TextProps, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Home,
  Profile,
  MoreSquare,
  WalletAdd1,
  Cards,
} from "iconsax-react-native";
import HomeScreen from "../screens/HomeScreen";
import ServicesScreen from "../screens/ServicesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CardsScreen from "../screens/CardsScreen";

const Tab = createBottomTabNavigator();

const customColors = {
  tabBarBackground: "#fff",
  activeTintColor: "#5136C1",
  inactiveTintColor: "#8E9AAF",
};

interface TabBarLabelProps extends TextProps {
  focused: boolean;
  title: string;
}

const TabBarLabel: React.FC<TabBarLabelProps> = ({ focused, title }) => {
  return (
    <Text
      style={[
        styles.tabBarLabel,
        {
          color: focused
            ? customColors.activeTintColor
            : customColors.inactiveTintColor,
        },
      ]}
      numberOfLines={1}
      ellipsizeMode="tail"
      allowFontScaling={false}
    >
      {title}
    </Text>
  );
};

interface IconProps {
  focused: boolean;
  IconComponent: React.ElementType;
}

const TabIcon: React.FC<IconProps> = ({ focused, IconComponent }) => {
  return (
    <IconComponent
      size={27}
      color={
        focused ? customColors.activeTintColor : customColors.inactiveTintColor
      }
      variant={focused ? "Bold" : "Linear"}
    />
  );
};

const BottomTab: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: customColors.tabBarBackground,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          borderTopColor: "transparent",
          height: "11%",
          position: "absolute",
        },
        tabBarActiveTintColor: customColors.activeTintColor,
        tabBarInactiveTintColor: customColors.inactiveTintColor,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} IconComponent={Home} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabBarLabel focused={focused} title="Home" />
          ), // Removed conditional
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} IconComponent={MoreSquare} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabBarLabel focused={focused} title="Services" />
          ), // Removed conditional
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Card"
        component={CardsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} IconComponent={Cards} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabBarLabel focused={focused} title="Card" />
          ), // Removed conditional
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} IconComponent={Profile} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabBarLabel focused={focused} title="Profile" />
          ), // Removed conditional
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarLabel: {
    fontSize: 14,
    fontFamily: "Outfit-Medium",
    paddingBottom: 5,
  },
});

export default BottomTab;
