import React from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "./_layout";

export default function Index() {
  const { auth, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0F172A",
        }}
      >
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (auth?.usuarioId) {
    return <Redirect href="/(app)/home" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
