import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useBackground } from "../src/context/BackgroundContext";
import AppLogo from "../src/components/AppLogo";
import { api } from "../src/services/api";

export default function Cadastro() {
  const { background } = useBackground();
  const router = useRouter();

  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(40)).current;
  const buttonTranslateY = useRef(new Animated.Value(20)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  const [nomeCompleto, setNomeCompleto] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(cardTranslateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
      ]),
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(buttonTranslateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [cardOpacity, cardTranslateY, buttonOpacity, buttonTranslateY]);

  function handleGoToLogin() {
    router.push("/login");
  }

  function parseDateToIso(date: string): string | null {
    const parts = date.split("/");
    if (parts.length !== 3) return null;
    const [dia, mes, ano] = parts;
    if (!dia || !mes || !ano) return null;
    return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
  }

  function handleNomeChange(text: string) {
    const semNumeros = text.replace(/[0-9]/g, "");
    setNomeCompleto(semNumeros);
  }

  function handleCpfChange(text: string) {
    const digits = text.replace(/\D/g, "").slice(0, 11);

    let valor = digits;
    if (valor.length > 3) {
      valor = valor.replace(/^(\d{3})(\d)/, "$1.$2");
    }
    if (valor.length > 7) {
      valor = valor.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    }
    if (valor.length > 11) {
      valor = valor.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
    } else if (valor.length > 11 - 2) {
      valor = valor.replace(
        /^(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})?$/,
        (_m, a, b, c, d) => (d ? `${a}.${b}.${c}-${d}` : `${a}.${b}.${c}`)
      );
    }

    setCpf(valor);
  }

  function handleDataChange(text: string) {
    const digits = text.replace(/\D/g, "").slice(0, 8);

    let valor = digits;
    if (valor.length > 2) {
      valor = valor.replace(/^(\d{2})(\d)/, "$1/$2");
    }
    if (valor.length > 5) {
      valor = valor.replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
    }

    setDataNascimento(valor);
  }

  function isEmailValido(value: string) {
    const trimmed = value.trim();
    if (!trimmed.includes("@")) return false;
    if (!trimmed.includes(".")) return false;
    if (trimmed.startsWith("@") || trimmed.endsWith("@")) return false;
    return true;
  }

  async function handleAccess() {
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
    if (!email.trim() || !isEmailValido(email)) {
      Alert.alert("Atenção", "Informe um email válido.");
      return;
    }
    if (!senha.trim() || senha.length < 6) {
      Alert.alert("Atenção", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    const cpfSomenteNumeros = cpf.replace(/\D/g, "");
    const dataIso = parseDateToIso(dataNascimento);

    setIsSubmitting(true);
    try {
      await api.post("/api/Auth/signup", {
      nomeCompleto: nomeCompleto.trim(),
      cpf: cpfSomenteNumeros,
      dataNascimento: dataIso,
      email: email.trim(),
      senha: senha,
      });

      Alert.alert("Sucesso", "Cadastro realizado com sucesso!", [
        {
          text: "OK",
          onPress: () => router.push("/home"),
        },
      ]);
    } catch (error: any) {
      const status = error?.response?.status;
      const mensagemBackend =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        null;

      if (status === 400 && mensagemBackend) {
        Alert.alert("Erro de validação", mensagemBackend);
      } else if (status === 401 || status === 403) {
        Alert.alert(
          "Acesso negado",
          "Falha na autenticação da API. Verifique a API key."
        );
      } else {
        Alert.alert(
          "Erro",
          "Não foi possível realizar o cadastro. Tente novamente."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <LinearGradient colors={background.colors} style={styles.container}>
      <Animated.View
        style={[
          styles.cardWrapper,
          {
            opacity: cardOpacity,
            transform: [{ translateY: cardTranslateY }],
          },
        ]}
      >
        <LinearGradient colors={["#a3cbff", "#c8d6f0"]} style={styles.card}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <AppLogo />

            <Text style={styles.formTitle}>Cadastro</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nome completo:</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu nome completo"
                placeholderTextColor="#7c8aa3"
                value={nomeCompleto}
                onChangeText={handleNomeChange}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>CPF:</Text>
              <TextInput
                style={styles.input}
                placeholder="000.000.000-00"
                keyboardType="numeric"
                placeholderTextColor="#7c8aa3"
                value={cpf}
                onChangeText={handleCpfChange}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Data de nascimento</Text>
              <TextInput
                style={styles.input}
                placeholder="dd/mm/aaaa"
                placeholderTextColor="#7c8aa3"
                value={dataNascimento}
                onChangeText={handleDataChange}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={styles.input}
                placeholder="seuemail@exemplo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#7c8aa3"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Senha:</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Digite sua senha"
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#7c8aa3"
                  value={senha}
                  onChangeText={setSenha}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword((prev) => !prev)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#4b5563"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={handleGoToLogin}>
              <Text style={styles.loginText}>
                Já possui conta? Fazer login
              </Text>
            </TouchableOpacity>

            <Animated.View
              style={{
                width: "100%",
                opacity: buttonOpacity,
                transform: [{ translateY: buttonTranslateY }],
              }}
            >
              <TouchableOpacity
                style={[styles.button, isSubmitting && { opacity: 0.7 }]}
                onPress={handleAccess}
                disabled={isSubmitting}
              >
                <Text style={styles.buttonText}>
                  {isSubmitting ? "Enviando..." : "Acessar"}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </LinearGradient>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardWrapper: {
    width: "90%",
    borderRadius: 32,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  card: {
    borderRadius: 32,
  },
  scrollContent: {
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    height: 46,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: "#dfe9fb",
    borderWidth: 1,
    borderColor: "#c2d4f5",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  passwordWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  passwordInput: {
    paddingRight: 44,
  },
  eyeButton: {
    position: "absolute",
    right: 14,
    height: 46,
    justifyContent: "center",
  },
  loginText: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    width: "100%",
    paddingVertical: 16,
    borderRadius: 999,
    backgroundColor: "#000000",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
