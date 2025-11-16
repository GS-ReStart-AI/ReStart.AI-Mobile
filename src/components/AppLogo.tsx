import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, ViewStyle } from "react-native";

type AppLogoProps = {
    style?: ViewStyle;
};

export default function AppLogo({ style }: AppLogoProps) {
    const scale = useRef(new Animated.Value(0.8)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(-8)).current;

useEffect(() => {
    Animated.sequence([
    Animated.parallel([
    Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        }),
    Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        }),
]),
    Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 7,
        tension: 80,
}),
]).start();
}, [opacity, scale, translateY]);

return (
    <Animated.View
    style={[
        styles.logoWrapper,
        style,
        {
        opacity,
        transform: [{ scale }, { translateY }],
},
]}
>
<Image
    source={require("../../assets/img/ReStart.Ai.png")}
    style={styles.logo}
    />
    </Animated.View>
);
}

const styles = StyleSheet.create({
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
});
