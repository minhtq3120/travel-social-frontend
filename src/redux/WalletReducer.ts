import { createSlice } from '@reduxjs/toolkit';
import Web3 from 'web3';

export const WALLET_NAMES = {
  METAMASK: 'METAMASK'
};
const walletAddress = localStorage.getItem('account') || '';

const initialState = {
  account: Web3.utils.isAddress(walletAddress) ? walletAddress : '',
  isConnected: false,
  modalWrongNetwork: false,
  userInfo: null,
  socket: null,
  notification: null,
  weatherData: null,
  currentPosition: null,
  weatherPosition: null
};
export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setAccountAddress: (state, action) => {
      localStorage.setItem('account', action.payload as string);
      return {
        ...state,
        account: action.payload
      };
    },
    setLoginResult: (state, action) => {
      localStorage.setItem('accessToken', action.payload.accessToken as string);
      localStorage.setItem('sex', action.payload.sex as string);
      localStorage.setItem('name', action.payload.name as string);
      localStorage.setItem('avatar', action.payload.avatar as string);
      return {
        ...state,
        accessToken: action.payload.accessToken,
        sex: action.payload.sex,
        name: action.payload.name,
        avatar: action.payload.avatar,
      };
    },
    setConnected: (state, action) => {
      localStorage.setItem('isConnected', action.payload);
      return {
        ...state,
        isConnected: action.payload
      };
    },
    setSocket: (state, action) => {
      return {
        ...state,
        socket: action.payload
      };
    },
    setNotifications: (state, action) => {
      return {
        ...state,
        notification: action.payload
      };
    },
    setWeatherData: (state, action) => {
      return {
        ...state,
        weatherData: action.payload
      };
    },
    setCurrentPosition: (state, action) => {
      return {
        ...state,
        currentPosition: action.payload
      };
    },
    setWeatherPosition: (state, action) => {
      return {
        ...state,
        weatherPosition: action.payload
      };
    },
  }
});
export const { setAccountAddress, setConnected, setLoginResult, setSocket, setNotifications, setWeatherData, setCurrentPosition, setWeatherPosition } = walletSlice.actions;
const { reducer: walletReducer } = walletSlice;
export default walletReducer;
