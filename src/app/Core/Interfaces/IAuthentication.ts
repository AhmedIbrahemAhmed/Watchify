export interface IUserSignUp {
  name: string | null | undefined;
  password: string | null | undefined;
  rePassword: string | null | undefined;
  phone: string | null | undefined;
  email: string | null | undefined;
}

export interface IUserSignIn extends Pick<IUserSignUp, 'email' | 'password'> {}
export interface IForgetPassword {
  email: string | null | undefined;
}

export interface IVerifyResetCode {
  resetCode: string | null | undefined;
}

export interface IResetPassword extends IForgetPassword {
  newPassword: string | null | undefined;
}

export interface IDecodedToken {
  id: string;
  name: string;
  role: 'user';
  iat?: number;
  exp?: number;
}

export const BaseUrl: string = 'https://ecommerce.routemisr.com';
