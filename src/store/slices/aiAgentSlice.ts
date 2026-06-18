import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Autonomy = "manual" | "assisted" | "autonomous";

export interface AgentConfig {
  enabled: boolean;
  autonomy: Autonomy;
}

export interface AiAgentState {
  selectedAgentId: string | null;
  /** Per-agent demo configuration shown in the AI Command Center. */
  config: Record<string, AgentConfig>;
  consoleOpen: boolean;
}

const initialState: AiAgentState = {
  selectedAgentId: null,
  consoleOpen: false,
  config: {
    planner: { enabled: true, autonomy: "assisted" },
    sourcing: { enabled: true, autonomy: "autonomous" },
    outreach: { enabled: false, autonomy: "assisted" },
    screening: { enabled: true, autonomy: "autonomous" },
    interview: { enabled: true, autonomy: "assisted" },
    assessment: { enabled: false, autonomy: "manual" },
    offer: { enabled: false, autonomy: "manual" },
    compliance: { enabled: true, autonomy: "assisted" },
    analytics: { enabled: true, autonomy: "autonomous" },
  },
};

const aiAgentSlice = createSlice({
  name: "aiAgent",
  initialState,
  reducers: {
    selectAgent(state, action: PayloadAction<string | null>) {
      state.selectedAgentId = action.payload;
    },
    toggleAgent(state, action: PayloadAction<string>) {
      const cfg = state.config[action.payload];
      if (cfg) cfg.enabled = !cfg.enabled;
    },
    setAgentAutonomy(
      state,
      action: PayloadAction<{ id: string; autonomy: Autonomy }>
    ) {
      const cfg = state.config[action.payload.id];
      if (cfg) cfg.autonomy = action.payload.autonomy;
    },
    setConsoleOpen(state, action: PayloadAction<boolean>) {
      state.consoleOpen = action.payload;
    },
  },
});

export const { selectAgent, toggleAgent, setAgentAutonomy, setConsoleOpen } =
  aiAgentSlice.actions;
export default aiAgentSlice.reducer;
