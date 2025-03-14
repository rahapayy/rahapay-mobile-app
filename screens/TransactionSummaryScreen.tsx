import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { ArrowLeft, DocumentDownload, WalletAdd1 } from "iconsax-react-native";
import SPACING from "../constants/SPACING";
import FONT_SIZE from "../constants/font-size";
import COLORS from "../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import { AppStackParamList } from "../types/RootStackParams";
import Airtel from "../assets/svg/airtelbig.svg";
import Mtn from "../assets/svg/mtnbig.svg";
import Eti from "../assets/svg/9mobilebig.svg";
import Glo from "../assets/svg/globig.svg";
import { DownloadReceiptButton } from "@/components/DownloadReceipt";

type TransactionSummaryRouteParams = {
  transaction: {
    purpose: string;
    amount: number;
    created_at: number;
    status: string;
    tranxType: string;
    referenceId: string;
    metadata?: {
      networkType?: string;
      phoneNumber?: string;
    };
  };
};

type TransactionSummaryScreenProps = {
  navigation: NativeStackNavigationProp<
    AppStackParamList,
    "TransactionSummaryScreen"
  >;
  route: RouteProp<AppStackParamList, "TransactionSummaryScreen">;
};

const TransactionSummaryScreen: React.FC<TransactionSummaryScreenProps> = ({
  navigation,
  route,
}) => {
  const { transaction } = route.params;

  const networkType = transaction.metadata?.networkType;

  const renderServiceIcon = (provider: string) => {
    // Ensure the provider name is always in lower case for comparison
    const providerLower = provider.toLowerCase();
    switch (providerLower) {
      case "airtel":
        return <Airtel width={70} height={70} />;
      case "mtn": // This line is changed to lowercase
        return <Mtn width={70} height={70} />;
      case "9mobile":
        return <Eti width={70} height={70} />;
      case "glo":
        return <Glo width={70} height={70} />;
      default:
        return;
    }
  };

  const renderTransactionDetails = () => {
    switch (transaction.tranxType) {
      case "WALLET_TRANSFER":
        return (
          <>
            <View style={styles.row}>
              <Text style={styles.titleText}>Sender</Text>
              <Text style={styles.descriptionText}>
                {transaction.metadata?.sender}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.titleText}>Recipient</Text>
              <Text style={styles.descriptionText}>
                {transaction.metadata?.recipient}
              </Text>
            </View>
          </>
        );
      case "AIRTIME_PURCHASE":
        return (
          <>
            <View style={styles.row}>
              <Text style={styles.titleText}>Network</Text>
              <Text style={styles.descriptionText}>
                {transaction.metadata?.networkType || "N/A"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.titleText}>Recipient Mobile</Text>
              <Text style={styles.descriptionText}>
                {transaction.metadata?.phoneNumber || "N/A"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.titleText}>Paid with</Text>
              <Text style={styles.descriptionText}>{transaction.purpose}</Text>
            </View>
          </>
        );
      case "DATA_PURCHASE":
        return (
          <>
            <View style={styles.row}>
              <Text style={styles.titleText}>Network</Text>
              <Text style={styles.descriptionText}>
                {transaction.metadata?.networkType || "N/A"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.titleText}>Recipient Mobile</Text>
              <Text style={styles.descriptionText}>
                {transaction.metadata?.phoneNumber || "N/A"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.titleText}>Paid with</Text>
              <Text style={styles.descriptionText}>{transaction.purpose}</Text>
            </View>
          </>
        );
      case "WALLET_FUNDING":
        return (
          <>
            <View style={styles.row}>
              <Text style={styles.titleText}>Funding Source</Text>
              <Text style={styles.descriptionText}>
                {transaction.purpose || "Unknown Source"}
              </Text>
            </View>
          </>
        );
      // Add more cases for other transaction types
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.leftIcon}
            >
              <ArrowLeft color={"#000"} size={24} />
            </TouchableOpacity>
            <Text style={[styles.headerText]} allowFontScaling={false}>
              Transaction Summary
            </Text>
          </View>

          <View style={styles.iconWrapper}>
            {transaction.tranxType === "WALLET_FUNDING" ? (
              <View style={styles.iconContainer}>
                <WalletAdd1 color={COLORS.violet400} size={40} />
              </View>
            ) : null}
            {networkType && renderServiceIcon(networkType)}
            <Text style={styles.itemText} allowFontScaling={false}>
              {transaction.tranxType.replace("_", " ")}
            </Text>
          </View>

          <View className="p-4">
            <View style={styles.container}>
              <Text style={styles.headText} allowFontScaling={false}>
                Transaction Summary
              </Text>

              <View style={styles.row}>
                <Text style={styles.titleText}>Amount</Text>
                <Text style={styles.descriptionText}>
                  ₦{" "}
                  {transaction.amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.titleText}>Date</Text>
                <Text style={styles.descriptionText}>
                  {transaction.created_at}
                </Text>
              </View>

              {renderTransactionDetails()}

              <View style={styles.row}>
                <Text style={styles.titleText}>Status</Text>
                <View style={styles.statusContainer}>
                  <Text style={styles.completedText}>
                    {transaction.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View className="px-4 mb-4">
        <DownloadReceiptButton transaction={transaction} />
      </View>
    </SafeAreaView>
  );
};

export default TransactionSummaryScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING * 2,
    paddingTop: SPACING * 2,
    paddingBottom: SPACING * 3,
  },
  leftIcon: {
    marginRight: SPACING,
  },
  headerText: {
    color: "#000",
    fontSize: FONT_SIZE.medium,
    fontFamily: "Outfit-Regular",
    flex: 1,
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginRight: 10,
    backgroundColor: COLORS.violet100,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: FONT_SIZE.medium,
    fontFamily: "Outfit-Medium",
    paddingVertical: SPACING * 2,
  },
  container: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING,
    paddingVertical: SPACING,
    borderRadius: SPACING,
    marginTop: SPACING * 4,
  },
  headText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(16),
    marginBottom: SPACING,
  },
  titleText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(14),
    paddingVertical: 5,
  },
  descriptionText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(12),
    color: "#9BA1A8",
  },
  row: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: SPACING,
  },
  statusContainer: {
    padding: 5,
    backgroundColor: "#E6F9F1",
    borderRadius: 10,
  },
  completedText: {
    fontFamily: "Outfit-Regular",
    color: "#06C270",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderStyle: "dotted",
    borderColor: "#000",
    paddingVertical: SPACING,
    paddingHorizontal: SPACING * 3,
    borderRadius: 8,
    marginTop: SPACING * 2,
  },
  buttonText: {
    marginLeft: SPACING,
    color: "#000",
    fontFamily: "Outfit-Regular",
    fontSize: FONT_SIZE.medium,
  },
});
