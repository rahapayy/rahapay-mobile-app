import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft } from "iconsax-react-native";
import SPACING from "../../../config/SPACING";
import FONT_SIZE from "../../../config/font-size";
import { RFValue } from "react-native-responsive-fontsize";
import Dstv from "../../../assets/svg/dstv.svg";
import Gotv from "../../../assets/svg/gotv.svg";
import Startimes from "../../../assets/svg/startimes.svg";
import COLORS from "../../../config/colors";
import useSWR from "swr";
import * as Animatable from "react-native-animatable";
import LoadingLogo from "../../../assets/svg/loadingLogo.svg";

const TvSubscriptionScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const { data, error, isLoading } = useSWR(`/cable/`);

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
    if (data) {
      const filteredPlans = data.filter(
        (plan: { cable_name: string }) =>
          plan.cable_name.toLowerCase() === service.toLowerCase()
      );
      navigation.navigate("CableServiceDetailsScreen", {
        service,
        plans: filteredPlans,
      });
    }
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

  if (isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Animatable.View
          animation="pulse"
          iterationCount="infinite"
          // style={{
          //   backgroundColor: "#fff",
          //   flex: 1,
          //   justifyContent: "center",
          //   alignItems: "center",
          // }}
        >
          <LoadingLogo />
        </Animatable.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View className="justify-center items-center">
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.leftIcon}
            >
              <ArrowLeft color={"#000"} size={24} />
            </TouchableOpacity>
            <Text style={[styles.headerText]} allowFontScaling={false}>
              Cable TV Subscription
            </Text>
          </View>

          <View style={{ paddingHorizontal: 16 }}>
            <Text style={styles.titleText} allowFontScaling={false}>
              Select a service you need
            </Text>

            <View style={styles.serviceContainer}>
              <TouchableOpacity
                style={[
                  styles.boxSelect,
                  selectedService === "Dstv" && styles.selectedBox,
                ]}
                onPress={() => handleServiceSelect("Dstv")}
              >
                <Dstv />
                <Text style={styles.serviceText} allowFontScaling={false}>
                  DStv
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.boxSelect,
                  selectedService === "Gotv" && styles.selectedBox,
                ]}
                onPress={() => handleServiceSelect("Gotv")}
              >
                <Gotv />
                <Text style={styles.serviceText} allowFontScaling={false}>
                  GOtv
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.boxSelect,
                  selectedService === "Startime" && styles.selectedBox,
                ]}
                onPress={() => handleServiceSelect("Startime")}
              >
                <Startimes />
                <Text style={styles.serviceText} allowFontScaling={false}>
                  Startimes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TvSubscriptionScreen;

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
  serviceContainer: {
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
  serviceText: {
    marginTop: SPACING,
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(10),
  },
});
