import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CompanySummary {
  id: string;
  name: string;
  plan?: string;
}

export interface CompanyState {
  current: CompanySummary | null;
}

const initialState: CompanyState = { current: null };

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setCompany(state, action: PayloadAction<CompanySummary | null>) {
      state.current = action.payload;
    },
  },
});

export const { setCompany } = companySlice.actions;
export default companySlice.reducer;
