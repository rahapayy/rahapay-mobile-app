import React, { Dispatch, SetStateAction } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import BottomSheet from "./BottomSheet";
import { SearchNormal1 } from "iconsax-react-native";

const bettingProviders = [
  "Sportybet",
  "BetKing",
  "BetSmash",
  "BetBetter",
  "1xBet",
  "Bet9Ja",
  "BetWay",
];

const BettingProvidersBottomSheet = ({
  isOpen,
  setIsOpen,
  selectedOption,
  setSelectedOption,
}: {
  selectedOption: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedOption: (value: string) => void;
}) => {
  function onClose() {
    setIsOpen(!isOpen);
  }
  return (
    <BottomSheet isOpen={isOpen} setIsOpen={setIsOpen}>
      <View>
        <View>
          <View className="rounded-lg border bg-surface-secondary border-border-200 flex-row p-3 items-center gap-x-2">
            <SearchNormal1 color="#C2C2C2" />
            <TextInput
              placeholderTextColor="#C2C2C2"
              placeholder="Search Provider"
              style={{
                fontFamily: "Outfit-Regular",
                fontSize: 16,
              }}
            />
          </View>
        </View>
        <View className="py-[18px] flex flex-col gap-y-6">
          {bettingProviders.map((provider, index) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedOption(provider);
                onClose();
              }}
              //   className="py-4"
            >
              <View
                key={index}
                className="flex flex-row items-center justify-between"
              >
                <Text>{provider}</Text>
                <View
                  className={`w-6 h-6 rounded-full flex items-center border-[3px] ${
                    selectedOption === provider
                      ? "border-[#5136C1]"
                      : "border-[#D1D1D6]"
                  } justify-center bg-white`}
                >
                  {selectedOption === provider && (
                    <View className="w-3 h-3 rounded-full bg-[#5136C1]" />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </BottomSheet>
  );
};

export default BettingProvidersBottomSheet;
