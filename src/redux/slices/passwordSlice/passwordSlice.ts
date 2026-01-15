import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../../lib/axios';
import { apiEndpoints } from '../../../config/apiEndpoints';

interface PasswordState {
  isLoading: boolean;
  error: string | null;
  resetRequested: boolean;
  resetSuccess: boolean;
}

const initialState: PasswordState = {
  isLoading: false,
  error: null,
  resetRequested: false,
  resetSuccess: false,
};

export const requestPasswordReset = createAsyncThunk(
  'password/requestPasswordReset',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}${apiEndpoints.auth.sendOtp}`, { email });
      return response.data;
    } catch (error: unknown) {
      let message = 'Failed to send reset code';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'password/resetPassword',
  async ({ email, code, newPassword }: { email: string; code: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}${apiEndpoints.auth.resetPassword}`, {
        email,
        code,
        newPassword,
      });
      return response.data;
    } catch (error: unknown) {
      let message = 'Failed to reset password';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

const passwordSlice = createSlice({
  name: 'password',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.resetRequested = false;
      state.resetSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestPasswordReset.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.isLoading = false;
        state.resetRequested = true;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.resetSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetState } = passwordSlice.actions;
export default passwordSlice.reducer;