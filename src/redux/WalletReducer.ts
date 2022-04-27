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
  weatherPosition: null,
  messageNotifi: 0,
  otherNotifi: 0,
  oldChat: [],
  hashtagSearch: null,
  searchValue: '',
  searchFilter: 'post',
  triggerSearch: false,
  chatNotSeen: 0,
  notiNotSeen: 0
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
    setMessageNotifi: (state, action) => {
      return {
        ...state,
        messageNotifi: state.messageNotifi + 1
      };
    },
    setOtherNotifi: (state, action) => {
      return {
        ...state,
        otherNotifi: state.otherNotifi + 1
      };
    },
    setOldChat: (state, action) => {
      return {
        ...state,
        oldChat: action.payload
      };
    },
    setHashtagSearch: (state, action) => {
      return {
        ...state,
        hashtagSearch: action.payload
      };
    },
    setSearchValue: (state, action) => {
      localStorage.setItem('searchValue', action.payload as string);
      return {
        ...state,
        searchValue: action.payload
      };
    },
    setSearchFilter: (state, action) => {
      localStorage.setItem('searchFilter', action.payload as string);
      return {
        ...state,
        searchFilter: action.payload
      };
    },
    setTriggerSearch: (state, action) => {
      return {
        ...state,
        triggerSearch: !state.triggerSearch
      };
    },
    setChatNotSeen: (state, action) => {
      localStorage.setItem('chatNotSeen', action.payload);
      return {
        ...state,
        chatNotSeen: action.payload,
      };
    },
    setNotiNotSeen: (state, action) => {
      localStorage.setItem('notiNotSeen', action.payload);
      return {
        ...state,
        notiNotSeen: action.payload
      };
    },
  }
});
export const { setAccountAddress, setConnected, setLoginResult, setSocket,
  setNotifications, setWeatherData, setCurrentPosition, setWeatherPosition,
  setOtherNotifi, setMessageNotifi, setOldChat, setTriggerSearch,
  setHashtagSearch, setSearchValue, setSearchFilter, setChatNotSeen, setNotiNotSeen } = walletSlice.actions;
const { reducer: walletReducer } = walletSlice;
export default walletReducer;
