import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft } from "iconsax-react-native";
import SPACING from "../../constants/SPACING";
import FONT_SIZE from "../../constants/font-size";
import ComingSoon from "../../assets/svg/Coming Soon.svg";

const TransferScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
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
            <Text style={[styles.headerText]} >
              Transfer to User
            </Text>
          </View>
        </View>
        <View className="justify-center items-center">
          <ComingSoon />
          <Text style={styles.comingsoonText}>
            We are creating something amazing. Stay tuned!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TransferScreen;

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
  comingsoonText: {
    fontFamily: "Outfit-Regular",
    fontSize: FONT_SIZE.medium,
    textAlign: "center",
  },
});
