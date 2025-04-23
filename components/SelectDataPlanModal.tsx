import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { DataPlan } from "@/services/modules/data";
import COLORS from "@/constants/colors";

// Constants
const SPACING = 16;
const { height } = Dimensions.get("window");

// Define props interface with strict typing
interface SelectDataPlanModalProps {
  visible: boolean;
  onClose: () => void;
  dataPlans: DataPlan[];
  onSelectPackage: (plan: DataPlan) => void;
  isLoading: boolean;
  error: string | null;
}

// Define validity category type
type ValidityCategory = "Daily" | "Weekly" | "Monthly";

const SelectDataPlanModal: React.FC<SelectDataPlanModalProps> = ({
  visible,
  onClose,
  dataPlans,
  onSelectPackage,
  isLoading,
  error,
}) => {
  // Default to "Daily" category
  const [selectedCategory, setSelectedCategory] = useState<ValidityCategory>("Daily");

  // Function to determine the validity category (Daily, Weekly, Monthly)
  const getValidityCategory = (validity: string): ValidityCategory => {
    const validityLower = validity?.toLowerCase().trim() || "";

    // Daily: Plans valid for 1-2 days or less (including hours)
    if (
      validityLower.includes("hour") ||
      validityLower.includes("hrs") ||
      validityLower === "1 day" ||
      validityLower === "2 day" ||
      validityLower === "2 days" ||
      validityLower === "1day"
    ) {
      return "Daily";
    }

    // Weekly: Plans valid for 3-14 days
    if (
      validityLower.includes("7 days") ||
      validityLower.includes("7days") ||
      validityLower.includes("2 days") ||
      validityLower.includes("14 days") ||
      validityLower === "7 day"
    ) {
      return "Weekly";
    }

    // Monthly: Plans valid for 30 days, 1 month, or longer
    if (
      validityLower.includes("30 days") ||
      validityLower.includes("30days") ||
      validityLower.includes("1 month") ||
      validityLower.includes("365 days")
    ) {
      return "Monthly";
    }

    // Default to Monthly for anything longer or unrecognized
    return "Monthly";
  };

  // Filter data plans based on the selected category (Daily, Weekly, Monthly)
  const filteredDataPlans = dataPlans.filter(
    (plan) => getValidityCategory(plan.validity) === selectedCategory
  );

  // Render each data plan item with a concise format
  const renderDataPlan = ({ item }: { item: DataPlan }) => (
    <TouchableOpacity
      style={styles.dataPlanContainer}
      onPress={() => onSelectPackage(item)}
      accessibilityLabel={`Select ${item.plan_name} plan for ${item.validity} at ₦${item.amount}`}
    >
      <Text style={styles.planText} allowFontScaling={false}>
        {item.plan_name || "Unknown Plan"}
      </Text>
      <Text style={styles.separator} allowFontScaling={false}>
        |
      </Text>
      <Text style={styles.planText} allowFontScaling={false}>
        {item.validity || "N/A"}
      </Text>
      <Text style={styles.separator} allowFontScaling={false}>
        |
      </Text>
      <Text style={styles.planText} allowFontScaling={false}>
        ₦{item.amount || "0"}
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
        <TouchableOpacity
          style={styles.overlay}
          onPress={onClose}
          accessibilityLabel="Close modal"
        />
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.modalText} allowFontScaling={false}>
              Select Data Plan
            </Text>
            <TouchableOpacity onPress={onClose} accessibilityLabel="Close">
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>

          {/* Category Buttons */}
          <View style={styles.categoryContainer}>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === "Daily" && styles.selectedCategoryButton,
              ]}
              onPress={() => setSelectedCategory("Daily")}
              accessibilityLabel="Show daily plans"
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === "Daily" && styles.selectedCategoryButtonText,
                ]}
                allowFontScaling={false}
              >
                Daily
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === "Weekly" && styles.selectedCategoryButton,
              ]}
              onPress={() => setSelectedCategory("Weekly")}
              accessibilityLabel="Show weekly plans"
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === "Weekly" && styles.selectedCategoryButtonText,
                ]}
                allowFontScaling={false}
              >
                Weekly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === "Monthly" && styles.selectedCategoryButton,
              ]}
              onPress={() => setSelectedCategory("Monthly")}
              accessibilityLabel="Show monthly plans"
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === "Monthly" && styles.selectedCategoryButtonText,
                ]}
                allowFontScaling={false}
              >
                Monthly
              </Text>
            </TouchableOpacity>
          </View>

          {isLoading && (
            <ActivityIndicator size="large" color={COLORS.violet200} />
          )}

          {error && (
            <Text style={styles.errorText} allowFontScaling={false}>
              {error}
            </Text>
          )}

          {!isLoading && !error && filteredDataPlans.length > 0 && (
            <FlatList
              data={filteredDataPlans}
              renderItem={renderDataPlan}
              keyExtractor={(item) => item.plan_id || Math.random().toString()} // Fallback for keyExtractor
              showsVerticalScrollIndicator={false}
            />
          )}

          {!isLoading && !error && filteredDataPlans.length === 0 && (
            <Text style={styles.noPlansText} allowFontScaling={false}>
              No plans available for this category
            </Text>
          )}
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
    height: height * 0.7, // Increased height to 60% of screen
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Outfit-SemiBold",
  },
  closeButtonText: {
    color: COLORS.violet200,
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 15,
  },
  noPlansText: {
    textAlign: "center",
    color: "gray",
  },
  dataPlanContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // Adjusted gap for better spacing between elements
    marginBottom: SPACING,
    paddingVertical: 10,
  },
  planText: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Outfit-Regular",
    color: COLORS.grey900, // Darker text for readability (assumes grey900 exists)
  },
  separator: {
    fontSize: 14,
    color: COLORS.grey500, // Lighter color for the separator
    fontFamily: "Outfit-Regular",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 15,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.violet100,
  },
  selectedCategoryButton: {
    backgroundColor: COLORS.violet300,
  },
  categoryButtonText: {
    fontSize: 14,
    color: COLORS.grey500,
    fontFamily: "Outfit-Regular",
  },
  selectedCategoryButtonText: {
    color: "white",
  },
});