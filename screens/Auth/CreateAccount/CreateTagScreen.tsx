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
import COLORS from "../../../config/colors";
import SPACING from "../../../config/SPACING";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Button from "../../../components/Button";
import useApi from "../../../utils/api";
import { handleShowFlash } from "../../../components/FlashMessageComponent";
import FONT_SIZE from "../../../config/font-size";

const CreateTagScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);

  const isFormComplete = tag;

  // const { mutateAsync: updateTagMutateAsync } = useApi.patch("/auth/username");
  const { data: suggestedTagsResponse } = useApi.get(
    "/auth/suggest-username?numberOfSuggestions=7"
  );

  const updateTagMutation = useApi.patch<{ userName: string }, Error>(
    "/auth/username"
  );

  const handleSetTag = async () => {
    setLoading(true);
    try {
      await updateTagMutation.mutateAsync({ userName: tag });
      navigation.navigate("CreatePinScreen");
      handleShowFlash({
        message: "Tag updated successfully!",
        type: "success",
      });
      setTag("");
    } catch (error) {
      handleShowFlash({
        message: "Failed to update tag. Please try another.",
        type: "danger",
      });
      // Optionally log the error too
      console.error("Failed to update tag:", error);
      console.error({ error });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      suggestedTagsResponse?.data &&
      suggestedTagsResponse.data &&
      suggestedTagsResponse.data?.suggestedUserNames
    ) {
      setSuggestedTags(suggestedTagsResponse.data?.suggestedUserNames);
    }
  }, [suggestedTagsResponse]);

  return (
    <SafeAreaView className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft color="#000" />
          </TouchableOpacity>
          <View className="mt-4">
            <Text style={styles.headText} allowFontScaling={false}>
              Create a RahaPay Tag
            </Text>
            <Text style={styles.subText} allowFontScaling={false}>
              Send and receive money from your loved ones with your RahaPay tag
            </Text>
          </View>

          <View className="mt-6">
            <View>
              <Text style={styles.label} allowFontScaling={false}>
                Set Username
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={{}} allowFontScaling={false}>
                @{" "}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="eg. john"
                placeholderTextColor="#BABFC3"
                allowFontScaling={false}
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
                    allowFontScaling={false}
                  >
                    {suggestedTag}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>

          <Button
            title="Set My Tag"
            onPress={handleSetTag}
            isLoading={loading}
            style={[
              styles.proceedButton,
              // If the form is not complete, add styles.proceedButtonDisabled
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
