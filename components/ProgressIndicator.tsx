import { View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { LightText } from "./common/Text";
import BackButton from "./common/ui/buttons/BackButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ProgressIndicatorProps = {
  navigation: any;
  currentStep: number;
  totalSteps: number;
  clearOnboardingOnBack?: boolean;
};

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  navigation,
  currentStep,
  totalSteps,
  clearOnboardingOnBack = false,
}) => {
  // Custom back handler for VerifyEmailScreen
  const handleBack = async () => {
    if (clearOnboardingOnBack) {
      const onboardingStateString = await AsyncStorage.getItem("ONBOARDING_STATE");
      if (onboardingStateString) {
        await AsyncStorage.removeItem("ONBOARDING_STATE");
        navigation.reset({
          index: 0,
          routes: [{ name: "LoginScreen" }] as any,
        });
        return;
      }
    }
    navigation.goBack();
  };

  return (
    <View className="flex-row justify-between items-center">
      <BackButton navigation={navigation} onPress={handleBack} />

      <View className="flex-row items-center gap-2">
        {[...Array(totalSteps)].map((_, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          return (
            <View key={index} className="flex-row items-center">
              {index !== 0 && (
                <View
                  className={`h-1 w-5 ${
                    isCompleted
                      ? "bg-green-500"
                      : isActive
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                />
              )}
              <View
                className={`w-3 h-3 rounded-full flex-row items-center justify-center ${
                  isCompleted
                    ? "bg-green-500"
                    : isActive
                    ? "bg-blue-500"
                    : "bg-gray-300"
                }`}
              >
                {isCompleted && (
                  <AntDesign name="check" size={10} color="white" />
                )}
              </View>
            </View>
          );
        })}
      </View>

      <LightText color="light">
        {currentStep + 1}/{totalSteps}
      </LightText>
    </View>
  );
};

export default ProgressIndicator;
