import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../../lib/axios';
import { apiEndpoints } from '../../../config/apiEndpoints';
import { Transaction, TransactionPagination, TransactionResponse } from '../../../types/transactions.types';

export interface TransactionDetail {
  _id: string;
  bookingId: string;
  razorpayOrderId: string;
  feeDetails: {
    totalFee: number;
    razorpayFee: number;
    gst: number;
  };
  razorpayPaymentId: string;
  Amount: number;
  Date: string;
  Time: string;
  bankRRN: string;
  vpa: string;
  method: string;
}

export interface TransactionDetailResponse {
  success: boolean;
  data: TransactionDetail;
}

interface TransactionState {
  transactions: Transaction[];
  pagination: TransactionPagination | null;
  transactionDetail: TransactionDetail | null;
  isLoading: boolean;
  isLoadingDetail: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  pagination: null,
  transactionDetail: null,
  isLoading: false,
  isLoadingDetail: false,
  error: null,
};

export const fetchTransactions = createAsyncThunk<
  TransactionResponse,
  { page: number; limit: number; sortBy: string; sortOrder: string }
>(
  'transactions/fetchTransactions',
  async ({ page, limit, sortBy, sortOrder }, { rejectWithValue }) => {
    try {
      const url = `${API_BASE_URL}${apiEndpoints.transactions.transactionList}`;
      const body = { page, limit, sortBy, sortOrder };
      console.log('Fetching Transactions:');
      console.log('URL:', url);
      console.log('Body:', body);
      const response = await axios.post(url, body);
      console.log('Transaction Response:', response.data);
      return response.data;
    } catch (error: string) {
      console.error('Transaction API Error:', error);
      console.error('Error Response:', error.response);
      console.error('Error Status:', error.response?.status);
      console.error('Error Data:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
    }
  }
);

export const fetchTransactionDetails = createAsyncThunk<
  TransactionDetailResponse,
  string
>(
  'transactions/fetchTransactionDetails',
  async (razorpayOrderId, { rejectWithValue }) => {
    try {
      const url = `${API_BASE_URL}${apiEndpoints.transactions.transactionDetails.replace(':razorpayOrderId', razorpayOrderId)}`;
      console.log('Fetching Transaction Details:');
      console.log('URL:', url);
      const response = await axios.get(url);
      console.log('Transaction Details Response:', response.data);
      return response.data;
    } catch (error: string) {
      console.error('Transaction Details API Error:', error);
      console.error('Error Response:', error.response);
      console.error('Error Status:', error.response?.status);
      console.error('Error Data:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transaction details');
    }
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTransactionDetails.pending, (state) => {
        state.isLoadingDetail = true;
        state.error = null;
      })
      .addCase(fetchTransactionDetails.fulfilled, (state, action) => {
        state.isLoadingDetail = false;
        state.transactionDetail = action.payload.data;
      })
      .addCase(fetchTransactionDetails.rejected, (state, action) => {
        state.isLoadingDetail = false;
        state.error = action.payload as string;
      });
  },
});

export default transactionsSlice.reducer;
