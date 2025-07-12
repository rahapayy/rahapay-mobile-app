import React from "react";
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
import { RFValue } from "react-native-responsive-fontsize";
import Button from "./common/ui/buttons/Button";

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
  onRetry?: () => void | Promise<void>; // Add onRetry prop
}

const SelectDataPlanModal: React.FC<SelectDataPlanModalProps> = ({
  visible,
  onClose,
  dataPlans,
  onSelectPackage,
  isLoading,
  error,
  onRetry,
}) => {
  // Get unique plan types
  const planTypes = React.useMemo(() => {
    const types = Array.from(
      new Set(dataPlans.map((plan) => plan.plan_type || "Other"))
    );
    return types;
  }, [dataPlans]);

  // State for selected plan type, default to first available
  const [selectedPlanType, setSelectedPlanType] = React.useState<string>(
    planTypes[0] || ""
  );

  // State for refresh loading
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Update selectedPlanType if planTypes change
  React.useEffect(() => {
    if (planTypes.length > 0 && !planTypes.includes(selectedPlanType)) {
      setSelectedPlanType(planTypes[0]);
    }
  }, [planTypes, selectedPlanType]);

  // Filter plans by selected plan type
  const filteredPlans = dataPlans.filter(
    (plan) => (plan.plan_type || "Other") === selectedPlanType
  );

  // Handle refresh with loading state
  const handleRefresh = () => {
    if (onRetry) {
      setIsRefreshing(true);
      try {
        // Handle both sync and async functions
        const result = onRetry();
        if (result && typeof result.then === "function") {
          // It's a Promise
          result.finally(() => {
            setIsRefreshing(false);
          });
        } else {
          // It's a synchronous function
          setTimeout(() => setIsRefreshing(false), 100);
        }
      } catch (error) {
        console.error("Refresh error:", error);
        setIsRefreshing(false);
      }
    }
  };

  const renderDataPlan = ({ item }: { item: DataPlan }) => (
    <TouchableOpacity
      style={styles.dataPlanContainer}
      onPress={() => onSelectPackage(item)}
      accessibilityLabel={`Select ${item.plan_name} plan for ${item.validity} at ₦${item.amount}`}
    >
      <Text style={styles.planText}>{item.plan_name || "Unknown Plan"}</Text>
      <Text style={styles.separator}>|</Text>
      <Text style={styles.planText}>{item.validity || "N/A"}</Text>
      <Text style={styles.separator}>|</Text>
      <Text style={styles.planText}>₦{item.amount || "0"}</Text>
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
            <Text style={styles.modalText}>Select Data Plan</Text>
            <TouchableOpacity onPress={onClose} accessibilityLabel="Close">
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>

          {/* Plan Type Buttons */}
          <View style={styles.categoryContainer}>
            {planTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.categoryButton,
                  selectedPlanType === type && styles.selectedCategoryButton,
                ]}
                onPress={() => setSelectedPlanType(type)}
                accessibilityLabel={`Show ${type} plans`}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedPlanType === type &&
                      styles.selectedCategoryButtonText,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {isLoading && (
            <ActivityIndicator size="large" color={COLORS.violet200} />
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <Button
                title={isRefreshing ? "Refreshing..." : "Refresh"}
                onPress={handleRefresh}
                accessibilityLabel="Retry fetching data plans"
                style={{ width: "30%" }}
                disabled={isRefreshing}
              />
            </View>
          )}

          {!isLoading && !error && dataPlans.length === 0 && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>No data plans available</Text>
              <Button
                title={isRefreshing ? "Refreshing..." : "Refresh"}
                onPress={handleRefresh}
                accessibilityLabel="Retry fetching data plans"
                style={{ width: "30%" }}
                disabled={isRefreshing}
              />
            </View>
          )}

          {!isLoading && !error && filteredPlans.length > 0 && (
            <FlatList
              data={filteredPlans}
              renderItem={renderDataPlan}
              keyExtractor={(item) => item.plan_id || Math.random().toString()}
              showsVerticalScrollIndicator={false}
            />
          )}

          {!isLoading && !error && filteredPlans.length === 0 && (
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
    height: height * 0.5, // Increased height to 60% of screen
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
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 15,
    fontSize: 16,
    fontFamily: "Outfit-Regular",
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
    fontSize: RFValue(14),
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
  retryButton: {
    marginTop: 15,
    alignSelf: "center",
    backgroundColor: COLORS.violet200,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Outfit-SemiBold",
  },
});
