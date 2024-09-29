import React from "react";
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SPACING from "../../constants/SPACING";
import FONT_SIZE from "../../constants/font-size";
import COLORS from "../../constants/colors";
import { ArrowLeft, ArrowRight2 } from "iconsax-react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const options = [
  {
    title: "Change transaction pin",
    type: "transactionPin",
  },
  {
    title: "Change security pin",
    type: "securityPin",
  },
];

const SelectPinChangeScreen: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View className="p-4">
          <View className="flex-row items-center mb-6">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.leftIcon}
            >
              <ArrowLeft color={"#000"} size={24} />
            </TouchableOpacity>
            <Text style={[styles.headerText]} allowFontScaling={false}>
              Select pin type
            </Text>
          </View>
          <View>
            {options.map((item, index) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ChangePinScreen", {
                    type: item.type,
                  })
                }
                key={index}
                className="flex-row items-center justify-between py-3 my-1"
              >
                <View>
                  <Text style={styles.addFont} allowFontScaling={false}>
                    {item.title}
                  </Text>
                </View>
                <View>
                  <ArrowRight2 size={20} color="#000" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SelectPinChangeScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? SPACING * 2 : SPACING * 2,
    paddingBottom: SPACING * 3,
  },
  leftIcon: {
    marginRight: SPACING,
  },
  headerText: {
    color: "#000",
    fontSize: FONT_SIZE.medium,
    fontFamily: "Outfit-Regular",
    flex: 1,
  },
  addFont: {
    fontFamily: "Outfit-Regular",
  },
  headerTextDark: {
    color: COLORS.white,
  },
  headTextContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
