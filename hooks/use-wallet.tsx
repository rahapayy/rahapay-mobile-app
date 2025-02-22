import { useAuth } from "@/services/AuthContext";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

// Define the Transaction type based on your API response and usage
interface Transaction {
  _id: string;
  paidOn: string | number | Date;
  amountPaid: number | string;
  paymentStatus: string;
  transactionType: string;
  paymentMethod?: string;
  transactionReference?: string;
  updatedAt?: string | number | Date;
  metadata?: {
    networkType?: string;
    phoneNumber?: string;
  };
}

// Define the Wallet type
interface Wallet {
  balance: number;
  [key: string]: any; // Adjust based on actual wallet properties
}

// Define the Dashboard response type
interface DashboardData {
  transacton: Transaction[]; // Note: 'transacton' seems to be a typo in your code, should it be 'transactions'?
  wallet: Wallet;
  user: {
    _id: string;
  };
}

// Define the Pagination type
interface Pagination {
  currentPage: number;
  totalPages: number;
}

// Define the AllTransactions page type
interface AllTransactionsPage {
  data: Transaction[];
  pagination: Pagination;
}

// Define the return type of getAllTransactions
interface GetAllTransactionsResult {
  transactions: Transaction[];
  pagination: Pagination;
  isLoading: boolean;
  currentPage: number;
  setCurrentPage: (size: number | ((size: number) => number)) => void;
}

const useWallet = () => {
  const { userInfo } = useAuth();

  // Fetch data from both endpoints
  const {
    data: dashboardData,
    isValidating: isDashboardLoading,
    mutate: mutateDashboard,
  } = useSWR<DashboardData>(`user/dashboard/me`, {
    revalidateOnFocus: true,
  });

  const {
    data: reservedAccountsData,
    isValidating: isReservedAccountsLoading,
    mutate: mutateReservedAccounts,
  } = useSWR(`user/reserved-accounts`);

  const {
    data: allTransactionsPages,
    isValidating: isAllTransactionsLoading,
    mutate: mutateAllTransactions,
    size: currentPage,
    setSize: setCurrentPage,
  } = useSWRInfinite<AllTransactionsPage>(
    (pageIndex) => `transaction/all?page=${pageIndex + 1}`,
    {
      revalidateFirstPage: false,
    }
  );

  const refreshAll = () => {
    mutateDashboard();
    mutateReservedAccounts();
    mutateAllTransactions();
  };

  const isLoading = isDashboardLoading || isReservedAccountsLoading;

  // Correct the extraction of the transactions array from dashboard
  const dashboardTransactions = dashboardData?.transacton || [];

  // Filter the COMMISSION to not show amount in the transaction history
  const filteredDashboardTransactions = dashboardTransactions.filter(
    (trx: Transaction) => trx.transactionType !== "COMMISSION"
  );

  const balance = dashboardData?.wallet?.balance || 0;
  const account = dashboardData?.wallet || {};

  // Extract and properly format transactions from infinite loading
  const allTransactionsData = allTransactionsPages
    ? ([] as Transaction[]).concat(
        ...allTransactionsPages.map((page) =>
          (page.data || []).filter(
            (trx: Transaction) => trx.transactionType !== "COMMISSION"
          )
        )
      )
    : [];

  const pagination = allTransactionsPages?.[0]?.pagination || {
    currentPage: 1,
    totalPages: 1,
  };

  const getAllTransactions = (): GetAllTransactionsResult => ({
    transactions: allTransactionsData,
    pagination,
    isLoading: isAllTransactionsLoading,
    currentPage,
    setCurrentPage,
  });

  // Mapping dashboard transactions to required fields for other views
  const formattedTransactions = filteredDashboardTransactions.map(
    (trx: Transaction) => ({
      amount: trx.amountPaid || 0,
      created_at: new Date(trx.paidOn).toLocaleString(),
      id: trx._id || "",
      ownerId: dashboardData?.user?._id || "",
      purpose: trx.paymentMethod || "",
      referenceId: trx.transactionReference || "",
      status: trx.paymentStatus || "",
      tranxType: trx.transactionType || "",
      updated_at: trx.updatedAt || "",
      metadata: trx.metadata,
    })
  );

  return {
    balance,
    account,
    refreshAll,
    transactions: formattedTransactions,
    isLoading,
    getAllTransactions,
  };
};

export default useWallet;
