import React from "react";
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
import SPACING from "../../config/SPACING";
import FONT_SIZE from "../../config/font-size";
import COLORS from "../../config/colors";
import { RFValue } from "react-native-responsive-fontsize";
import SwipeButton from "../../components/SwipeButton";
import useApi from "../../utils/api";
import { handleShowFlash } from "../../components/FlashMessageComponent";
import { RootStackParamList } from "../../navigation/RootStackParams";

type ReviewEducationSummaryScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ReviewEducationSummaryScreen"
>;

const ReviewEducationSummaryScreen: React.FC<
  ReviewEducationSummaryScreenProps
> = ({ navigation, route }) => {
  const { exam, amount, phoneNumber, serviceType } = route.params;

  const { mutateAsync } = useApi.post("/exam/");

  const handleSwipeConfirm = async (reset: () => void) => {
    try {
      // Making the API call
      const response = await mutateAsync({
        exam,
        phoneNumber,
        amount,
      });

      console.log(response);

      // Checking the response for success or failure
      if (response.data.success) {
        navigation.navigate("TransactionStatusScreen", {
          status: "successful",
        });
      } else {
        handleShowFlash({
          message: "Transaction failed. Please try again.",
          type: "danger",
        });
        navigation.navigate("TransactionStatusScreen", { status: "failed" });
      }
    } catch (err: unknown) {
      console.error("Error processing electricity payment:", err);

      // Handling different types of errors
      if (err instanceof Error) {
        if (err.message.includes("Network")) {
          handleShowFlash({
            message:
              "Network error. Please check your connection and try again.",
            type: "danger",
          });
        } else if (err.message.includes("Timeout")) {
          handleShowFlash({
            message: "Request timed out. Please try again later.",
            type: "danger",
          });
        } else {
          handleShowFlash({
            message: "An unexpected error occurred. Please try again.",
            type: "danger",
          });
        }
      } else if (err instanceof Object && "response" in err) {
        // Handle specific status codes or response errors
        const response = (err as any).response;
        if (response?.status === 503) {
          handleShowFlash({
            message:
              "The server is currently unavailable. Please try again later.",
            type: "danger",
          });
        } else if (response?.status === 400) {
          handleShowFlash({
            message: "Bad request. Please check the input values.",
            type: "danger",
          });
        } else {
          handleShowFlash({
            message: "An error occurred. Please try again.",
            type: "danger",
          });
        }
      } else {
        handleShowFlash({
          message: "An unknown error occurred. Please try again.",
          type: "danger",
        });
      }
    } finally {
      // Resetting the swipe button regardless of success or failure
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

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text style={styles.itemText} allowFontScaling={false}>
              {exam}
            </Text>
          </View>
          <View style={{ padding: 16 }}>
            <View style={styles.container}>
              <Text style={styles.headText} allowFontScaling={false}>
                Transaction summary
              </Text>

              <View
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Text style={styles.titleText} allowFontScaling={false}>
                  Amount
                </Text>
                <Text style={styles.descriptionText} allowFontScaling={false}>
                  {amount}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Text style={styles.titleText} allowFontScaling={false}>
                  Service
                </Text>
                <Text style={styles.descriptionText} allowFontScaling={false}>
                  {serviceType}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Text style={styles.titleText} allowFontScaling={false}>
                  Phone Number
                </Text>
                <Text style={styles.descriptionText} allowFontScaling={false}>
                  {phoneNumber}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Text style={styles.titleText} allowFontScaling={false}>
                  Date
                </Text>
                <Text style={styles.descriptionText} allowFontScaling={false}>
                  {new Date().toLocaleString()}
                </Text>
              </View>

              <View
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Text style={styles.titleText} allowFontScaling={false}>
                  Status
                </Text>
                <View
                  style={{
                    padding: 8,
                    backgroundColor: "#FFEFC3",
                    borderRadius: 16,
                  }}
                >
                  <Text style={styles.completedText} allowFontScaling={false}>
                    Pending
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ marginTop: 24 }}>
              <SwipeButton onConfirm={handleSwipeConfirm} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReviewEducationSummaryScreen;

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
