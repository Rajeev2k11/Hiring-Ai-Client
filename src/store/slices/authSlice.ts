import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ActorType, Identity, LoadStatus } from "@/types";

export interface AuthState {
  token: string | null;
  actorType: ActorType | null;
  identity: Identity | null;
  isAuthenticated: boolean;
  status: LoadStatus;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  actorType: null,
  identity: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
};

interface Credentials {
  token: string;
  actorType: ActorType;
  identity: Identity;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authPending(state) {
      state.status = "loading";
      state.error = null;
    },
    setCredentials(state, action: PayloadAction<Credentials>) {
      state.token = action.payload.token;
      state.actorType = action.payload.actorType;
      state.identity = action.payload.identity;
      state.isAuthenticated = true;
      state.status = "succeeded";
      state.error = null;
    },
    setIdentity(state, action: PayloadAction<Identity>) {
      state.identity = action.payload;
    },
    authFailed(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    logout(state) {
      state.token = null;
      state.actorType = null;
      state.identity = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
    },
  },
});

export const { authPending, setCredentials, setIdentity, authFailed, logout } =
  authSlice.actions;
export default authSlice.reducer;
