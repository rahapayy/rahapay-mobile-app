import { useContext } from "react";
import useSWR from "swr";
import { AuthContext } from "../context/AuthContext";

const useWallet = () => {
  const { userInfo } = useContext(AuthContext);

  // Fetch data from both endpoints
  const { data: dashboardData, isValidating: isDashboardLoading } =
    useSWR(`user/dashboard/me/`);
  const {
    data: reservedAccountsData,
    isValidating: isReservedAccountsLoading,
  } = useSWR(`user/reserved-accounts`);

  const isLoading = isDashboardLoading || isReservedAccountsLoading;

  // Correct the extraction of the transactions array
  const transactions = dashboardData?.transacton || []; // Fix the transactions source and correct the typo

  const balance = dashboardData?.wallet?.balance || 0;

  // The reserved accounts information will now come from dashboardData
  const account = dashboardData?.wallet || {};

  // Mapping transactions to required fields and categorizing
  const formattedTransactions = transactions.map(
    (trx: {
      amountPaid: any;
      paidOn: string | number | Date;
      _id: any;
      paymentMethod: any;
      transactionReference: any;
      paymentStatus: any;
      transactionType: any;
      updatedAt: any;
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
    })
  );

  // Categorize transactions
  const walletTransactions = formattedTransactions.filter(
    (trx: { tranxType: string }) =>
      trx.tranxType !== "funding" && trx.tranxType !== "debit"
  );
  const serviceTransactions = formattedTransactions.filter(
    (trx: { tranxType: string }) =>
      trx.tranxType === "funding" || trx.tranxType === "debit"
  );

  return {
    balance,
    account,
    walletTransactions,
    serviceTransactions,
    isLoading,
  };
};

export default useWallet;
