import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useBackground } from "../src/context/BackgroundContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { api } from "../src/services/api";
import People from "../src/components/People";

type ResumoPerfilResponse = {
  Areas?: string[];
  areas?: string[];
  Roles?: string[];
  roles?: string[];
  Experiencias?: number;
  experiencias?: number;
  BestRole?: string;
  bestRole?: string;
  Match?: number;
  match?: number;
  WhyYou?: string;
  whyYou?: string;
};

export default function RotasApp() {
  const { background } = useBackground();
  const router = useRouter();
  const params = useLocalSearchParams();
  const usuarioIdParam = params.usuarioId as string | undefined;
  const usuarioId =
    usuarioIdParam && usuarioIdParam.length > 0 ? usuarioIdParam : undefined;

  const [cargo, setCargo] = useState<string | null>(null);
  const [matchPercent, setMatchPercent] = useState<number | null>(null);
  const [motivos, setMotivos] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRotas = async () => {
      if (!usuarioId) {
        Alert.alert(
          "Erro",
          "Não foi possível identificar o usuário. Faça login novamente.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/login"),
            },
          ]
        );
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get<ResumoPerfilResponse>(
          "/api/usuarios/me/resumo-perfil",
          {
            params: { usuarioId },
          }
        );

        const data = response.data;

        const areas = data.areas ?? data.Areas ?? [];
        const roles = data.roles ?? data.Roles ?? [];

        const bestRoleFromApi = data.bestRole ?? data.BestRole ?? null;
        const bestRole =
          bestRoleFromApi ?? (roles.length > 0 ? roles[0] : null);

        setCargo(bestRole);

        const matchFromApi = data.match ?? data.Match;
        if (
          typeof matchFromApi === "number" &&
          !Number.isNaN(matchFromApi)
        ) {
          setMatchPercent(matchFromApi);
        } else if (bestRole) {
          setMatchPercent(92);
        } else {
          setMatchPercent(null);
        }

        const whyFromApi = data.whyYou ?? data.WhyYou;
        if (whyFromApi && whyFromApi.trim().length > 0) {
          setMotivos(whyFromApi.trim());
        } else if (bestRole && areas.length > 0) {
          setMotivos(`Força em: ${areas.slice(0, 2).join(" · ")}`);
        } else if (bestRole) {
          setMotivos(
            "Baseado nas suas experiências e competências mapeadas."
          );
        } else {
          setMotivos(null);
        }
      } catch {
        Alert.alert(
          "Erro",
          "Não foi possível carregar sua melhor oportunidade. Tente novamente em alguns minutos."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRotas();
  }, [usuarioId, router]);

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

          {isLoading ? (
            <View style={{ paddingVertical: 40, alignItems: "center" }}>
              <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
          ) : (
            <>
              <View style={styles.jobContainer}>
                <Text style={styles.jobLabel}>Cargo:</Text>
                <Text style={styles.jobTitle}>
                  {cargo ??
                    "Estamos analisando seu currículo para sugerir o melhor papel."}
                </Text>
              </View>

              {matchPercent !== null && (
                <View style={styles.matchSection}>
                  <Text style={styles.matchLabel}>Match</Text>
                  <Text style={styles.matchValue}>{matchPercent}%</Text>
                </View>
              )}

              {motivos && (
                <View style={styles.whySection}>
                  <Text style={styles.whyTitle}>Por que você?</Text>
                  <Text style={styles.whyText}>{motivos}</Text>
                </View>
              )}

              <View style={styles.illustrationPlaceholder}>
                <People width="100%" height="100%" />
              </View>
            </>
          )}
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
