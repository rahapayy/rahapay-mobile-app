import { useAuth } from "@/services/AuthContext";
import useSWR from "swr";

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
    data: allTransactionsData,
    isValidating: isAllTransactionsLoading,
    mutate: mutateAllTransactions,
  } = useSWR(`transaction/all`);

  const refreshAll = () => {
    mutateDashboard();
    mutateReservedAccounts();
    mutateAllTransactions();
  };

  // console.log(allTransactionsData);

  const isLoading = isDashboardLoading || isReservedAccountsLoading;

  // Correct the extraction of the transactions array
  const transactions = dashboardData?.transacton || []; // Fix the transactions source and correct the typo

  // Filter the COMMISSION to not show amount in the transaction history
  const filteredTransactions = transactions.filter(
    (trx: { transactionType: string }) => trx.transactionType !== "COMMISSION"
  );

  const balance = dashboardData?.wallet?.balance || 0;

  // The reserved accounts information will now come from dashboardData
  const account = dashboardData?.wallet || {};

  // console.log(account, balance);

  const getAllTransactions = () => {
    return {
      transactions: allTransactionsData || [], // Return all transactions
      isLoading: isAllTransactionsLoading,
    };
  };

  // Mapping transactions to required fields without categorization
  const formattedTransactions = filteredTransactions.map(
    (trx: {
      amountPaid: any;
      paidOn: string | number | Date;
      _id: any;
      paymentMethod: any;
      transactionReference: any;
      paymentStatus: any;
      transactionType: any;
      updatedAt: any;
      metadata: any;
    }) => ({
      amount: trx.amountPaid || 0,
      created_at: new Date(trx.paidOn).toLocaleString(),
      id: trx._id || "",
      ownerId: dashboardData?.user?._id || "", // Pull from dashboardData instead
      purpose: trx.paymentMethod || "",
      referenceId: trx.transactionReference || "", // Adjust if needed
      status: trx.paymentStatus || "",
      tranxType: trx.transactionType || "",
      updated_at: trx.updatedAt || "",
      metadata: trx.metadata,
    })
  );

  // Return the plain transactions without categorization
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
