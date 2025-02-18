import React, { useEffect, useState, useMemo } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import LottieView from "lottie-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Skeleton } from "@rneui/themed";
import { DocumentText, WalletAdd1 } from "iconsax-react-native";
import useWallet from "../hooks/use-wallet";
import { BoldText, LightText } from "./common/Text";
import COLORS from "../constants/colors";
import SPACING from "../constants/SPACING";
import Airtel from "../assets/svg/airtelbig.svg";
import Mtn from "../assets/svg/mtnbig.svg";
import Eti from "../assets/svg/9mobilebig.svg";
import Glo from "../assets/svg/globig.svg";

const RecentServiceTransaction: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { getAllTransactions } = useWallet();
  const { transactions, isLoading } = getAllTransactions();
  const [hasTransaction, setHasTransaction] = useState(false);

  // Get the 3 most recent transactions using useMemo
  const recentTransactions = useMemo(() => {
    if (transactions.length === 0) return [];
    
    // Sort transactions by date (most recent first)
    const sortedTransactions = [...transactions].sort((a, b) => {
      return new Date(b.paidOn || 0).getTime() - new Date(a.paidOn || 0).getTime();
    });
    
    // Return only the first 3 transactions
    return sortedTransactions.slice(0, 3);
  }, [transactions]);

  // Update hasTransaction flag when transactions change
  useEffect(() => {
    setHasTransaction(transactions.length > 0);
  }, [transactions]);

  const renderServiceIcon = (
    provider: string | undefined,
    tranxType: string
  ) => {
    // If it's a wallet funding transaction, return the WalletAdd1 icon
    if (tranxType === "WALLET_FUNDING") {
      return <WalletAdd1 size={24} color={COLORS.violet400} />;
    }

    // Get provider from metadata if available
    if (provider?.toLowerCase() === "airtel") {
      return <Airtel width={40} height={40} />;
    } else if (provider?.toLowerCase() === "mtn") {
      return <Mtn width={40} height={40} />;
    } else if (provider?.toLowerCase() === "9mobile") {
      return <Eti width={40} height={40} />;
    } else if (provider?.toLowerCase() === "glo") {
      return <Glo width={40} height={40} />;
    }

    // Default icon if no match
  };

  const renderLoadingSkeleton = () => (
    <View>
      {[1, 2, 3].map((item) => (
        <View key={item} style={styles.transactionItem}>
          <Skeleton
            circle
            width={40}
            height={40}
            style={{
              backgroundColor: COLORS.grey100,
              marginRight: 10,
            }}
            skeletonStyle={{ backgroundColor: COLORS.grey50 }}
            animation="wave"
          />
          <View style={styles.transactionTextContainer}>
            <View style={styles.transactionTextRow}>
              <Skeleton
                width={RFValue(80)}
                height={RFValue(16)}
                style={{
                  backgroundColor: COLORS.grey100,
                  marginRight: 10,
                }}
                skeletonStyle={{ backgroundColor: COLORS.grey50 }}
                animation="wave"
              />
              <Skeleton
                width={RFValue(60)}
                height={RFValue(16)}
                style={{
                  backgroundColor: COLORS.grey100,
                  marginRight: 10,
                }}
                skeletonStyle={{ backgroundColor: COLORS.grey50 }}
                animation="wave"
              />
            </View>
            <View style={[styles.transactionTextRow, { marginTop: 8 }]}>
              <Skeleton
                width={RFValue(120)}
                height={RFValue(12)}
                style={{
                  backgroundColor: COLORS.grey100,
                  marginRight: 10,
                }}
                skeletonStyle={{ backgroundColor: COLORS.grey50 }}
                animation="wave"
              />
              <Skeleton
                width={RFValue(40)}
                height={RFValue(12)}
                style={{
                  backgroundColor: COLORS.grey100,
                  marginRight: 10,
                }}
                skeletonStyle={{ backgroundColor: COLORS.grey50 }}
                animation="wave"
              />
            </View>
          </View>
        </View>
      ))}
    </View>
  );

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

  const mapTransactionToSummaryFormat = (transaction: {
    paidOn: string | number | Date;
    purpose: any;
    transactionType: any;
    amountPaid: any;
    paymentStatus: any;
    referenceId: any;
    _id: any;
    metadata: { networkType: any; phoneNumber: any };
  }) => {
    // Format the date string from transaction.paidOn
    const formattedDate = new Date(transaction.paidOn).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Map to the expected format for TransactionSummaryScreen
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
      }
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BoldText color="black" size="medium">
          Recent Transactions
        </BoldText>
        <TouchableOpacity
          onPress={() => navigation.navigate("TransactionHistoryScreen")}
        >
          <LightText color="light">View More</LightText>
        </TouchableOpacity>
      </View>

      <View>
        {isLoading ? (
          renderLoadingSkeleton()
        ) : hasTransaction ? (
          recentTransactions.map((transaction) => {
            const formattedTime = new Date(transaction.paidOn).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            });
            
            // Extract network type from metadata if available
            const networkType = transaction.metadata?.networkType;
            
            return (
              <TouchableOpacity
                key={transaction._id}
                onPress={() =>
                  navigation.navigate("TransactionSummaryScreen", { 
                    transaction: mapTransactionToSummaryFormat(transaction)
                  })
                }
                style={styles.transactionItem}
              >
                <View style={styles.iconContainer}>
                  {renderServiceIcon(networkType, transaction.transactionType)}
                </View>
                <View style={styles.transactionTextContainer}>
                  <View style={styles.transactionTextRow}>
                    <Text style={styles.item} allowFontScaling={false}>
                      {transaction.transactionType}
                    </Text>
                    <Text 
                      style={[
                        styles.valueText, 
                        { color: transaction.transactionType.includes('PURCHASE') ? 'red' : 'black' }
                      ]} 
                      allowFontScaling={false}>
                      {transaction.transactionType.includes('PURCHASE') ? '-' : '+'} ₦{transaction.amountPaid}
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
                            transaction.paymentStatus === 'SUCCESS' || transaction.paymentStatus === 'SUCCESSFUL' 
                              ? '#E6F9F1' 
                              : '#FFEDE9'
                        }
                      ]}>
                      <Text 
                        style={[
                          styles.completedText,
                          {
                            color: 
                              transaction.paymentStatus === 'SUCCESS' || transaction.paymentStatus === 'SUCCESSFUL' 
                                ? '#06C270' 
                                : '#FF3B30'
                          }
                        ]} 
                        allowFontScaling={false}>
                        {transaction.paymentStatus}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          renderEmptyState()
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: Platform.OS === "android" ? SPACING * 25 : SPACING * 38,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#F7F9FC',
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
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
  noTransactionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING * 8,
  },
  noTransactionAnimation: {
    width: 200,
    height: 200,
  },
  notransactionText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(14),
  },
});

export default RecentServiceTransaction;