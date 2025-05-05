import { createSlice } from "@reduxjs/toolkit";

const webSocketSlice = createSlice({
  name: "webSocket",
  initialState: {
    ipAddress: "",
    isConnected: false,
  },
  reducers: {
    setIpAddress: (state, action) => {
      state.ipAddress = action.payload;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});

export const { setIpAddress, setIsConnected } = webSocketSlice.actions;
export default webSocketSlice.reducer;
