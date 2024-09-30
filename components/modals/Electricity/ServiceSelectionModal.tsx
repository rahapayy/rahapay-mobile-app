import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import SPACING from "../../../constants/SPACING";
import COLORS from "../../../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import { CloseCircle, TickCircle } from "iconsax-react-native";
import useSWR from "swr";

interface ServiceSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectService: (service: string, planId: string) => void;
}

const ServiceSelectionModal: React.FC<ServiceSelectionModalProps> = ({
  visible,
  onClose,
  onSelectService,
}) => {
  const { data, error, isLoading } = useSWR(`/electricity`);
  const [services, setServices] = useState<Array<{ disco_name: string; plan_id: string }>>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      const availableServices = Array.isArray(data.plan)
        ? data.plan.map((item: { disco_name: string; plan_id: string }) => ({
            disco_name: item.disco_name,
            plan_id: item.plan_id,
          }))
        : [];
      setServices(availableServices);
      console.log("Available services:", availableServices);
    }
  }, [data]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={COLORS.violet300} size={"large"} />
      </View>
    );
  }

  if (error) {
    console.error("Error fetching electricity services:", error);
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error loading services.</Text>
      </View>
    );
  }

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
              Select an Electricity Provider
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <CloseCircle color={COLORS.violet400} size={24} />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.serviceScrollView}
            contentContainerStyle={styles.serviceScrollViewContent}
          >
            <View style={styles.serviceContainer}>
              {services.map((service) => (
                <TouchableOpacity
                  key={service.plan_id}
                  style={styles.serviceBox}
                  onPress={() => {
                    setSelectedService(service.disco_name);
                    onSelectService(service.disco_name, service.plan_id); // Ensure planId is passed here
                    console.log("Selected plan:", service);
                    onClose();
                  }}
                >
                  <Text style={styles.serviceName} allowFontScaling={false}>
                    {service.disco_name}
                  </Text>
                  {selectedService === service.disco_name && (
                    <TickCircle
                      color={COLORS.violet400}
                      variant="Bold"
                      size={24}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ServiceSelectionModal;

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
    height: height * 0.6,
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
  serviceScrollView: {
    flex: 1,
  },
  serviceScrollViewContent: {
    flexGrow: 1,
  },
  serviceContainer: {
    padding: SPACING,
    flexDirection: "column",
  },
  serviceBox: {
    padding: SPACING,
    borderRadius: 10,
    marginBottom: SPACING,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  serviceName: {
    fontSize: RFValue(13),
    fontFamily: "Outfit-Regular",
    color: COLORS.black400,
  },
});
