import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../../lib/axios';
import { apiEndpoints } from '../../../config/apiEndpoints';
import { RootState } from '../../../redux/store';

interface User {
  userId: string;
  fullName: string;
  email: string;
  role: string;
  firebaseUid: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  firebaseToken: string | null;
  isLoading: boolean;
  isAuthChecked: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  firebaseToken: null,
  isLoading: false,
  isAuthChecked: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}${apiEndpoints.auth.login}`, { email, password });
      return response.data;
    } catch (error: unknown) {
      let message = 'Login failed';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const refreshToken = state.auth.refreshToken;
    if (!refreshToken) {
      return rejectWithValue('No refresh token');
    }
    try {
      const response = await axios.post(`${API_BASE_URL}${apiEndpoints.auth.refresh}`, { refreshToken });
      return response.data;
    } catch (error: unknown) {
      let message = 'Refresh failed';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.firebaseToken = null;
      state.error = null;
      state.isAuthChecked = false;
      localStorage.removeItem('auth');
    },
    setAuthFromStorage: (state, action: PayloadAction<AuthState>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.firebaseToken = action.payload.firebaseToken;
    },
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.user;
        state.accessToken = action.payload.data.accessToken;
        state.refreshToken = action.payload.data.refreshToken;
        state.firebaseToken = action.payload.data.firebaseToken;
        localStorage.setItem('auth', JSON.stringify({
          user: state.user,
          accessToken: state.accessToken,
        }));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.data.accessToken;
        state.refreshToken = action.payload.data.refreshToken;
        localStorage.setItem('auth', JSON.stringify({
          user: state.user,
          accessToken: state.accessToken,
        }));
      })
      .addCase(refreshToken.rejected, (state) => {
        // On refresh failure, logout
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.firebaseToken = null;
        localStorage.removeItem('auth');
      });
  },
});

export const { logout, setAuthFromStorage, setAuthChecked } = authSlice.actions;
export default authSlice.reducer;