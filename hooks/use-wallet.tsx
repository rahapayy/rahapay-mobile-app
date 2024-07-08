// use-wallet.tsx
import { useContext } from "react";
import useSWR from "swr";
import { AuthContext } from "../context/AuthContext";

const useWallet = () => {
  const { userInfo } = useContext(AuthContext);

  // Fetch data from both endpoints
  const { data: dashboardData } = useSWR(`user/dashboard/me/`);
  const { data: reservedAccountsData } = useSWR(`user/reserved-accounts`);

  console.log(dashboardData, reservedAccountsData);

  // Assuming 'reservedAccountsData' already contains the account data directly
  // hence we're checking for 'reservedAccountsData?.data' instead of 'reservedAccountsData?.payment_account'
  const accountDataExists = reservedAccountsData && reservedAccountsData.data;

  const combinedData = {
    ...dashboardData,
    // Adjusting to check the `data` attribute inside `reservedAccountsData`
    payment_account: accountDataExists ? [reservedAccountsData.data] : [],
    transaction: reservedAccountsData?.transaction || [],
  };

  const balance = combinedData?.wallet?.balance || 0;

  // If `payment_account` does not have data, `accountDataExists` will be false, so we return the default null values
  const account = accountDataExists
    ? {
        // Use the first element since we're wrapping the `data` inside an array
        accountNumber: combinedData.payment_account[0].accountNumber,
        bankName: combinedData.payment_account[0].bankName,
        accountName: combinedData.payment_account[0].accountName,
      }
    : { accountNumber: null, bankName: "", accountName: "" };

  const transactions =
    combinedData?.transaction?.map((trx: any) => ({
      amount: trx.amount || 0,
      created_at: trx.created_at || "",
      id: trx._id,
      ownerId: trx.ownerId || "",
      purpose: trx.purpose || "",
      referenceId: trx.referenceId || "",
      status: trx.status || "",
      tranxType: trx.tranxType || "",
      updated_at: trx.updated_at || "",
    })) || [];

  return { balance, account, transactions };
};
export default useWallet;
