import React from "react";
import {
  Image,
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
import { useAuth } from "@/services/AuthContext";

type HelpAndSupportScreenNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  "HelpAndSupportScreen"
>;

const HelpAndSupportScreen: React.FC<{
  navigation: HelpAndSupportScreenNavigationProp;
}> = ({ navigation }) => {
  const { userInfo } = useAuth();

  const fullName = userInfo?.fullName || "";
  const firstName = fullName.split(" ")[0];

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
            Help and Support
          </Text>
        </View>
        <View style={styles.greetingContainer}>
          <Image
            source={require("../../../assets/images/avatar.png")} // Replace with your avatar image
            style={styles.avatar}
          />
          <View>
            <Text style={styles.greetingText} allowFontScaling={false}>
              Hello, {firstName} 👋
            </Text>
            <Text style={styles.subGreetingText} allowFontScaling={false}>
              How can we help you?
            </Text>
          </View>
        </View>
        <Text style={styles.sectionTitle} allowFontScaling={false}>
          Self-service
        </Text>
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate("TransferDispute")}
        >
          <Text style={styles.optionText} allowFontScaling={false}>
            Transfer Dispute
          </Text>
          <ArrowLeft color="#000" size={24} style={styles.optionIcon} />
        </TouchableOpacity>
        {/* Add more options as needed */}
        {/* <View style={styles.banner}>
          <Text style={styles.bannerText} allowFontScaling={false}>
            Explore benefits of having our cards
          </Text>
          <TouchableOpacity style={styles.learnMoreButton}>
            <Text style={styles.learnMoreText} allowFontScaling={false}>
              Learn More
            </Text>
          </TouchableOpacity>
        </View> */}
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
  greetingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.violet400,
    padding: SPACING * 2,
    marginHorizontal: SPACING * 2,
    borderRadius: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING,
  },
  greetingText: {
    color: COLORS.white,
    fontSize: RFValue(18),
    fontFamily: "Outfit-Medium",
  },
  subGreetingText: {
    color: COLORS.white,
    fontSize: RFValue(14),
    fontFamily: "Outfit-Regular",
  },
  sectionTitle: {
    fontSize: RFValue(16),
    fontFamily: "Outfit-Medium",
    marginHorizontal: SPACING * 2,
    marginTop: SPACING * 2,
    marginBottom: SPACING,
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
  banner: {
    backgroundColor: COLORS.violet400,
    padding: SPACING * 2,
    marginHorizontal: SPACING * 2,
    borderRadius: 12,
    marginTop: SPACING * 2,
  },
  bannerText: {
    color: COLORS.white,
    fontSize: RFValue(18),
    fontFamily: "Outfit-Medium",
    marginBottom: SPACING,
  },
  learnMoreButton: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING,
    paddingHorizontal: SPACING * 2,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  learnMoreText: {
    color: COLORS.violet400,
    fontSize: RFValue(14),
    fontFamily: "Outfit-Medium",
  },
});

export default HelpAndSupportScreen;
