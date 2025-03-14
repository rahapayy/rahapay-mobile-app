export interface IUpdateUserCredentials {
  type: string;
  current: string;
  new: string;
}

export interface IUpdateProfilePayload {
  fullName: string;
  phoneNumber: string;
  email: string;
}

export interface UserInfoType {
  _id: string;
  email: string;
  userName: string;
  fullName: string;
  phoneNumber: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  deviceToken?: string;
  trasactionPin: string;
  securityPin: string;
}