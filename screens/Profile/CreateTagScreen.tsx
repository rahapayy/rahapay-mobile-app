import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ArrowLeft } from "iconsax-react-native";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "../../constants/colors";
import SPACING from "../../constants/SPACING";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Button from "../../components/common/ui/buttons/Button";
import { handleShowFlash } from "../../components/FlashMessageComponent";
import FONT_SIZE from "../../constants/font-size";
import BackButton from "../../components/common/ui/buttons/BackButton";
import { services } from "@/services";

const CreateTagScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [error, setError] = useState(null);

  const isFormComplete = tag;

  const fetchSuggestedTags = async () => {
    setLoading(true);
    try {
      const response = await services.userService.suggestUsername(7);

      // Remove the .data reference since suggestedUserNames is at the top level
      const suggestedUsernames = response?.suggestedUserNames;
      if (Array.isArray(suggestedUsernames) && suggestedUsernames.length > 0) {
        setSuggestedTags(suggestedUsernames);
      } else {
        console.log("No suggested usernames received.");
      }
    } catch (error) {
      console.error("Error fetching suggested tags:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateTag = async () => {
    try {
      setIsLoading(true);
      await services.userService.updateUsername({ userName: tag });
      handleShowFlash({
        message: "Tag updated successfully!",
        type: "success",
      });
      navigation.navigate("HomeScreen");
    } catch (error) {
      handleShowFlash({
        message: "Failed to update tag. Please try another.",
        type: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestedTags();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <BackButton navigation={navigation} />
          <View className="mt-4">
            <Text style={styles.headText}>Create a RahaPay Tag</Text>
            <Text style={styles.subText}>
              Send and receive money from your loved ones with your RahaPay tag
            </Text>
          </View>

          <View className="mt-6">
            <View>
              <Text style={styles.label}>Set Username</Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={{}}>@ </Text>
              <TextInput
                style={styles.input}
                placeholder="eg. john"
                placeholderTextColor="#BABFC3"
                value={tag}
                onChangeText={setTag}
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>
          {/* Suggested availble usertags */}
          <View className="flex-row gap-2 w-full flex-wrap mt-3">
            {suggestedTags?.length > 0 &&
              suggestedTags?.map((suggestedTag, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    paddingHorizontal: SPACING,
                    paddingVertical: 5,
                    borderRadius: 5,
                    width: "auto",
                    backgroundColor: "#C9C1EC",
                    marginTop: SPACING,
                  }}
                  onPress={() => setTag(suggestedTag)}
                >
                  <Text
                    style={{
                      color: "#5136C1",
                      fontSize: FONT_SIZE.extraSmall,
                    }}
                  >
                    {suggestedTag}
                  </Text>
                </TouchableOpacity>
              ))}
            {error && <Text style={{ color: "red" }}>{error}</Text>}
          </View>

          <Button
            title="Set My Tag"
            onPress={updateTag}
            isLoading={isLoading}
            style={[
              styles.proceedButton,
              !isFormComplete && styles.proceedButtonDisabled,
            ]}
            textColor={COLORS.white}
            disabled={!isFormComplete || isLoading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateTagScreen;

const styles = StyleSheet.create({
  headText: {
    fontFamily: "Outfit-Medium",
    fontSize: RFValue(20),
    marginBottom: 10,
  },
  subText: {
    fontFamily: "Outfit-ExtraLight",
    fontSize: RFValue(13),
  },
  label: {
    fontFamily: "Outfit-Regular",
    marginBottom: 10,
    fontSize: RFValue(12),
  },
  vertical: {
    backgroundColor: COLORS.black100,
    width: 1,
    height: "100%",
    marginHorizontal: SPACING,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#DFDFDF",
    paddingHorizontal: SPACING,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    fontSize: RFValue(10),
    fontFamily: "Outfit-Regular",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: RFValue(12),
    borderRadius: 10,
    paddingHorizontal: SPACING,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    width: "100%",
    borderWidth: 1,
    borderColor: "#DFDFDF",
  },
  input: {
    flex: 1,
    fontSize: RFValue(12),
  },
  numberText: {
    fontFamily: "Outfit-Regular",
  },
  proceedButton: {
    marginTop: SPACING * 2,
  },
  proceedButtonText: {
    fontFamily: "Outfit-Regular",
    color: "#fff",
    fontSize: RFValue(16),
  },
  proceedButtonDisabled: {
    backgroundColor: COLORS.violet200,
  },
});
