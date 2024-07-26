import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft } from "iconsax-react-native";
import SPACING from "../../../config/SPACING";
import FONT_SIZE from "../../../config/font-size";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../../../config/colors";
import useSWR from "swr";
import * as Animatable from "react-native-animatable";
import LoadingLogo from "../../../assets/svg/loadingLogo.svg";

const ElectricityScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [selectedDisco, setSelectedDisco] = useState<string | null>(null);

  const { data, error, isLoading } = useSWR(`/electricity`); // Fetch data

  const handleDiscoSelect = (disco: string, planId: string) => {
    setSelectedDisco(disco);
    navigation.navigate("MeterTypeScreen", {
      disco,
      planId,
    });
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

  if (isLoading || !data) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Animatable.View animation="pulse" iterationCount="infinite">
          <LoadingLogo />
        </Animatable.View>
      </SafeAreaView>
    );
  }

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
              Electricity Bills
            </Text>
          </View>

          <View style={{ paddingHorizontal: 16 }}>
            <Text style={styles.titleText} allowFontScaling={false}>
              Select an electricity provider
            </Text>

            <View style={styles.discoContainer}>
              {Array.isArray(data.plan) &&
                data.plan.map(
                  (item: { disco_name: string; plan_id: string }) => (
                    <TouchableOpacity
                      key={item.plan_id}
                      style={[
                        styles.boxSelect,
                        selectedDisco === item.disco_name && styles.selectedBox,
                      ]}
                      onPress={() =>
                        handleDiscoSelect(item.disco_name, item.plan_id)
                      }
                    >
                      <Text style={styles.discoText} allowFontScaling={false}>
                        {item.disco_name}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ElectricityScreen;

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
  discoContainer: {
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
  discoText: {
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(10),
    textAlign: "center",
  },
});
