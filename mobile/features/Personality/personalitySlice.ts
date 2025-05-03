import { createSlice } from "@reduxjs/toolkit";

import { PetPreferences } from "./constants";

const personalitySlice = createSlice({
  name: "personality",
  initialState: {
    name: "HeyHey",
    isPreferencesSecret: false,
    actionPreferences: {
      [PetPreferences.HEAD]: 0,
      [PetPreferences.EARS]: 2,
      [PetPreferences.BELLY]: 1,
      [PetPreferences.BACK]: 3,
    },
  },
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    setActionPreferences: (state, action) => {
      state.actionPreferences = action.payload;
      // todo: update the actions
    },
    setIsPreferencesSecret: (state, action) => {
      state.isPreferencesSecret = action.payload;
    },
  },
});

export const { setName, setActionPreferences, setIsPreferencesSecret } =
  personalitySlice.actions;

export default personalitySlice.reducer;
