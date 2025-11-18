import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useBackground } from "../src/context/BackgroundContext";

export default function RotasApp() {
  const { background } = useBackground();

  const cargo = "Atendente de loja";
  const matchPercent = 92;
  const motivos =
    '"Você tem Excel" · "Experiência com atendimento"';

  return (
    <LinearGradient colors={background.colors} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Rotas de recolocação</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.helperText}>Baseado no seu currículo</Text>
          <Text style={styles.highlightText}>
            Vagas onde você já atende os requisitos essenciais.
          </Text>

          <View style={styles.jobContainer}>
            <Text style={styles.jobLabel}>Cargo:</Text>
            <Text style={styles.jobTitle}>{cargo}</Text>
          </View>

          <View style={styles.matchSection}>
            <Text style={styles.matchLabel}>Match</Text>
            <Text style={styles.matchValue}>{matchPercent}%</Text>
          </View>

          <View style={styles.whySection}>
            <Text style={styles.whyTitle}>Por que você?</Text>
            <Text style={styles.whyText}>{motivos}</Text>
          </View>

          <View style={styles.illustrationPlaceholder} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  menuButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  menuLine: {
    width: 16,
    height: 2,
    backgroundColor: "#FFFFFF",
    marginVertical: 1,
    borderRadius: 1,
  },
  card: {
    borderRadius: 32,
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  helperText: {
    fontSize: 13,
    color: "#E5E7EB",
    textAlign: "center",
    marginBottom: 12,
  },
  highlightText: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 24,
  },
  jobContainer: {
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: "#111827",
    marginBottom: 32,
  },
  jobLabel: {
    fontSize: 12,
    color: "#E5E7EB",
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  matchSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  matchLabel: {
    fontSize: 14,
    color: "#E5E7EB",
    marginBottom: 4,
  },
  matchValue: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  whySection: {
    marginBottom: 32,
  },
  whyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  whyText: {
    fontSize: 13,
    color: "#E5E7EB",
    textAlign: "center",
  },
  illustrationPlaceholder: {
    height: 160,
    borderRadius: 32,
    marginTop: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
});
