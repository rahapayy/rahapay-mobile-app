export interface Disco {
  id: string;
  name: string;
  state: string;
}

export interface ValidateElectricityPayload {
  meterNumber: string;
  meterId: string;
  meterType: "Prepaid" | "Postpaid";
}

export interface ValidateElectricityResponse {
  name: string;
  address: string;
  meterNumber: string;
  discoId: string;
  meterType: "Prepaid" | "Postpaid";
  minAmount: number;
  maxAmount: number;
}

export interface ElectricityPurchasePayload {
  meterNumber: string;
  discoId: string;
  phoneNumber: string;
  amount: number;
  userId: string;
  saveBeneficiary: boolean;
  meterType: "Prepaid" | "Postpaid";
  transactionPin: string;
}

export interface ElectricityPurchaseResponse {
  msg: string;
  status: "success" | "failed";
  amount: string;
  data: {
    token: string | null;
    units: string | null;
    customerName: string;
    customerAddress: string;
    meterNumber: string;
    transactionReference: string;
    requestId: string;
  };
}

export interface ElectricityRequeryPayload {
  transactionReference: string;
}

export interface ElectricityRequeryResponse {
  message: string;
  status: "success" | "failed";
  data: {
    _id: string;
    transactionReference: string;
    accountReference: string;
    amountPaid: number;
    totalPayable: number;
    paidOn: string;
    paymentStatus: string;
    currency: string;
    paymentMethod: string;
    settlementAmount: number;
    transactionType: string;
    metadata: {
      balanceBefore: number;
      balanceAfter: number;
      baseAmount: number;
      finalAmount: number;
      meterNumber: string;
      meterType: string;
      discoId: string;
      customerName: string;
      customerAddress: string;
      token: string | null;
      units: string | null;
      ebillsRequestId: string;
      ebillsOrderId: number;
      ebillsStatus: string;
      customer_name: string;
      customer_address: string;
      customer_arrears: string;
      electricity: string;
      meter_type: string;
      meter_number: string;
      electricity_token: string;
      electricity_units: string;
    };
    createdAt: string;
    updatedAt: string;
  };
}