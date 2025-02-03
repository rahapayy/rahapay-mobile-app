import { View, ImageBackground, FlatList } from "react-native";
import React, { useContext } from "react";
import { SemiBoldText } from "../common/Text";
import Button from "../common/ui/buttons/Button";
import { SPACING } from "../../constants/ui";
import AtIcon from "../../assets/svg/@ at the rate 1.svg";
import { AuthContext } from "../../services/AuthContext";

const banners = [
  {
    id: "1",
    text: "Create a tag to personalize your account to invite others and earn rewards!",
    image: require("../../assets/images/bg.png"),
    showButton: true,
    buttonText: "Create tag",
    showIcon: true,
  },
  {
    id: "2",
    text: "Invite your friends and earn exclusive bonuses!",
    image: require("../../assets/images/bg.png"),
    showButton: true,
    buttonText: "Invite now",
    showIcon: false,
  },
];

const Banner = () => {
  const { userDetails } = useContext(AuthContext);
  const filteredBanners = userDetails?.userName
    ? banners.filter((b) => b.id !== "1")
    : banners;
  return (
    <View className="py-6">
      <FlatList
        data={filteredBanners}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="rounded-lg overflow-hidden mx-2">
            <ImageBackground
              source={item.image}
              className="p-4 w-80 h-32"
              resizeMode="cover"
            >
              <View>
                <SemiBoldText color="white" size="base">
                  {item.text}
                </SemiBoldText>
              </View>

              {item.showButton && (
                <Button
                  textColor="black"
                  title={item.buttonText}
                  style={{
                    backgroundColor: "white",
                    width: 150,
                    height: 32,
                    marginTop: SPACING * 2,
                  }}
                />
              )}

              {item.showIcon && (
                <View className="absolute right-0 bottom-0">
                  <AtIcon />
                </View>
              )}
            </ImageBackground>
          </View>
        )}
      />
    </View>
  );
};

export default Banner;
