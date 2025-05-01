import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import {
  ArrowLeft,
  DocumentDownload,
  WalletAdd1,
  Copy,
} from "iconsax-react-native";
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
import Dstv from "../assets/svg/dstv.svg";
import Gotv from "../assets/svg/gotv.svg";
import Startimes from "../assets/svg/startimes.svg";
import { handleShowFlash } from "@/components/FlashMessageComponent";
import { MediumText, RegularText } from "@/components/common/Text";

type TransactionSummaryRouteParams = {
  transaction: {
    purpose: string;
    amount: number;
    created_at: number | string;
    status: string;
    tranxType: string;
    referenceId: string;
    metadata?: {
      networkType?: string;
      phoneNumber?: string;
      cableName?: string;
      smartCardNo?: string;
      planName?: string;
      discoId?: string;
      discoName?: string;
      electricity?: string;
      meterNumber?: string;
      meterType?: "Prepaid" | "Postpaid";
      electricity_token?: string;
      electricity_units?: string;
      customerName?: string;
      customerAddress?: string;
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

  // Debug logging to inspect metadata
  console.log("Transaction metadata:", transaction.metadata);

  const networkType = transaction.metadata?.networkType;
  const cableName = transaction.metadata?.cableName;
  const discoId = transaction.metadata?.discoId;

  // Helper function to extract token numbers
  const getDisplayToken = (token: string | undefined): string => {
    if (!token || token === "Processing, check notifications later") {
      return token || "N/A";
    }
    // Split on " : " and take the second part
    const parts = token.split(" : ");
    return parts[1] || token; // Return numbers or original token if no " : "
  };

  const getDiscoIcon = (discoId: string | undefined) => {
    if (!discoId) return null;
    switch (discoId) {
      case "abuja-electric":
        return require("@/assets/images/electricity/abuja.jpeg");
      case "aba-electric":
        return require("@/assets/images/electricity/aba.png");
      case "benin-electric":
        return require("@/assets/images/electricity/benin.jpeg");
      case "eko-electric":
        return require("@/assets/images/electricity/eko.png");
      case "enugu-electric":
        return require("@/assets/images/electricity/enugu.png");
      case "ibadan-electric":
        return require("@/assets/images/electricity/ibadan.jpeg");
      case "ikeja-electric":
        return require("@/assets/images/electricity/ikeja.png");
      case "jos-electric":
        return require("@/assets/images/electricity/jos.jpeg");
      case "kaduna-electric":
        return require("@/assets/images/electricity/kaduna.png");
      case "kano-electric":
        return require("@/assets/images/electricity/kano.jpeg");
      case "yola-electric":
        return require("@/assets/images/electricity/yola.png");
      case "portharcourt-electric":
        return null;
      default:
        return null;
    }
  };

  const renderServiceIcon = (
    provider: string | undefined,
    discoId: string | undefined
  ) => {
    if (transaction.tranxType === "CABLE_SUBSCRIPTION" && cableName) {
      const cableLower = cableName.toLowerCase();
      switch (cableLower) {
        case "dstv":
          return <Dstv width={70} height={70} />;
        case "gotv":
          return <Gotv width={70} height={70} />;
        case "startime":
          return <Startimes width={70} height={70} />;
        default:
          return null;
      }
    }

    if (transaction.tranxType === "ELECTRICITY_PURCHASE" && discoId) {
      const iconSource = getDiscoIcon(discoId);
      return iconSource ? (
        <Image
          source={iconSource}
          style={styles.discoIcon}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.placeholderIcon} />
      );
    }

    if (!provider) return null;

    const providerLower = provider.toLowerCase();
    switch (providerLower) {
      case "airtel":
        return <Airtel width={70} height={70} />;
      case "mtn":
        return <Mtn width={70} height={70} />;
      case "9mobile":
        return <Eti width={70} height={70} />;
      case "glo":
        return <Glo width={70} height={70} />;
      default:
        return null;
    }
  };

  const copyToken = (token: string) => {
    Clipboard.setStringAsync(token);
    handleShowFlash({
      message: "Token copied to clipboard",
      type: "success",
    });
  };

  const renderTransactionDetails = () => {
    switch (transaction.tranxType) {
      case "WALLET_TRANSFER":
        return (
          <>
            <View style={styles.row}>
              <Text style={styles.titleText}>Sender</Text>
              <Text style={styles.descriptionText}>
                {transaction.metadata?.sender || "N/A"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.titleText}>Recipient</Text>
              <Text style={styles.descriptionText}>
                {transaction.metadata?.recipient || "N/A"}
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
              <Text style={styles.titleText}>Plan</Text>
              <Text style={styles.descriptionText}>
                {transaction.metadata?.planName || "N/A"}
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
      case "CABLE_SUBSCRIPTION":
        return (
          <>
            <View style={styles.row}>
              <Text style={styles.titleText}>Provider</Text>
              <Text style={styles.descriptionText}>
                {transaction.metadata?.cableName || "N/A"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.titleText}>Smart Card Number</Text>
              <Text style={styles.descriptionText}>
                {transaction.metadata?.smartCardNo || "N/A"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.titleText}>Plan</Text>
              <Text style={styles.descriptionText}>
                {transaction.metadata?.planName || "N/A"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.titleText}>Paid with</Text>
              <Text style={styles.descriptionText}>{transaction.purpose}</Text>
            </View>
          </>
        );
      case "ELECTRICITY_PURCHASE":
        return (
          <>
            <View style={styles.row}>
              <Text style={styles.titleText}>Provider</Text>
              <Text style={styles.descriptionText}>
                {transaction.metadata?.electricity ||
                  transaction.metadata?.discoName ||
                  "N/A"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.titleText}>Meter Number</Text>
              <Text style={styles.descriptionText}>
                {transaction.metadata?.meterNumber || "N/A"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.titleText}>Meter Type</Text>
              <Text style={styles.descriptionText}>
                {transaction.metadata?.meterType || "N/A"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.titleText}>Customer Name</Text>
              <Text style={styles.descriptionText}>
                {transaction.metadata?.customerName || "N/A"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.titleText}>Customer Address</Text>
              <Text style={styles.descriptionText}>
                {transaction.metadata?.customerAddress || "N/A"}
              </Text>
            </View>
          </>
        );
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
            <RegularText color="black">Transaction Summary</RegularText>
          </View>

          <View style={styles.iconWrapper}>
            {transaction.tranxType === "WALLET_FUNDING" ? (
              <View style={styles.iconContainer}>
                <WalletAdd1 color={COLORS.violet400} size={40} />
              </View>
            ) : (
              renderServiceIcon(networkType || cableName, discoId)
            )}
            <Text style={styles.itemText}>
              {transaction.tranxType.replace("_", " ")}
            </Text>
          </View>

          {transaction.tranxType === "ELECTRICITY_PURCHASE" &&
            transaction.metadata?.meterType === "Prepaid" && (
              <View style={styles.tokenSection}>
                <View style={styles.row}>
                  <Text style={styles.titleText}>Token</Text>
                  <View style={styles.tokenContainer}>
                    <MediumText color="black">
                      {transaction.metadata?.electricity_token ===
                      "Processing, check notifications later"
                        ? "Token processing, check notifications"
                        : getDisplayToken(
                            transaction.metadata?.electricity_token
                          )}
                    </MediumText>
                    {transaction.metadata?.electricity_token &&
                      transaction.metadata?.electricity_token !==
                        "Processing, check notifications later" && (
                        <TouchableOpacity
                          onPress={() =>
                            copyToken(transaction.metadata!.electricity_token!)
                          }
                          style={styles.copyButton}
                        >
                          <Copy size={16} color={COLORS.violet400} />
                        </TouchableOpacity>
                      )}
                  </View>
                </View>
                <View style={styles.row}>
                  <Text style={styles.titleText}>Units</Text>
                  <Text style={styles.descriptionText}>
                    {transaction.metadata?.electricity_units || "N/A"}
                  </Text>
                </View>
              </View>
            )}

          <View className="p-4">
            <View style={styles.container}>
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
                <Text style={styles.titleText}>Transaction No.</Text>
                <Text style={styles.descriptionText}>
                  {transaction.referenceId}
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
      <View className="px-4 mb-6">
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
    borderRadius: 35,
    marginRight: 10,
    backgroundColor: COLORS.violet100,
    justifyContent: "center",
    alignItems: "center",
  },
  discoIcon: {
    width: 70,
    height: 70,
  },
  placeholderIcon: {
    width: 70,
    height: 70,
    backgroundColor: COLORS.grey200,
    borderRadius: 35,
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
    marginTop: SPACING,
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
  tokenContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  copyButton: {
    marginLeft: SPACING,
    padding: SPACING / 2,
  },
  tokenSection: {
    paddingHorizontal: SPACING * 2,
    paddingVertical: SPACING,
    backgroundColor: COLORS.white,
    borderRadius: SPACING,
    marginHorizontal: SPACING * 1.5,
    marginTop: SPACING,
  },
});
