export interface UserInfo {
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
