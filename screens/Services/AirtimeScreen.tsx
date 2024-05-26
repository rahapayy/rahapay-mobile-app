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
import { ArrowLeft } from "iconsax-react-native";
import SPACING from "../../config/SPACING";
import FONT_SIZE from "../../config/font-size";
import COLORS from "../../config/colors";
import { RFValue } from "react-native-responsive-fontsize";
import Airtel from "../../assets/svg/air.svg";
import Mtn from "../../assets/svg/mtn.svg";
import Eti from "../../assets/svg/eti.svg";
import Glo from "../../assets/svg/glo.svg";

const AirtimeScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("Local");

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
              Airtime Top-up
            </Text>
          </View>
          <View className="px-6">
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === "Local" && styles.activeTab]}
                onPress={() => setActiveTab("Local")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "Local" && styles.activeTabText,
                  ]}
                  allowFontScaling={false}
                >
                  Local
                </Text>
                {activeTab === "Local" && (
                  <View style={styles.activeTabIndicator} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === "International" && styles.activeTab,
                ]}
                onPress={() => setActiveTab("International")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "International" && styles.activeTabText,
                  ]}
                  allowFontScaling={false}
                >
                  International
                </Text>
                {activeTab === "International" && (
                  <View style={styles.activeTabIndicator} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.tabContent}>
              {activeTab === "Local" ? (
                // Local tab
                <View>
                  <Text style={styles.headText} allowFontScaling={false}>
                    Saved Beneficiaries
                  </Text>
                  <View></View>

                  <Text style={styles.headText} allowFontScaling={false}>
                    Select Network Provider
                  </Text>
                  <View className="flex-row gap-4">
                    <Airtel />
                    <Mtn />
                    <Eti />
                    <Glo />
                  </View>
                </View>
              ) : (
                // International tab
                <View>
                  <Text style={styles.contentText}>Hello</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AirtimeScreen;

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
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: SPACING,
  },
  tab: {
    alignItems: "center",
    flex: 1,
  },
  tabText: {
    fontSize: RFValue(14),
    color: "#9BA1A8",
    fontFamily: "Outfit-Regular",
  },
  activeTab: {
    alignItems: "center",
  },
  activeTabText: {
    color: COLORS.violet400,
  },
  activeTabIndicator: {
    height: 2,
    backgroundColor: COLORS.violet400,
    marginTop: 4,
    width: "100%",
  },
  tabContent: {
    marginTop: SPACING,
    fontFamily: "Outfit-Regular",
  },
  contentText: {
    fontSize: RFValue(18),
    fontFamily: "Outfit-Regular",
    color: "#000",
  },
  headText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(12),
    marginBottom: SPACING,
  },
});
