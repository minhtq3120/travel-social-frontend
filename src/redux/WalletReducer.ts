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
  userInfo: null
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
      // localStorage.setItem('refreshToken', action.payload.refreshToken as string);
      return {
        ...state,
        accessToken: action.payload.accessToken,
        userInfo: action.payload.userInfo
      };
    },
    setConnected: (state, action) => {
      localStorage.setItem('isConnected', action.payload);
      return {
        ...state,
        isConnected: action.payload
      };
    },
    setModalWrongNetwork: (state, action) => {
      return {
        ...state,
        modalWrongNetwork: action.payload
      };
    }
  }
});
export const { setAccountAddress, setConnected, setLoginResult, setModalWrongNetwork } = walletSlice.actions;
const { reducer: walletReducer } = walletSlice;
export default walletReducer;
