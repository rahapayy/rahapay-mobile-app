import React, { Dispatch, SetStateAction } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import BottomSheet from "./BottomSheet";
import SwipeButton from "../SwipeButton";

const BetSummaryBottomSheet = ({
  isOpen,
  setIsOpen,
  navigate,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  navigate: () => void;
}) => {
  function onClose() {
    setIsOpen(!isOpen);
    navigate();
  }

  const values = [
    {
      title: "Transaction ID",
      value: "1234567890",
    },
    {
      title: "Amount",
      value: "1,000",
    },
    {
      title: "Service",
      value: "SportyBet Funding",
    },
    {
      title: "Receipient",
      value: "+23480123456789",
    },
    {
      title: "Date",
      value: "Mar 06, 2024, 02:12 PM",
    },
  ];
  return (
    <BottomSheet isOpen={isOpen} setIsOpen={setIsOpen}>
      <View>
        <View className="">
          <View className="mb-2">
            <Image
              source={require("../../assets/images/sporty.png")}
              className="w-[64px] h-[64px] mx-auto"
            />
            <Text
              style={styles.medium}
              allowFontScaling={false}
              className="text-center text-base mt-[6px]"
            >
              Sportybet
            </Text>
          </View>
          <View className="py-2">
            <View className="mb-5">
              <Text
                style={styles.bold}
                allowFontScaling={false}
                className="text-2xl text-center"
              >
                ₦1,000
              </Text>
            </View>
            <View className="flex flex-col gap-y-4 mb-8">
              {values.map((value, index) => (
                <View
                  key={index + 20}
                  className="flex flex-row justify-between items-center"
                >
                  <Text
                    style={styles.medium}
                    allowFontScaling={false}
                    className="text-sm"
                  >
                    {value.title}
                  </Text>
                  <Text
                    style={styles.medium}
                    allowFontScaling={false}
                    className="text-[#9BA1A8] text-sm"
                  >
                    {value.value}
                  </Text>
                </View>
              ))}
            </View>

            <SwipeButton buttonText="Slide to pay" onConfirm={onClose} />
          </View>
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  medium: {
    fontFamily: "Outfit-Medium",
  },
  bold: {
    fontFamily: "Outfit-Bold",
  },
});

export default BetSummaryBottomSheet;
