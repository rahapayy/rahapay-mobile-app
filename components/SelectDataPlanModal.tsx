import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import LoadingIndicator from "./LoadingIndicator";
import { DataPlan } from "@/services/modules/data";
import COLORS from "@/constants/colors";

const SPACING = 16;

const { height } = Dimensions.get("window");

interface SelectDataPlanModalProps {
  visible: boolean;
  onClose: () => void;
  dataPlans: DataPlan[];
  onSelectPackage: (plan: DataPlan) => void;
  isLoading: boolean;
  error: string | null;
}

const SelectDataPlanModal: React.FC<SelectDataPlanModalProps> = ({
  visible,
  onClose,
  dataPlans,
  onSelectPackage,
  isLoading,
  error,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique plan types for categories
  const categories = Array.from(
    new Set(dataPlans.map((plan) => plan.plan_type))
  );

  // Filter data plans based on the selected category
  const filteredDataPlans = selectedCategory
    ? dataPlans.filter((plan) => plan.plan_type === selectedCategory)
    : dataPlans;

  const renderDataPlan = ({ item }: { item: DataPlan }) => (
    <TouchableOpacity
      style={styles.dataPlanContainer}
      onPress={() => onSelectPackage(item)}
    >
      <Text style={styles.planText} allowFontScaling={false}>
        {item.plan_name}
      </Text>
      <Text style={styles.for} allowFontScaling={false}>
        -
      </Text>
      <Text style={styles.planText} allowFontScaling={false}>
        {item.validity}
      </Text>
      <Text style={styles.for} allowFontScaling={false}>
        -
      </Text>
      <Text style={styles.planText} allowFontScaling={false}>
        ₦{item.amount}
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
          <View style={styles.header}>
            <Text style={styles.modalText} allowFontScaling={false}>
              Select Data Plan
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>

          {/* Category Buttons */}
          <View style={styles.categoryContainer}>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                !selectedCategory && styles.selectedCategoryButton,
              ]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  !selectedCategory && styles.selectedCategoryButtonText,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category &&
                    styles.selectedCategoryButton,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category &&
                      styles.selectedCategoryButtonText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {isLoading && <LoadingIndicator />}

          {error && <Text style={styles.errorText}>{error}</Text>}

          {!isLoading && !error && filteredDataPlans.length > 0 && (
            <FlatList
              data={filteredDataPlans}
              renderItem={renderDataPlan}
              keyExtractor={(item) => item.plan_id}
              showsVerticalScrollIndicator={false}
            />
          )}

          {!isLoading && !error && filteredDataPlans.length === 0 && (
            <Text style={styles.noPlansText}>
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
    height: height * 0.5, // Increased height to accommodate categories
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
    gap: 6,
    marginBottom: SPACING,
    paddingVertical: 10,
  },
  planText: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Outfit-Regular",
  },
  for: {
    fontSize: 10,
    fontWeight: "bold",
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
