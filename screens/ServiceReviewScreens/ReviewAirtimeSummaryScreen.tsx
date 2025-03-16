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
import SPACING from "../../constants/SPACING";
import FONT_SIZE from "../../constants/font-size";
import COLORS from "../../constants/colors";
import Airtel from "../../assets/svg/airtelbig.svg";
import Mtn from "../../assets/svg/mtnbig.svg";
import Eti from "../../assets/svg/9mobilebig.svg";
import Glo from "../../assets/svg/globig.svg";
import { RFValue } from "react-native-responsive-fontsize";
import SwipeButton from "../../components/SwipeButton";
import { IAirtimePurchasePayload } from "@/services/modules/airtime";
import { AppStackParamList } from "../../types/RootStackParams";
import { services } from "@/services";
import { handleShowFlash } from "@/components/FlashMessageComponent";
import { AxiosError } from "axios";

type ReviewAirtimeSummaryScreenProps = NativeStackScreenProps<
  AppStackParamList,
  "ReviewAirtimeSummaryScreen"
>;

const ReviewAirtimeSummaryScreen: React.FC<ReviewAirtimeSummaryScreenProps> = ({
  navigation,
  route,
}) => {
  const {
    selectedOperator,
    phoneNumber,
    amount,
    saveBeneficiary = false,
  } = route.params;

  const handleSwipeConfirm = async (reset: () => void) => {
    try {
      const payload: IAirtimePurchasePayload = {
        amount,
        networkType: selectedOperator.toLowerCase(),
        phoneNumber,
        saveBeneficiary,
      };

      const response = await services.airtimeService.purchaseAirtime(payload);
      console.log(response);

      navigation.navigate("TransactionStatusScreen", {
        status: response.status,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message instanceof Array
          ? error.response.data.message[0]
          : error.response?.data?.message || "An unexpected error occurred";
      console.error("airtime purchase error:", errorMessage);

      handleShowFlash({
        message: errorMessage,
        type: "danger",
      });
    } finally {
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
            <Text style={styles.headerText} allowFontScaling={false}>
              Review Summary
            </Text>
          </View>

          <View style={styles.imageContainer}>
            {selectedOperator === "Airtel" && (
              <Airtel width={100} height={100} />
            )}
            {selectedOperator === "Mtn" && <Mtn width={100} height={100} />}
            {selectedOperator === "9Mobile" && <Eti width={100} height={100} />}
            {selectedOperator === "Glo" && <Glo width={100} height={100} />}
            <Text style={styles.itemText} allowFontScaling={false}>
              {selectedOperator} Airtime
            </Text>
          </View>
          <View style={styles.content}>
            <View style={styles.container}>
              <Text style={styles.headText} allowFontScaling={false}>
                Transaction summary
              </Text>

              <View style={styles.row}>
                <Text style={styles.titleText} allowFontScaling={false}>
                  Amount
                </Text>
                <Text style={styles.descriptionText} allowFontScaling={false}>
                  ₦ {amount}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.titleText} allowFontScaling={false}>
                  Recipient
                </Text>
                <Text style={styles.descriptionText} allowFontScaling={false}>
                  {phoneNumber}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.titleText} allowFontScaling={false}>
                  Date
                </Text>
                <Text style={styles.descriptionText} allowFontScaling={false}>
                  {new Date().toLocaleString()}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.titleText} allowFontScaling={false}>
                  Status
                </Text>
                <View style={styles.statusContainer}>
                  <Text style={styles.completedText} allowFontScaling={false}>
                    Pending
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.swipeButtonContainer}>
              <SwipeButton onConfirm={handleSwipeConfirm} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReviewAirtimeSummaryScreen;

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
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  itemText: {
    fontSize: FONT_SIZE.small,
    fontFamily: "Outfit-Medium",
    paddingVertical: SPACING * 2,
  },
  content: {
    padding: 16,
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
  statusContainer: {
    padding: 8,
    backgroundColor: "#FFEFC3",
    borderRadius: 16,
  },
  row: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  swipeButtonContainer: {
    marginTop: SPACING * 5,
  },
});
