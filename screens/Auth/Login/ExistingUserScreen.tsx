import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import FaceId from "../../../assets/svg/mingcute_faceid-line.svg";
import COLORS from "../../../config/colors";
import SPACING from "../../../config/SPACING";
import Backspace from "../../../assets/svg/solar_backspace-linear.svg";
import { authenticateWithBiometrics } from "../../../context/Biometrics";

const ExistingUserScreen: React.FC<{ onCorrectPin: () => void }> = ({
  onCorrectPin,
}) => {
  const [pin, setPin] = useState<string>("");

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
      onCorrectPin();
    }
  };

  useEffect(() => {
    pin.length === 4 && onCorrectPin;
  }, [pin]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/avatar.png")}
        style={styles.logo}
      />
      <Text style={styles.welcomeText}>Welcome back Shedrach!</Text>
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
      <Text style={styles.resetText}>
        Having troubles remembering pin?{" "}
        <Text style={styles.linkText}>Reset Pin</Text>
      </Text>
      <Text style={styles.switchAccountText}>
        Not you? <Text style={styles.linkText}>Switch Account</Text>
      </Text>
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
    width: 20,
    height: 20,
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
    color: COLORS.violet400,
    marginTop: 8,
    fontFamily: "Outfit-Bold",
  },
});
