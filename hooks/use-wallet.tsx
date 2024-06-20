// import React, { useContext } from "react";
// import useSWR from "swr";
// import { AuthContext } from "../context/AuthContext";

// const useWallet = () => {
//   const { userInfo } = useContext(AuthContext);
//   const { data, ...rest } = useSWR(`/users/${userInfo.data.user.id}`);

//   const balance = React.useMemo(() => data?.data?.wallet?.balance || 0, [data]);

//   const account: {
//     accountNumber: number;
//     bankName: string;
//     currencyCode: string;
//   } = React.useMemo(() => data?.data?.payment_account[0], [data]);

//   const transactions: {
//     amount: number;
//     created_at: string;
//     id: string;
//     ownerId: string;
//     purpose: string;
//     referenceId: string;
//     status: string;
//     tranxType: string;
//     updated_at: string;
//   }[] = React.useMemo(() => data?.data?.transaction, [data]);

//   return { balance, account, transactions, ...rest };
// };

// export default useWallet;
