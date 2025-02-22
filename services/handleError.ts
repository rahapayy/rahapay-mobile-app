import axios, { AxiosError } from "axios";
import { handleShowFlash } from "../components/FlashMessageComponent";

export const handleError = (error: unknown) => {
  if (error instanceof AxiosError) {
    // Extract the backend error message if available.
    const errorMessage =
      error.response?.data.message || "Something went wrong";
    handleShowFlash({
      message: errorMessage,
      type: "danger",
    });
  } else {
    handleShowFlash({
      message: error instanceof Error ? error.message : "Something went wrong",
      type: "danger",
    });
  }
};
