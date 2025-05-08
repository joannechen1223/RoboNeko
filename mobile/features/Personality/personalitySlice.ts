import { createSlice } from "@reduxjs/toolkit";

import { PetPreferences } from "./constants";

const personalitySlice = createSlice({
  name: "personality",
  initialState: {
    name: "HeyHey",
    isPreferencesSecret: false,
    actionPreferences: {
      [PetPreferences.HEAD]: 0,
      [PetPreferences.EARS]: 0,
      [PetPreferences.BELLY]: 0,
      [PetPreferences.BACK]: 0,
    },
  },
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    setActionPreferences: (state, action) => {
      state.actionPreferences = action.payload;
    },
    setIsPreferencesSecret: (state, action) => {
      state.isPreferencesSecret = action.payload;
    },
  },
});

export const { setName, setActionPreferences, setIsPreferencesSecret } =
  personalitySlice.actions;

export default personalitySlice.reducer;
