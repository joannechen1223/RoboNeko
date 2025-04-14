import { createSlice } from "@reduxjs/toolkit";

const postcardsSlice = createSlice({
  name: "postcards",
  initialState: {
    postcards: [
      {
        id: 1,
        image: require("@/assets/images/postcards/postcard-1.jpg"),
        stampId: 1,
        content:
          "I found the purr-fect spot! 🌸 The sun is warm, the cherry blossoms are fluffy, and the breeze smells like fish from the river.",
        date: "2025-04-14",
      },
      {
        id: 2,
        image: require("@/assets/images/postcards/postcard-2.jpg"),
        stampId: 2,
        content:
          "You wouldn't be-lieve the view from up here! I climbed all the way to the top of this giant cat tree they call a skyscraper. ",
        date: "2025-04-13",
      },
      {
        id: 3,
        image: require("@/assets/images/postcards/postcard-2.jpg"),
        stampId: 2,
        content:
          "You wouldn't be-lieve the view from up here! I climbed all the way to the top of this giant cat tree they call a skyscraper. ",
        date: "2025-04-12",
      },
    ],
  },
  reducers: {
    setPostcards: (state, action) => {
      state.postcards = action.payload;
    },
  },
});

export const { setPostcards } = postcardsSlice.actions;
export default postcardsSlice.reducer;
