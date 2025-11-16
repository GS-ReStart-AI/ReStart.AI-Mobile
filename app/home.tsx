import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { useBackground } from "../src/context/BackgroundContext";

export default function HomeApp() {
  const { background } = useBackground();

  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(30)).current;
  const submitScale = useRef(new Animated.Value(1)).current;

  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(cardTranslateY, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
    ]).start();
  }, [cardOpacity, cardTranslateY]);

  async function handlePickPdf() {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      setSelectedFileName(file.name ?? "Currículo selecionado");
    }
  }

  function handleSubmit() {
    if (isSubmitting) return;

    if (!selectedFileName && !resumeText.trim()) {
      Alert.alert(
        "Dados incompletos",
        "Selecione um PDF ou cole o texto do seu currículo antes de enviar."
      );
      return;
    }

    setIsSubmitting(true);

    Animated.sequence([
      Animated.timing(submitScale, {
        toValue: 0.95,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(submitScale, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push("/homeLoading");
    });
  }

  return (
    <LinearGradient colors={background.colors} style={styles.container}>
      <View style={styles.headerMenuRow}>
        <View style={styles.menuIcon}>
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
        </View>
      </View>

      <Text style={styles.headerTitle}>Passaporte de Talentos</Text>

      <Animated.View
        style={[
          styles.cardWrapper,
          {
            opacity: cardOpacity,
            transform: [{ translateY: cardTranslateY }],
          },
        ]}
      >
        <LinearGradient colors={["#a3cbff", "#c8d6f0"]} style={styles.panel}>
          <ScrollView
            contentContainerStyle={styles.panelScroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.panelText}>
              Envie seu currículo para montarmos{"\n"}
              um plano de migração de area
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.curriculoButton}
              onPress={handlePickPdf}
            >
              <Text style={styles.curriculoButtonText}>Currículo</Text>
            </TouchableOpacity>

            <Text style={styles.curriculoHint}>
              PDF com texto, até 2 MB (Máximo duas páginas)
            </Text>

            {selectedFileName && (
              <View style={styles.selectedFileBadge}>
                <View style={styles.selectedFileLeft}>
                  <View style={styles.selectedFileIconCircle}>
                    <Text style={styles.selectedFileIconText}>✓</Text>
                  </View>
                  <View style={styles.selectedFileTextColumn}>
                    <Text style={styles.selectedFileBadgeTitle}>
                      PDF adicionado
                    </Text>
                    <Text
                      style={styles.selectedFileText}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {selectedFileName}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <Text style={styles.ouText}>Ou</Text>

            <View style={styles.textAreaCard}>
              <Text style={styles.textAreaLabel}>
                Cole o texto do{"\n"}seu currículo
              </Text>

              <TextInput
                style={styles.textAreaInput}
                multiline
                value={resumeText}
                onChangeText={setResumeText}
                placeholder="Digite ou cole seu currículo aqui"
                placeholderTextColor="#7c8aa3"
                textAlignVertical="top"
              />
            </View>

            <Text style={styles.limitText}>
              Limite de 10.000 caracteres (UTF-8)
            </Text>

            <Animated.View
              style={{
                width: "100%",
                transform: [{ scale: submitScale }],
              }}
            >
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isSubmitting && styles.submitButtonDisabled,
                ]}
                activeOpacity={0.9}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? "Enviando..." : "Enviar currículo"}
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
    paddingTop: 40,
    paddingBottom: 24,
    alignItems: "center",
  },
  headerMenuRow: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  menuIcon: {
    width: 22,
    alignItems: "flex-end",
    gap: 3,
  },
  menuLine: {
    width: 18,
    height: 2,
    borderRadius: 999,
    backgroundColor: "#000",
  },
  headerTitle: {
    width: "90%",
    marginTop: 62,
    marginBottom: 16,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  cardWrapper: {
    width: "90%",
    flexGrow: 1,
    justifyContent: "center",
  },
  panel: {
    borderRadius: 32,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 90,
  },
  panelScroll: {
    paddingHorizontal: 4,
    paddingBottom: 16,
    alignItems: "center",
  },
  panelText: {
    color: "#0f1b3c",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  curriculoButton: {
    paddingVertical: 11,
    paddingHorizontal: 50,
    borderRadius: 999,
    backgroundColor: "#dfe9fb",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  curriculoButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#223163",
  },
  curriculoHint: {
    marginTop: 8,
    fontSize: 10,
    textAlign: "center",
    color: "#475a8a",
  },
  selectedFileBadge: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#223163",
    alignItems: "center",
    alignSelf: "center",
  },
  selectedFileLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedFileIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#8ad0ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  selectedFileIconText: {
    color: "#0f1b3c",
    fontSize: 14,
    fontWeight: "bold",
  },
  selectedFileTextColumn: {
    maxWidth: 220,
  },
  selectedFileBadgeTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 1,
  },
  selectedFileText: {
    fontSize: 10,
    color: "#dfe9fb",
  },
  ouText: {
    marginTop: 18,
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f1b3c",
  },
  textAreaCard: {
    width: "100%",
    marginTop: 12,
    borderRadius: 24,
    backgroundColor: "#cddcff",
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  textAreaLabel: {
    fontSize: 16,
    textAlign: "center",
    color: "#223163",
    marginBottom: 12,
  },
  textAreaInput: {
    width: "100%",
    height: 140,
    maxHeight: 160,
    borderRadius: 16,
    backgroundColor: "#dfe9fb",
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#c2d4f5",
  },
  limitText: {
    marginTop: 16,
    fontSize: 10,
    color: "#0f1b3c",
    textAlign: "center",
  },
  submitButton: {
    marginTop: 20,
    width: "100%",
    paddingVertical: 16,
    borderRadius: 999,
    backgroundColor: "#000000",
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
