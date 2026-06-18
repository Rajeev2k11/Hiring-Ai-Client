import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";

export type NotificationKind = "info" | "success" | "warning" | "agent";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body?: string;
  /** ISO string */
  createdAt: string;
  read: boolean;
  href?: string;
}

export interface NotificationsState {
  items: AppNotification[];
}

const initialState: NotificationsState = { items: [] };

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    pushNotification: {
      reducer(state, action: PayloadAction<AppNotification>) {
        state.items.unshift(action.payload);
        if (state.items.length > 50) state.items.pop();
      },
      prepare(payload: Omit<AppNotification, "id" | "createdAt" | "read">) {
        return {
          payload: {
            ...payload,
            id: nanoid(),
            createdAt: new Date().toISOString(),
            read: false,
          } as AppNotification,
        };
      },
    },
    markRead(state, action: PayloadAction<string>) {
      const item = state.items.find((n) => n.id === action.payload);
      if (item) item.read = true;
    },
    markAllRead(state) {
      state.items.forEach((n) => (n.read = true));
    },
    clearNotifications(state) {
      state.items = [];
    },
    seedNotifications(state, action: PayloadAction<AppNotification[]>) {
      if (state.items.length === 0) state.items = action.payload;
    },
  },
});

export const {
  pushNotification,
  markRead,
  markAllRead,
  clearNotifications,
  seedNotifications,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;
