import React, { useContext, useMemo } from "react";
import useSWR from "swr";
import { AuthContext } from "../context/AuthContext";

const useWallet = () => {
  const { userInfo } = useContext(AuthContext);
  const userId = userInfo?.id;
  const { data, ...rest } = useSWR(userId ? `/users/${userId}` : null);

  const balance = useMemo(() => data?.balance || 0, [data]);

  const account = useMemo(
    () => ({
      accountNumber: data?.accountNumber ? String(data?.accountNumber) : "",
      bankName: data?.bankName || "",
      // Assuming currency code is needed but is missing in the provided data
      // and is static (like 'NGN' for Nigerian Naira)
      currencyCode: "NGN",
    }),
    [data]
  );

  const transactions = useMemo(
    () =>
      data?.transactions?.map(
        (trx: {
          amount: any;
          createdAt: any;
          _id: any;
          userId: any;
          purpose: any;
          referenceId: any;
          status: any;
          tranxType: any;
          updatedAt: any;
        }) => ({
          amount: trx.amount,
          created_at: trx.createdAt,
          id: trx._id,
          ownerId: trx.userId, // ownerId assumed to map to userId here
          purpose: trx.purpose || "", // Assuming purpose is a field you want
          referenceId: trx.referenceId || "", // Assuming referenceId is a field you want
          status: trx.status || "", // Assuming status is a field you want
          tranxType: trx.tranxType || "", // Assuming tranxType is a field you want
          updated_at: trx.updatedAt,
        })
      ) || [],
    [data]
  );

  return { balance, account, transactions, ...rest };
};

export default useWallet;
