import { useAuth } from "@/services/AuthContext";
import { useEffect } from "react";
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
  transactions: Transaction[];
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

  // Use userInfo._id to track user changes
  const userId = userInfo?._id || "anonymous";
  // console.log("User ID:", userId);

  // Adjust API endpoints (remove userId from URL, rely on token-based auth)
  const {
    data: dashboardData,
    isValidating: isDashboardLoading,
    mutate: mutateDashboard,
    error: dashboardError,
  } = useSWR<DashboardData>("user/dashboard/me", {
    revalidateOnFocus: true,
  });

  const {
    data: reservedAccountsData,
    isValidating: isReservedAccountsLoading,
    mutate: mutateReservedAccounts,
    error: reservedAccountsError,
  } = useSWR("user/reserved-accounts");

  const {
    data: allTransactionsPages,
    isValidating: isAllTransactionsLoading,
    mutate: mutateAllTransactions,
    size: currentPage,
    setSize: setCurrentPage,
    error: transactionsError,
  } = useSWRInfinite<AllTransactionsPage>(
    (pageIndex) => `transaction/all?page=${pageIndex + 1}`,
    {
      revalidateFirstPage: false,
    }
  );

  // Revalidate when userInfo._id changes
  useEffect(() => {
    // console.log("User ID changed, revalidating:", userId);
    if (userId !== "anonymous") {
      mutateDashboard();
      mutateReservedAccounts();
      mutateAllTransactions();
    }
  }, [userId, mutateDashboard, mutateReservedAccounts, mutateAllTransactions]);

  const refreshAll = () => {
    mutateDashboard();
    mutateReservedAccounts();
    mutateAllTransactions();
  };

  const isLoading = isDashboardLoading || isReservedAccountsLoading;

  // Debug: Log data and errors
  useEffect(() => {
    // console.log("Dashboard Data:", dashboardData);
    // console.log("Dashboard Error:", dashboardError);
    // console.log("Reserved Accounts Data:", reservedAccountsData);
    // console.log("Reserved Accounts Error:", reservedAccountsError);
    // console.log("All Transactions Pages:", allTransactionsPages);
    // console.log("Transactions Error:", transactionsError);
  }, [dashboardData, dashboardError, reservedAccountsData, reservedAccountsError, allTransactionsPages, transactionsError]);

  // Handle errors
  const errorMessage = dashboardError || reservedAccountsError || transactionsError
    ? "Failed to load wallet data. Please try again later."
    : null;

  // Remove filtering from dashboard transactions
  const dashboardTransactions = dashboardData?.transactions || [];

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
    error: errorMessage, // Add error message for the UI to display
  };
};

export default useWallet;