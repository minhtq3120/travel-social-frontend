import { createSlice } from '@reduxjs/toolkit';
import Web3 from 'web3';

export const WALLET_NAMES = {
  METAMASK: 'METAMASK'
};
const walletAddress = localStorage.getItem('account') || '';

const initialState = {
  iconKey: '1'
};
export const iconTabSlice = createSlice({
  name: 'iconTab',
  initialState,
  reducers: {
    setIconTabKey: (state, action) => {
      localStorage.setItem('iconTabKey', action.payload as string);
      return {
        ...state,
        iconKey: action.payload
      };
    },

  }
});
export const { setIconTabKey } = iconTabSlice.actions;
const { reducer: IconTabReducer } = iconTabSlice;
export default IconTabReducer;
