import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { MediumText } from "../../Text";

interface Props {
  text: string;
  marked: boolean;
}

const Label: React.FunctionComponent<Props> = ({ text, marked }) => {
  return (
    <View style={styles.row}>
      <MediumText color="mediumGrey" size="small">
        {text}
        {marked && <Text style={styles.requiredSymbol}> *</Text>}
      </MediumText>
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
