import React from "react";
import { Slot, Redirect } from "expo-router";
import { useAuth } from "../_layout";

export default function AuthLayout() {
  const { auth, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return null;
  }

  if (auth?.usuarioId) {
    return <Redirect href="/(app)/home" />;
  }

  return <Slot />;
}
