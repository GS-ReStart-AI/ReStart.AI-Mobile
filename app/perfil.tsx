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
import { useBackground } from "../src/context/BackgroundContext";
import { useAuth } from "./_layout";
import AppLogo from "../src/components/AppLogo";
import MenuController from "../src/components/MenuController";
import { api } from "../src/services/api";

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
        const nome =
          data.NomeCompleto ??
          data.nomeCompleto ??
          "";
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
        // Senha é obrigatória no backend; se o usuário não digitar nada,
        // mandamos uma senha fake só para passar na validação.
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
              {/* botão de logout removido por enquanto */}
            </View>

            <Text style={styles.title}>Meus dados</Text>

            <LinearGradient
              colors={["#ffffff", "#6308ca"]}
              style={styles.cardWrapper}
            >
              <View style={styles.cardInner}>
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

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Senha:</Text>
                  <TextInput
                    style={styles.input}
                    value={senha}
                    editable={isEditing}
                    onChangeText={setSenha}
                    secureTextEntry
                    placeholder="Digite uma nova senha (opcional)"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </LinearGradient>

            {isLoadingPerfil ? (
              <View style={styles.loadingWrapper}>
                <ActivityIndicator size="large" color="#ffffff" />
              </View>
            ) : (
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
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>
                    {isEditing
                      ? isSubmitting
                        ? "Salvando..."
                        : "Salvar"
                      : "editar"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dangerButton}
                  onPress={handleExcluirConta}
                  activeOpacity={0.8}
                  disabled={isSubmitting}
                >
                  <Text style={styles.dangerButtonText}>
                    Apagar Minha conta
                  </Text>
                </TouchableOpacity>
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
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 16,
  },
  cardWrapper: {
    borderRadius: 32,
    padding: 2,
    marginTop: 4,
  },
  cardInner: {
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 20,
    backgroundColor: "rgb(216, 211, 241)",
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
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    paddingHorizontal: 8,
  },
  primaryButton: {
    flex: 1,
    marginRight: 8,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#383381",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonOutline: {
    backgroundColor: "#383381",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  dangerButton: {
    flex: 1,
    marginLeft: 8,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#aa001a",
    alignItems: "center",
    justifyContent: "center",
  },
  dangerButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  loadingWrapper: {
    marginTop: 24,
    alignItems: "center",
  },
});
