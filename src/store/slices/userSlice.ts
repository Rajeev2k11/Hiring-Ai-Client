import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/** Client-side user preferences (server profile lives in React Query). */
export interface UserPrefsState {
  reducedMotion: boolean;
  onboardingComplete: boolean;
  dismissedTips: string[];
}

const initialState: UserPrefsState = {
  reducedMotion: false,
  onboardingComplete: false,
  dismissedTips: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setReducedMotion(state, action: PayloadAction<boolean>) {
      state.reducedMotion = action.payload;
    },
    setOnboardingComplete(state, action: PayloadAction<boolean>) {
      state.onboardingComplete = action.payload;
    },
    dismissTip(state, action: PayloadAction<string>) {
      if (!state.dismissedTips.includes(action.payload)) {
        state.dismissedTips.push(action.payload);
      }
    },
  },
});

export const { setReducedMotion, setOnboardingComplete, dismissTip } =
  userSlice.actions;
export default userSlice.reducer;
