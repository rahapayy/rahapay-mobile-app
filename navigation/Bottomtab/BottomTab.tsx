import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Profile, MoreSquare, WalletAdd1, Cards } from "iconsax-react-native";
import HomeScreen from "../../screens/HomeScreen";
import ServicesScreen from "../../screens/ServicesScreen";
import WalletScreen from "../../screens/WalletScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import CardsScreen from "../../screens/CardsScreen";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from "react-native-reanimated";

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
  const translateY = useSharedValue(focused ? 0 : 10);
  const opacity = useSharedValue(focused ? 1 : 0);

  React.useEffect(() => {
    translateY.value = withTiming(focused ? 0 : 10, { duration: 300 });
    opacity.value = withTiming(focused ? 1 : 0, { duration: 300 });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text
      style={[
        styles.tabBarLabel,
        {
          color: focused
            ? customColors.activeTintColor
            : customColors.inactiveTintColor,
        },
        animatedStyle,
      ]}
      numberOfLines={1}
      ellipsizeMode="tail"
      allowFontScaling={false}
    >
      {title}
    </Animated.Text>
  );
};

interface AnimatedIconProps {
  focused: boolean;
  IconComponent: React.ElementType;
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({ focused, IconComponent }) => {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.2 : 1, { damping: 15, stiffness: 90 });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <IconComponent size={27} color={focused ? customColors.activeTintColor : customColors.inactiveTintColor} variant={focused ? "Bold" : "Linear"} />
    </Animated.View>
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
            <AnimatedIcon focused={focused} IconComponent={Home} />
          ),
          tabBarLabel: ({ focused }) =>
            focused ? <TabBarLabel focused={focused} title="Home" /> : null,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedIcon focused={focused} IconComponent={MoreSquare} />
          ),
          tabBarLabel: ({ focused }) =>
            focused ? <TabBarLabel focused={focused} title="Services" /> : null,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedIcon focused={focused} IconComponent={WalletAdd1} />
          ),
          tabBarLabel: ({ focused }) =>
            focused ? <TabBarLabel focused={focused} title="Wallet" /> : null,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Cards"
        component={CardsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedIcon focused={focused} IconComponent={Cards} />
          ),
          tabBarLabel: ({ focused }) =>
            focused ? <TabBarLabel focused={focused} title="Cards" /> : null,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedIcon focused={focused} IconComponent={Profile} />
          ),
          tabBarLabel: ({ focused }) =>
            focused ? <TabBarLabel focused={focused} title="Profile" /> : null,
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
