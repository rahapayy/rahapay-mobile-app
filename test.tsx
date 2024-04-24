import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  ImageBackground,
  FlatList,
} from "react-native";
import SPACING from "../config/SPACING";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LineChart } from "react-native-chart-kit";
import { RFValue } from "react-native-responsive-fontsize";

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

const DashboardScreen: React.FC<{
  navigation: NativeStackNavigationProp<any>;
}> = ({ navigation }) => {
  const chartWidth = windowWidth - SPACING * 2;

  const boxData = [
    { title: "TOTAL", value: "1234", link: "View All" },
    { title: "CATTLE", value: "13", link: "View All" },
    { title: "SHEEP", value: "21", link: "View All" },
  ];
  return (
    <ImageBackground
      source={require("../assets/images/bg.png")}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.contain}>
          <View style={styles.container}>
            <Text style={styles.headText}>Hello Bash</Text>
            <Text style={styles.subHeadText}>How's your day so far?</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: SPACING,
            }}
          >
            <Text style={styles.livestock}>Livestock</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={boxData}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.box}>
                <Text style={styles.titleText}>{item.title}</Text>
                <Text style={styles.valueText}>{item.value}</Text>
                <TouchableOpacity>
                  <Text style={styles.linkText}>{item.link}</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <View style={{ paddingVertical: SPACING * 3 }}>
            <Text
              style={{
                color: "#203729",
                fontWeight: "bold",
                fontSize: 20,
              }}
            >
              Reports
            </Text>
          </View>
          <View style={styles.chartContainer}>
            <View
              style={{
                marginTop: SPACING * 2,
                alignSelf: "flex-start",
              }}
            >
              <Text
                style={{
                  color: "#6C8164",
                  fontWeight: "bold",
                  fontSize: 18,
                  marginBottom: SPACING,
                }}
              >
                Mortality Rate
              </Text>
              <View
                style={{
                  backgroundColor: "#6C8164",
                  borderWidth: 2,
                  marginBottom: SPACING,
                }}
              />
            </View>
            <LineChart
              data={{
                labels: [
                  "Week 1",
                  "Week 2",
                  "Week 3",
                  "Week 4",
                  "Week 5",
                  "Week 6",
                ],
                datasets: [
                  {
                    data: [
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                    ],
                  },
                ],
              }}
              width={chartWidth}
              height={250}
              yAxisLabel=""
              yAxisSuffix=""
              yAxisInterval={10}
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(32, 55, 41, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(32, 55, 41, ${opacity})`,
                style: {},
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                },
              }}
              bezier
              style={{
                borderRadius: 5,
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING * 4,
  },
  contain: {
    paddingHorizontal: SPACING,
  },
  headText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: SPACING,
  },
  subHeadText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  backgroundImage: {
    height: 250,
  },
  boxContainer: {
    flexDirection: "row",
  },
  box: {
    backgroundColor: "#fff",
    height: 150,
    width: 150,
    borderRadius: 10,
    marginRight: 16,
    padding: SPACING * 2,
  },
  livestock: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  viewAll: {
    color: "#fff",
  },
  chartContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: SPACING * 2,
  },
  titleText: {
    fontWeight: "500",
    color: "#AFB7C7",
    marginBottom: SPACING * 2,
  },
  valueText: {
    textAlign: "center",
    fontSize: RFValue(32),
    fontWeight: "bold",
    color: "#646B78",
    marginBottom: SPACING * 2.5,
  },
  linkText: {
    color: "#6C8164",
    textDecorationLine: "underline",
  },
});

export default DashboardScreen;
