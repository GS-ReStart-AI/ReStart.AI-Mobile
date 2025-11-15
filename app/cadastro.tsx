import React, { useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    Animated,
    Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useBackground } from "../src/context/BackgroundContext";

export default function Cadastro() {
  const { background } = useBackground();
  const router = useRouter();

  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(40)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const buttonTranslateY = useRef(new Animated.Value(20)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

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

  function handleGoToLogin() {
    router.back();
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
        <LinearGradient
          colors={["#a3cbff", "#c8d6f0"]}
          style={styles.card}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={[
                styles.logoWrapper,
                { transform: [{ scale: logoScale }] },
              ]}
            >
              <Image
                source={require("../assets/img/ReStart.Ai.png")}
                style={styles.logo}
              />
            </Animated.View>

            <Text style={styles.formTitle}>Cadastro</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nome completo:</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu nome completo"
                placeholderTextColor="#7c8aa3"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>CPF:</Text>
              <TextInput
                style={styles.input}
                placeholder="000.000.000-00"
                keyboardType="numeric"
                placeholderTextColor="#7c8aa3"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Data de nascimento</Text>
              <TextInput
                style={styles.input}
                placeholder="dd/mm/aaaa"
                placeholderTextColor="#7c8aa3"
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
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Senha:</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                secureTextEntry
                placeholderTextColor="#7c8aa3"
              />
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
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Acessar</Text>
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
  logoWrapper: {
    alignItems: "center",
    marginBottom: -8,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: -23,
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
