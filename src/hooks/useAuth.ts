"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authService } from "@/services";
import { queryKeys } from "@/lib/query-keys";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  authFailed,
  authPending,
  logout as logoutAction,
  setCredentials,
} from "@/store/slices/authSlice";
import type {
  CandidateRegisterRequest,
  CompanyRegisterRequest,
  LoginRequest,
  TokenResponse,
} from "@/types";

/** Auth state + login/register/logout mutations wired into Redux. */
export function useAuth() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const auth = useAppSelector((s) => s.auth);

  const handleToken = (res: TokenResponse) => {
    dispatch(
      setCredentials({
        token: res.access_token,
        actorType: res.actor_type,
        identity: res.identity,
      })
    );
  };

  const loginCompany = useMutation({
    mutationFn: (payload: LoginRequest) => {
      dispatch(authPending());
      return authService.loginCompany(payload);
    },
    onSuccess: handleToken,
    onError: (e: { message?: string }) =>
      dispatch(authFailed(e?.message ?? "Login failed")),
  });

  const registerCompany = useMutation({
    mutationFn: (payload: CompanyRegisterRequest) => {
      dispatch(authPending());
      return authService.registerCompany(payload);
    },
    onSuccess: handleToken,
    onError: (e: { message?: string }) =>
      dispatch(authFailed(e?.message ?? "Registration failed")),
  });

  const loginCandidate = useMutation({
    mutationFn: (payload: LoginRequest) => authService.loginCandidate(payload),
    onSuccess: handleToken,
  });

  const registerCandidate = useMutation({
    mutationFn: (payload: CandidateRegisterRequest) =>
      authService.registerCandidate(payload),
    onSuccess: handleToken,
  });

  const logout = () => {
    dispatch(logoutAction());
    queryClient.clear();
  };

  return {
    ...auth,
    loginCompany,
    registerCompany,
    loginCandidate,
    registerCandidate,
    logout,
    queryKey: queryKeys.auth.me,
  };
}
