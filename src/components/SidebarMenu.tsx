import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppLogo from "./AppLogo";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ isOpen, onClose }) => {
  const slideAnim = React.useRef(new Animated.Value(300)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen]);

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <TouchableOpacity 
            style={{ flex: 1 }} 
            onPress={onClose}
            activeOpacity={1}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.sidebar,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="close" size={32} color="#000" />
          </TouchableOpacity>

          <View style={styles.logoWrapper}>
            <AppLogo />
          </View>

          <View style={styles.divider} />

          <Text style={styles.item}>Início</Text>
          <Text style={styles.item}>Resumo</Text>
          <Text style={styles.item}>Rotas</Text>
          <Text style={styles.item}>Perfil</Text>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  sidebar: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 280,
    height: "100%",
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
    zIndex: 30,
    elevation: 30,
  },

  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 40,
    elevation: 40,
    padding: 10,
  },

  logoWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },

  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#ccc",
    marginBottom: 20,
  },

  item: {
    fontSize: 18,
    paddingVertical: 15,
  },
});

export default SidebarMenu;