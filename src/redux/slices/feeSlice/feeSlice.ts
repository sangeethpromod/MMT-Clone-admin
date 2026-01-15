import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../../lib/axios';
import { apiEndpoints } from '../../../config/apiEndpoints';
import { FeeState, Fee } from '../../../types/fee.type';

const initialState: FeeState = {
  fees: [],
  currentFee: null,
  isLoading: false,
  error: null,
};

export const fetchFees = createAsyncThunk(
  'fee/fetchFees',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}${apiEndpoints.fee.feeList}`);
      return response.data;
    } catch (error: unknown) {
      let message = 'Failed to fetch fees';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const deleteFee = createAsyncThunk(
  'fee/deleteFee',
  async (feeId: string, { rejectWithValue }) => {
    try {
      const url = `${API_BASE_URL}${apiEndpoints.fee.deleteFee(feeId)}`;
      await axios.delete(url);
      return feeId;
    } catch (error: unknown) {
      let message = 'Failed to delete fee';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const createFee = createAsyncThunk(
  'fee/createFee',
  async (feeData: Omit<Fee, 'feeId'>, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}${apiEndpoints.fee.createFees}`, feeData);
      return response.data;
    } catch (error: unknown) {
      let message = 'Failed to create fee';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const fetchFeeDetails = createAsyncThunk(
  'fee/fetchFeeDetails',
  async (feeId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}${apiEndpoints.fee.feeDetails(feeId)}`);
      return response.data;
    } catch (error: unknown) {
      let message = 'Failed to fetch fee details';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const updateFee = createAsyncThunk(
  'fee/updateFee',
  async ({ feeId, feeData }: { feeId: string; feeData: Partial<Fee> }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}${apiEndpoints.fee.updateFee(feeId)}`, feeData);
      return response.data;
    } catch (error: unknown) {
      let message = 'Failed to update fee';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

const feeSlice = createSlice({
  name: 'fee',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFees.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fees = action.payload.data.fees || action.payload.data; // Adjust based on API response
      })
      .addCase(fetchFees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteFee.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fees = state.fees.filter(fee => fee.feeId !== action.payload);
      })
      .addCase(deleteFee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createFee.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createFee.fulfilled, (state, action) => {
        state.isLoading = false;
        // Optionally add the new fee to the list
        state.fees.push(action.payload.data);
      })
      .addCase(createFee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFeeDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentFee = action.payload.data;
      })
      .addCase(fetchFeeDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateFee.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateFee.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the fee in the list
        const index = state.fees.findIndex(fee => fee.feeId === action.payload.data.feeId);
        if (index !== -1) {
          state.fees[index] = action.payload.data;
        }
        state.currentFee = null; // Clear current fee after update
      })
      .addCase(updateFee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = feeSlice.actions;
export default feeSlice.reducer;