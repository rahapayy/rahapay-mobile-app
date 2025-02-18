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
import React, { useContext } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft } from "iconsax-react-native";
import SPACING from "../constants/SPACING";
import FONT_SIZE from "../constants/font-size";
import COLORS from "../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import LottieView from "lottie-react-native";
import { NotificationContext } from "../context/NotificationContext";
import { Skeleton } from "@rneui/themed";

const NotificationScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { notifications } = useContext(NotificationContext);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.leftIcon}
            >
              <ArrowLeft color={"#000"} size={24} />
            </TouchableOpacity>
            <Text style={styles.headerText} allowFontScaling={false}>
              Notifications
            </Text>
          </View>

          {/* Notification List */}
          {notifications.length > 0 ? (
            <View style={{ padding: SPACING }}>
              {notifications.map(
                (
                  notification: {
                    request: { content: { title: any; body: any; data: any } };
                    date: any;
                  },
                  index: React.Key | null | undefined
                ) => {
                  // Extract details from the notification payload.
                  const { title, body, data } = notification.request.content;
                  const timestamp = data?.timestamp || notification.date;
                  const displayDate = new Date(timestamp).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  );

                  return (
                    <View
                      key={index}
                      // onPress={() =>
                      //   navigation.navigate("TransactionSummaryScreen")
                      // }
                      style={styles.transactionItem}
                    >
                      <Image
                        source={require("../assets/images/small-logo.png")}
                        style={styles.transactionImage}
                      />
                      <View style={styles.transactionTextContainer}>
                        <View style={styles.transactionTextRow}>
                          <Text style={styles.item} allowFontScaling={false}>
                            {title || "New Notification"}
                          </Text>
                          <Text
                            style={styles.valueText}
                            allowFontScaling={false}
                          >
                            {displayDate}
                          </Text>
                        </View>
                        <View style={styles.transactionTextRow}>
                          <Text style={styles.date} allowFontScaling={false}>
                            {body || "Notification content"}
                          </Text>
                          {/* <Text style={styles.completedText} allowFontScaling={false}>
                          View
                        </Text> */}
                        </View>
                      </View>
                    </View>
                  );
                }
              )}
            </View>
          ) : (
            // Fallback if no notifications
            <View style={styles.noTransactionContainer}>
              <LottieView
                source={require("../assets/animation/noTransaction.json")}
                autoPlay
                loop
                style={styles.loadingAnimation}
              />
              <Text style={styles.notransactionText}>
                You don't have any notifications
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
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
    fontSize: FONT_SIZE.medium,
    fontFamily: "Outfit-Regular",
    flex: 1,
  },
  loadingAnimation: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  notransactionText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(14),
    textAlign: "center",
  },
  noTransactionContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    padding: SPACING,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    overflow: "hidden",
  },
  transactionImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  transactionTextContainer: {
    flex: 1,
  },
  transactionTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  valueText: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(8),
  },
  item: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(12),
  },
  date: {
    fontFamily: "Outfit-Regular",
    color: "#9BA1A8",
    fontSize: RFValue(10),
    width: 200,
    marginTop: 5,
  },
  completedText: {
    fontFamily: "Outfit-Regular",
    color: COLORS.violet500,
  },
});
