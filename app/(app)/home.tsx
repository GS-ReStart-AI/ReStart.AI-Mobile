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
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useBackground } from "../../src/context/BackgroundContext";
import AppLogo from "../../src/components/AppLogo";
import MenuController from "../../src/components/MenuController";
import { api } from "../../src/services/api";
import { useAuth } from "../_layout";

export default function HomeApp() {
  const { background } = useBackground();
  const params = useLocalSearchParams();
  const router = useRouter();
  const { auth, isLoadingAuth } = useAuth();

  const usuarioIdParam = params.usuarioId as string | undefined;
  const usuarioId =
    (auth?.usuarioId ? String(auth.usuarioId) : undefined) ||
    (usuarioIdParam && usuarioIdParam.length > 0 ? usuarioIdParam : undefined);

  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(30)).current;
  const submitScale = useRef(new Animated.Value(1)).current;
  const spinnerRotation = useRef(new Animated.Value(0)).current;

  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<any | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslateY, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinnerRotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  useEffect(() => {
    if (!isLoadingAuth && !usuarioId) {
      Alert.alert("Sessão expirada", "Faça login novamente.", [
        {
          text: "OK",
          onPress: () => router.replace("/login"),
        },
      ]);
    }
  }, [isLoadingAuth, usuarioId, router]);

  const handlePickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: false,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      setSelectedFileName(file.name);
      setSelectedFile(file);
      if (!resumeText) {
        setResumeText("");
      }
    }
  };

  const handleSubmit = async () => {
    if (!usuarioId) {
      Alert.alert(
        "Erro",
        "Não foi possível identificar o usuário. Faça login novamente."
      );
      return;
    }

    if (!selectedFileName && !resumeText.trim()) {
      Alert.alert("Atenção", "Envie um PDF ou cole o texto do seu currículo.");
      return;
    }

    Animated.sequence([
      Animated.timing(submitScale, {
        toValue: 0.96,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(submitScale, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();

    setIsSubmitting(true);

    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", {
          uri: selectedFile.uri,
          name: selectedFile.name || "curriculo.pdf",
          type: selectedFile.mimeType || "application/pdf",
        } as any);
        formData.append("usuarioId", usuarioId);

        await api.post("/api/v1/curriculo/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        const payload = {
          usuarioId: usuarioId,
          nomeArquivo: "curriculo",
          texto: resumeText.trim(),
          skills: [] as string[],
        };

        await api.post("/api/v1/curriculos", payload);
      }

      router.push({ pathname: "/resumo", params: { usuarioId } });
    } catch (err: any) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      const backendMessage =
        typeof data === "string"
          ? data
          : data?.message || data?.error || null;

      const textoStatus = status ? `Erro ${status}. ` : "";
      const textoBackend = backendMessage
        ? String(backendMessage)
        : "Não conseguimos enviar seu currículo agora. Tente novamente em alguns minutos.";

      Alert.alert("Erro", textoStatus + textoBackend);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderForm = () => (
    <View style={styles.formCard}>
      <Text style={styles.subtitle}>
        Envie seu currículo para montarmos um plano de migração de area
      </Text>

      <View style={styles.section}>
        <TouchableOpacity style={styles.uploadButton} onPress={handlePickFile}>
          <Text style={styles.uploadButtonText}>Currículo</Text>
        </TouchableOpacity>
        <Text style={styles.helperText}>
          PDF com texto, até 2 MB (Máximo duas páginas)
        </Text>

        {selectedFileName && (
          <View style={styles.fileInfoContainer}>
            <View style={styles.fileBadge}>
              <Text style={styles.fileBadgeIcon}>✔</Text>
            </View>
            <View style={styles.fileTextWrapper}>
              <Text style={styles.fileTitle}>PDF adicionado</Text>
              <Text style={styles.fileName}>{selectedFileName}</Text>
            </View>
          </View>
        )}
      </View>

      <Text style={styles.orText}>Ou</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cole o texto do seu currículo</Text>
        <View style={styles.textAreaWrapper}>
          <TextInput
            style={styles.textArea}
            placeholder="Digite ou cole seu currículo aqui"
            placeholderTextColor="#9BA4C1"
            multiline
            value={resumeText}
            onChangeText={setResumeText}
            textAlignVertical="top"
          />
        </View>
        <Text style={styles.helperText}>
          Limite de 10.000 caracteres (UTF-8)
        </Text>
      </View>

      <Animated.View style={{ transform: [{ scale: submitScale }] }}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Enviar currículo</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );

  const renderLoading = () => {
    const spin = spinnerRotation.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });

    return (
      <View style={styles.loadingCard}>
        <Text style={styles.loadingTopText}>
          Calma, estamos analisando seu currículo...
        </Text>

        <View style={styles.loadingIndicatorWrapper}>
          <Animated.View
            style={[
              styles.spinnerOuter,
              {
                transform: [{ rotate: spin }],
              },
            ]}
          />
        </View>

        <Text style={styles.loadingBottomText}>Lendo as informações...</Text>
      </View>
    );
  };

  return (
    <MenuController>
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient colors={background.colors} style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={[
                styles.animatedWrapper,
                {
                  opacity: cardOpacity,
                  transform: [{ translateY: cardTranslateY }],
                },
              ]}
            >
              <View style={styles.blockWrapper}>
                <AppLogo />
                <Text style={styles.titleCentered}>Passaporte de Talentos</Text>
                {isSubmitting ? renderLoading() : renderForm()}
              </View>
            </Animated.View>
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
  animatedWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  blockWrapper: {
    width: "100%",
  },
  titleCentered: {
    fontSize: 24,
    fontWeight: "700",
    color: "#050B24",
    textAlign: "center",
    marginBottom: 24,
    padding: 20,
  },
  formCard: {
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingVertical: 28,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#050B24",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  uploadButton: {
    alignSelf: "center",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    marginBottom: 8,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#050B24",
  },
  helperText: {
    fontSize: 11,
    textAlign: "center",
    color: "#050B24",
    opacity: 0.8,
  },
  fileInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
  },
  fileBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#60A5FA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  fileBadgeIcon: {
    color: "#60A5FA",
    fontSize: 16,
  },
  fileTextWrapper: {
    flex: 1,
  },
  fileTitle: {
    color: "#E5E7EB",
    fontSize: 13,
    fontWeight: "600",
  },
  fileName: {
    color: "#D1D5DB",
    fontSize: 12,
  },
  orText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#050B24",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#050B24",
    marginBottom: 8,
    textAlign: "center",
  },
  textAreaWrapper: {
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 12,
  },
  textArea: {
    minHeight: 140,
    fontSize: 14,
    color: "#050B24",
  },
  submitButton: {
    marginTop: 12,
    borderRadius: 999,
    backgroundColor: "#000000",
    paddingVertical: 16,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  loadingCard: {
    borderRadius: 32,
    paddingVertical: 40,
    paddingHorizontal: 24,
    backgroundColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
  },
  loadingTopText: {
    fontSize: 15,
    color: "#050B24",
    marginBottom: 24,
    textAlign: "center",
  },
  loadingIndicatorWrapper: {
    marginBottom: 24,
  },
  loadingBottomText: {
    fontSize: 14,
    color: "#050B24",
    textAlign: "center",
  },
  spinnerOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 7,
    borderColor: "rgba(245,245,255,0.7)",
    borderTopColor: "#a855f7",
  },
});
