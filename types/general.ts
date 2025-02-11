export interface IResponse<T = unknown> {
  data: T;
  message: string;
  success: boolean;
}
export interface IErrorResponse<T = unknown> {
  data: T;
  message: string;
  status: number;
}

export interface ErrorResponse {
  response: {
    data: {
      message: string;
    };
  };
}

export type Currency = "NGN";
