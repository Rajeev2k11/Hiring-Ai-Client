import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type InterviewsView = "calendar" | "list";

export interface InterviewsState {
  statusFilter: string | null;
  view: InterviewsView;
  /** ISO date (YYYY-MM-DD) the calendar is focused on. */
  focusedDate: string | null;
}

const initialState: InterviewsState = {
  statusFilter: null,
  view: "calendar",
  focusedDate: null,
};

const interviewsSlice = createSlice({
  name: "interviews",
  initialState,
  reducers: {
    setInterviewStatusFilter(state, action: PayloadAction<string | null>) {
      state.statusFilter = action.payload;
    },
    setInterviewsView(state, action: PayloadAction<InterviewsView>) {
      state.view = action.payload;
    },
    setFocusedDate(state, action: PayloadAction<string | null>) {
      state.focusedDate = action.payload;
    },
  },
});

export const { setInterviewStatusFilter, setInterviewsView, setFocusedDate } =
  interviewsSlice.actions;
export default interviewsSlice.reducer;
