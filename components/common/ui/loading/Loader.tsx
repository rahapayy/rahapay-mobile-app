import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { RegularText } from "../../Text";

interface LoadingProps {
  text?: string;
  size?: "small" | "large";
  color?: string;
}

const Loading: React.FC<LoadingProps> = ({
  text = "",
  size = "large",
  color = "#0000ff",
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.loaderBox}>
        <ActivityIndicator size={size} color={color} />
        {text && (
          <RegularText color="black" style={styles.text}>
            {text}
          </RegularText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  loaderBox: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  text: {
    marginTop: 10,
    color: "#666",
  },
});

export default Loading;
