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
import { ArrowRight2 } from "iconsax-react-native";
import LottieView from "lottie-react-native";

const windowWidth = Dimensions.get("window").width;
const sliderWidth = 380;
const knobWidth = 50;
const maxTranslateX = sliderWidth - knobWidth - 20;

const SwipeButton = () => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;

  // Note we use the same interpolate values as translateX for the text so it starts hidden behind the knob
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

      // Use a spring effect when releasing the knob
      Animated.spring(translateX, {
        toValue: confirmed ? maxTranslateX : 0,
        bounciness: 10,
        useNativeDriver: true,
      }).start(() => {
        if (confirmed && !isConfirmed) {
          setIsConfirmed(true);

          // Here, you should also handle the confirmed action,
          // like sending a request to the server or navigating to another screen
          // after some processing, you might want to reset the swipe button
          // for that, you will need another state transition or callback.
        }
      });
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
                <Text style={styles.slideText}>Slide to Confirm</Text>
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
    backgroundColor: "#fff",
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
    overflow: "hidden", // This prevents the text from showing outside the background
  },
  sliderKnob: {
    backgroundColor: "#4931AE",
    width: knobWidth,
    height: 50,
    position: "absolute",
    left: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  sliderTextContainer: {
    position: "absolute",
    width: sliderWidth - knobWidth, // Adjusted width to prevent text overflow
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    left: 10, // Position it at the start of the sliderBackground
    zIndex: 0,
  },
  slideText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#333",
  },
  loadingAnimation: {
    width: 100,
    height: 100,
    position: "absolute",
    alignSelf: "center",
  },
});
