import { configureStore } from "@reduxjs/toolkit";

import postcardsReducer from "@/features/Postcards/postcardsSlice";

const store = configureStore({
  reducer: {
    postcards: postcardsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
