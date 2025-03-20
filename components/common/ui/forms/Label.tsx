import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { RegularText } from "../../Text";

interface Props {
  text: string;
  marked: boolean;
}

const Label: React.FunctionComponent<Props> = ({ text, marked }) => {
  return (
    <View style={styles.row}>
      <RegularText color="label" size="small">
        {text}
        {marked && <Text style={styles.requiredSymbol}> *</Text>}
      </RegularText>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  requiredSymbol: {
    color: "red",
  },
});

export default Label;
