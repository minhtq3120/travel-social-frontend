import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../config/config';
import { CreateAdmin, Filter } from '../constant/constants';
import { qsStringify } from './query-string';

export const options = {
  baseUrl: process.env.REACT_APP_BACKEND
};

export const getAdminLists = createAsyncThunk('admins', async (body: Filter) => {
  const res = await axiosInstance.get(`/admins${qsStringify(body)}`);
  return res.data;
});

export const deleteAdmin = async (id: number) => {
  const res = await axiosInstance.delete(`/admins/${id}`);
  return { data: res.data, status: res.status };
};

export const createAdmin = async (body: CreateAdmin) => {
  const res = await axiosInstance.post(`/admins`, body);
  return res;
};
