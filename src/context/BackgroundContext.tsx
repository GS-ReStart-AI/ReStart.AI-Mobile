import React, { createContext, useContext } from "react";

type BackgroundConfig = {
  colors: [string, string];
};

const defaultBackground: BackgroundConfig = {
  colors: ["#d4bbfd", "#73c1ee"],
};

type BackgroundContextValue = {
  background: BackgroundConfig;
};

const BackgroundContext = createContext<BackgroundContextValue>({
  background: defaultBackground,
});

type BackgroundProviderProps = {
  children: React.ReactNode;
};

export function BackgroundProvider({ children }: BackgroundProviderProps) {
  return (
    <BackgroundContext.Provider value={{ background: defaultBackground }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  return useContext(BackgroundContext);
}
