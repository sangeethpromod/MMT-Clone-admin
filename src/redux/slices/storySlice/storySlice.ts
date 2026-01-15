import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../../lib/axios';
import { apiEndpoints } from '../../../config/apiEndpoints';
import { StoryState, FetchStoriesParams } from '../../../types/story.types';

const initialState: StoryState = {
  stories: [],
  storyDetails: null,
  pagination: null,
  isLoading: false,
  error: null,
};

export const fetchStories = createAsyncThunk(
  'story/fetchStories',
  async ({ page, limit, sort, status, storyType, search }: FetchStoriesParams, { rejectWithValue }) => {
    try {
      const body: Partial<FetchStoriesParams> = { page, limit, sort, status, storyType };
      if (search && search.trim()) {
        body.search = search.trim();
      }
      const response = await axios.post(`${API_BASE_URL}${apiEndpoints.story.storyList}`, body);
      return response.data;
    } catch (error: unknown) {
      let message = 'Failed to fetch stories';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const fetchStoryDetails = createAsyncThunk(
  'story/fetchStoryDetails',
  async (storyId: string, { rejectWithValue }) => {
    try {
      const url = `${API_BASE_URL}${apiEndpoints.story.storyDetails.replace(':id', storyId)}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error: unknown) {
      let message = 'Failed to fetch story details';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const approveStory = createAsyncThunk(
  'story/approveStory',
  async (storyId: string, { rejectWithValue }) => {
    try {
      const url = `${API_BASE_URL}${apiEndpoints.story.approveStory.replace(':id', storyId)}`;
      const response = await axios.patch(url);
      return response.data;
    } catch (error: unknown) {
      let message = 'Failed to approve story';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const rejectStory = createAsyncThunk(
  'story/rejectStory',
  async ({ storyId, rejectedReason }: { storyId: string; rejectedReason: string }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}${apiEndpoints.story.rejectStory}`, { storyId, rejectedReason });
      return response.data;
    } catch (error: unknown) {
      let message = 'Failed to reject story';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const blockStory = createAsyncThunk(
  'story/blockStory',
  async ({ storyId, blockReason }: { storyId: string; blockReason: string }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}${apiEndpoints.story.blockStory}`, { storyId, blockReason });
      return response.data;
    } catch (error: unknown) {
      let message = 'Failed to block story';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stories = action.payload.data.stories;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchStoryDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStoryDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.storyDetails = action.payload.data;
      })
      .addCase(fetchStoryDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(approveStory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(approveStory.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(approveStory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(rejectStory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(rejectStory.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(rejectStory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(blockStory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(blockStory.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(blockStory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = storySlice.actions;
export default storySlice.reducer;
