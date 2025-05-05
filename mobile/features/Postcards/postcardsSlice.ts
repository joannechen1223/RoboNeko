import { createSlice } from "@reduxjs/toolkit";

import { Postcard, postcardData } from "./postcardData";

const postcardShownScore: { [key: number]: number } = {
  0: 1,
  1: 3,
  2: 5,
  3: 10,
  4: 15,
  5: 20,
  6: 30,
  7: 40,
  8: 50,
  9: 70,
  10: 100,
  11: 150,
};

const updatePostcardsShown = (postcards: Postcard[], intimacyScore: number) => {
  return postcards.map((postcard) => ({
    ...postcard,
    isShown: intimacyScore >= postcardShownScore[postcard.id],
  }));
};

const postcardsSlice = createSlice({
  name: "postcards",
  initialState: {
    postcards: postcardData,
    intimacyScore: 0,
  },
  reducers: {
    setPostcards: (state, action) => {
      state.postcards = action.payload;
    },
    setIntimacyScore: (state, action) => {
      state.intimacyScore = action.payload;
      state.postcards = updatePostcardsShown(state.postcards, action.payload);
    },
  },
});

export const { setPostcards, setIntimacyScore } = postcardsSlice.actions;
export default postcardsSlice.reducer;
