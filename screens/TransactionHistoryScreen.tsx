import React, { useEffect, useState, useMemo } from "react";
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SectionList,
  ActivityIndicator,
  Image,
} from "react-native";
import { ArrowLeft, WalletAdd1 } from "iconsax-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import LottieView from "lottie-react-native";
import { RFValue } from "react-native-responsive-fontsize";
import useWallet from "../hooks/use-wallet";
import { MediumText } from "../components/common/Text";
import SPACING from "../constants/SPACING";
import COLORS from "../constants/colors";
import Airtel from "../assets/svg/airtelbig.svg";
import Mtn from "../assets/svg/mtnbig.svg";
import Eti from "../assets/svg/9mobilebig.svg";
import Glo from "../assets/svg/globig.svg";
import { Skeleton } from "@rneui/themed";
import Dstv from "../assets/svg/dstv.svg";
import Gotv from "../assets/svg/gotv.svg";
import Startimes from "../assets/svg/startimes.svg";

const AllTransactionsScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { getAllTransactions } = useWallet();
  const { transactions, pagination, isLoading, currentPage, setCurrentPage } =
    getAllTransactions();

  const [hasTransaction, setHasTransaction] = useState(false);

  const groupedTransactions = useMemo(() => {
    if (transactions.length === 0) return [];

    const sortedTransactions = [...transactions].sort((a, b) => {
      return new Date(b.paidOn).getTime() - new Date(a.paidOn).getTime();
    });

    const groups: { [key: string]: any[] } = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    sortedTransactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.paidOn);
      transactionDate.setHours(0, 0, 0, 0);

      let sectionTitle;

      if (transactionDate.getTime() === today.getTime()) {
        sectionTitle = "Today";
      } else if (transactionDate.getTime() === yesterday.getTime()) {
        sectionTitle = "Yesterday";
      } else if (
        transactionDate >= lastWeekStart &&
        transactionDate < yesterday
      ) {
        sectionTitle = "This Week";
      } else if (
        transactionDate >= thisMonthStart &&
        transactionDate < lastWeekStart
      ) {
        sectionTitle = "This Month";
      } else {
        sectionTitle = transactionDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      }

      if (!groups[sectionTitle]) {
        groups[sectionTitle] = [];
      }

      groups[sectionTitle].push(transaction);
    });

    return Object.keys(groups).map((key) => ({
      title: key,
      data: groups[key],
    }));
  }, [transactions]);

  useEffect(() => {
    setHasTransaction(transactions.length > 0);
  }, [transactions]);

  const handleLoadMore = () => {
    if (!isLoading && currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderServiceIcon = (
    provider: string | undefined,
    tranxType: string,
    cableName?: string,
    discoId?: string
  ) => {
    if (tranxType === "WALLET_FUNDING") {
      return <WalletAdd1 size={24} color={COLORS.violet400} />;
    }

    if (tranxType === "CABLE_SUBSCRIPTION" && cableName) {
      const cableLower = cableName.toLowerCase();
      switch (cableLower) {
        case "dstv":
          return <Dstv width={40} height={40} />;
        case "gotv":
          return <Gotv width={40} height={40} />;
        case "startime":
          return <Startimes width={40} height={40} />;
        default:
          return null;
      }
    }

    if (tranxType === "ELECTRICITY_PURCHASE" && discoId) {
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
        return <Airtel width={40} height={40} />;
      case "mtn":
        return <Mtn width={40} height={40} />;
      case "9mobile":
        return <Eti width={40} height={40} />;
      case "glo":
        return <Glo width={40} height={40} />;
      default:
        return null;
    }
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

  const mapTransactionToSummaryFormat = (transaction: {
    paidOn: string | number | Date;
    purpose: any;
    transactionType: any;
    amountPaid: any;
    paymentStatus: any;
    referenceId: any;
    _id: any;
    metadata: { networkType: any; phoneNumber: any; cableName?: string };
  }) => {
    const formattedDate = new Date(transaction.paidOn).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      purpose: transaction.purpose || transaction.transactionType,
      amount: transaction.amountPaid,
      created_at: formattedDate,
      status: transaction.paymentStatus,
      tranxType: transaction.transactionType,
      referenceId: transaction.referenceId || transaction._id,
      metadata: {
        ...transaction.metadata,
        networkType: transaction.metadata?.networkType,
        phoneNumber: transaction.metadata?.phoneNumber,
        cableName: transaction.metadata?.cableName,
      },
    };
  };

  const renderTransactionItem = ({ item }: { item: any }) => {
    const networkType = item.metadata?.networkType;
    const cableName = item.metadata?.cableName;
    const formattedTime = new Date(item.paidOn).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("TransactionSummaryScreen", {
            transaction: mapTransactionToSummaryFormat(item),
          })
        }
        style={styles.transactionItem}
      >
        <View style={styles.iconContainer}>
          {renderServiceIcon(
            networkType,
            item.transactionType,
            cableName,
            item.metadata?.discoId
          )}
        </View>
        <View style={styles.transactionTextContainer}>
          <View style={styles.transactionTextRow}>
            <Text style={styles.item} allowFontScaling={false}>
              {item.transactionType}
            </Text>
            <Text
              style={[
                styles.valueText,
                {
                  color:
                    item.transactionType.includes("PURCHASE") ||
                    item.transactionType === "CABLE_SUBSCRIPTION"
                      ? "black"
                      : "black",
                },
              ]}
              allowFontScaling={false}
            >
              {item.transactionType.includes("PURCHASE") ||
              item.transactionType === "CABLE_SUBSCRIPTION"
                ? "-"
                : "+"}{" "}
              ₦{item.amountPaid}
            </Text>
          </View>
          <View style={styles.transactionTextRow}>
            <Text style={styles.date} allowFontScaling={false}>
              {formattedTime}
            </Text>
            <View
              style={[
                styles.statusContainer,
                {
                  backgroundColor:
                    item.paymentStatus === "SUCCESS" ||
                    item.paymentStatus === "SUCCESSFUL"
                      ? "#E6F9F1"
                      : "#FFEDE9",
                },
              ]}
            >
              <Text
                style={[
                  styles.completedText,
                  {
                    color:
                      item.paymentStatus === "SUCCESS" ||
                      item.paymentStatus === "SUCCESSFUL"
                        ? "#06C270"
                        : "#FF3B30",
                  },
                ]}
                allowFontScaling={false}
              >
                {item.paymentStatus}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({
    section: { title },
  }: {
    section: { title: string };
  }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.skeletonContainer}>
      {Array(5)
        .fill(null)
        .map((_, index) => (
          <View key={index} style={styles.transactionItem}>
            <Skeleton
              animation="pulse"
              circle
              width={40}
              height={40}
              style={{ backgroundColor: COLORS.grey100, marginRight: 10 }}
              skeletonStyle={{ backgroundColor: COLORS.grey50 }}
            />
            <View style={styles.transactionTextContainer}>
              <View style={styles.transactionTextRow}>
                <Skeleton
                  animation="pulse"
                  width={80}
                  height={14}
                  style={{ backgroundColor: COLORS.grey100, marginVertical: 2 }}
                  skeletonStyle={{ backgroundColor: COLORS.grey50 }}
                />
                <Skeleton
                  animation="pulse"
                  width={60}
                  height={16}
                  style={{ backgroundColor: COLORS.grey100, marginVertical: 2 }}
                  skeletonStyle={{ backgroundColor: COLORS.grey50 }}
                />
              </View>
              <View style={styles.transactionTextRow}>
                <Skeleton
                  animation="pulse"
                  width={30}
                  height={12}
                  style={{ backgroundColor: COLORS.grey100, marginVertical: 2 }}
                  skeletonStyle={{ backgroundColor: COLORS.grey50 }}
                />
                <Skeleton
                  animation="pulse"
                  width={45}
                  height={12}
                  style={{ backgroundColor: COLORS.grey100, marginVertical: 2 }}
                  skeletonStyle={{ backgroundColor: COLORS.grey50 }}
                />
              </View>
            </View>
          </View>
        ))}
    </View>
  );

  const renderFooter = () => {
    if (isLoading && currentPage > 1) {
      return (
        <View style={styles.footerLoadingContainer}>
          <ActivityIndicator color={COLORS.violet400} size={24} />
        </View>
      );
    }
    return null;
  };

  const renderEmptyState = () => (
    <View style={styles.noTransactionContainer}>
      <LottieView
        source={require("../assets/animation/noTransaction.json")}
        autoPlay
        loop
        style={styles.noTransactionAnimation}
      />
      <Text style={styles.notransactionText}>
        You don't have any transactions
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.header}>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.leftIcon}
          >
            <ArrowLeft color={"#000"} size={24} />
          </TouchableOpacity>
          <MediumText color="black" size="large">
            Transactions
          </MediumText>
        </View>
      </View>

      {isLoading && currentPage === 1 ? (
        renderLoadingState()
      ) : (
        <SectionList
          sections={groupedTransactions}
          keyExtractor={(item) => item._id}
          renderItem={renderTransactionItem}
          renderSectionHeader={renderSectionHeader}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={true}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING * 2,
    paddingTop: Platform.OS === "ios" ? SPACING * 2 : SPACING * 2,
    paddingBottom: SPACING * 3,
  },
  leftIcon: {
    marginRight: SPACING,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: SPACING * 2,
  },
  skeletonContainer: {
    flex: 1,
    paddingHorizontal: SPACING * 2,
  },
  sectionHeader: {
    backgroundColor: "#F7F9FC",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 8,
    borderRadius: 6,
  },
  sectionHeaderText: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(12),
    color: "#515966",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "#F7F9FC",
  },
  transactionTextContainer: {
    flex: 1,
  },
  transactionTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  item: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(12),
  },
  valueText: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(14),
  },
  date: {
    fontFamily: "Outfit-Regular",
    color: "#9BA1A8",
    fontSize: RFValue(10),
  },
  statusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#E6F9F1",
    borderRadius: 10,
  },
  completedText: {
    fontFamily: "Outfit-Regular",
    color: "#06C270",
    fontSize: RFValue(10),
  },
  footerLoadingContainer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  noTransactionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noTransactionAnimation: {
    width: 200,
    height: 200,
  },
  notransactionText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(14),
  },
  discoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  placeholderIcon: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.grey200,
    borderRadius: 20,
  },
});

export default AllTransactionsScreen;
