import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
} from "react-native";
import SPACING from "../../../constants/SPACING";
import COLORS from "../../../constants/colors";
import { RFValue } from "react-native-responsive-fontsize";
import { CloseCircle } from "iconsax-react-native";
import Dstv from "../../../assets/svg/dstv.svg";
import Gotv from "../../../assets/svg/gotv.svg";
import Startimes from "../../../assets/svg/startimes.svg";

interface ServiceSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectService: (service: string, icon: JSX.Element) => void;
}

const ServiceSelectionModal: React.FC<ServiceSelectionModalProps> = ({
  visible,
  onClose,
  onSelectService,
}) => {
  const services = [
    { name: "Dstv", icon: <Dstv width={32} height={32} /> },
    { name: "Gotv", icon: <Gotv width={32} height={32} /> },
    { name: "Startime", icon: <Startimes width={32} height={32} /> },
  ];

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
              Select a Service
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
                  key={service.name}
                  style={styles.serviceBox}
                  onPress={() => {
                    onSelectService(service.name, service.icon); // Pass icon along with name
                    onClose();
                  }}
                >
                  {service.icon}
                  <Text style={styles.serviceName} allowFontScaling={false}>
                    {service.name}
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
    height: height * 0.4,
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
  },
  serviceName: {
    fontSize: RFValue(14),
    fontFamily: "Outfit-Regular",
    color: COLORS.black400,
    marginLeft: SPACING,
  },
});
