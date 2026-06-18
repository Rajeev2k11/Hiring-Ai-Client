import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type DateRange = "7d" | "30d" | "90d" | "ytd";

export interface DashboardState {
  range: DateRange;
  /** Which executive/recruiter/hiring-manager view is active. */
  view: string;
}

const initialState: DashboardState = {
  range: "30d",
  view: "recruiter",
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardRange(state, action: PayloadAction<DateRange>) {
      state.range = action.payload;
    },
    setDashboardView(state, action: PayloadAction<string>) {
      state.view = action.payload;
    },
  },
});

export const { setDashboardRange, setDashboardView } = dashboardSlice.actions;
export default dashboardSlice.reducer;
