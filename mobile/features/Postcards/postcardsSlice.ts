import { createSlice } from "@reduxjs/toolkit";

import { postcardData } from "./postcardData";

const postcardsSlice = createSlice({
  name: "postcards",
  initialState: {
    postcards: postcardData,
  },
  reducers: {
    setPostcards: (state, action) => {
      state.postcards = action.payload;
    },
  },
});

export const { setPostcards } = postcardsSlice.actions;
export default postcardsSlice.reducer;
