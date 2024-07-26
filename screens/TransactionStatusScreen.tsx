import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import COLORS from "../config/colors";
import SPACING from "../config/SPACING";
import { RFValue } from "react-native-responsive-fontsize";
import * as Animatable from "react-native-animatable";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import Button from "../components/Button";
import { ReceiptText, Timer, Warning2 } from "iconsax-react-native";
import { RootStackParamList } from "../navigation/RootStackParams";

type TransactionStatusScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "TransactionStatusScreen"
>;
type TransactionStatusScreenRouteProp = RouteProp<
  RootStackParamList,
  "TransactionStatusScreen"
>;

type Props = {
  navigation: TransactionStatusScreenNavigationProp;
  route: TransactionStatusScreenRouteProp;
};

const TransactionStatusScreen: React.FC<Props> = ({ navigation, route }) => {
  const { status } = route.params;

  const getStatusProps = () => {
    switch (status) {
      case "pending":
        return {
          headText: "Transaction Pending",
          subText: "Your transaction is currently being processed.",
          animation: "pulse",
          icon: <Timer variant="Bold" color={COLORS.orange400} size={150} />,
        };
      case "failed":
        return {
          headText: "Transaction Failed",
          subText: "Something went wrong. Please try again.",
          animation: "shake",
          icon: <Warning2 variant="Bold" color={COLORS.red400} size={150} />,
        };
      case "successful":
        return {
          headText: "Transaction Completed",
          subText: "Order has been processed successfully.",
          animation: "pulse",
          icon: (
            <ReceiptText variant="Bold" color={COLORS.violet400} size={150} />
          ),
        };
      default:
        return {
          headText: "Transaction Status",
          subText: "Unknown status",
          animation: "pulse",
          icon: null,
        };
    }
  };

  const { headText, subText, animation, icon } = getStatusProps();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View style={styles.circleContain}>
          <Animatable.View
            animation={animation}
            duration={2000}
            iterationCount="infinite"
          >
            {icon}
          </Animatable.View>
        </View>
        <View style={{ alignItems: "center", marginTop: 8 }}>
          <Text style={styles.headText} allowFontScaling={false}>
            {headText}
          </Text>
          <Text style={styles.subText} allowFontScaling={false}>
            {subText}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title={"Done"}
            textColor="#fff"
            onPress={() => navigation.navigate("HomeScreen")}
          />
          <Button
            title={"Pay Another Bill"}
            textColor="#A07CFF"
            style={styles.inactiveButton}
            onPress={() => navigation.navigate("AirtimeScreen")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TransactionStatusScreen;

const styles = StyleSheet.create({
  circleContain: {
    backgroundColor: COLORS.violet200,
    width: 250,
    height: 250,
    borderRadius: SPACING * 15,
    justifyContent: "center",
    alignItems: "center",
  },
  headText: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(18),
  },
  subText: {
    fontFamily: "Outfit-Regular",
    color: "#ADADAD",
    fontSize: RFValue(14),
  },
  buttonContainer: {
    paddingHorizontal: SPACING,
    paddingBottom: SPACING * 2,
  },
  inactiveButton: {
    backgroundColor: COLORS.violet200,
    marginTop: SPACING,
  },
});
