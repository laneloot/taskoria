"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  fetchProfile,
  login,
  LoginPayload,
  register,
  RegisterPayload,
  updateProfile,
  ProfileUpdatePayload,
} from "@/lib/api/endpoints";
import { useAuthStore } from "@/lib/store/auth-store";
import { ApiUser } from "@/lib/types";

export const useProfileQuery = (enabled: boolean) => {
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  return useQuery<ApiUser, Error>({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    enabled,
    staleTime: 60 * 1000,
    retry: false,
    onSuccess: setUser,
    onError: (error) => {
      console.error("Profile fetch failed", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        logout();
      }
    },
  });
};

export const useLogin = () => {
  const setTokens = useAuthStore((state) => state.setTokens);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: async (data) => {
      setTokens({ access: data.access, refresh: data.refresh });
      const profile = await fetchProfile();
      useAuthStore.getState().setUser(profile);
      queryClient.setQueryData(["profile"], profile);
      return profile;
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
  });
};

export const useUpdateProfile = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProfileUpdatePayload) => updateProfile(payload),
    onSuccess: (profile) => {
      setUser(profile);
      queryClient.setQueryData(["profile"], profile);
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return () => {
    logout();
    queryClient.clear();
  };
};
