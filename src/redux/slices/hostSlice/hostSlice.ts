import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../../lib/axios';
import { apiEndpoints } from '../../../config/apiEndpoints';
import { HostState, FetchHostsParams } from '../../../types/host.type';

const initialState: HostState = {
  hosts: [],
  hostDetails: null,
  pagination: null,
  isLoading: false,
  error: null,
};

export const fetchHosts = createAsyncThunk(
  'host/fetchHosts',
  async ({ page, limit, sort, status, search }: FetchHostsParams, { rejectWithValue }) => {
    try {
      const body: Partial<FetchHostsParams> = { page, limit, sort, status };
      if (search && search.trim()) {
        body.search = search.trim();
      }
      const response = await axios.post(`${API_BASE_URL}${apiEndpoints.host.hostListApproval}`, body);
      return response.data;
    } catch (error: unknown) {
      let message = 'Failed to fetch hosts';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const fetchHostDetails = createAsyncThunk(
  'host/fetchHostDetails',
  async (userId: string, { rejectWithValue }) => {
    try {
      const url = `${API_BASE_URL}${apiEndpoints.host.hostDetails.replace(':id', userId)}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error: unknown) {
      let message = 'Failed to fetch host details';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const approveHost = createAsyncThunk(
  'host/approveHost',
  async (hostId: string, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}${apiEndpoints.host.approveHost}`, { hostId });
      return response.data;
    } catch (error: unknown) {
      let message = 'Failed to approve host';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const blockHost = createAsyncThunk(
  'host/blockHost',
  async ({ hostId, blockReason }: { hostId: string; blockReason: string }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}${apiEndpoints.host.blockHost}`, { hostId, blockReason });
      return response.data;
    } catch (error: unknown) {
      let message = 'Failed to block host';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const unblockHost = createAsyncThunk(
  'host/unblockHost',
  async (hostId: string, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}${apiEndpoints.host.unblockHost}`, { hostId });
      return response.data;
    } catch (error: unknown) {
      let message = 'Failed to unblock host';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const deleteHost = createAsyncThunk(
  'host/deleteHost',
  async (hostId: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}${apiEndpoints.host.deleteHost}`, { data: { hostId } });
      return response.data;
    } catch (error: unknown) {
      let message = 'Failed to delete host';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

const hostSlice = createSlice({
  name: 'host',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hosts = action.payload.data.hosts;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchHosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchHostDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHostDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hostDetails = action.payload.data;
      })
      .addCase(fetchHostDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(approveHost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(approveHost.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(approveHost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(blockHost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(blockHost.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(blockHost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(unblockHost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(unblockHost.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(unblockHost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteHost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteHost.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteHost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = hostSlice.actions;
export default hostSlice.reducer;