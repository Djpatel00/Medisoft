import { createSlice } from '@reduxjs/toolkit';

const initialState = false; // use boolean since you're toggling

const refreshSlice = createSlice({
  name: 'refresh',
  initialState,
  reducers: {
    toggleRefresh: (state) => !state,
  },
});

// Selector
export const selectRefresh = (state) => state.refresh;

// Action
export const { toggleRefresh } = refreshSlice.actions;

export default refreshSlice.reducer;
