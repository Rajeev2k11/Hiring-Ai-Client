import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type JobsView = "grid" | "table" | "board";

export interface JobsState {
  statusFilter: string | null; // null = All
  search: string;
  view: JobsView;
  sort: "recent" | "applicants" | "title";
}

const initialState: JobsState = {
  statusFilter: null,
  search: "",
  view: "grid",
  sort: "recent",
};

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setJobStatusFilter(state, action: PayloadAction<string | null>) {
      state.statusFilter = action.payload;
    },
    setJobSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setJobsView(state, action: PayloadAction<JobsView>) {
      state.view = action.payload;
    },
    setJobsSort(state, action: PayloadAction<JobsState["sort"]>) {
      state.sort = action.payload;
    },
  },
});

export const { setJobStatusFilter, setJobSearch, setJobsView, setJobsSort } =
  jobsSlice.actions;
export default jobsSlice.reducer;
