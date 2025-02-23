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
import { RFValue } from "react-native-responsive-fontsize";
import SwipeButton from "../../components/SwipeButton";
import { services } from "@/services";
import { handleShowFlash } from "../../components/FlashMessageComponent";
import { RootStackParamList } from "../../types/RootStackParams";

type ReviewElectricitySummaryScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ReviewElectricitySummaryScreen"
>;

const ReviewElectricitySummaryScreen: React.FC<
  ReviewElectricitySummaryScreenProps
> = ({ navigation, route }) => {
  const {
    meterNumber,
    amount,
    selectedService,
    meterType,
    id,
    customerName,
    saveBeneficiary,
  } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const handleSwipeConfirm = async (reset: () => void) => {
    setIsLoading(true);
    try {
      const payload = {
        meterNumber,
        amount: parseFloat(amount),
        discoId: id,
        saveBeneficiary
      };

      const response = await services.electricityService.purchaseElectricity(
        payload
      );

      if (response.status === "success") {
        navigation.navigate("TransactionStatusScreen", {
          status: "success",
        });
      } else {
        handleShowFlash({
          message: response.msg || "Transaction failed. Please try again.",
          type: "danger",
        });
      }
    } catch (error: any) {
      console.error("Error response from server:", error); // Log error response from server
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

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text style={styles.itemText} allowFontScaling={false}>
              {selectedService} Bill ({meterType})
            </Text>
          </View>
          <View style={{ padding: 16 }}>
            <View style={styles.container}>
              <Text style={styles.headText} allowFontScaling={false}>
                Transaction Summary
              </Text>

              <View style={styles.row}>
                <Text style={styles.titleText} allowFontScaling={false}>
                  Amount
                </Text>
                <Text style={styles.descriptionText} allowFontScaling={false}>
                  ₦{amount}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.titleText} allowFontScaling={false}>
                  Meter Number
                </Text>
                <Text style={styles.descriptionText} allowFontScaling={false}>
                  {meterNumber}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.titleText} allowFontScaling={false}>
                  Account Name
                </Text>
                <Text style={styles.descriptionText} allowFontScaling={false}>
                  {customerName}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.titleText} allowFontScaling={false}>
                  Disco
                </Text>
                <Text style={styles.descriptionText} allowFontScaling={false}>
                  {selectedService}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.titleText} allowFontScaling={false}>
                  Meter Type
                </Text>
                <Text style={styles.descriptionText} allowFontScaling={false}>
                  {meterType}
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

export default ReviewElectricitySummaryScreen;

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
