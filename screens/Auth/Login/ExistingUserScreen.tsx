import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import FaceId from "../../../assets/svg/mingcute_faceid-line.svg";
import COLORS from "../../../config/colors";
import SPACING from "../../../config/SPACING";
import Backspace from "../../../assets/svg/solar_backspace-linear.svg";
import { authenticateWithBiometrics } from "../../../context/Biometrics";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthContext } from "../../../context/AuthContext";

type ExistingUserScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const ExistingUserScreen: React.FC<ExistingUserScreenProps> = ({
  navigation,
}) => {
  const [pin, setPin] = useState<string>("");
  const { refreshAccessToken, userDetails } = useContext(AuthContext);

  const handlePinPress = (value: string) => {
    if (pin.length < 4) {
      setPin(pin + value);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const renderPinDots = () => {
    let dots = [];
    for (let i = 0; i < 4; i++) {
      dots.push(
        <View
          key={i}
          style={[styles.dot, { opacity: i < pin.length ? 1 : 0.2 }]}
        />
      );
    }
    return dots;
  };

  const handleBiometricAuth = async () => {
    const success = await authenticateWithBiometrics();
    if (success) {
      await refreshAccessToken();
    }
  };

  const handlePinSubmit = async () => {
    if (pin.length === 4) {
      await refreshAccessToken({ pin });
    }
  };

  useEffect(() => {
    if (pin.length === 4) {
      handlePinSubmit();
    }
  }, [pin]);

  const fullName = userDetails?.fullName || "";
  const firstName = fullName.split(" ")[0];

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/avatar.png")}
        style={styles.logo}
      />
      <Text style={styles.welcomeText}>Welcome back {firstName}!</Text>
      <Text style={styles.subText}>
        Enter the pin associated with your account
      </Text>
      <View style={styles.pinContainer}>{renderPinDots()}</View>
      <View style={styles.keypad}>
        {(
          [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "face",
            "0",
            "backspace",
          ] as const
        ).map((key, index) => (
          <TouchableOpacity
            key={index}
            style={styles.key}
            onPress={() => {
              if (key === "backspace") {
                handleBackspace();
              } else if (key !== "face") {
                handlePinPress(key);
              } else {
                handleBiometricAuth();
              }
            }}
          >
            {key === "face" ? (
              <FaceId style={styles.icon} />
            ) : key === "backspace" ? (
              <Backspace style={styles.icon} />
            ) : (
              <Text style={styles.keyText}>{key}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
      <View className="flex-row gap-2">
        <Text style={styles.resetText}>Having troubles remembering pin?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("ResetPinScreen")}>
          <Text style={styles.linkText}>Reset Pin</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row gap-2 mt-2">
        <Text style={styles.switchAccountText} allowFontScaling={false}>
          Not you?
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("CreateAccountScreen")}
        >
          <Text style={styles.linkText} allowFontScaling={false}>
            Switch Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ExistingUserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginTop: SPACING,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: "Outfit-Bold",
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: "#7D7D7D",
    marginBottom: 32,
    fontFamily: "Outfit-Regular",
  },
  pinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 32,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 10,
    backgroundColor: COLORS.violet400,
    margin: 8,
  },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 32,
    gap: 10,
  },
  key: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
    borderRadius: 40,
    backgroundColor: "#F2F2F2",
  },
  keyText: {
    fontSize: 24,
    fontFamily: "Outfit-Bold",
  },
  icon: {
    width: 24,
    height: 24,
  },
  resetText: {
    fontSize: 14,
    color: "#7D7D7D",
    fontFamily: "Outfit-Regular",
  },
  linkText: {
    color: COLORS.violet400,
    fontFamily: "Outfit-Bold",
  },
  switchAccountText: {
    fontSize: 14,
    color: "#7D7D7D",
    marginTop: 8,
    fontFamily: "Outfit-Regular",
  },
});
