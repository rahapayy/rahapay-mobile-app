import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ArrowLeft } from "iconsax-react-native";
import SPACING from "../../constants/SPACING";
import FONT_SIZE from "../../constants/font-size";
import COLORS from "../../constants/colors";
import Dstv from "../../assets/svg/dstv.svg";
import Gotv from "../../assets/svg/gotv.svg";
import Startimes from "../../assets/svg/startimes.svg";
import SwipeButton from "../../components/SwipeButton";
import { RFValue } from "react-native-responsive-fontsize";
import { handleShowFlash } from "../../components/FlashMessageComponent";
import { RootStackParamList } from "../../types/RootStackParams";
import { services } from "@/services";

type ReviewCableTvSummaryScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ReviewCableTvSummaryScreen"
>;

const ReviewCableTvSummaryScreen: React.FC<ReviewCableTvSummaryScreenProps> = ({
  navigation,
  route,
}) => {
  const { service, planId, price, cardNumber, planName, customerName } =
    route.params;
  const [isLoading, setIsLoading] = useState(false);

  const handleSwipeConfirm = async (reset: () => void) => {
    setIsLoading(true);
    try {
      const payload = {
        cableName: service.toUpperCase(), // Match API case (e.g., "STARTIME")
        planId,
        smartCardNo: cardNumber,
        customerName: "Unknown", // Optional field, adjust as needed
      };

      const response = await services.cableService.purchaseCable(payload);

      if (response.status === "success") {
        navigation.navigate("TransactionStatusScreen", {
          status: "success",
        });
      } else {
        handleShowFlash({
          message: response.msg || "Cable subscription failed.",
          type: "danger",
        });
      }
    } catch (error: any) {
      console.error("Error processing cable TV subscription:", error);
      if (error.message?.includes("Network")) {
        handleShowFlash({
          message: "Network error. Please check your connection and try again.",
          type: "danger",
        });
      } else if (error.message?.includes("Timeout")) {
        handleShowFlash({
          message: "Request timed out. Please try again later.",
          type: "danger",
        });
      } else if (error.response?.status === 503) {
        handleShowFlash({
          message:
            "The server is currently unavailable. Please try again later.",
          type: "danger",
        });
      } else if (error.response?.status === 400) {
        handleShowFlash({
          message: "Bad request. Please check the input values.",
          type: "danger",
        });
      } else {
        handleShowFlash({
          message:
            error.response?.data?.msg || "An error occurred. Please try again.",
          type: "danger",
        });
      }
    } finally {
      setIsLoading(false);
      reset();
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
              Review Summary
            </Text>
          </View>

          <View className="justify-center items-center mt-10">
            {service.toLowerCase() === "dstv" && (
              <Dstv width={100} height={100} />
            )}
            {service.toLowerCase() === "gotv" && (
              <Gotv width={100} height={100} />
            )}
            {service.toLowerCase() === "startime" && (
              <Startimes width={100} height={100} />
            )}
            <Text style={styles.itemText} allowFontScaling={false}>
              {service} Subscription
            </Text>
          </View>
          <View className="p-4">
            <View style={styles.container}>
              <Text style={styles.headText} allowFontScaling={false}>
                Transaction Summary
              </Text>

              <View className="justify-between items-center flex-row">
                <Text style={styles.titleText} allowFontScaling={false}>
                  Amount
                </Text>
                <Text style={styles.descriptionText} allowFontScaling={false}>
                  ₦{price}
                </Text>
              </View>
              <View className="justify-between items-center flex-row">
                <Text style={styles.titleText} allowFontScaling={false}>
                  Account Name
                </Text>
                <Text style={styles.descriptionText} allowFontScaling={false}>
                  {customerName}
                </Text>
              </View>
              <View className="justify-between items-center flex-row">
                <Text style={styles.titleText} allowFontScaling={false}>
                  Package
                </Text>
                <Text style={styles.descriptionText} allowFontScaling={false}>
                  {planName}
                </Text>
              </View>
              <View className="justify-between items-center flex-row">
                <Text style={styles.titleText} allowFontScaling={false}>
                  Smartcard Number
                </Text>
                <Text style={styles.descriptionText} allowFontScaling={false}>
                  {cardNumber}
                </Text>
              </View>
              <View className="justify-between items-center flex-row">
                <Text style={styles.titleText} allowFontScaling={false}>
                  Date
                </Text>
                <Text style={styles.descriptionText} allowFontScaling={false}>
                  {new Date().toLocaleString()}
                </Text>
              </View>
              <View className="justify-between items-center flex-row">
                <Text style={styles.titleText} allowFontScaling={false}>
                  Status
                </Text>
                <View className="p-2 bg-[#FFEFC3] rounded-2xl">
                  <Text style={styles.completedText} allowFontScaling={false}>
                    Pending
                  </Text>
                </View>
              </View>
            </View>
            <View className="mt-12">
              <SwipeButton onConfirm={handleSwipeConfirm} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReviewCableTvSummaryScreen;

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
  itemText: {
    fontSize: FONT_SIZE.small,
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
  headText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(12),
    marginBottom: SPACING,
  },
  titleText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(12),
    paddingVertical: SPACING,
  },
  descriptionText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(12),
    color: "#9BA1A8",
  },
  completedText: {
    fontFamily: "Outfit-Regular",
    color: "#FFCC3D",
  },
});
