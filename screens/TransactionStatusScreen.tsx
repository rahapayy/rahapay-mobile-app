import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React from "react";
import COLORS from "../constants/colors";
import SPACING from "../constants/SPACING";
import { RFValue } from "react-native-responsive-fontsize";
import * as Animatable from "react-native-animatable";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import Button from "../components/common/ui/buttons/Button";
import { ReceiptText, Timer, Warning2, Copy } from "iconsax-react-native";
import { AppStackParamList } from "../types/RootStackParams";
import useWallet from "@/hooks/use-wallet";
import { handleShowFlash } from "@/components/FlashMessageComponent";
import * as Clipboard from "expo-clipboard";
import { MediumText, RegularText } from "@/components/common/Text";

type TransactionStatusScreenNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  "TransactionStatusScreen"
>;
type TransactionStatusScreenRouteProp = RouteProp<
  AppStackParamList,
  "TransactionStatusScreen"
> & {
  params: {
    status: "success" | "failed" | "pending" | "successful";
    tranxType?: string;
    token?: string;
    meterType?: string;
    transactionType?: string;
    transactionDetails?: {
      electricity_token?: string;
      electricity_units?: string;
    };
    errorMessage?: string;
  };
};

type Props = {
  navigation: TransactionStatusScreenNavigationProp;
  route: TransactionStatusScreenRouteProp;
};

const TransactionStatusScreen: React.FC<Props> = ({ navigation, route }) => {
  const { status, tranxType, token, meterType } = route.params;
  const { refreshAll } = useWallet();

  const handlePayAnotherBill = () => {
    navigation.navigate("ServicesScreen");
  };

  const handleDone = () => {
    if (status === "success") {
      refreshAll();
    }
    navigation.navigate("HomeScreen");
  };
  const ShareReciept = () => {
    navigation.navigate("TransactionHistoryScreen");
  };

  const copyToken = () => {
    if (token) {
      Clipboard.setStringAsync(token);
      handleShowFlash({
        message: "Token copied to clipboard",
        type: "success",
      });
    }
  };

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
      case "success":
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View className="justify-center items-center mt-6">
          <View style={styles.circleContain}>
            <Animatable.View
              animation={animation}
              duration={2000}
              iterationCount="infinite"
            >
              {icon}
            </Animatable.View>
          </View>
          <View style={styles.textContainer}>
            <MediumText color="black" size="xlarge">
              {headText}
            </MediumText>
            <RegularText color="light">{subText}</RegularText>
            {status === "success" &&
              tranxType === "ELECTRICITY_PURCHASE" &&
              meterType === "Prepaid" &&
              token && (
                <View style={styles.tokenContainer}>
                  <Text style={styles.tokenText}>Token: {token}</Text>
                  <TouchableOpacity
                    onPress={copyToken}
                    style={styles.copyButton}
                  >
                    <Copy size={20} color={COLORS.violet400} />
                  </TouchableOpacity>
                </View>
              )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button title={"Done"} textColor="#fff" onPress={handleDone} />
          <Button
            title={"Pay another bill"}
            textColor="#4931AE"
            onPress={handlePayAnotherBill}
            borderOnly
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING,
  },
  circleContain: {
    backgroundColor: COLORS.violet200,
    width: 250,
    height: 250,
    borderRadius: SPACING * 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING * 5,
  },
  textContainer: {
    alignItems: "center",
    marginTop: SPACING * 2,
  },
  headText: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(18),
  },
  subText: {
    fontFamily: "Outfit-Regular",
    color: "#ADADAD",
    fontSize: RFValue(14),
    marginTop: SPACING,
  },
  tokenContainer: {
    marginTop: SPACING * 2,
    alignItems: "center",
    backgroundColor: COLORS.violet100,
    padding: SPACING,
    borderRadius: 10,
  },
  tokenText: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(14),
    color: COLORS.black400,
    marginBottom: SPACING,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.violet400,
    paddingVertical: SPACING / 2,
    paddingHorizontal: SPACING,
    borderRadius: 5,
  },
  copyText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(12),
    color: COLORS.white,
    marginLeft: SPACING / 2,
  },
  buttonContainer: {
    width: "100%",
    justifyContent: "flex-end",
    gap: 10,
    marginBottom: SPACING * 4,
  },
});

export default TransactionStatusScreen;
