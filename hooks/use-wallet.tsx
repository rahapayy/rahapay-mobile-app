import React, { useContext } from "react";
import useSWR from "swr";
import { AuthContext } from "../context/AuthContext";

const useWallet = () => {
  const { userInfo } = useContext(AuthContext);
  const { data, ...rest } = useSWR(`user/dashboard/me/`);

  console.log(data);

  const balance = React.useMemo(() => data?.wallet?.balance || 0, [data]);

  const account = React.useMemo(() => {
    if (data?.payment_account && data.payment_account.length > 0) {
      return {
        accountNumber: data.payment_account[0].accountNumber,
        bankName: data.payment_account[0].bankName,
        currencyCode: data.payment_account[0].currencyCode
      };
    }
    return { accountNumber: null, bankName: "", currencyCode: "" };
  }, [data]);

  const transactions = React.useMemo(() => {
    return data?.transaction?.map((trx: { amount: any; created_at: any; _id: any; ownerId: any; purpose: any; referenceId: any; status: any; tranxType: any; updated_at: any; }) => ({
      amount: trx.amount || 0,
      created_at: trx.created_at || "",
      id: trx._id,
      ownerId: trx.ownerId || "",
      purpose: trx.purpose || "",
      referenceId: trx.referenceId || "",
      status: trx.status || "",
      tranxType: trx.tranxType || "",
      updated_at: trx.updated_at || ""
    })) || [];
  }, [data]);

  return { balance, account, transactions, ...rest };
};

export default useWallet;
