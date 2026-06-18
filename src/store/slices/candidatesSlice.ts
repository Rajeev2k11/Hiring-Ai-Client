import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CandidatesView = "list" | "board" | "graph";

export interface CandidatesState {
  statusFilter: string | null;
  jobFilter: string | null;
  search: string;
  view: CandidatesView;
  selectedApplicationId: string | null;
}

const initialState: CandidatesState = {
  statusFilter: null,
  jobFilter: null,
  search: "",
  view: "list",
  selectedApplicationId: null,
};

const candidatesSlice = createSlice({
  name: "candidates",
  initialState,
  reducers: {
    setCandidateStatusFilter(state, action: PayloadAction<string | null>) {
      state.statusFilter = action.payload;
    },
    setCandidateJobFilter(state, action: PayloadAction<string | null>) {
      state.jobFilter = action.payload;
    },
    setCandidateSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setCandidatesView(state, action: PayloadAction<CandidatesView>) {
      state.view = action.payload;
    },
    selectApplication(state, action: PayloadAction<string | null>) {
      state.selectedApplicationId = action.payload;
    },
  },
});

export const {
  setCandidateStatusFilter,
  setCandidateJobFilter,
  setCandidateSearch,
  setCandidatesView,
  selectApplication,
} = candidatesSlice.actions;
export default candidatesSlice.reducer;
