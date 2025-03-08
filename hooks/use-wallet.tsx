import { useAuth } from "@/services/AuthContext";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

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

interface Wallet {
  balance: number;
  [key: string]: any;
}

interface DashboardData {
  transacton: Transaction[]; // Note: still contains typo from original
  wallet: Wallet;
  user: {
    _id: string;
  };
}

interface Pagination {
  currentPage: number;
  totalPages: number;
}

interface AllTransactionsPage {
  data: Transaction[];
  pagination: Pagination;
}

interface GetAllTransactionsResult {
  transactions: Transaction[];
  pagination: Pagination;
  isLoading: boolean;
  currentPage: number;
  setCurrentPage: (size: number | ((size: number) => number)) => void;
}

const useWallet = () => {
  const { userInfo } = useAuth();

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

  // Remove filtering from dashboard transactions
  const dashboardTransactions = dashboardData?.transacton || [];

  const balance = dashboardData?.wallet?.balance || 0;
  const account = dashboardData?.wallet || {};

  // Remove filtering from all transactions
  const allTransactionsData = allTransactionsPages
    ? ([] as Transaction[]).concat(
        ...allTransactionsPages.map((page) => page.data || [])
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

  const formattedTransactions = dashboardTransactions.map(
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