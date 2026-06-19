"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { authClient, type AuthResult } from "@/services/auth-client";
import { queryKeys } from "@/lib/query-keys";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  authFailed,
  authPending,
  logout as logoutAction,
  setSession,
} from "@/store/slices/authSlice";
import type {
  CandidateRegisterRequest,
  CompanyRegisterRequest,
  LoginRequest,
} from "@/types";

/** Validates the httpOnly-cookie session against the backend (/auth/me). */
export function useSession(enabled = true) {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => authClient.session(),
    enabled,
    retry: false,
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });
}

/** Auth state + login/register/logout wired to the BFF and Redux. */
export function useAuth() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const auth = useAppSelector((s) => s.auth);

  const onAuthed = (res: AuthResult) => {
    dispatch(setSession({ actorType: res.actor_type, identity: res.identity }));
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
  };
  const onError = (e: unknown) =>
    dispatch(authFailed((e as { message?: string })?.message ?? "Auth failed"));

  const loginCompany = useMutation({
    mutationFn: (payload: LoginRequest) => {
      dispatch(authPending());
      return authClient.login("company", payload);
    },
    onSuccess: onAuthed,
    onError,
  });

  const loginCandidate = useMutation({
    mutationFn: (payload: LoginRequest) => {
      dispatch(authPending());
      return authClient.login("candidate", payload);
    },
    onSuccess: onAuthed,
    onError,
  });

  const registerCompany = useMutation({
    mutationFn: (payload: CompanyRegisterRequest) => {
      dispatch(authPending());
      return authClient.registerCompany(payload);
    },
    onSuccess: onAuthed,
    onError,
  });

  const registerCandidate = useMutation({
    mutationFn: (payload: CandidateRegisterRequest) => {
      dispatch(authPending());
      return authClient.registerCandidate(payload);
    },
    onSuccess: onAuthed,
    onError,
  });

  const logout = async () => {
    try {
      await authClient.logout();
    } finally {
      dispatch(logoutAction());
      queryClient.clear();
    }
  };

  return {
    ...auth,
    loginCompany,
    registerCompany,
    loginCandidate,
    registerCandidate,
    logout,
  };
}
