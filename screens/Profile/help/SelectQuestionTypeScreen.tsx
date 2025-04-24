import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ArrowLeft } from "iconsax-react-native";
import COLORS from "@/constants/colors";
import SPACING from "@/constants/SPACING";
import { RFValue } from "react-native-responsive-fontsize";
import { AppStackParamList } from "@/types/RootStackParams";

type Props = NativeStackScreenProps<AppStackParamList, "SelectQuestionType">;

const questionTypes = [
  { label: "Successful but no drop", value: "Successful but no drop" },
  { label: "Failed but no refund", value: "Failed but no refund" },
  { label: "Long time pending", value: "Long time pending" },
];

const SelectQuestionTypeScreen: React.FC<Props> = ({ navigation, route }) => {
  const { businessType } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.leftIcon}
          >
            <ArrowLeft color="#000" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerText} allowFontScaling={false}>
            {businessType}
          </Text>
        </View>
        <View style={styles.progress}>
          <View style={styles.step}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>✔</Text>
            </View>
          </View>
          <View style={styles.line} />
          <View style={styles.step}>
            <View style={styles.stepCircleActive}>
              <Text style={styles.stepNumberActive}>2</Text>
            </View>
            <Text style={styles.stepTextActive}>Select question type</Text>
          </View>
          <View style={styles.line} />
          <View style={styles.step}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
          </View>
        </View>
        {questionTypes.map((type) => (
          <TouchableOpacity
            key={type.value}
            style={styles.option}
            onPress={() =>
              navigation.navigate("DisputeSubmission", {
                businessType,
                questionType: type.value,
              })
            }
          >
            <Text style={styles.optionText} allowFontScaling={false}>
              {type.label}
            </Text>
            <ArrowLeft color="#000" size={24} style={styles.optionIcon} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING * 2,
    paddingVertical: SPACING * 2,
  },
  leftIcon: {
    marginRight: SPACING,
  },
  headerText: {
    color: "#000",
    fontSize: RFValue(18),
    fontFamily: "Outfit-Regular",
    flex: 1,
  },
  progress: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: SPACING * 2,
    marginVertical: SPACING,
  },
  step: {
    alignItems: "center",
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.grey400,
    alignItems: "center",
    justifyContent: "center",
  },
  stepCircleActive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.violet400,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumber: {
    color: COLORS.grey400,
    fontSize: RFValue(12),
    fontFamily: "Outfit-Medium",
  },
  stepNumberActive: {
    color: COLORS.white,
    fontSize: RFValue(12),
    fontFamily: "Outfit-Medium",
  },
  stepTextActive: {
    color: COLORS.violet400,
    fontSize: RFValue(12),
    fontFamily: "Outfit-Regular",
    marginTop: SPACING / 2,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.grey400,
    marginHorizontal: SPACING / 2,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING * 2,
    marginHorizontal: SPACING * 2,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: SPACING,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionText: {
    fontSize: RFValue(16),
    fontFamily: "Outfit-Regular",
  },
  optionIcon: {
    transform: [{ rotate: "180deg" }],
  },
});

export default SelectQuestionTypeScreen;
