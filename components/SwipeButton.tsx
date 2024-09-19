import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import LottieView from "lottie-react-native";
import { RFValue } from "react-native-responsive-fontsize";

const windowWidth = Dimensions.get("window").width;
const sliderWidth = 360;
const knobWidth = 50;
const maxTranslateX = sliderWidth - knobWidth - 20;

interface SwipeButtonProps {
  onConfirm: (reset: () => void) => void;
  buttonText?: string;
}

const SwipeButton: React.FC<SwipeButtonProps> = ({ onConfirm, buttonText }) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;

  const textTranslateX = translateX.interpolate({
    inputRange: [0, maxTranslateX],
    outputRange: [-10, maxTranslateX - knobWidth / 2],
    extrapolate: "clamp",
  });

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: {
    nativeEvent: { oldState?: any; translationX?: any };
  }) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      let { translationX } = event.nativeEvent;
      translationX = translationX < 0 ? 0 : translationX;
      const confirmed = translationX > maxTranslateX * 0.7;

      if (confirmed && !isConfirmed) {
        // Set translateX to max immediately
        translateX.setValue(maxTranslateX);
        setIsConfirmed(true);
        onConfirm(() => {
          setIsConfirmed(false);
          translateX.setValue(0);
        });
      } else {
        // Animate back to the start if not confirmed
        Animated.spring(translateX, {
          toValue: 0,
          bounciness: 10,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  return (
    <SafeAreaView style={styles.contain}>
      <View style={styles.centeredView}>
        <View style={styles.sliderBackground}>
          {isConfirmed ? (
            <LottieView
              source={require("../assets/animation/loading.json")}
              autoPlay
              loop
              style={styles.loadingAnimation}
            />
          ) : (
            <>
              <PanGestureHandler
                onGestureEvent={onGestureEvent}
                onHandlerStateChange={onHandlerStateChange}
              >
                <Animated.View
                  style={[
                    styles.sliderKnob,
                    {
                      transform: [{ translateX }],
                    },
                  ]}
                >
                  <LottieView
                    source={require("../assets/animation/rightarrow.json")}
                    autoPlay
                    loop
                    style={{
                      width: 40,
                      height: 40,
                    }}
                  />
                </Animated.View>
              </PanGestureHandler>
              <Animated.View
                style={[
                  styles.sliderTextContainer,
                  {
                    transform: [{ translateX: textTranslateX }],
                  },
                ]}
              >
                <Text style={styles.slideText} allowFontScaling={false}>
                  {buttonText || "Slide to Confirm"}
                </Text>
              </Animated.View>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SwipeButton;

const styles = StyleSheet.create({
  contain: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sliderBackground: {
    width: sliderWidth,
    height: 60,
    backgroundColor: "#C9C1EC",
    justifyContent: "center",
    borderRadius: 10,
    overflow: "hidden",
  },
  sliderKnob: {
    backgroundColor: "#4931AE",
    width: knobWidth,
    height: 50,
    position: "absolute",
    left: 10,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  sliderTextContainer: {
    position: "absolute",
    width: sliderWidth - knobWidth,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    left: 0,
    zIndex: 0,
  },
  slideText: {
    fontSize: RFValue(13),
    fontWeight: "500",
    color: "#333",
    fontFamily: "Outfit-Regular",
  },
  loadingAnimation: {
    width: 100,
    height: 100,
    position: "absolute",
    alignSelf: "center",
  },
});
