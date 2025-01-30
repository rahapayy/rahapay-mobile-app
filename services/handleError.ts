import { handleShowFlash } from "@/components/FlashMessageComponent";

export const handleError = (error: any) => {
  const errorMessage =
    error instanceof Error ? error.message : "Something went wrong";
  if (Array.isArray(error.data?.error)) {
    error.data.error.forEach((el: any) =>
      handleShowFlash({
        message: "Something went wrong",
        type: "info",
        description: errorMessage,
      })
    );
  } else {
    handleShowFlash({
      message: "Something went wrong",
      type: "info",
      description: errorMessage,
    });
  }
};
