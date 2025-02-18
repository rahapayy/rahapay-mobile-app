import { useAuth } from "@/services/AuthContext";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

const useWallet = () => {
  const { userInfo } = useAuth();

  // Fetch data from both endpoints
  const {
    data: dashboardData,
    isValidating: isDashboardLoading,
    mutate: mutateDashboard,
  } = useSWR(`user/dashboard/me`, {
    // refreshInterval: 5000, // Refresh every 5 seconds
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
  } = useSWRInfinite(
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
    (trx) => trx.transactionType !== "COMMISSION"
  );

  const balance = dashboardData?.wallet?.balance || 0;
  const account = dashboardData?.wallet || {};

  // Extract and properly format transactions from infinite loading
  const allTransactionsData = allTransactionsPages
    ? [].concat(...allTransactionsPages.map((page) => 
        // Apply the same filter to remove COMMISSION transactions
        (page.data || []).filter(trx => trx.transactionType !== "COMMISSION")
      ))
    : [];

  const pagination = allTransactionsPages?.[0]?.pagination || {
    currentPage: 1,
    totalPages: 1,
  };

  const getAllTransactions = () => ({
    transactions: allTransactionsData,
    pagination,
    isLoading: isAllTransactionsLoading,
    currentPage,
    setCurrentPage,
  });

  // Mapping dashboard transactions to required fields for other views
  const formattedTransactions = filteredDashboardTransactions.map(
    (trx) => ({
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