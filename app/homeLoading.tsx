import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useBackground } from "../src/context/BackgroundContext";

export default function HomeLoading() {
  const { background } = useBackground();
  const spinnerRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinnerRotation, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spinnerRotation]);

  const rotate = spinnerRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <LinearGradient colors={background.colors} style={styles.container}>
      <View style={styles.headerMenuRow}>
        <View style={styles.menuIcon}>
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
        </View>
      </View>

      <Text style={styles.headerTitle}>Passaporte de Talentos</Text>

      <View style={styles.cardWrapper}>
        <LinearGradient colors={["#a3cbff", "#c8d6f0"]} style={styles.panel}>
          <Text style={styles.topText}>
            Calma, estamos analisando seu currículo...
          </Text>

          <Animated.View
            style={[styles.spinner, { transform: [{ rotate }] }]}
          />

          <Text style={styles.bottomText}>Lendo as informações...</Text>
        </LinearGradient>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 60,
    alignItems: "center",
  },
  headerMenuRow: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  menuIcon: {
    width: 22,
    alignItems: "flex-end",
    gap: 3,
  },
  menuLine: {
    width: 18,
    height: 2,
    borderRadius: 999,
    backgroundColor: "#000",
  },
  headerTitle: {
    width: "90%",
    marginTop: 120,
    marginBottom: 20,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  cardWrapper: {
    width: "90%",
    flexGrow: 1,
    justifyContent: "center",
    marginBottom: 200,
  },
  panel: {
    borderRadius: 32,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: "center",
    marginTop: 60,
  },
  topText: {
    fontSize: 14,
    textAlign: "center",
    color: "#0f1b3c",
    marginBottom: 50,
  },
  spinner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 7,
    borderColor: "rgba(255,255,255,0.4)",
    borderTopColor: "#8ad0ff",
    marginBottom: 40,
  },
  bottomText: {
    fontSize: 14,
    textAlign: "center",
    color: "#0f1b3c",
  },
});
