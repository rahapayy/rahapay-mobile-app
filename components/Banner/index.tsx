import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SemiBoldText } from "../common/Text";
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
    showIcon: true,
    icon: require("@/assets/animation/at.gif"), // Assuming you have this
    iconWidth: 100, // Custom width for this banner
    iconHeight: 100, // Custom height for this banner
    onPress: (navigation: NativeStackNavigationProp<any, "">) =>
      navigation.navigate("CreateTagScreen"),
  },
  {
    id: "2",
    text: "Card Coming Soon! Get ready for seamless payments.",
    backgroundColor: "#5136C1",
    showIcon: true,
    icon: require("@/assets/images/Card.png"), // Assuming you have this
    iconWidth: 80, // Smaller width for this banner
    iconHeight: 80, // Smaller height for this banner
    onPress: () => {},
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

  // Auto-scroll logic
  useEffect(() => {
    if (filteredBanners.length <= 1) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % filteredBanners.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, filteredBanners.length]);

  // Handle manual scrolling
  const onScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const itemWidth = width * 0.7 + 8;
    const newIndex = Math.round(contentOffsetX / itemWidth);
    setCurrentIndex(newIndex);
  };

  const renderItem = ({ item }: { item: (typeof banners)[0] }) => (
    <TouchableOpacity
      onPress={() => item.onPress(navigation)}
      activeOpacity={0.8}
      className="rounded-xl overflow-hidden mx-2"
      style={{
        backgroundColor: item.backgroundColor,
        width: width * 0.7,
        height: RFValue(75),
      }}
    >
      <View className="p-3">
        <Overlay style={styles.overlay} />
        <View style={styles.content}>
          <SemiBoldText color="white" size="small" numberOfLines={3}>
            {item.text}
          </SemiBoldText>
          {item.showIcon && (
            <Image
              source={item.icon}
              style={{
                ...styles.animation,
                width: item.iconWidth, // Override with custom width
                height: item.iconHeight, // Override with custom height
              }}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="py-4">
      {isLoading ? (
        <Skeleton
          animation="wave"
          width={RFValue(220)}
          height={RFValue(92)}
          style={{ backgroundColor: COLORS.grey100, borderRadius: 8 }}
          skeletonStyle={{ backgroundColor: COLORS.grey50 }}
        >
          <View className="p-3">
            <Skeleton
              animation="wave"
              width={RFValue(160)}
              height={RFValue(14)}
              style={{ backgroundColor: COLORS.grey100, borderRadius: 8 }}
              skeletonStyle={{ backgroundColor: COLORS.grey50 }}
            />
            <Skeleton
              animation="wave"
              width={RFValue(100)}
              height={RFValue(20)}
              style={{
                backgroundColor: COLORS.grey100,
                borderRadius: 8,
                marginTop: SPACING,
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
          snapToInterval={width * 0.7 + 8}
          snapToAlignment="start"
          decelerationRate="fast"
          initialNumToRender={filteredBanners.length}
          contentContainerStyle={{ paddingHorizontal: 4 }}
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
    right: -45,
    top: 10,
    width: 130, // Default width (overridden by iconWidth)
    height: 130, // Default height (overridden by iconHeight)
  },
});

export default Banner;
