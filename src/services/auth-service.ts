import axiosInstance from 'src/config/config';
import { ActivateParams, LoginParams, RegisterParams, ResetPassword } from "./params-type";

export const login = async (payload: LoginParams) => {
  return await axiosInstance
    .post('/user/auth/login', payload)
    .catch(function (error) {
      if (error.response) {
        return error.response.status;
      }
    });
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
    throw error;
  }
};

export const activate = async (payload: ActivateParams) => {
  try {
    const { email, activationCode } = payload
    return await axiosInstance.put(`/user/auth/activate-account`, {
      email,
    });
  } catch (error) {
    throw error;
  }
};

export const sendActivate = async (email: string) => {
  try {
    return await axiosInstance.put(`/user/auth/send/activationCode`, {
      email,
    });
  } catch (error) {
    throw error;
  }
};

export const resetLink = async (email: string) => {
  return await axiosInstance
    .put(`/user/auth/send/resetlink`, {
      email: email,
    })
    .catch((error) => {
      if (error.response) {
        console.error(error.response.message);
        return error.response.status;
      }
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
      if (error.response) {
        console.error(error.response.message);
        return error.response.status;
      }
    });
};

