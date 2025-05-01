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
import { services } from "@/services";
import { Skeleton } from "@rneui/themed";
import { RegularText } from "@/components/common/Text";
import Label from "@/components/common/ui/forms/Label";

const EditTagScreen: React.FC<{
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

  const handleSetTag = async () => {
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft color="#000" />
          </TouchableOpacity>
          <View className="mt-4">
            <RegularText size="large" color="black">
              Edit your RahaPay Tag
            </RegularText>
            <RegularText color="light" size="small" marginTop={10}>
              Update your RahaPay tag for sending and receiving money
            </RegularText>
          </View>

          <View className="mt-6">
            <View>
              <Label text="Edit Username" marked={false} />
            </View>
            <View style={styles.inputContainer}>
              <RegularText color="black">@</RegularText>
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
          {/* Suggested available user tags */}
          <View className="flex-row gap-2 w-full flex-wrap mt-3">
            {loading ? (
              Array.from({ length: 5 }, (_, i) => (
                <Skeleton
                  key={i}
                  width={100}
                  height={25}
                  style={{ backgroundColor: COLORS.grey100, borderRadius: 8 }}
                  skeletonStyle={{ backgroundColor: COLORS.grey50 }}
                />
              ))
            ) : suggestedTags && suggestedTags.length > 0 ? (
              suggestedTags.map((suggestedTag, index) => (
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
              ))
            ) : (
              <Text>No suggestions available.</Text>
            )}
          </View>
        </View>
      </ScrollView>

      <View className="justify-center items-center">
        <Button
          title="Update My Tag"
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
    </SafeAreaView>
  );
};

export default EditTagScreen;

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
    marginBottom: SPACING * 2,
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
