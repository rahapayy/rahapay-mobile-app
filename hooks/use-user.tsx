import React, { useContext } from "react";
import useSWR from "swr";
import { AuthContext } from "../services/AuthContext";

interface UserType {
  // Ensure these types match the response from your backend
  id: string;
  email: string;
  password: string;
  countryCode: string;
  fullName: string;
  phoneNumber: string;
  type: string;
  emailIsVerified: boolean;
  numberIsVerified: boolean;
  created_at: string;
  updated_at: string;
}

const useUser = () => {
  const { userInfo } = useContext(AuthContext);

  const shouldFetch = userInfo?.data?.user?.id; // Only fetch if `id` is non-null/non-undefined
  const { data, error, mutate, isValidating } = useSWR<UserType>(
    shouldFetch ? `/users/${userInfo.data.user.id}` : null
  );

  const user = React.useMemo(
    () => (data ? data : undefined), // Or deeper extraction depending on your API response structure
    [data]
  );

  // Wrap any additional logic here as needed, potentially to handle loading and error states

  return { user, error, mutate, isValidating };
};

export default useUser;
