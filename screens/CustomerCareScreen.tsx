import {
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActionSheetIOS,
    Alert,
    Linking,
  } from "react-native";
  import React from "react";
  import { NativeStackNavigationProp } from "@react-navigation/native-stack";
  import { ArrowLeft, Call, Message2, Messages2 } from "iconsax-react-native";
  import SPACING from "../config/SPACING";
  import FONT_SIZE from "../config/font-size";
  import COLORS from "../config/colors";
  import { RFValue } from "react-native-responsive-fontsize";
  
  const CustomerCareScreen: React.FC<{
    navigation: NativeStackNavigationProp<any, "">;
  }> = ({ navigation }) => {
    const phoneNumber = "+23409167662449"; // Replace with your phone number
  
    const handleCallUs = () => {
      if (Platform.OS === "ios") {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ["Cancel", `Call ${phoneNumber}`],
            cancelButtonIndex: 0,
            destructiveButtonIndex: 1,
          },
          (buttonIndex) => {
            if (buttonIndex === 1) {
              Linking.openURL(`tel:${phoneNumber}`);
            }
          }
        );
      } else {
        Alert.alert(
          "Call Us",
          phoneNumber,
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Call",
              onPress: () => Linking.openURL(`tel:${phoneNumber}`),
            },
          ],
          { cancelable: true }
        );
      }
    };
  
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F7F7" }}>
        <ScrollView>
          <View>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.leftIcon}
              >
                <ArrowLeft color={"#000"} size={24} />
              </TouchableOpacity>
              <Text style={[styles.headerText]} allowFontScaling={false}>
                Customer Care Screen
              </Text>
            </View>
  
            <View className="p-4 flex-1 justify-center items-center">
              <Image
                source={require("../assets/images/phoneimg.png")}
                alt="img"
                style={styles.centerImg}
              />
  
              <Text style={styles.headText} allowFontScaling={false}>
                RahaPay Support
              </Text>
              <Text style={styles.subHead} allowFontScaling={false}>
                Message or call us if you are having trouble using any of our
                services
              </Text>
  
              <TouchableOpacity
                onPress={() => navigation.navigate("")}
                style={styles.chatButton}
              >
                <Messages2 color="#fff" />
                <Text style={styles.chatText} allowFontScaling={false}>
                  Start live Chat
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCallUs}
                style={styles.callButton}
              >
                <Call color={COLORS.violet400} />
                <Text style={styles.callText} allowFontScaling={false}>
                  Call Us
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  export default CustomerCareScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING * 2,
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
  centerImg: {
    width: 320,
    height: 300,
    marginBottom: SPACING * 6,
  },
  headText: {
    fontFamily: "Outfit-Medium",
    textAlign: "center",
    fontSize: FONT_SIZE.large,
    marginBottom: SPACING,
  },
  subHead: {
    fontFamily: "Outfit-Regular",
    textAlign: "center",
    fontSize: FONT_SIZE.small,
    color: "#9BA1A8",
    marginBottom: SPACING * 4,
  },
  chatButton: {
    backgroundColor: COLORS.violet400,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 13,
    borderRadius: 10,
    flexDirection: "row",
    marginTop: SPACING,
    width: "100%",
  },
  chatText: {
    fontFamily: "Outfit-Regular",
    color: COLORS.white,
    marginLeft: 4,
    fontSize: RFValue(14),
  },
  callButton: {
    borderWidth: 1,
    borderColor: COLORS.violet400,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 13,
    borderRadius: 10,
    flexDirection: "row",
    marginTop: SPACING,
    width: "100%",
  },
  callText: {
    fontFamily: "Outfit-Regular",
    color: COLORS.violet400,
    marginLeft: 4,
    fontSize: RFValue(14),
  },
});
