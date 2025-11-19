import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SidebarMenu from "./SidebarMenu";

interface MenuControllerProps {
  children: React.ReactNode;
}

export default function MenuController({ children }: MenuControllerProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.menuFloatingButton}
        onPress={() => setMenuOpen(true)}
      >
        <MaterialCommunityIcons name="menu" size={28} color="#050B24" />
      </TouchableOpacity>

      <View style={styles.content}>
        {children}
      </View>

      <SidebarMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "transparent",
  },

  menuFloatingButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 50,
  },

  content: {
    flex: 1,
  },
});
