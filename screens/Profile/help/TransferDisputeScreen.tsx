import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft } from "iconsax-react-native";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "@/constants/colors";
import SPACING from "@/constants/SPACING";
import { AppStackParamList } from "@/types/RootStackParams";
import Button from "@/components/common/ui/buttons/Button";

type TransferDisputeScreenNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  "TransferDispute"
>;

const TransferDisputeScreen: React.FC<{
  navigation: TransferDisputeScreenNavigationProp;
}> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<"Processing" | "Completed">(
    "Processing"
  );

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
          <Text style={styles.headerText}>
            Transfer Dispute
          </Text>
        </View>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "Processing" && styles.activeTab]}
            onPress={() => setActiveTab("Processing")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Processing" && styles.activeTabText,
              ]}
             
            >
              Processing
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "Completed" && styles.activeTab]}
            onPress={() => setActiveTab("Completed")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Completed" && styles.activeTabText,
              ]}
          
            >
              Completed
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText} >
            You don’t have any data
          </Text>
        </View>
      </ScrollView>
      {/* <Button
        title="Report new issue"
        textColor="white"
        style={styles.reportButton}
        onPress={() => navigation.navigate("ReportNewIssue")}
      /> */}
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
  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: SPACING * 2,
    marginVertical: SPACING,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: COLORS.grey100,
    marginHorizontal: SPACING / 2,
  },
  activeTab: {
    backgroundColor: COLORS.violet400,
  },
  tabText: {
    fontSize: RFValue(14),
    fontFamily: "Outfit-Medium",
    color: COLORS.black400,
  },
  activeTabText: {
    color: COLORS.white,
  },
  noDataContainer: {
    alignItems: "center",
    marginTop: SPACING * 26,
  },
  noDataText: {
    fontSize: RFValue(16),
    fontFamily: "Outfit-Regular",
    color: COLORS.grey400,
    marginTop: SPACING,
  },
  reportButton: {
    backgroundColor: COLORS.violet400,
    padding: SPACING * 1.5,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: SPACING * 2,
    marginVertical: SPACING * 2,
  },
  reportButtonText: {
    color: COLORS.white,
    fontSize: RFValue(16),
    fontFamily: "Outfit-Medium",
  },
});

export default TransferDisputeScreen;
