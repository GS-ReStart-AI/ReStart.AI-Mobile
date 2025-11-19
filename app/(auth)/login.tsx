import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useBackground } from "../../src/context/BackgroundContext";
import AppLogo from "../../src/components/AppLogo";
import { api } from "../../src/services/api";
import { useAuth } from "../_layout";

export default function Login() {
  const { background } = useBackground();
  const router = useRouter();
  const { setAuthData } = useAuth();

  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(40)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const buttonTranslateY = useRef(new Animated.Value(20)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

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
      Animated.spring(logoScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 7,
        tension: 80,
      }),
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
  }, [cardOpacity, cardTranslateY, logoScale, buttonOpacity, buttonTranslateY]);

  function handleGoToCadastro() {
    router.push("/cadastro");
  }

  function isEmailValido(value: string) {
    const trimmed = value.trim();
    if (!trimmed.includes("@")) return false;
    if (!trimmed.includes(".")) return false;
    if (trimmed.startsWith("@") || trimmed.endsWith("@")) return false;
    return true;
  }

  async function handleLogin() {
    if (!email.trim() || !isEmailValido(email)) {
      Alert.alert("Atenção", "Informe um email válido.");
      return;
    }

    if (!senha.trim()) {
      Alert.alert("Atenção", "Informe sua senha.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/api/Auth/login", {
        email: email.trim(),
        senha,
      });

      const token = response.data?.token ?? response.data?.Token;
      const expiresAt = response.data?.expiresAt ?? response.data?.ExpiresAt;
      const usuarioId =
        response.data?.usuarioId ?? response.data?.UsuarioId ?? null;

      if (!usuarioId) {
        Alert.alert(
          "Erro",
          "Não foi possível identificar o usuário. Tente novamente."
        );
        return;
      }

      await setAuthData({
        usuarioId,
        token: token ?? "",
        expiresAt: expiresAt ?? "",
      });

      Alert.alert("Bem-vindo(a)", "Login realizado com sucesso!", [
        {
          text: "OK",
          onPress: () =>
            router.push({ pathname: "/home", params: { usuarioId } }),
        },
      ]);
    } catch (error: any) {
      const status = error?.response?.status;

      if (status === 401) {
        Alert.alert("Credenciais inválidas", "Email ou senha incorretos.");
      } else {
        Alert.alert(
          "Erro",
          "Não foi possível realizar o login. Tente novamente."
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
          <View style={styles.content}>
            <Animated.View
              style={[
                styles.logoWrapper,
                { transform: [{ scale: logoScale }] },
              ]}
            >
              <AppLogo />
            </Animated.View>

            <Text style={styles.formTitle}>Login</Text>

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

            <TouchableOpacity onPress={handleGoToCadastro}>
              <Text style={styles.registerText}>
                Não possui conta? Se cadastre-se
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
                onPress={handleLogin}
                disabled={isSubmitting}
              >
                <Text style={styles.buttonText}>
                  {isSubmitting ? "Entrando..." : "Acessar"}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
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
  content: {
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  logoWrapper: {
    alignItems: "center",
    marginBottom: -8,
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
  registerText: {
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
