import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useBackground } from "../src/context/BackgroundContext";
import AppLogo from "../src/components/AppLogo";
import { api } from "../src/services/api";

type ResumoPerfilResponse = {
  Areas?: string[];
  areas?: string[];
  Roles?: string[];
  roles?: string[];
  Experiencias?: number;
  experiencias?: number;
};

export default function ResumoApp() {
  const { background } = useBackground();
  const router = useRouter();
  const params = useLocalSearchParams();
  const usuarioIdParam = params.usuarioId as string | undefined;
  const usuarioId =
    usuarioIdParam && usuarioIdParam.length > 0 ? usuarioIdParam : undefined;

  const [areas, setAreas] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [experiencias, setExperiencias] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResumo = async () => {
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

        const a = data.areas ?? data.Areas ?? [];
        const r = data.roles ?? data.Roles ?? [];
        const e = data.experiencias ?? data.Experiencias ?? null;

        setAreas(a);
        setRoles(r);
        setExperiencias(e);
      } catch {
        Alert.alert(
          "Erro",
          "Não foi possível carregar o resumo do seu perfil. Tente novamente em alguns minutos."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumo();
  }, [usuarioId, router]);

  const renderChipList = (items: string[]) => {
    return items.map((item) => (
      <View key={item} style={styles.chip}>
        <Text style={styles.chipText}>{item}</Text>
      </View>
    ));
  };

  return (
    <LinearGradient colors={background.colors} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <AppLogo />
        </View>

        <View style={styles.contentCard}>
          <Text style={styles.title}>Resumo</Text>
          <Text style={styles.subtitle}>
            Analisamos seu currículo e encontramos:
          </Text>

          {isLoading ? (
            <View style={styles.loadingWrapper}>
              <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
          ) : (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Áreas compatíveis:</Text>
                {areas.length > 0 ? (
                  <View style={styles.chipList}>{renderChipList(areas)}</View>
                ) : (
                  <Text style={styles.emptyText}>
                    Ainda não encontramos áreas compatíveis.
                  </Text>
                )}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Papéis sugeridos para transição
                </Text>
                {roles.length > 0 ? (
                  <View style={styles.chipList}>{renderChipList(roles)}</View>
                ) : (
                  <Text style={styles.emptyText}>
                    Ainda não há papéis sugeridos.
                  </Text>
                )}
              </View>

              <View style={styles.section}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => router.push("/rotas")}
                >
                  <Text style={styles.primaryButtonText}>Próximos passos</Text>
                </TouchableOpacity>
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
    marginBottom: 24,
  },
  contentCard: {
    borderRadius: 32,
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#E5E7EB",
    textAlign: "center",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E5E7EB",
    marginBottom: 12,
    textAlign: "center",
  },
  sectionTitleCentered: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E5E7EB",
    marginBottom: 16,
    textAlign: "center",
  },
  chipList: {
    gap: 12,
  },
  chip: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "rgba(236, 239, 255, 0.95)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 13,
    color: "#E5E7EB",
    textAlign: "center",
  },
  experienceText: {
    fontSize: 13,
    color: "#E5E7EB",
    textAlign: "center",
  },
  primaryButton: {
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 24,
    backgroundColor: "#6C8CFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  loadingWrapper: {
    paddingVertical: 40,
    alignItems: "center",
  },
});
