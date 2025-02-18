export interface TransactionMetadata {
    networkType?: string;
    phoneNumber?: string;
    sender?: string;
    recipient?: string;
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