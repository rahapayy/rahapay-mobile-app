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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import useApi from "../../../utils/api";
import { handleShowFlash } from "../../../components/FlashMessageComponent";

const CreateTagScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);

  // const { mutateAsync: updateTagMutateAsync } = useApi.patch("/auth/username");
  const { data: suggestedTagsResponse } = useApi.get(
    "/auth/suggest-username?numberOfSuggestions=7"
  );

  const updateTagMutation = useApi.patch<{ userName: string }, Error>('/auth/username');

  const handleSetTag = async () => {
    setLoading(true);
    try {
await updateTagMutation.mutateAsync({ userName: tag });

      // Here you would navigate to another screen or reset the state as required
      navigation.navigate("NextScreen");
      // Show success message
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (suggestedTagsResponse) {
      setSuggestedTags(suggestedTagsResponse.data); // Assuming the response data is an array of strings
    }
  }, [suggestedTagsResponse]);

  return (
    <SafeAreaView>
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
          <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            enableOnAndroid={true}
            extraScrollHeight={Platform.OS === "ios" ? 20 : 0}
          >
            <View className="mt-6">
              <View>
                <Text style={styles.label} allowFontScaling={false}>
                  Set Username
                </Text>
                {/* Loading component for check if the user name is availble */}
                <View></View>
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
                />
              </View>
            </View>
            {/* Suggested availble usertags */}
            {suggestedTags.map((suggestedTag, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  padding: SPACING,
                  backgroundColor: COLORS.black200,
                  marginTop: SPACING,
                }}
                onPress={() => setTag(suggestedTag)}
              >
                <Text>{`@${suggestedTag}`}</Text>
              </TouchableOpacity>
            ))}

            <Button
              title="Set My Tag"
              onPress={handleSetTag}
              isLoading={loading}
              style={styles.proceedButton}
              textColor={COLORS.white}
            />
          </KeyboardAwareScrollView>
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
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#DFDFDF",
    padding: 18,
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: RFValue(12),
    borderRadius: 10,
    padding: 18,
    width: "100%",
    borderWidth: 1,
    borderColor: "#DFDFDF",
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: RFValue(12),
  },
  numberText: {
    fontFamily: "Outfit-Regular",
  },
  proceedButton: {
    marginTop: SPACING * 4,
  },
  proceedButtonText: {
    fontFamily: "Outfit-Regular",
    color: "#fff",
    fontSize: RFValue(16),
  },
});
