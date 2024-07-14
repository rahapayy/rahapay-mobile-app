import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import FONT_SIZE from "../config/font-size";
import Airtime from "../assets/svg/smartphone-rotate-angle_svgrepo.com.svg";
import Tv from "../assets/svg/tv_svgrepo.com.svg";
import Electricity from "../assets/svg/electricity_svgrepo.com.svg";
import Data from "../assets/svg/signal_svgrepo.com.svg";
import SPACING from "../config/SPACING";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons, Octicons } from "@expo/vector-icons";
import COLORS from "../config/colors";

const ServicesScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View className="p-4">
          <Text style={styles.headText} allowFontScaling={false}>
            Services
          </Text>
          {/* Card */}
          <View className="w-full bg-white p-6 mt-10 rounded-xl overflow-hidden">
            <View className="flex flex-row flex-wrap justify-between">
              <TouchableOpacity
                onPress={() => navigation.navigate("AirtimeScreen")}
                className="items-center mb-4 w-1/5"
              >
                <View className="bg-[#EEEBF9] rounded-full flex-shrink-0 w-10 h-10 items-center justify-center">
                  <Airtime />
                </View>
                <Text
                  style={styles.titleText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  allowFontScaling={false}
                >
                  Airtime
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("DataScreen")}
                className="items-center mb-4 w-1/5"
              >
                <View className="bg-[#EEEBF9] rounded-full flex-shrink-0 w-10 h-10 items-center justify-center">
                  <Data />
                </View>
                <Text
                  style={styles.titleText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  allowFontScaling={false}
                >
                  Data
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("TvSubscriptionScreen")}
                className="items-center mb-4 w-1/5"
              >
                <View className="bg-[#EEEBF9] rounded-full flex-shrink-0 w-10 h-10 items-center justify-center">
                  <Tv />
                </View>
                <Text
                  style={styles.titleText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  allowFontScaling={false}
                >
                  TV
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("ElectricityScreen")}
                className="items-center mb-4 w-1/5"
              >
                <View className="bg-[#EEEBF9] rounded-full flex-shrink-0 w-10 h-10 items-center justify-center">
                  <Electricity />
                </View>
                <Text
                  style={styles.titleText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  allowFontScaling={false}
                >
                  Electricity
                </Text>
              </TouchableOpacity>
            </View>

            {/*  */}
            <View className="flex flex-row flex-wrap justify-between mt-6">
              <TouchableOpacity
                onPress={() => navigation.navigate("ReferralScreen")}
                className="items-center mb-4 w-1/5"
              >
                <View className="bg-[#EEEBF9] rounded-full flex-shrink-0 w-10 h-10 items-center justify-center">
                  <Ionicons name="gift" size={24} color={COLORS.violet400} />
                </View>
                <Text
                  style={styles.titleText}
                  // numberOfLines={1}
                  // ellipsizeMode="tail"
                  allowFontScaling={false}
                >
                  Refer & Earn
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("EducationScreen")}
                className="items-center mb-4 w-1/5"
              >
                <View className="bg-[#EEEBF9] rounded-full flex-shrink-0 w-10 h-10 items-center justify-center">
                  <Ionicons
                    name="school-sharp"
                    size={24}
                    color={COLORS.violet400}
                  />
                </View>
                <Text
                  style={styles.titleText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  allowFontScaling={false}
                >
                  Education
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("BettingScreen")}
                className="items-center mb-4 w-1/5"
              >
                <View className="bg-[#EEEBF9] rounded-full flex-shrink-0 w-10 h-10 items-center justify-center">
                  <Ionicons
                    name="football"
                    size={24}
                    color={COLORS.violet400}
                  />
                </View>
                <Text
                  style={styles.titleText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  allowFontScaling={false}
                >
                  Betting
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("TransferScreen")}
                className="items-center mb-4 w-1/5"
              >
                <View className="bg-[#EEEBF9] rounded-full flex-shrink-0 w-10 h-10 items-center justify-center">
                  <Octicons
                    name="arrow-switch"
                    size={24}
                    color={COLORS.violet400}
                  />
                </View>
                <Text
                  style={styles.titleText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  allowFontScaling={false}
                >
                  Transfer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ServicesScreen;

const styles = StyleSheet.create({
  headText: {
    fontFamily: "Outfit-Regular",
    fontSize: FONT_SIZE.large,
  },
  titleText: {
    fontFamily: "Outfit-Regular",
    fontSize: FONT_SIZE.extraSmall,
    marginTop: SPACING,
    textAlign: "center",
  },
});
