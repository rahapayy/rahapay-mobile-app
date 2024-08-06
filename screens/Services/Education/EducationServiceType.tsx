import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { RootStackParamList } from "../../../navigation/RootStackParams";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import SPACING from "../../../config/SPACING";
import COLORS from "../../../config/colors";
import { RFValue } from "react-native-responsive-fontsize";
import FONT_SIZE from "../../../config/font-size";
import { ArrowLeft } from "iconsax-react-native";
import Button from "../../../components/Button";

type EducationServiceTypeProps = NativeStackScreenProps<
  RootStackParamList,
  "EducationServiceType"
>;

const EducationServiceType: React.FC<EducationServiceTypeProps> = ({
  navigation,
  route,
}) => {
  const { exam, plan_id, amount } = route.params;

  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(
    null
  );

  const handleServiceTypeSelect = (serviceType: string) => {
    setSelectedServiceType(serviceType);
  };

  const handleProceed = () => {
    if (selectedServiceType) {
      navigation.navigate("EducationDetailsScreen", {
        exam,
        plan_id,
        serviceType: selectedServiceType,
        amount,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.leftIcon}
            >
              <ArrowLeft color={"#000"} size={24} />
            </TouchableOpacity>
            <Text style={[styles.headerText]} allowFontScaling={false}>
              {exam}
            </Text>
          </View>

          <Text style={styles.titleText} allowFontScaling={false}>
            Choose your meter type
          </Text>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.option}
              onPress={() => handleServiceTypeSelect("Result")}
            >
              <View className="flex-row items-center">
                <Text style={styles.optionText} allowFontScaling={false}>
                  Result checker PIN
                </Text>
                <Text> - </Text>
                <Text
                  style={[styles.optionText, { fontFamily: "Outfit-SemiBold" }]}
                >
                  {amount}
                </Text>
              </View>
              {selectedServiceType === "Result" && (
                <View style={styles.radioSelected}>
                  <View style={styles.radioSelectedSmall} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <Button
          style={[
            styles.proceedButton,
            !selectedServiceType && styles.disabledButton,
          ]}
          onPress={handleProceed}
          disabled={!selectedServiceType}
          title="Proceed"
          textColor="#fff"
        />
      </View>
    </SafeAreaView>
  );
};

export default EducationServiceType;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: SPACING * 2,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING * 3,
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
  optionsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderColor: COLORS.black200,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING * 2,
  },
  optionText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(12),
    color: COLORS.black400,
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.violet400,
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelectedSmall: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: COLORS.violet100,
  },
  separator: {
    height: 1,
    backgroundColor: "#E6E5EA",
  },
  proceedButton: {
    marginTop: SPACING * 2,
  },
  disabledButton: {
    backgroundColor: COLORS.violet200,
  },
});
