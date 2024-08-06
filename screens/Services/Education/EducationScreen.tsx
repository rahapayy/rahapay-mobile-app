import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft } from "iconsax-react-native";
import SPACING from "../../../config/SPACING";
import FONT_SIZE from "../../../config/font-size";
import useSWR from "swr";
import COLORS from "../../../config/colors";
import { RFValue } from "react-native-responsive-fontsize";

const EducationScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [selectedExam, setSelectedExam] = useState<string | null>(null);

  const { data, error, isLoading } = useSWR(`/exam/`);
  console.log(data);

  const handleExamSelect = (exam: string, plan_id: string, amount: string) => {
    setSelectedExam(exam);
    navigation.navigate("EducationServiceType", {
      exam,
      plan_id,
      amount,
    });
  };

  if (error) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Error loading data.</Text>
      </SafeAreaView>
    );
  }

  if (isLoading || !data) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={COLORS.violet300} size={"large"} />
      </View>
    );
  }

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
              Education
            </Text>
          </View>

          <View style={{ paddingHorizontal: 16 }}>
            <Text style={styles.titleText} allowFontScaling={false}>
              Select an electricity provider
            </Text>

            <View style={styles.examContainer}>
              {Array.isArray(data.plan) &&
                data.plan.map(
                  (item: {
                    exam_name: string;
                    plan_id: string;
                    amount: string;
                  }) => (
                    <TouchableOpacity
                      key={item.plan_id}
                      style={[
                        styles.boxSelect,
                        selectedExam === item.exam_name && styles.selectedBox,
                      ]}
                      onPress={() =>
                        handleExamSelect(
                          item.exam_name,
                          item.plan_id,
                          item.amount
                        )
                      }
                    >
                      <Text style={styles.examText} allowFontScaling={false}>
                        {item.exam_name}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EducationScreen;

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
  examContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  boxSelect: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: SPACING * 2,
    alignItems: "center",
    marginBottom: SPACING,
    flexBasis: "47%",
    margin: SPACING / 2,
  },
  selectedBox: {
    borderColor: COLORS.violet400,
    borderWidth: 1,
  },
  examText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(10),
    textAlign: "center",
  },
});
