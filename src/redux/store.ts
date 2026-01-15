import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice/authSlice';
import hostReducer from './slices/hostSlice/hostSlice';
import travellerReducer from './slices/travellerSlice/travellerSlice';
import storyReducer from './slices/storySlice/storySlice';
import feeReducer from './slices/feeSlice/feeSlice';
import passwordReducer from './slices/passwordSlice/passwordSlice';
import transactionsReducer from './slices/transactionSlice/transactionsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    host: hostReducer,
    traveller: travellerReducer,
    story: storyReducer,
    fee: feeReducer,
    password: passwordReducer,
    transactions: transactionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;