import {
  View,
  FlatList,
  Share,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { SemiBoldText } from "../common/Text";
import Button from "../common/ui/buttons/Button";
import { SPACING } from "../../constants/ui";
import { useAuth } from "../../services/AuthContext";
import { Skeleton } from "@rneui/themed";
import COLORS from "@/constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Overlay from "@/assets/svg/layer.svg";

const { width } = Dimensions.get("window");

const banners = [
  {
    id: "1",
    text: "Create a tag to personalize your account to invite others and earn rewards!",
    backgroundColor: "#5136C1",
    showButton: true,
    buttonText: "Create tag",
    showIcon: true,
  },
  {
    id: "2",
    text: "Invite your friends and earn exclusive bonuses!",
    backgroundColor: "#5136C1",
    showButton: true,
    buttonText: "Invite now",
    showIcon: false,
  },
  {
    id: "3",
    text: "Card Coming Soon! Get ready for seamless payments.",
    backgroundColor: "#5136C1",
    showButton: false,
    showIcon: false,
  },
];

const Banner = ({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any, "">;
}) => {
  const { userInfo, isLoading } = useAuth();
  const filteredBanners = userInfo?.userName
    ? banners.filter((b) => b.id !== "1")
    : banners;

  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleInviteFriends = async () => {
    await Share.share({
      message: "https://example.com/invite-link",
    });
  };

  // Auto-scroll logic
  useEffect(() => {
    if (filteredBanners.length <= 1) return; // No need to scroll if 1 or fewer items

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % filteredBanners.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 3000); // Scroll every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [currentIndex, filteredBanners.length]);

  // Handle manual scrolling to update currentIndex
  const onScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / (width / 1.3));
    setCurrentIndex(newIndex);
  };

  const renderItem = ({ item }: { item: (typeof banners)[0] }) => (
    <View
      className="rounded-xl overflow-hidden mx-2"
      style={{
        backgroundColor: item.backgroundColor,
        width: width / 1.2,
        height: RFValue(100),
      }}
    >
      <View className="p-4">
        <Overlay style={styles.overlay} />
        <View style={styles.content}>
          <SemiBoldText color="white" size="base">
            {item.text}
          </SemiBoldText>

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
            <Image
              source={require("@/assets/animation/at.gif")}
              style={styles.animation}
            />
          )}
        </View>
      </View>
    </View>
  );

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
          ref={flatListRef}
          data={filteredBanners}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onScroll={onScroll}
          snapToInterval={width / 1.3 + 8} // Item width + margin (mx-2 = 8px total)
          snapToAlignment="start"
          decelerationRate="fast"
          initialNumToRender={filteredBanners.length}
          contentContainerStyle={{ paddingHorizontal: 4 }} // Half of mx-2 for alignment
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  },
  content: {
    position: "relative",
    zIndex: 1,
  },
  animation: {
    position: "absolute",
    right: -40,
    bottom: -50,
    width: 150,
    height: 150,
  },
});

export default Banner;
