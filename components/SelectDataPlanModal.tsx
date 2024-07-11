import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import COLORS from "../config/colors";
import useSWR from "swr";
import Airtel from "../assets/svg/airtelbig.svg";
import Mtn from "../assets/svg/mtnbig.svg";
import Eti from "../assets/svg/9mobilebig.svg";
import Glo from "../assets/svg/globig.svg";
import SPACING from "../config/SPACING";

const { height } = Dimensions.get("window");

interface DataPlan {
  plan_id: string;
  plan_name: string;
  plan_day: string;
  amount: number;
}

interface SelectDataPlanModalProps {
  visible: boolean;
  onClose: () => void;
  route: {
    params: {
      selectedOperator?: string;
      onSelectPackage: (
        plan: string,
        days: string,
        plan_id: string,
        amount: number
      ) => void;
    };
  };
}

const SelectDataPlanModal: React.FC<SelectDataPlanModalProps> = ({
  visible,
  onClose,
  route,
}) => {
  const selectedOperator = route.params?.selectedOperator || "";
  const onSelectPackage = route.params?.onSelectPackage;

  const { data } = useSWR(`/top-up/get-plan?networkType=${selectedOperator}`);

  const dataPlans = React.useMemo(() => data || [], [data]);

  const renderDataPlan = ({ item }: { item: DataPlan }) => (
    <TouchableOpacity
      style={[
        styles.dataPlanContainer,
        selectedOperator === item.plan_name && styles.selectedDataPlan,
      ]}
      onPress={() => {
        onSelectPackage(
          item.plan_name,
          item.plan_day,
          item.plan_id,
          item.amount
        );
      }}
    >
      {selectedOperator === "Airtel" && <Airtel width={32} height={32} />}
      {selectedOperator === "Mtn" && <Mtn width={32} height={32} />}
      {selectedOperator === "9Mobile" && <Eti width={32} height={32} />}
      {selectedOperator === "Glo" && <Glo width={32} height={32} />}
      <Text style={styles.planText} allowFontScaling={false}>
        {item.plan_name}
      </Text>
      <Text style={styles.for} allowFontScaling={false}>
        -
      </Text>
      <Text style={styles.planText} allowFontScaling={false}>
        {item.plan_day}{" "}
      </Text>
      <Text style={styles.for} allowFontScaling={false}>
        -
      </Text>
      <Text style={styles.planText} allowFontScaling={false}>
        ₦ {item.amount}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <TouchableOpacity style={styles.overlay} onPress={onClose} />
        <View style={styles.modalView}>
          <Text style={styles.modalText} allowFontScaling={false}>
            Select Data Plan
          </Text>
          <FlatList
            data={dataPlans}
            renderItem={renderDataPlan}
            keyExtractor={(item, index) =>
              `${item.plan_name}_${item.plan_id || index}`
            }
          />
        </View>
      </View>
    </Modal>
  );
};

export default SelectDataPlanModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "100%",
    height: height * 0.4,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    fontFamily: "Outfit-SemiBold",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: COLORS.violet200,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 20,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  dataPlanContainer: {
    // padding: 10,
    gap: 6,
    marginBottom: SPACING,
    flexDirection: "row",
    alignItems: "center",
  },
  selectedDataPlan: {
    borderTopWidth: 4,
    borderTopColor: "#3498db",
  },
  for: {
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "Outfit-Regular",
  },
  planText: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Outfit-Regular",
  },
});
