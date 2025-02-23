import React, { useState, useMemo } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  TextInput,
  Keyboard,
} from "react-native";
import SPACING from "../../../constants/SPACING";
import COLORS from "../../../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import { CloseCircle, SearchNormal1 } from "iconsax-react-native";

interface PlanSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  plans: { planId: string; price: number; planName: string }[];
  onSelectPlan: (plan: {
    planId: string;
    price: number;
    planName: string;
  }) => void;
}

const PlanSelectionModal: React.FC<PlanSelectionModalProps> = ({
  visible,
  onClose,
  plans,
  onSelectPlan,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) =>
      plan.planName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [plans, searchQuery]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      accessible={true}
      accessibilityLabel="Plan Selection Modal"
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={dismissKeyboard}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} allowFontScaling={false}>
              Select a Plan
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              accessibilityLabel="Close Modal"
            >
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
              accessibilityLabel="Search Plans Input"
            />
          </View>
          <ScrollView
            style={styles.planScrollView}
            contentContainerStyle={styles.planScrollViewContent}
          >
            <View style={styles.planContainer}>
              {filteredPlans.length > 0 ? (
                filteredPlans.map((plan) => (
                  <TouchableOpacity
                    key={plan.planId}
                    style={styles.planBox}
                    onPress={() => {
                      onSelectPlan(plan);
                      onClose();
                    }}
                    accessibilityLabel={`Select ${plan.planName} for ₦${plan.price}`}
                  >
                    <Text style={styles.planName} allowFontScaling={false}>
                      {plan.planName}
                    </Text>
                    <Text style={styles.planPrice} allowFontScaling={false}>
                      ₦{plan.price}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noPlansText} allowFontScaling={false}>
                  No plans match your search.
                </Text>
              )}
            </View>
          </ScrollView>
        </View>
      </TouchableOpacity>
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
    width: (width - SPACING * 5) / 3, // Three columns
    aspectRatio: 0.7,
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
  noPlansText: {
    fontSize: RFValue(12),
    fontFamily: "Outfit-Regular",
    color: COLORS.black400,
    textAlign: "center",
    padding: SPACING * 2,
  },
});
