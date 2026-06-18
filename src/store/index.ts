import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "./storage";
import { listenerMiddleware } from "./listeners";

import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import notificationsReducer from "./slices/notificationsSlice";
import aiAgentReducer from "./slices/aiAgentSlice";
import jobsReducer from "./slices/jobsSlice";
import candidatesReducer from "./slices/candidatesSlice";
import interviewsReducer from "./slices/interviewsSlice";
import dashboardReducer from "./slices/dashboardSlice";
import companyReducer from "./slices/companySlice";
import userReducer from "./slices/userSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  notifications: notificationsReducer,
  aiAgent: aiAgentReducer,
  jobs: jobsReducer,
  candidates: candidatesReducer,
  interviews: interviewsReducer,
  dashboard: dashboardReducer,
  company: companyReducer,
  user: userReducer,
});

const persistConfig = {
  key: "hiring-os-root",
  version: 1,
  storage,
  // Persist durable client state only; volatile view filters reset each session.
  whitelist: [
    "auth",
    "ui",
    "aiAgent",
    "user",
    "company",
    "notifications",
    "dashboard",
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () =>
  configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).prepend(listenerMiddleware.middleware),
    devTools: process.env.NODE_ENV !== "production",
  });

export const store = makeStore();
export const persistor = persistStore(store);

export type AppStore = typeof store;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];
