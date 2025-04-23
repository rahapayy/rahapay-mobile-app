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
      <View className="bg-white p-6 rounded-lg">
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ""
  },
  text: {
    marginTop: 10,
    color: "#666",
  },
});

export default Loading;
