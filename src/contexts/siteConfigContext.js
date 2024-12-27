"use client";

import { createContext, useContext } from "react";

export const SiteConfigContext = createContext();

export const SiteConfigProvider = ({ config, children }) => {
  return (
    <SiteConfigContext.Provider value={config}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => useContext(SiteConfigContext);
