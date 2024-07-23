import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useRoute } from "@react-navigation/native";
import { ArrowLeft } from "iconsax-react-native";
import SPACING from "../../../config/SPACING";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../../../config/colors";
import FONT_SIZE from "../../../config/font-size";

const CableServiceDetailsScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const route = useRoute();
  const { service, plans } = route.params as { service: string; plans: any[] };

  const handlePlanSelect = (plan: { plan_id: string; plan_price: number, plan_name: string }) => {
    navigation.navigate("CardDetailsScreen", {
      service,
      planId: plan.plan_id,
      planPrice: plan.plan_price,
      planName: plan.plan_name
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View className="justify-center items-center">
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.leftIcon}
            >
              <ArrowLeft color={"#000"} size={24} />
            </TouchableOpacity>
            <Text style={[styles.headerText]} allowFontScaling={false}>
              Select a Plan
            </Text>
          </View>

          <View className="w-full px-6">
            <Text style={styles.titleText} allowFontScaling={false}>
              Available Plans for {service}
            </Text>

            <View style={styles.planContainer}>
              {plans.map((plan: any) => (
                <TouchableOpacity
                  key={plan.plan_id}
                  style={[
                    styles.planBox,
                  ]}
                  onPress={() => handlePlanSelect(plan)}
                >
                  <Text style={styles.planName} allowFontScaling={false}>
                    {plan.plan_name}
                  </Text>
                  <Text allowFontScaling={false}> - </Text>
                  <Text style={styles.planPrice} allowFontScaling={false}>
                    ₦{plan.plan_price}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
  titleText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(12),
    marginBottom: SPACING * 2,
  },
  planContainer: {
    marginVertical: SPACING,
  },
  planBox: {
    backgroundColor: COLORS.white,
    padding: SPACING,
    borderRadius: 5,
    marginBottom: SPACING,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING * 1.5,
  },
  selectedPlanBox: {
    borderColor: COLORS.violet400,
    backgroundColor: COLORS.violet200,
  },
  planName: {
    fontSize: RFValue(12),
    fontFamily: "Outfit-Regular",
  },
  planPrice: {
    fontSize: RFValue(12),
    color: COLORS.black400,
    fontFamily: "Outfit-SemiBold",
  },
  proceedButton: {
    backgroundColor: COLORS.violet400,
  },
  disabledButton: {
    backgroundColor: COLORS.black200,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: COLORS.error,
    fontSize: RFValue(16),
  },
});

export default CableServiceDetailsScreen;
