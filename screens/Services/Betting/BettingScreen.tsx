import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowDown2, ArrowLeft } from "iconsax-react-native";
import SPACING from "../../../constants/SPACING";
import FONT_SIZE from "../../../constants/font-size";
import BettingProvidersBottomSheet from "../../../components/bottom-sheet/BettingProvidersBottomSheet";
import Button from "../../../components/Button";
import COLORS from "../../../constants/colors";
import BetSummaryBottomSheet from "../../../components/bottom-sheet/BetSummaryBottomSheet";

const BettingScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [showProvider, setShowProvider] = useState(false);
  const [showBetSummary, setShowBetSummary] = useState(false);
  const [formValues, setFormValues] = useState({
    provider: "",
  });

  function handleInputChange(value: string, key: string) {
    setFormValues({ ...formValues, [key]: value });
  }

  const amounts = [50, 100, 200, 500, 1000, 2000, 3000, 5000];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView className="flex-1 px-4">
        <View>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.leftIcon}
            >
              <ArrowLeft color={"#000"} size={24} />
            </TouchableOpacity>
            <Text style={[styles.headerText]} allowFontScaling={false}>
              Fund Bet Wallet
            </Text>
          </View>

          <View className="flex flxe-col gap-y-4">
            <View className="bg-white rounded-lg p-4 flex flex-col gap-y-4">
              <View>
                <View className="flex flex-col gap-y-2">
                  <Text
                    style={styles.text}
                    className="text-sm"
                    allowFontScaling={false}
                  >
                    Select provider
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowProvider(!showProvider);
                    }}
                  >
                    <View
                      className={`${
                        formValues.provider
                          ? "border border-brand bg-brand/10"
                          : "bg-surface-tertiary"
                      }  py-[17px] px-4 rounded-lg flex-row items-center justify-between`}
                    >
                      <Text
                        style={[
                          styles.text,
                          {
                            color: formValues.provider ? "#000" : "#AEAEB2",
                            fontSize: 16,
                            paddingHorizontal: 4,
                          },
                        ]}
                        allowFontScaling={false}
                      >
                        {formValues.provider
                          ? formValues.provider
                          : "Select provider"}
                      </Text>
                      <ArrowDown2
                        color={formValues.provider ? COLORS.brand : "#AEAEB2"}
                        strokeWidth={2}
                        size={20}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <View className="flex flex-col gap-y-2">
                  <Text
                    style={styles.text}
                    className="text-sm"
                    allowFontScaling={false}
                  >
                    User ID
                  </Text>
                  <TextInput
                    className="pt-[10px] pb-[17px] px-4 rounded-lg text-base text-grey-200 bg-surface-tertiary"
                    placeholder="Enter your User ID or Phone number"
                    placeholderTextColor="#AEAEB2"
                    style={styles.text}
                  />
                  <View className="rounded-full bg-red-50 px-3 py-[5px] w-[114px]">
                    <Text style={styles.text} className="text-red-500 text-sm">
                      Invalid User ID
                    </Text>
                  </View>
                </View>
              </View>
              <View>
                <View className="flex flex-col gap-y-2">
                  <Text style={styles.text} className="text-sm">
                    Amount
                  </Text>
                  <TextInput
                    style={styles.text}
                    className="pt-[10px] pb-[17px] px-4 rounded-lg text-base text-grey-200 bg-surface-tertiary"
                    placeholder="Enter amount"
                    placeholderTextColor="#AEAEB2"
                  />
                </View>
              </View>
            </View>

            <View className="rounded-lg py-3 px-4 flex-row flex-wrap bg-[#7165E3]/10 gap-y-[9px]">
              {amounts.map((value, index) => (
                <TouchableOpacity key={index}>
                  <View className="bg-white px-[17px] py-2 rounded-[5.4px] mr-[11px]">
                    <Text style={styles.text}>₦{value}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <View>
              <Button
                title="Proceed"
                onPress={() => {
                  setShowBetSummary(!showBetSummary);
                }}
                textColor="white"
              />
            </View>

            <View className="px-5 py-[17px] bg-white rounded-lg">
              <View className="flex-row items-center justify-between gap-x-5">
                <View className="flex-col col-span-1 gap-y-3 w-24 items-center">
                  <View className="col-span-1">
                    <Image
                      source={require("../../../assets/images/chelsea.png")}
                      className="w-[64px] h-[64px]"
                    />
                  </View>
                  <Text style={styles.text} className="text-center">
                    Chelsea
                  </Text>
                  <View className="bg-surface-primary rounded-lg border border-border-200 px-5 py-[10px] w-full justify-center items-center flex">
                    <Text style={styles.text} className="text-base">
                      1.8
                    </Text>
                  </View>
                </View>
                <View className="flex-col col-span-1 gap-y-3 w-24 items-center">
                  <Text
                    style={styles.text}
                    className="text-black opacity-50 text-center"
                  >
                    Premier League
                  </Text>
                  <View className="flex flex-col gap-y-2">
                    <Text
                      style={[styles.textBlack, { fontWeight: 900 }]}
                      className="text-black font-black text-[25px] text-center"
                    >
                      1:3
                    </Text>
                    <View className="flex-row items-center justify-center gap-x-[5px]">
                      <View className="w-2 h-2 bg-success rounded-full"></View>
                      <Text
                        style={styles.text}
                        className="text-black opacity-50"
                      >
                        49:20
                      </Text>
                    </View>
                  </View>
                  <View className="bg-surface-primary rounded-lg border border-border-200 px-5 py-[10px] w-full justify-center items-center flex">
                    <Text style={styles.text} className="text-base">
                      2.1
                    </Text>
                  </View>
                </View>
                <View className="flex-col col-span-1 gap-y-3 w-24 items-center">
                  <View className="col-span-1">
                    <Image
                      source={require("../../../assets/images/leicester.png")}
                      className="w-[64px] h-[64px]"
                    />
                  </View>
                  <Text style={styles.text} className="text-center">
                    Leicester
                  </Text>
                  <View className="bg-surface-primary rounded-lg border border-border-200 px-5 py-[10px] w-full justify-center items-center flex">
                    <Text style={styles.text} className="text-base">
                      1.3
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <BettingProvidersBottomSheet
            isOpen={showProvider}
            setIsOpen={setShowProvider}
            selectedOption={formValues.provider}
            setSelectedOption={(value: string) => {
              handleInputChange(value, "provider");
            }}
          />
          <BetSummaryBottomSheet
            isOpen={showBetSummary}
            setIsOpen={setShowBetSummary}
            navigate={() => navigation.navigate("BettingSuccessScreen")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BettingScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    paddingTop: Platform.OS === "ios" ? SPACING * 2 : SPACING * 2,
    paddingBottom: SPACING * 3,
  },
  leftIcon: {
    marginRight: SPACING,
  },
  text: {
    fontFamily: "Outfit-Regular",
  },
  textBlack: {
    fontFamily: "Outfit-Black",
  },
  headerText: {
    color: "#000",
    fontSize: FONT_SIZE.medium,
    fontFamily: "Outfit-Regular",
    flex: 1,
  },
});
