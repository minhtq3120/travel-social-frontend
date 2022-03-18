import { configureStore } from '@reduxjs/toolkit';
import IconTabReducer from './IconTabReducer';
import walletReducer from './WalletReducer';

const store = configureStore({
  reducer: {
    wallet: walletReducer,
    iconTabb: IconTabReducer
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
