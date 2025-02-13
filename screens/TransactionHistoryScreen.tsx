// AllTransactionsScreen.tsx
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ArrowLeft, DocumentText } from "iconsax-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SPACING from "../constants/SPACING";
import FONT_SIZE from "../constants/font-size";
import LottieView from "lottie-react-native";
import { RFValue } from "react-native-responsive-fontsize";
import useWallet from "../hooks/use-wallet";
import { MediumText } from "../components/common/Text";
import { Skeleton } from "@rneui/themed";

const AllTransactionsScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { transactions, isLoading } = useWallet();
  const [hasTransaction, setHasTransaction] = useState(false);

  useEffect(() => {
    setHasTransaction(transactions.length > 0);
  }, [transactions]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
        <TouchableOpacity>
          <DocumentText color={"#000"} />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4">
          {isLoading ? (
            <View>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <View key={item} style={styles.transactionItem}>
                  <Skeleton
                    circle
                    width={40}
                    height={40}
                    style={styles.skeletonImage}
                    animation="wave"
                  />
                  <View style={styles.transactionTextContainer}>
                    <View style={styles.transactionTextRow}>
                      <Skeleton
                        width={RFValue(80)}
                        height={RFValue(16)}
                        style={styles.skeletonText}
                        animation="wave"
                      />
                      <Skeleton
                        width={RFValue(60)}
                        height={RFValue(16)}
                        style={styles.skeletonText}
                        animation="wave"
                      />
                    </View>
                    <View style={[styles.transactionTextRow, { marginTop: 8 }]}>
                      <Skeleton
                        width={RFValue(120)}
                        height={RFValue(12)}
                        style={styles.skeletonText}
                        animation="wave"
                      />
                      <Skeleton
                        width={RFValue(40)}
                        height={RFValue(12)}
                        style={styles.skeletonText}
                        animation="wave"
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : hasTransaction ? (
            transactions.map(
              (transaction: {
                id: React.Key | null | undefined;
                tranxType: string;
                amount: any;
                created_at: any;
                status: string;
              }) => (
                <TouchableOpacity
                  key={transaction.id}
                  onPress={() =>
                    navigation.navigate("TransactionSummaryScreen", {
                      transaction,
                    })
                  }
                  style={styles.transactionItem}
                >
                  <Image
                    // source={require("../assets/images/airtel.png")}
                    style={styles.transactionImage}
                  />
                  <View style={styles.transactionTextContainer}>
                    <View style={styles.transactionTextRow}>
                      <Text style={styles.item} allowFontScaling={false}>
                        {transaction.tranxType}
                      </Text>
                      <Text style={styles.valueText} allowFontScaling={false}>
                        ₦{" "}
                        {transaction.amount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </Text>
                    </View>
                    <View style={styles.transactionTextRow}>
                      <Text style={styles.date} allowFontScaling={false}>
                        {transaction.created_at}
                      </Text>
                      <View style={styles.statusContainer}>
                        <Text
                          style={styles.completedText}
                          allowFontScaling={false}
                        >
                          {transaction.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            )
          ) : (
            <View style={styles.noTransactionContainer}>
              <LottieView
                source={require("../assets/animation/noTransaction.json")}
                autoPlay
                loop
                style={styles.noTransactionAnimation}
              />
              <Text style={styles.notransactionText}>
                You don’t have any transactions
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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
  headerText: {
    color: "#000",
    fontSize: FONT_SIZE.large,
    fontFamily: "Outfit-Regular",
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingAnimation: {
    width: 100,
    height: 100,
  },
  loadingText: {
    marginTop: 16,
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(14),
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
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  transactionImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
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
  skeletonImage: {
    marginRight: 10,
  },
  skeletonText: {
    borderRadius: 4,
  },
});

export default AllTransactionsScreen;
