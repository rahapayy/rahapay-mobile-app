import { SafeAreaView, ScrollView, TouchableOpacity, View } from "react-native";
import React, { useContext } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";
import { RegularText, SemiBoldText } from "../components/common/Text";
import {
  AirtimeIcon,
  DataIcon,
  ElectricityIcon,
  TvIcon,
} from "../components/common/ui/icons";
import AirtimeRotate from "../assets/svg/airtime-rotate.svg";
import DataRotate from "../assets/svg/data-rotate.svg";
import TvRotate from "../assets/svg/tv-rotate.svg";
import ElectricityRotate from "../assets/svg/electricity-rotate.svg";
import EducationRotate from "../assets/svg/education-rotate.svg";
import GiftRotate from "../assets/svg/gift-rotate.svg";
import { AuthContext } from "../services/AuthContext";

const ServicesScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const { isLoading } = useContext(AuthContext);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F7F7" }}>
      <ScrollView>
        <View className="p-4">
          <SemiBoldText color="black" size="large">
            Services
          </SemiBoldText>

          {/* Grid Container */}
          <View className="flex flex-row flex-wrap justify-between mt-4">
            {/* Grid Items */}
            <TouchableOpacity
              onPress={() => navigation.navigate("AirtimeScreen")}
              className="w-[48%] mb-4 bg-[#F5F3FD] py-4 px-3 rounded-xl border border-[#C9C1EC]"
            >
              <View className="bg-[#EEEBF9] rounded-full flex-shrink-0 w-10 h-10 items-center justify-center">
                <AirtimeIcon width={20} height={20} fill="#5136C1" />
              </View>
              <RegularText color="black" marginTop={5}>
                Airtime
              </RegularText>
              <View className="absolute right-0 bottom-0">
                <AirtimeRotate />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("DataScreen")}
              className="w-[48%] mb-4 bg-[#E6F8F1] py-4 px-3 rounded-xl border border-[#B0E9D4]"
            >
              <View className="bg-[#B0E9D4] rounded-full flex-shrink-0 w-10 h-10 items-center justify-center">
                <DataIcon width={20} height={20} fill="#00935E" />
              </View>
              <RegularText color="black" marginTop={5}>
                Data
              </RegularText>
              <View className="absolute right-0 bottom-0">
                <DataRotate />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("DataScreen")}
              className="w-[48%] mb-4 bg-[#E6F8F1] py-4 px-3 rounded-xl border border-[#B0E9D4]"
            >
              <View className="bg-[#B0E9D4] rounded-full flex-shrink-0 w-10 h-10 items-center justify-center">
                <ElectricityIcon width={20} height={20} fill="#00935E" />
              </View>
              <RegularText color="black" marginTop={5}>
                Electricity
              </RegularText>
              <View className="absolute right-0 bottom-0">
                <ElectricityRotate />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("TvSubscriptionScreen")}
              className="w-[48%] mb-4 bg-[#FFEAEA] py-4 px-3 rounded-xl border border-[#FFBEBE]"
            >
              <View className="bg-[#FFBEBE] rounded-full flex-shrink-0 w-10 h-10 items-center justify-center">
                <TvIcon width={20} height={20} fill="#E62929" />
              </View>
              <RegularText color="black" marginTop={5}>
                TV
              </RegularText>
              <View className="absolute right-0 bottom-0">
                <TvRotate />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("ReferralScreen")}
              className="w-[48%] mb-4 bg-[#FFEAEA] py-4 px-3 rounded-xl border border-[#FFBEBE]"
            >
              <View className="bg-[#FFBEBE] rounded-full flex-shrink-0 w-10 h-10 items-center justify-center">
                <Ionicons name="gift" size={20} color={COLORS.red400} />
              </View>
              <RegularText color="black" marginTop={5}>
                Refer & Earn
              </RegularText>
              <View className="absolute right-0 bottom-0">
                <GiftRotate />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("AirtimeScreen")}
              className="w-[48%] mb-4 bg-[#F5F3FD] py-4 px-3 rounded-xl border border-[#C9C1EC]"
            >
              <View className="bg-[#EEEBF9] rounded-full flex-shrink-0 w-10 h-10 items-center justify-center">
                <Ionicons
                  name="school-sharp"
                  size={20}
                  color={COLORS.violet400}
                />
              </View>
              <RegularText color="black" marginTop={5}>
                Education
              </RegularText>
              <View className="absolute right-0 bottom-0">
                <EducationRotate />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ServicesScreen;
