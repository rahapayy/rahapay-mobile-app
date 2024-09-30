import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  TextInput,
} from "react-native";
import SPACING from "../../../constants/SPACING";
import COLORS from "../../../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import { CloseCircle, SearchNormal1 } from "iconsax-react-native";

interface PlanSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  plans: { plan_id: string; plan_price: number; plan_name: string }[];
  onSelectPlan: (plan: {
    plan_id: string;
    plan_price: number;
    plan_name: string;
  }) => void;
}

const PlanSelectionModal: React.FC<PlanSelectionModalProps> = ({
  visible,
  onClose,
  plans,
  onSelectPlan,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlans = plans.filter((plan) =>
    plan.plan_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} allowFontScaling={false}>
              Select a Plan
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <CloseCircle color={COLORS.violet400} size={24} />
            </TouchableOpacity>
          </View>
          <View style={styles.searchContainer}>
            <SearchNormal1
              color={COLORS.violet400}
              size={20}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search plans..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              allowFontScaling={false}
            />
          </View>
          <ScrollView
            style={styles.planScrollView}
            contentContainerStyle={styles.planScrollViewContent}
          >
            <View style={styles.planContainer}>
              {filteredPlans.map((plan) => (
                <TouchableOpacity
                  key={plan.plan_id}
                  style={styles.planBox}
                  onPress={() => {
                    onSelectPlan(plan);
                    onClose();
                  }}
                >
                  <Text style={styles.planName} allowFontScaling={false}>
                    {plan.plan_name}
                  </Text>
                  <Text style={styles.planPrice} allowFontScaling={false}>
                    ₦{plan.plan_price}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default PlanSelectionModal;

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING * 2,
  },
  modalTitle: {
    fontSize: RFValue(16),
    fontFamily: "Outfit-Medium",
    color: COLORS.black400,
  },
  closeButton: {
    padding: SPACING,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginHorizontal: SPACING * 2,
    marginBottom: SPACING * 2,
    paddingHorizontal: SPACING,
  },
  searchIcon: {
    marginRight: SPACING,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontFamily: "Outfit-Regular",
    fontSize: RFValue(14),
    color: COLORS.black400,
  },
  planScrollView: {
    flex: 1,
  },
  planScrollViewContent: {
    flexGrow: 1,
  },
  planContainer: {
    padding: SPACING * 1.5,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  planBox: {
    backgroundColor: COLORS.violet50,
    padding: SPACING,
    borderRadius: 10,
    marginBottom: SPACING,
    width: (width - SPACING * 5) / 3, // Subtracting total horizontal padding and dividing by 3 for three columns
    aspectRatio: 0.7, // Slightly increased height while maintaining width
    justifyContent: "center",
    alignItems: "center",
  },
  planName: {
    fontSize: RFValue(10),
    fontFamily: "Outfit-Regular",
    color: COLORS.black400,
    textAlign: "center",
    marginBottom: SPACING,
  },
  planPrice: {
    fontSize: RFValue(12),
    color: COLORS.violet400,
    fontFamily: "Outfit-SemiBold",
    textAlign: "center",
  },
});
