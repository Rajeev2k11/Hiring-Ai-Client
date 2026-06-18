/**
 * redux-persist storage that no-ops on the server (Next.js SSR) and uses
 * localStorage in the browser. Avoids "window is not defined" during prerender.
 */
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

function createNoopStorage() {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: unknown) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
}

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

export default storage;
