import axiosInstance from 'src/config/config';
import { ActivateParams, LoginParams, LoginParamsWalletAddress, RegisterParams, RegisterParamsWalletAddress, ResetPassword } from "./params-type";

export const login = async (payload: LoginParams) => {
  try {
    return await axiosInstance
      .post('/user/auth/login', payload)
  }

  catch (error) {
    return error
  }
};

export const register = async (payload: RegisterParams) => {
  try {
    const { email, password, displayName } = payload
    return await axiosInstance.post(`/user/auth/signup`, {
      email,
      password,
      displayName,
    });
  } catch (error) {
    console.log(error)
    return error;
  }
};

export const loginWalletAddress = async (payload: LoginParamsWalletAddress) => {
  return await axiosInstance
    .post('/user/auth/loginWalletAddress', payload)
    .catch(function (error) {
      return error
    });
};

export const registerWalletAddress = async (payload: RegisterParamsWalletAddress) => {
  try {
    return await axiosInstance.post(`/user/auth/registerWalletAddress`, payload);
  } catch (error) {
    return error;
  }
};

export const activate = async (payload: ActivateParams) => {
  try {
    const { email, activationCode } = payload
    return await axiosInstance.put(`/user/auth/activate-account`, {
      email,
      activationCode
    });
  } catch (error) {
    return error;
  }
};

export const sendActivate = async (email: string) => {
  try {
    return await axiosInstance.put(`/user/auth/send/activationCode`, {
      email,
    });
  } catch (error) {
    return error;
  }
};

export const resetLink = async (email: string) => {
  return await axiosInstance
    .put(`/user/auth/send/resetlink`, {
      email: email,
    })
    .catch((error) => {
      return error
    });
};

export const setNewPassword = async (payload: ResetPassword) => {
  const { email, newPassword, token } = payload
  return axiosInstance
    .put(`/user/auth/reset-password`, {
      email,
      newPassword,
      token,
    })
    .catch((error) => {
      return error
    });
};

