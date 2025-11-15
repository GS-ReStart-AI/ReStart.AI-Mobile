import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { GirlComputer } from "../src/components/GirlComputer";
import { useBackground } from "../src/context/BackgroundContext";

export default function Home() {
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

  function handleStart() {
    router.push("/cadastro");
  }

  return (
    <LinearGradient colors={background.colors} style={styles.container}>
      <Animated.View
        style={{
          width: "100%",
          alignItems: "center",
          opacity: cardOpacity,
          transform: [{ translateY: cardTranslateY }],
        }}
      >
        <LinearGradient
          colors={["#a3cbff", "#c8d6f0"]}
          style={styles.card}
        >
          <Animated.View
            style={{
              transform: [{ scale: logoScale }],
            }}
          >
            <Image
              source={require("../assets/img/ReStart.Ai.png")}
              style={styles.logo}
            />
          </Animated.View>

          <Text style={styles.title}>ReStart.AI</Text>

          <Text style={styles.subtitle}>
            Com a chegada da IA, empregos nascem e desaparecem. O desafio agora
            é realocar pessoas nesse novo mercado de trabalho.
          </Text>

          <View style={styles.illustrationWrapper}>
            <GirlComputer width="100%" height="100%" />
          </View>

          <Text style={styles.footerText}>
            A ReStart.AI é o caminho das pessoas nesse novo mercado.
          </Text>

          <Animated.View
            style={{
              width: "100%",
              opacity: buttonOpacity,
              transform: [{ translateY: buttonTranslateY }],
            }}
          >
            <TouchableOpacity style={styles.button} onPress={handleStart}>
              <Text style={styles.buttonText}>Iniciar</Text>
            </TouchableOpacity>
          </Animated.View>
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
  card: {
    width: "90%",
    borderRadius: 32,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: -23,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
  },
  illustrationWrapper: {
    width: "100%",
    height: 220,
    marginTop: 16,
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
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
