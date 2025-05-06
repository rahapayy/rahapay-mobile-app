import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LockScreen from "./LockScreen";
import PasswordReauthScreen from "./PasswordReauthScreen";
import { UserInfo } from "@/types/user";
import { getItem } from "@/utils/storage";

type LockStackParamList = {
  LockScreen: undefined;
  PasswordReauthScreen: { onPasswordSuccess: () => void };
};

const Stack = createNativeStackNavigator<LockStackParamList>();

interface LockStackNavigatorProps {
  onBiometricSuccess: () => void;
  onBiometricFailure: () => void;
  onPasswordSuccess: () => void;
  onSwitchAccount: () => void;
  userInfo: UserInfo | null;
}

const LockStackNavigator: React.FC<LockStackNavigatorProps> = ({
  onBiometricSuccess,
  onBiometricFailure,
  onPasswordSuccess,
  onSwitchAccount,
  userInfo,
}) => {
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

  useEffect(() => {
    const checkBiometricPreference = async () => {
      const biometricEnabled = await getItem("BIOMETRIC_ENABLED");
      setIsBiometricEnabled(biometricEnabled === "true");
    };
    checkBiometricPreference();
  }, []);

  if (!isBiometricEnabled) {
    return (
      <LockScreen
        onBiometricSuccess={onBiometricSuccess}
        onBiometricFailure={onBiometricFailure}
        onPasswordLogin={() => onPasswordSuccess()}
        onSwitchAccount={onSwitchAccount}
        userInfo={userInfo}
      />
    );
  }

  return (
    <Stack.Navigator screenOptions={{ gestureEnabled: false }}>
      <Stack.Screen name="LockScreen" options={{ headerShown: false }}>
        {(props) => (
          <LockScreen
            {...props}
            onBiometricSuccess={onBiometricSuccess}
            onBiometricFailure={onBiometricFailure}
            onPasswordLogin={() =>
              props.navigation.navigate("PasswordReauthScreen", {
                onPasswordSuccess,
              })
            }
            onSwitchAccount={onSwitchAccount}
            userInfo={userInfo}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="PasswordReauthScreen"
        options={{ headerShown: false }}
      >
        {(props) => (
          <PasswordReauthScreen
            {...props}
            onPasswordSuccess={props.route.params.onPasswordSuccess}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default LockStackNavigator;
