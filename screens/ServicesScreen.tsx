import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import FONT_SIZE from "../config/font-size";
import Airtime from "../assets/svg/smartphone-rotate-angle_svgrepo.com.svg";
import Tv from "../assets/svg/tv_svgrepo.com.svg";
import Electricity from "../assets/svg/electricity_svgrepo.com.svg";
import Data from "../assets/svg/signal_svgrepo.com.svg";

const ServicesScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View className="p-6">
          <Text style={styles.headText}>Services</Text>
          {/* Card */}
          <View className="w-full bg-white p-6 mt-10 rounded-xl">
            <View className="flex-row gap-12 justify-center">
              <View className="items-center">
                <View className=" bg-[#EEEBF9] rounded-full flex-shrink-0 w-10 h-10 items-center justify-center">
                  <Airtime />
                </View>
                <Text>Airtime</Text>
              </View>
              <View className="items-center">
                <View className=" bg-[#EEEBF9] rounded-full flex-shrink-0 w-10 h-10 items-center justify-center">
                  <Data />
                </View>
                <Text>Airtime</Text>
              </View>
              <View className="items-center">
                <View className=" bg-[#EEEBF9] rounded-full flex-shrink-0 w-10 h-10 items-center justify-center">
                  <Tv />
                </View>
                <Text>Airtime</Text>
              </View>
              <View className="items-center">
                <View className=" bg-[#EEEBF9] rounded-full flex-shrink-0 w-10 h-10 items-center justify-center">
                  <Electricity />
                </View>
                <Text>Airtime</Text>
              </View>
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
});
