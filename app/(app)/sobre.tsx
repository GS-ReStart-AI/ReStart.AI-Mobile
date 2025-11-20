import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useBackground } from "../../src/context/BackgroundContext";
import AppLogo from "../../src/components/AppLogo";
import MenuController from "../../src/components/MenuController";
import Constants from "expo-constants";

const COMMIT_HASH =
  (Constants.expoConfig?.extra as any)?.commitHash ?? "N/A";

export default function SobreAppScreen() {
  const { background } = useBackground();

  return (
    <MenuController>
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient colors={background.colors} style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.headerRow}>
              <AppLogo />
            </View>

            <View style={styles.window}>
              <View style={styles.windowHeader}>
                <View style={[styles.windowDot, styles.dotRed]} />
                <View style={[styles.windowDot, styles.dotYellow]} />
                <View style={[styles.windowDot, styles.dotGreen]} />
              </View>

              <View style={styles.windowBody}>

                <View style={styles.section}>
                  <Text style={styles.label}>Hash do commit</Text>
                  <Text style={styles.code}>{COMMIT_HASH}</Text>
                </View>

                <View style={styles.sectionRow}>
                  <View style={styles.sectionItem}>
                    <Text style={styles.label}>Versão</Text>
                    <Text style={styles.value}>1.0.0</Text>
                  </View>
                  <View style={styles.sectionItem}>
                    <Text style={styles.label}>Plataforma</Text>
                    <Text style={styles.value}>Mobile · Expo</Text>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Tecnologias principais</Text>
                  <Text style={styles.value}>
                    React Native · Expo · TypeScript · C# · Python
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </MenuController>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  headerRow: {
    alignItems: "center",
    justifyContent: "center",
    padding: 15
  },
  window: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 24,
    backgroundColor: "rgba(109, 109, 109, 0)",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.85)",
  },
  windowHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
  },
  windowDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotRed: {
    backgroundColor: "#f97373",
  },
  dotYellow: {
    backgroundColor: "#facc15",
  },
  dotGreen: {
    backgroundColor: "#22c55e",
  },
  windowBody: {
    paddingHorizontal: 18,
    paddingVertical: 18,
    gap: 12,
  },
  section: {
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: "#0f172a",
    backgroundColor: "rgba(255, 255, 255, 0.55)",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  code: {
    fontSize: 12,
    color: "#0b1120",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.55)",
    fontFamily: "monospace",
  },
  sectionRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 6,
  },
  sectionItem: {
    flex: 1,
  },
});
