import { View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { LightText } from "./common/Text";
import BackButton from "./common/ui/buttons/BackButton";

type ProgressIndicatorProps = {
  navigation: any;
  currentStep: number;
  totalSteps: number;
};

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  navigation,
  currentStep,
  totalSteps,
}) => {
  return (
    <View className="flex-row justify-between items-center">
      <BackButton navigation={navigation} />

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
