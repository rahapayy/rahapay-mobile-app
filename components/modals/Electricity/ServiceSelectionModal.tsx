import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import SPACING from "../../../constants/SPACING";
import COLORS from "../../../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import { CloseCircle, TickCircle } from "iconsax-react-native";
import { MediumText, RegularText } from "@/components/common/Text";

interface ServiceSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectService: (service: string, id: string) => void;
  services: Array<{ name: string; id: string }>;
}

const ServiceSelectionModal: React.FC<ServiceSelectionModalProps> = ({
  visible,
  onClose,
  onSelectService,
  services,
}) => {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const getDiscoIcon = (discoId: string) => {
    switch (discoId) {
      case "abuja-electric":
        return require("@/assets/images/electricity/abuja.jpeg");
      case "aba-electric":
        return require("@/assets/images/electricity/aba.png");
      case "benin-electric":
        return require("@/assets/images/electricity/benin.jpeg");
      case "eko-electric":
        return require("@/assets/images/electricity/eko.png");
      case "enugu-electric":
        return require("@/assets/images/electricity/enugu.png");
      case "ibadan-electric":
        return require("@/assets/images/electricity/ibadan.jpeg");
      case "ikeja-electric":
        return require("@/assets/images/electricity/ikeja.png");
      case "jos-electric":
        return require("@/assets/images/electricity/jos.jpeg");
      case "kaduna-electric":
        return require("@/assets/images/electricity/kaduna.png");
      case "kano-electric":
        return require("@/assets/images/electricity/kano.jpeg");
      case "yola-electric":
        return require("@/assets/images/electricity/yola.png");
      case "portharcourt-electric":
        return null; // No logo provided for PHED
      default:
        return null; // Fallback for any unexpected discoId
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      onDismiss={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <MediumText size="medium" color="black">
              Select an Electricity Provider
            </MediumText>
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
                  key={service.id}
                  style={styles.serviceBox}
                  onPress={() => {
                    setSelectedService(service.name);
                    onSelectService(service.name, service.id);
                    onClose();
                  }}
                >
                  <View style={styles.serviceContent}>
                    {getDiscoIcon(service.id) ? (
                      <Image
                        source={getDiscoIcon(service.id)}
                        style={styles.discoIcon}
                        resizeMode="contain"
                      />
                    ) : (
                      <View style={styles.placeholderIcon} />
                    )}
                    <RegularText color="black">{service.name}</RegularText>
                  </View>
                  {selectedService === service.name && (
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
  serviceContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  discoIcon: {
    width: 35,
    height: 35,
    marginRight: SPACING,
  },
  placeholderIcon: {
    width: 35,
    height: 35,
    marginRight: SPACING,
    backgroundColor: COLORS.grey200,
    borderRadius: 5,
  },
  serviceName: {
    fontSize: RFValue(13),
    fontFamily: "Outfit-Regular",
    color: COLORS.black400,
  },
});
