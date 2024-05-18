import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Profile, MoreSquare, WalletAdd1, Cards } from "iconsax-react-native";
import HomeScreen from "../../screens/HomeScreen";
import ServicesScreen from "../../screens/ServicesScreen";
import WalletScreen from "../../screens/WalletScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import CardsScreen from "../../screens/CardsScreen";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

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

interface AnimatedIconProps {
  focused: boolean;
  children: React.ReactNode;
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({ focused, children }) => {
  const scale = useSharedValue(1);

  if (focused) {
    scale.value = withSpring(1.2);
  } else {
    scale.value = withSpring(1);
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
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
          borderBottomColor: "transparent",
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          height: "10%",
        },
        tabBarActiveTintColor: customColors.activeTintColor,
        tabBarInactiveTintColor: customColors.inactiveTintColor,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon focused={focused}>
              <Home size={27} color={color} />
            </AnimatedIcon>
          ),
          tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} title="Home" />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon focused={focused}>
              <MoreSquare size={27} color={color} />
            </AnimatedIcon>
          ),
          tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} title="Services" />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon focused={focused}>
              <WalletAdd1 size={27} color={color} />
            </AnimatedIcon>
          ),
          tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} title="Wallet" />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Cards"
        component={CardsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon focused={focused}>
              <Cards size={27} color={color} />
            </AnimatedIcon>
          ),
          tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} title="Cards" />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon focused={focused}>
              <Profile size={27} color={color} />
            </AnimatedIcon>
          ),
          tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} title="Profile" />,
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
