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
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft } from "iconsax-react-native";
import SPACING from "../constants/SPACING";
import FONT_SIZE from "../constants/font-size";
import COLORS from "../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import LottieView from "lottie-react-native";
import { useNotification } from "../context/NotificationContext";
import * as Notifications from "expo-notifications";
import { LightText, MediumText, RegularText } from "@/components/common/Text";
import BackButton from "@/components/common/ui/buttons/BackButton";

const NotificationScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "Notifications">;
}> = ({ navigation }) => {
  const { notifications } = useNotification();

  const renderNotificationItem = (
    {
      notification,
      receivedAt,
    }: { notification: Notifications.Notification; receivedAt: string },
    index: React.Key | null | undefined
  ) => {
    const { title, body, data } = notification.request.content;
    // console.log("Notification:", { title, body, data, receivedAt });

    const timestamp = receivedAt
      ? new Date(receivedAt)
      : data?.timestamp
      ? new Date(data.timestamp)
      : new Date();
    const displayDate = timestamp.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <TouchableOpacity
        key={index}
        onPress={() =>
          navigation.navigate("NotificationDetail", { notification })
        }
        style={styles.transactionItem}
      >
        <Image
          source={require("../assets/images/small-logo.png")}
          style={styles.transactionImage}
        />
        <View style={styles.transactionTextContainer}>
          <View style={styles.transactionTextRow}>
            <RegularText color="black" size="small">
              {title || "New Notification"}
            </RegularText>
            <LightText color="black" size="xsmall">
              {displayDate}
            </LightText>
          </View>
          <View style={styles.transactionTextRow}>
            <RegularText color="light" size="small">
              {body || "Notification content"}
            </RegularText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View>
          <View style={styles.header}>
            <BackButton navigation={navigation} />
            <RegularText size="large" color="black">
              Notifications
            </RegularText>
          </View>

          {notifications.length > 0 ? (
            <View style={{ padding: SPACING }}>
              {notifications.map((item, index) =>
                renderNotificationItem(item, index)
              )}
            </View>
          ) : (
            <View style={styles.noTransactionContainer}>
              <LottieView
                source={require("../assets/animation/noTransaction.json")}
                autoPlay
                loop
                style={styles.loadingAnimation}
              />
              <RegularText color="black">
                You don't have any notifications
              </RegularText>
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
    gap: 2,
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
    marginBottom: 14,
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
    maxWidth: "80%",
  },
  transactionTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
});
