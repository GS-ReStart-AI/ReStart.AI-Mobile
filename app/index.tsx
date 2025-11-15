import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GirlComputer } from "../src/components/GirlComputer";
import { useBackground } from "../src/context/BackgroundContext";

export default function Home() {
  const { background } = useBackground();

  return (
    <LinearGradient colors={background.colors} style={styles.container}>
      <LinearGradient
        colors={["#a3cbff", "#c8d6f0"]}
        style={styles.card}
      >
        <Image
          source={require("../assets/img/ReStart.Ai.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>ReStart.AI</Text>

        <Text style={styles.subtitle}>
          Com a chegada da IA, empregos nascem e desaparecem. O desafio agora é
          realocar pessoas nesse novo mercado de trabalho.
        </Text>

        <View style={styles.illustrationWrapper}>
          <GirlComputer width="100%" height="100%" />
        </View>

        <Text style={styles.footerText}>
          A ReStart.AI é o caminho das pessoas nesse novo mercado.
        </Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Iniciar</Text>
        </TouchableOpacity>
      </LinearGradient>
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
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  illustrationWrapper: {
    width: "100%",
    height: 220,
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
