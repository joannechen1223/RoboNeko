import { configureStore } from "@reduxjs/toolkit";

import personalityReducer from "@/features/Personality/personalitySlice";
import postcardsReducer from "@/features/Postcards/postcardsSlice";

const store = configureStore({
  reducer: {
    postcards: postcardsReducer,
    personality: personalityReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
