import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useBackground } from "../../src/context/BackgroundContext";
import { useAuth } from "../_layout";
import AppLogo from "../../src/components/AppLogo";
import MenuController from "../../src/components/MenuController";
import { api } from "../../src/services/api";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

type UsuarioResponse = {
  UsuarioId?: string;
  usuarioId?: string;
  NomeCompleto?: string;
  nomeCompleto?: string;
  Cpf?: string;
  cpf?: string;
  DataNascimento?: string;
  dataNascimento?: string;
  Email?: string;
  email?: string;
};

function formatIsoToBr(iso?: string | null): string {
  if (!iso) return "";
  const value = iso.toString();
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    const parts = value.split("T")[0]?.split("-") ?? [];
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
    }
    return "";
  }
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());
  return `${day}/${month}/${year}`;
}

function parseBrToIso(date: string): string | null {
  const parts = date.split("/");
  if (parts.length !== 3) return null;
  const [dia, mes, ano] = parts;
  if (!dia || !mes || !ano) return null;
  return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
}

function formatCpf(cpf: string): string {
  const digits = cpf.replace(/\D/g, "").slice(0, 11);
  let v = digits;
  if (v.length > 3) v = v.replace(/^(\d{3})(\d)/, "$1.$2");
  if (v.length > 7) v = v.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
  if (v.length > 11) {
    v = v.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
  } else if (v.length > 9) {
    v = v.replace(
      /^(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})?$/,
      (_m, a, b, c, d) => (d ? `${a}.${b}.${c}-${d}` : `${a}.${b}.${c}`)
    );
  }
  return v;
}

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export default function PerfilApp() {
  const { background } = useBackground();
  const router = useRouter();
  const { auth, isLoadingAuth, clearAuthData } = useAuth();

  const usuarioId = auth?.usuarioId ? String(auth.usuarioId) : undefined;

  const [nomeCompleto, setNomeCompleto] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPerfil, setIsLoadingPerfil] = useState(true);

  useEffect(() => {
    const carregarPerfil = async () => {
      if (isLoadingAuth) return;

      if (!usuarioId) {
        Alert.alert(
          "Sessão expirada",
          "Não encontramos seu usuário. Faça login novamente.",
          [
            {
              text: "OK",
              onPress: async () => {
                await clearAuthData();
                router.replace("/login");
              },
            },
          ]
        );
        setIsLoadingPerfil(false);
        return;
      }

      try {
        const response = await api.get<UsuarioResponse>(
          `/api/v1/usuarios/${usuarioId}`
        );

        const data = response.data;
        const nome = data.NomeCompleto ?? data.nomeCompleto ?? "";
        const cpfApi = data.Cpf ?? data.cpf ?? "";
        const dataIso = data.DataNascimento ?? data.dataNascimento ?? "";
        const emailApi = data.Email ?? data.email ?? "";

        setNomeCompleto(nome);
        setCpf(formatCpf(cpfApi));
        setDataNascimento(formatIsoToBr(dataIso));
        setEmail(emailApi);
        setSenha("");
      } catch (error: any) {
        const mensagemBackend =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.response?.data?.mensagem ||
          null;

        if (mensagemBackend) {
          Alert.alert("Erro ao carregar", mensagemBackend);
        } else {
          Alert.alert(
            "Erro",
            "Não foi possível carregar seus dados. Tente novamente em alguns minutos."
          );
        }
      } finally {
        setIsLoadingPerfil(false);
      }
    };

    carregarPerfil();
  }, [usuarioId, isLoadingAuth, router, clearAuthData]);

  function handleCpfChange(text: string) {
    setCpf(formatCpf(text));
  }

  function handleDataChange(text: string) {
    const digits = text.replace(/\D/g, "").slice(0, 8);
    let v = digits;
    if (v.length > 2) v = v.replace(/^(\d{2})(\d)/, "$1/$2");
    if (v.length > 5) v = v.replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
    setDataNascimento(v);
  }

  async function handleSalvar() {
    if (isLoadingPerfil || isLoadingAuth) {
      Alert.alert(
        "Carregando",
        "Ainda estamos carregando seus dados. Aguarde um instante e tente novamente."
      );
      return;
    }

    if (!usuarioId) {
      Alert.alert(
        "Sessão expirada",
        "Faça login novamente para atualizar seus dados."
      );
      return;
    }

    if (!nomeCompleto.trim()) {
      Alert.alert("Atenção", "Informe seu nome completo.");
      return;
    }
    if (!cpf.trim()) {
      Alert.alert("Atenção", "Informe seu CPF.");
      return;
    }
    if (!dataNascimento.trim()) {
      Alert.alert("Atenção", "Informe sua data de nascimento.");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Atenção", "Informe seu email.");
      return;
    }

    const cpfSomenteNumeros = onlyDigits(cpf);
    const dataIso = parseBrToIso(dataNascimento);
    if (!dataIso) {
      Alert.alert("Atenção", "Data de nascimento inválida.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        nomeCompleto: nomeCompleto.trim(),
        cpf: cpfSomenteNumeros,
        dataNascimento: dataIso,
        email: email.trim(),
        senha: senha.trim() || "SenhaPlaceholder123!",
      };

      await api.put(`/api/v1/usuarios/${usuarioId}`, payload);

      Alert.alert("Sucesso", "Dados atualizados com sucesso.");
      setIsEditing(false);
      setSenha("");
    } catch (error: any) {
      const status = error?.response?.status;
      const mensagemBackend =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.mensagem ||
        null;

      if (status === 400 && mensagemBackend) {
        Alert.alert("Erro de validação", mensagemBackend);
      } else if (mensagemBackend) {
        Alert.alert("Erro", mensagemBackend);
      } else {
        Alert.alert(
          "Erro",
          "Não foi possível atualizar seus dados. Tente novamente em alguns minutos."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleExcluirConta() {
    if (!usuarioId) {
      Alert.alert(
        "Sessão expirada",
        "Faça login novamente para gerenciar sua conta."
      );
      return;
    }

    Alert.alert(
      "Apagar conta",
      "Tem certeza que deseja apagar sua conta? Essa ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/api/v1/usuarios/${usuarioId}`);
              await clearAuthData();
              router.replace("/login");
            } catch (error: any) {
              const mensagemBackend =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.response?.data?.mensagem ||
                null;

              if (mensagemBackend) {
                Alert.alert("Erro", mensagemBackend);
              } else {
                Alert.alert(
                  "Erro",
                  "Não foi possível apagar sua conta. Tente novamente em alguns minutos."
                );
              }
            }
          },
        },
      ]
    );
  }

  async function handleLogout() {
    await clearAuthData();
    router.replace("/login");
  }

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

            <Text style={styles.title}>Meus dados</Text>

            <View style={styles.window}>
              <View style={styles.windowHeader}>
                <View style={[styles.windowDot, styles.dotRed]} />
                <View style={[styles.windowDot, styles.dotYellow]} />
                <View style={[styles.windowDot, styles.dotGreen]} />
              </View>

              <View style={styles.windowBody}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Nome completo:</Text>
                  <TextInput
                    style={styles.input}
                    value={nomeCompleto}
                    editable={isEditing}
                    onChangeText={setNomeCompleto}
                    placeholder="Seu nome"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>CPF:</Text>
                  <TextInput
                    style={styles.input}
                    value={cpf}
                    editable={isEditing}
                    onChangeText={handleCpfChange}
                    keyboardType="numeric"
                    placeholder="000.000.000-00"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Data de nascimento</Text>
                  <TextInput
                    style={styles.input}
                    value={dataNascimento}
                    editable={isEditing}
                    onChangeText={handleDataChange}
                    keyboardType="numeric"
                    placeholder="dd/mm/aaaa"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Email:</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    editable={isEditing}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="seuemail@exemplo.com"
                    placeholderTextColor="#808b9e"
                  />
                </View>
              </View>
            </View>

            {isLoadingPerfil ? (
              <View style={styles.loadingWrapper}>
                <ActivityIndicator size="large" color="#E5E7EB" />
              </View>
            ) : (
              <View style={styles.buttonsWrapper}>
                <View style={styles.buttonsRow}>
                  <TouchableOpacity
                    style={[
                      styles.primaryButton,
                      !isEditing && styles.primaryButtonOutline,
                    ]}
                    onPress={() =>
                      isEditing ? handleSalvar() : setIsEditing(true)
                    }
                    disabled={isSubmitting}
                    activeOpacity={0.85}
                  >
                    <View style={styles.buttonContent}>
                      <Feather
                        name={isEditing ? "save" : "edit-3"}
                        size={18}
                        color="#F9FAFB"
                      />
                      <Text style={styles.primaryButtonText}>
                        {isEditing
                          ? isSubmitting
                            ? "Salvando..."
                            : "Salvar"
                          : "Editar"}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.dangerButton}
                    onPress={handleExcluirConta}
                    activeOpacity={0.85}
                    disabled={isSubmitting}
                  >
                    <View style={styles.buttonContent}>
                      <MaterialCommunityIcons
                        name="trash-can-outline"
                        size={18}
                        color="#FEF2F2"
                      />
                      <Text style={styles.dangerButtonText}>
                        Apagar Minha conta
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={handleLogout}
                  activeOpacity={0.85}
                  disabled={isSubmitting}
                >
                  <View style={styles.buttonContent}>
                    <Feather name="log-out" size={18} color="#E5E7EB" />
                    <Text style={styles.logoutButtonText}>Sair da conta</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {isSubmitting && (
              <View style={styles.savingOverlay}>
                <ActivityIndicator size="small" color="#F9FAFB" />
                <Text style={styles.savingText}>Salvando alterações...</Text>
              </View>
            )}
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
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
  window: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 24,
    backgroundColor: "rgba(109, 109, 109, 0)",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.85)",
    marginTop: 12,
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
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderRadius: 18,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  buttonsWrapper: {
    marginTop: 24,
    paddingHorizontal: 8,
    alignItems: "center",
    width: "100%",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 360,
  },
  primaryButton: {
    flex: 1,
    marginRight: 8,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#6366F1",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonOutline: {
    backgroundColor: "#818CF8",
  },
  primaryButtonText: {
    color: "#F9FAFB",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 8,
  },
  dangerButton: {
    flex: 1,
    marginLeft: 8,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#F97373",
    alignItems: "center",
    justifyContent: "center",
  },
  dangerButtonText: {
    color: "#FEF2F2",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
  },
  logoutButton: {
    marginTop: 16,
    width: "60%",
    maxWidth: 260,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButtonText: {
    color: "#E5E7EB",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingWrapper: {
    marginTop: 24,
    alignItems: "center",
  },
  savingOverlay: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  savingText: {
    fontSize: 12,
    color: "#F9FAFB",
  },
});
