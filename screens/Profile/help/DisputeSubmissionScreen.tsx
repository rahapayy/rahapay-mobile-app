import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft } from "iconsax-react-native";
import { RFValue } from "react-native-responsive-fontsize";
import COLORS from "@/constants/colors";
import SPACING from "@/constants/SPACING";
import { AppStackParamList } from "@/types/RootStackParams";

type DisputeSubmissionScreenNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  "DisputeSubmission"
>;

const DisputeSubmissionScreen: React.FC<{
  navigation: DisputeSubmissionScreenNavigationProp;
  route: { params: { businessType: string; questionType: string } };
}> = ({ navigation, route }) => {
  const { businessType, questionType } = route.params;
  const [transactionNumber, setTransactionNumber] = useState("");
  const [description, setDescription] = useState("");
  const [transactionPin, setTransactionPin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);

  const handleSubmit = async () => {
    if (!transactionNumber || !description) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    // Show PIN modal
    setShowPinModal(true);
  };

  const handlePinSubmit = async () => {
    if (!transactionPin) {
      Alert.alert("Error", "Please enter your transaction PIN.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Validate transaction PIN
      await services.authServiceToken.validateTransactionPin(transactionPin);

      // Submit dispute if PIN is valid
      const payload = {
        businessType,
        questionType,
        transactionNumber,
        description,
        // Photo upload would be added here if implemented
      };

      const response = await services.disputeService.submitDispute(payload);
      Alert.alert("Success", "Dispute submitted successfully!");
      navigation.navigate("TransferDispute");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to submit dispute.";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsSubmitting(false);
      setShowPinModal(false);
      setTransactionPin("");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.leftIcon}
          >
            <ArrowLeft color="#000" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerText} allowFontScaling={false}>
            {questionType}
          </Text>
        </View>
        <View style={styles.progress}>
          <View style={styles.step}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>✔</Text>
            </View>
          </View>
          <View style={styles.line} />
          <View style={styles.step}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>✔</Text>
            </View>
          </View>
          <View style={styles.line} />
          <View style={styles.step}>
            <View style={styles.stepCircleActive}>
              <Text style={styles.stepNumberActive}>3</Text>
            </View>
          </View>
        </View>
        <View style={styles.form}>
          <Text style={styles.label} allowFontScaling={false}>
            Transaction Number
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter number"
            value={transactionNumber}
            onChangeText={setTransactionNumber}
          />
          <Text style={styles.label} allowFontScaling={false}>
            Upload Photo
          </Text>
          <View style={styles.uploadArea}>
            <Text style={styles.uploadText} allowFontScaling={false}>
              Not more than one
            </Text>
          </View>
          <Text style={styles.label} allowFontScaling={false}>
            Description
          </Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Please enter your description"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText} allowFontScaling={false}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* PIN Modal */}
      {showPinModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle} allowFontScaling={false}>
              Enter Transaction PIN
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter your 4-digit PIN"
              value={transactionPin}
              onChangeText={setTransactionPin}
              keyboardType="numeric"
              secureTextEntry
              maxLength={4}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowPinModal(false)}
              >
                <Text style={styles.modalButtonText} allowFontScaling={false}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSubmitButton]}
                onPress={handlePinSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text
                    style={styles.modalSubmitButtonText}
                    allowFontScaling={false}
                  >
                    Submit
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING * 2,
    paddingVertical: SPACING * 2,
  },
  leftIcon: {
    marginRight: SPACING,
  },
  headerText: {
    color: "#000",
    fontSize: RFValue(18),
    fontFamily: "Outfit-Regular",
    flex: 1,
  },
  progress: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: SPACING * 2,
    marginVertical: SPACING,
  },
  step: {
    alignItems: "center",
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.grey400,
    alignItems: "center",
    justifyContent: "center",
  },
  stepCircleActive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.violet400,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumber: {
    color: COLORS.grey400,
    fontSize: RFValue(12),
    fontFamily: "Outfit-Medium",
  },
  stepNumberActive: {
    color: COLORS.white,
    fontSize: RFValue(12),
    fontFamily: "Outfit-Medium",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.grey400,
    marginHorizontal: SPACING / 2,
  },
  form: {
    marginHorizontal: SPACING * 2,
    marginTop: SPACING,
  },
  label: {
    fontSize: RFValue(14),
    fontFamily: "Outfit-Medium",
    marginBottom: SPACING / 2,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.grey100,
    borderRadius: 8,
    padding: SPACING,
    fontSize: RFValue(14),
    fontFamily: "Outfit-Regular",
    marginBottom: SPACING,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
  },
  uploadArea: {
    borderWidth: 1,
    borderStyle: "dotted",
    borderColor: COLORS.grey400,
    borderRadius: 8,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING,
  },
  uploadText: {
    fontSize: RFValue(12),
    fontFamily: "Outfit-Regular",
    color: COLORS.grey400,
  },
  submitButton: {
    backgroundColor: COLORS.violet400,
    padding: SPACING * 1.5,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.grey200,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: RFValue(16),
    fontFamily: "Outfit-Medium",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: COLORS.white,
    padding: SPACING * 2,
    borderRadius: 12,
    width: "80%",
  },
  modalTitle: {
    fontSize: RFValue(16),
    fontFamily: "Outfit-Medium",
    marginBottom: SPACING,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.grey100,
    borderRadius: 8,
    padding: SPACING,
    fontSize: RFValue(14),
    fontFamily: "Outfit-Regular",
    marginBottom: SPACING,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: SPACING,
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.grey100,
    marginHorizontal: SPACING / 2,
  },
  modalButtonText: {
    fontSize: RFValue(14),
    fontFamily: "Outfit-Medium",
    color: COLORS.black400,
  },
  modalSubmitButton: {
    backgroundColor: COLORS.violet400,
    borderColor: COLORS.violet400,
  },
  modalSubmitButtonText: {
    color: COLORS.white,
  },
});

export default DisputeSubmissionScreen;
