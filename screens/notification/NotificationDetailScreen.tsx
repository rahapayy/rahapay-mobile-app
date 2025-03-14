// NotificationDetailScreen.tsx
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import SPACING from "../../constants/SPACING";
import COLORS from "../../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import { LightText, MediumText, RegularText } from "@/components/common/Text";
import BackButton from "@/components/common/ui/buttons/BackButton";
import { AppStackParamList } from "@/types/RootStackParams";

type NotificationDetailScreenProps = NativeStackScreenProps<
  AppStackParamList,
  "NotificationDetail"
>;

const NotificationDetailScreen: React.FC<NotificationDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { notification } = route.params;
  const { title, body, data } = notification.request.content;
  console.log("Notification Data:", notification);

  // Use data.timestamp if available, fall back to notification.date, and handle invalid cases
  let timestamp = data?.timestamp
    ? new Date(data.timestamp).toISOString() // Convert to ISO string if it's a valid date
    : notification.date instanceof Date && !isNaN(notification.date.getTime())
    ? notification.date
    : new Date(); // Fallback to current date if invalid

  const displayDate = new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackButton navigation={navigation} />
          <MediumText size="large" color="black" marginLeft={10}>
            Notification Details
          </MediumText>
        </View>

        <View className="px-4 py-5">
          <View className="px-6 py-6 bg-white rounded-xl shadow-lg shadow-slate-200">
            <MediumText size="medium" color="black" marginBottom={5}>
              {title || "New Notification"}
            </MediumText>
            <RegularText size="base" color="mediumGrey" marginTop={8}>
              {displayDate}
            </RegularText>
            <LightText size="base" color="mediumGrey" marginTop={8}>
              {body || "Notification content"}
            </LightText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING * 2,
    paddingVertical: SPACING * 2,
  },
  backButton: {
    marginRight: SPACING,
  },
  headerText: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(16),
    color: COLORS.black400,
    flex: 1,
  },
  content: {
    padding: SPACING * 2,
  },
  title: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(18),
    color: COLORS.black400,
    marginBottom: SPACING,
  },
  date: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(12),
    color: COLORS.grey500,
    marginBottom: SPACING * 2,
  },
  body: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(14),
    color: COLORS.black400,
    lineHeight: RFValue(20),
  },
  dataContainer: {
    marginTop: SPACING * 2,
    padding: SPACING,
    backgroundColor: COLORS.grey100,
    borderRadius: 8,
  },
  dataTitle: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(14),
    color: COLORS.black400,
    marginBottom: SPACING,
  },
  dataItem: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(12),
    color: COLORS.grey700,
    marginBottom: SPACING / 2,
  },
});

export default NotificationDetailScreen;
