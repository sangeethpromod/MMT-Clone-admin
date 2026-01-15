import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../../lib/axios';
import { apiEndpoints } from '../../../config/apiEndpoints';
import { TravellerState, FetchTravellersParams } from '../../../types/traveller.types';

const initialState: TravellerState = {
  travellers: [],
  travellerDetails: null,
  pagination: null,
  isLoading: false,
  error: null,
};

export const fetchTravellers = createAsyncThunk(
  'traveller/fetchTravellers',
  async ({ page, limit, sort, status, search }: FetchTravellersParams, { rejectWithValue }) => {
    try {
      const body: Partial<FetchTravellersParams> = { page, limit, sort, status };
      if (search && search.trim()) {
        body.search = search.trim();
      }
      const response = await axios.post(`${API_BASE_URL}${apiEndpoints.traveller.travellerList}`, body);
      return response.data;
    } catch (error: unknown) {
      let message = 'Failed to fetch travellers';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const fetchTravellerDetails = createAsyncThunk(
  'traveller/fetchTravellerDetails',
  async (userId: string, { rejectWithValue }) => {
    try {
      const url = `${API_BASE_URL}${apiEndpoints.traveller.travellerDetails.replace(':id', userId)}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error: unknown) {
      let message = 'Failed to fetch traveller details';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

const travellerSlice = createSlice({
  name: 'traveller',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTravellers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTravellers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.travellers = action.payload.data.travellers;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchTravellers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTravellerDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTravellerDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.travellerDetails = action.payload.data;
      })
      .addCase(fetchTravellerDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = travellerSlice.actions;
export default travellerSlice.reducer;
