import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";

import { setAuthToken } from "@/lib/api-client";
import { setCredentials, logout } from "./slices/authSlice";

/**
 * Keeps the axios client's bearer token in sync with the auth slice — the
 * single side-effect bridge between Redux state and the network layer.
 */
export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isAnyOf(setCredentials, logout),
  effect: (action) => {
    if (setCredentials.match(action)) {
      setAuthToken(action.payload.token);
    } else {
      setAuthToken(null);
    }
  },
});
