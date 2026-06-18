"use client";

import { useEffect, useState } from "react";

/** True only after first client mount — guards hydration-sensitive UI. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
