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
import { LinearGradient } from "expo-linear-gradient";
import AppLogo from "./AppLogo";
import { useRouter } from "expo-router";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ isOpen, onClose }) => {
  const slideAnim = React.useRef(new Animated.Value(300)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const router = useRouter();

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
  }, [isOpen, slideAnim, fadeAnim]);

  const handleNavigate = (path: string) => {
    onClose();
    router.push(path);
  };

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
          <LinearGradient
            colors={["#d6c7ff", "#b6d4ff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.sidebarGradient}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="close" size={28} color="#000" />
            </TouchableOpacity>

            <View style={styles.logoWrapper}>
              <AppLogo />
            </View>

            <View style={styles.divider} />

            <View style={styles.menu}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleNavigate("/home")}
                style={styles.menuItem}
              >
                <MaterialCommunityIcons
                  name="home-outline"
                  size={22}
                  color="#000"
                  style={styles.menuIcon}
                />
                <Text style={styles.itemText}>Inicio</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleNavigate("/resumo")}
                style={styles.menuItem}
              >
                <MaterialCommunityIcons
                  name="file-document-outline"
                  size={22}
                  color="#000"
                  style={styles.menuIcon}
                />
                <Text style={styles.itemText}>Resumo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleNavigate("/rotas")}
                style={styles.menuItem}
              >
                <MaterialCommunityIcons
                  name="chat-outline"
                  size={22}
                  color="#000"
                  style={styles.menuIcon}
                />
                <Text style={styles.itemText}>Rotas</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleNavigate("/perfil")}
                style={styles.menuItem}
              >
                <MaterialCommunityIcons
                  name="account-outline"
                  size={22}
                  color="#000"
                  style={styles.menuIcon}
                />
                <Text style={styles.itemText}>Perfil</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleNavigate("/sobre")}
                style={styles.menuItem}
              >
                <MaterialCommunityIcons
                  name="information-outline"
                  size={22}
                  color="#000"
                  style={styles.menuIcon}
                />
                <Text style={styles.itemText}>Sobre o app</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
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
    height: "100%",
    width: 280,
    paddingVertical: 12,
    paddingLeft: 8,
  },
  sidebarGradient: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderBottomLeftRadius: 32,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 8,
  },
  logoWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.7)",
    marginBottom: 20,
  },
  menu: {
    gap: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  menuIcon: {
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
    color: "#000",
  },
});

export default SidebarMenu;
