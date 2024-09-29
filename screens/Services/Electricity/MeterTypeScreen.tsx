import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ArrowLeft } from "iconsax-react-native";
import SPACING from "../../../constants/SPACING";
import FONT_SIZE from "../../../constants/font-size";
import COLORS from "../../../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import Button from "../../../components/Button";
import { RootStackParamList } from "../../../navigation/RootStackParams";

type MeterTypeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "MeterTypeScreen"
>;

const MeterTypeScreen: React.FC<MeterTypeScreenProps> = ({
  navigation,
  route,
}) => {
  const { disco, planId } = route.params;
  const [selectedMeterType, setSelectedMeterType] = useState<string | null>(
    null
  );

  const handleMeterTypeSelect = (meterType: string) => {
    setSelectedMeterType(meterType);
  };

  const handleProceed = () => {
    if (selectedMeterType) {
      navigation.navigate("ElectricityDetailsScreen", {
        disco,
        planId,
        meterType: selectedMeterType,
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
              Select Meter Type
            </Text>
          </View>

          <Text style={styles.titleText} allowFontScaling={false}>
            Choose your meter type
          </Text>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.option}
              onPress={() => handleMeterTypeSelect("Prepaid")}
            >
              <Text style={styles.optionText}>Prepaid</Text>
              {selectedMeterType === "Prepaid" && (
                <View style={styles.radioSelected}>
                  <View style={styles.radioSelectedSmall} />
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity
              style={styles.option}
              onPress={() => handleMeterTypeSelect("Postpaid")}
            >
              <Text style={styles.optionText}>Postpaid</Text>
              {selectedMeterType === "Postpaid" && (
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
            !selectedMeterType && styles.disabledButton,
          ]}
          onPress={handleProceed}
          disabled={!selectedMeterType}
          title="Proceed"
          textColor="#fff"
        />
      </View>
    </SafeAreaView>
  );
};

export default MeterTypeScreen;

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
    fontSize: RFValue(14),
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
