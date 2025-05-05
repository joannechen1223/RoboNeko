import { configureStore } from "@reduxjs/toolkit";

import personalityReducer from "@/features/Personality/personalitySlice";
import postcardsReducer from "@/features/Postcards/postcardsSlice";
import webSocketReducer from "@/features/WebSocket/webSocketSlice";

const store = configureStore({
  reducer: {
    postcards: postcardsReducer,
    personality: personalityReducer,
    webSocket: webSocketReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
