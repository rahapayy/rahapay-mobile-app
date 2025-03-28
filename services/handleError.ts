import axios, { AxiosError } from "axios";
import { handleShowFlash } from "../components/FlashMessageComponent";

export const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const errorMessage =
      error.response?.data?.message || // Prioritize server message
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";

    handleShowFlash({
      message: errorMessage,
      type: "danger",
    });

    console.log("Full error details:", {
      message: errorMessage,
      responseData: error.response?.data,
      status: error.response?.status,
    });
  } else {
    handleShowFlash({
      message: error instanceof Error ? error.message : "Something went wrong",
      type: "danger",
    });
  }
};
