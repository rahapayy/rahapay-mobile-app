import { View, Animated, useWindowDimensions, StyleSheet } from "react-native";
import React, { FC } from "react";
import COLORS from "../../config/colors";
import { RFValue } from "react-native-responsive-fontsize";

interface PaginationProps {
  data: any;
  scrollx: any;
}

const Paginator: FC<PaginationProps> = ({ data, scrollx }) => {
  const { width, height } = useWindowDimensions();
  const bottomPosition = height * 0.08;

  return (
    <View style={{ flexDirection: "row", bottom: bottomPosition }}>
      {data.map((_item: any, i: number) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

        const dotWidth = scrollx.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: "clamp",
        });

        const opacity = scrollx.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            style={[style.dot, { width: dotWidth, opacity }]}
            key={i.toString()}
          />
        );
      })}
    </View>
  );
};

export default Paginator;

const style = StyleSheet.create({
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.violet400,
    marginHorizontal: 8,
  },
});
