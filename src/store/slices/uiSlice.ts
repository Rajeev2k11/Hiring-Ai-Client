import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Density = "comfortable" | "compact";

export interface UiState {
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  commandPaletteOpen: boolean;
  density: Density;
  /** Persisted "active workspace role" for the role-aware demo navigation. */
  activeRole: string;
}

const initialState: UiState = {
  sidebarCollapsed: false,
  mobileNavOpen: false,
  commandPaletteOpen: false,
  density: "comfortable",
  activeRole: "RECRUITER",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
    },
    setMobileNavOpen(state, action: PayloadAction<boolean>) {
      state.mobileNavOpen = action.payload;
    },
    setCommandPaletteOpen(state, action: PayloadAction<boolean>) {
      state.commandPaletteOpen = action.payload;
    },
    setDensity(state, action: PayloadAction<Density>) {
      state.density = action.payload;
    },
    setActiveRole(state, action: PayloadAction<string>) {
      state.activeRole = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  setMobileNavOpen,
  setCommandPaletteOpen,
  setDensity,
  setActiveRole,
} = uiSlice.actions;
export default uiSlice.reducer;
