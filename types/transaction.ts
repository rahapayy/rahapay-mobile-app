export interface TransactionMetadata {
  networkType?: string;
  phoneNumber?: string;
  sender?: string;
  recipient?: string;
  cableName?: string;
  smartCardNo?: string;
  planName?: string;
  discoId?: string;
  discoName?: string;
  electricity?: string;
  meterNumber?: string;
  meterType?: "Prepaid" | "Postpaid";
  customerName?: string;
  customerAddress?: string;
  electricity_token?: string;
  electricity_units?: string;
}

export interface Transaction {
  purpose: string;
  amount: number;
  created_at: number;
  status: string;
  tranxType: string;
  referenceId: string;
  metadata?: TransactionMetadata;
}