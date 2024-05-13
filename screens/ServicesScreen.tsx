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

const ServicesScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View className="p-6">
          <Text style={styles.headText}>Services</Text>
          {/* Card */}
          <View className="w-full bg-white p-6 mt-10 rounded-xl overflow-hidden">
            <View className="flex-row gap-12 justify-center">
              <TouchableOpacity
                onPress={() => navigation.navigate("AirtimeScreen")}
                className="items-center"
              >
                <View className=" bg-[#EEEBF9] rounded-full flex-shrink-0 w-10 h-10 items-center justify-center">
                  <Airtime />
                </View>
                <Text style={styles.titleText}>Airtime</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("DataScreen")}
                className="items-center"
              >
                <View className=" bg-[#EEEBF9] rounded-full flex-shrink-0 w-10 h-10 items-center justify-center">
                  <Data />
                </View>
                <Text style={styles.titleText}>Data</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("TvSubscriptionScreen")}
                className="items-center"
              >
                <View className=" bg-[#EEEBF9] rounded-full flex-shrink-0 w-10 h-10 items-center justify-center">
                  <Tv />
                </View>
                <Text style={styles.titleText}>TV</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("ElectricityScreen")}
                className="items-center"
              >
                <View className=" bg-[#EEEBF9] rounded-full flex-shrink-0 w-10 h-10 items-center justify-center">
                  <Electricity />
                </View>
                <Text style={styles.titleText}>Electricity</Text>
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
    fontSize: FONT_SIZE.small,
    marginTop: SPACING,
  },
});
