import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ArrowLeft,
  Whatsapp,
  Instagram,
  Facebook,
  Call,
} from "iconsax-react-native";
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

  // Social media links (replace with your actual links)
  const socialLinks = [
    {
      name: "WhatsApp",
      icon: Whatsapp,
      url: "https://wa.me/+2349167662449",
      color: "#25D366",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://www.facebook.com/share/1BtBXtvoz2/?mibextid=LQQJ4d",
      color: "#1877F2",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/rahapay_?igsh=bDNidTFic29iYnB2&utm_source=qr",
      color: "#E1306C",
    },
    // { name: "Twitter", icon: Twitter, url: "https://x.com/raha_pay?s=21&t=DXoMQjeLYxVaXBq2dYtRVA", color: "#1DA1F2" },
    { name: "Phone", icon: Call, url: "tel:+2349167662449", color: "#000000" },
  ];

  const handleSocialLinkPress = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

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
          <Text style={styles.headerText}>Help and Support</Text>
        </View>
        <View style={styles.greetingContainer}>
          <Image
            source={require("../../../assets/images/avatar.png")} // Replace with your avatar image
            style={styles.avatar}
          />
          <View>
            <Text style={styles.greetingText}>Hello, {firstName} 👋</Text>
            <Text style={styles.subGreetingText}>How can we help you?</Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Self-service</Text>
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate("ReportNewIssue")}
        >
          <Text style={styles.optionText}>Report an issue</Text>
          <ArrowLeft color="#000" size={24} style={styles.optionIcon} />
        </TouchableOpacity>

        {/* Social Links Section */}
        <Text style={styles.sectionTitle}>Contact Us</Text>
        {socialLinks.map((link, index) => (
          <TouchableOpacity
            key={index}
            style={styles.socialOption}
            onPress={() => handleSocialLinkPress(link.url)}
          >
            <link.icon size={24} color={link.color} style={styles.socialIcon} />
            <Text style={styles.optionText}>{link.name}</Text>
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
  socialOption: {
    flexDirection: "row",
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
  socialIcon: {
    marginRight: SPACING,
  },
  optionText: {
    fontSize: RFValue(16),
    fontFamily: "Outfit-Regular",
    flex: 1,
  },
  optionIcon: {
    transform: [{ rotate: "180deg" }],
  },
});

export default HelpAndSupportScreen;
