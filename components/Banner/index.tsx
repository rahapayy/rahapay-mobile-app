import { View, ImageBackground, FlatList, Share } from "react-native";
import React, { useContext } from "react";
import { SemiBoldText } from "../common/Text";
import Button from "../common/ui/buttons/Button";
import { SPACING } from "../../constants/ui";
import AtIcon from "../../assets/svg/@ at the rate 1.svg";
import { useAuth } from "../../services/AuthContext";
import { Skeleton } from "@rneui/themed";
import COLORS from "@/constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

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

const Banner = ({ navigation }: { navigation: NativeStackNavigationProp<any, ""> }) => {
  const { userInfo, isLoading } = useAuth();
  const filteredBanners = userInfo?.userName
    ? banners.filter((b) => b.id !== "1")
    : banners;

  const handleInviteFriends = async () => {
    await Share.share({
      message: 'https://example.com/invite-link',
    });
  };

  return (
    <View className="py-6">
      {isLoading ? (
        <Skeleton
          animation="wave"
          width={RFValue(250)}
          height={RFValue(102)}
          style={{ backgroundColor: COLORS.grey100, borderRadius: 8 }}
          skeletonStyle={{ backgroundColor: COLORS.grey50 }}
        >
          <View className="p-4">
            <Skeleton
              animation="wave"
              width={RFValue(180)}
              height={RFValue(16)}
              style={{ backgroundColor: COLORS.grey100, borderRadius: 8 }}
              skeletonStyle={{ backgroundColor: COLORS.grey50 }}
            />
            <Skeleton
              animation="wave"
              width={RFValue(120)}
              height={RFValue(24)}
              style={{
                backgroundColor: COLORS.grey100,
                borderRadius: 8,
                marginTop: SPACING * 2,
              }}
              skeletonStyle={{ backgroundColor: COLORS.grey50 }}
            />
          </View>
        </Skeleton>
      ) : (
        <FlatList
          data={filteredBanners}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="rounded-xl overflow-hidden mx-2">
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
                    onPress={() => {
                      if (item.id === "1") {
                        navigation.navigate("CreateTagScreen");
                      } else if (item.id === "2") {
                        handleInviteFriends();
                      }
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
      )}
    </View>
  );
};

export default Banner;
