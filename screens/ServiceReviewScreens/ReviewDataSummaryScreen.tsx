import {
  Alert,
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
import SPACING from "../../config/SPACING";
import FONT_SIZE from "../../config/font-size";
import COLORS from "../../config/colors";
import Airtel from "../../assets/svg/airtelbig.svg";
import Mtn from "../../assets/svg/mtnbig.svg";
import Eti from "../../assets/svg/9mobilebig.svg";
import Glo from "../../assets/svg/globig.svg";
import { RFValue } from "react-native-responsive-fontsize";
import SwipeButton from "../../components/SwipeButton";
import { RouteProp } from "@react-navigation/native";
import useApi from "../../utils/api";
import { handleShowFlash } from "../../components/FlashMessageComponent";

type Params = {
  selectedOperator: string;
  selectedPlan: {
    plan: string;
    days: string;
    plan_id: string;
    amount: number;
  };
  phoneNumber: string;
};

interface ReviewDataSummaryScreenProps {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: Params }, "params">;
}

interface AxiosError {
  response?: {
    status: number;
  };
}

const ReviewDataSummaryScreen: React.FC<ReviewDataSummaryScreenProps> = ({
  navigation,
  route,
}) => {
  const { selectedOperator, selectedPlan, phoneNumber } = route.params;

  const { mutateAsync } = useApi.post("/top-up/data");

  const handleSwipeConfirm = async (reset: () => void) => {
    try {
      const response = await mutateAsync({
        planId: selectedPlan.plan_id,
        networkType: selectedOperator.toLowerCase(),
        phoneNumber: phoneNumber,
      });

      if (response.data.success) {
        navigation.navigate("TransactionStatusScreen", {
          status: "successful",
        });
      } else {
        navigation.navigate("TransactionStatusScreen", { status: "failed" });
      }
    } catch (err: unknown) {
      console.error("Error topping up data:", err);
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
      reset(); // Reset the swipe button state after the API call completes
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
            {/* Image */}
            {selectedOperator === "Airtel" && (
              <Airtel width={100} height={100} />
            )}
            {selectedOperator === "Mtn" && <Mtn width={100} height={100} />}
            {selectedOperator === "9Mobile" && <Eti width={100} height={100} />}
            {selectedOperator === "Glo" && <Glo width={100} height={100} />}
            <Text style={styles.itemText} allowFontScaling={false}>
              {selectedOperator} Data Bundle
            </Text>
          </View>
          <View className="p-4">
            <View style={styles.container}>
              <Text style={styles.headText} allowFontScaling={false}>
                Transaction summary
              </Text>

              <View className="justify-between items-center flex-row">
                <Text style={styles.titleText} allowFontScaling={false}>
                  Amount
                </Text>
                <Text style={styles.descriptionText} allowFontScaling={false}>
                  ₦ {selectedPlan.amount}
                </Text>
              </View>
              <View className="justify-between items-center flex-row">
                <Text style={styles.titleText} allowFontScaling={false}>
                  Package
                </Text>
                <Text style={styles.descriptionText} allowFontScaling={false}>
                  {selectedPlan.plan} - {selectedPlan.days}
                </Text>
              </View>
              <View className="justify-between items-center flex-row">
                <Text style={styles.titleText} allowFontScaling={false}>
                  Recipient
                </Text>
                <Text style={styles.descriptionText} allowFontScaling={false}>
                  {phoneNumber}
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
                {/* Transaction status */}
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

export default ReviewDataSummaryScreen;

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
  headerTextDark: {
    color: COLORS.white,
  },
  headTextContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
