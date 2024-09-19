import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  View,
  ScrollView,
  SafeAreaView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Button from "../../../components/Button";

const BettingSuccess: React.FC<{
  navigation: NativeStackNavigationProp<any, "">;
}> = ({ navigation }) => {
  const values = [
    {
      title: "Transaction ID",
      value: "1234567890",
    },
    {
      title: "Amount",
      value: "1,000",
    },
    {
      title: "Service",
      value: "SportyBet Funding",
    },
    {
      title: "Receipient",
      value: "+23480123456789",
    },
    {
      title: "Date",
      value: "Mar 06, 2024, 02:12 PM",
    },
  ];
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView className="flex-1 px-4">
        <View>
          <View className="flex flex-col gap-y-2 mt-5">
            <View>
              <Image
                className="w-14 h-14 mx-auto"
                source={require("../../../assets/images/success.png")}
              />
            </View>
            <Text
              allowFontScaling={false}
              className="text-center text-[18px]"
              style={styles.regular}
            >
              Transaction Successful
            </Text>
            <Text
              style={styles.regular}
              className="text-center text-base text-grey-200"
            >
              Order has been Processed Successfully{" "}
            </Text>
          </View>
          <View className="bg-white rounded-lg py-5 px-6 mt-4">
            <View className="flex-col gap-y-5">
              <View>
                <View className="mb-2">
                  <Image
                    source={require("../../../assets/images/sporty.png")}
                    className="w-[64px] h-[64px] mx-auto"
                  />
                  <Text
                    style={styles.medium}
                    allowFontScaling={false}
                    className="text-center text-base mt-[6px]"
                  >
                    Sportybet
                  </Text>
                </View>
                <View>
                  <Text
                    style={styles.bold}
                    allowFontScaling={false}
                    className="text-2xl text-center"
                  >
                    ₦1,000
                  </Text>
                </View>
              </View>
              <View className="flex flex-col gap-y-4 border-t border-[#DCDEE0]/30">
                {values.map((value, index) => (
                  <View
                    key={index + 20}
                    className="flex flex-row justify-between items-center"
                  >
                    <Text
                      style={styles.medium}
                      allowFontScaling={false}
                      className="text-sm"
                    >
                      {value.title}
                    </Text>
                    <Text
                      style={styles.medium}
                      allowFontScaling={false}
                      className="text-[#9BA1A8] text-sm"
                    >
                      {value.value}
                    </Text>
                  </View>
                ))}
              </View>
              <View className="w-full">
                <TouchableOpacity className="border border-dashed border-black rounded-lg py-4 w-full flex-row justify-center items-center">
                  <View className="mr-2">
                    <Image
                      source={require("../../../assets/images/share.png")}
                      className="w-6 h-6"
                    />
                  </View>
                  <Text
                    style={styles.regular}
                    allowFontScaling={false}
                    className="text-sm"
                  >
                    Share Reciept
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View className="flex-col gap-y-[14px] w-full mt-[26px]">
            <Button
              title="Done"
              textColor="white"
              onPress={() => navigation.navigate("Services")}
            />
            <Button
              title="Pay Another Bill"
              textColor="#BAA0FF"
              className="bg-[#E9E2FB]"
              onPress={() => navigation.navigate("Services")}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BettingSuccess;

const styles = StyleSheet.create({
  regular: {
    fontFamily: "Outfit-Regular",
  },
  medium: {
    fontFamily: "Outfit-Medium",
  },
  bold: {
    fontFamily: "Outfit-Bold",
  },
});
