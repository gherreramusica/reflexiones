'use client'

// context/ModulesContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModulesContextType {
  modules: string[];
  addModule: (moduleName: string) => void;
  removeModule: (moduleName: string) => void;
}

const ModulesContext = createContext<ModulesContextType | undefined>(undefined);

export const ModulesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modules, setModules] = useState<string[]>(['Versiculos']);

  const addModule = (moduleName: string) => {
    setModules([...modules, moduleName]);
  };

  const removeModule = (moduleName: string) => {
    setModules(modules.filter(module => module !== moduleName));
  };

  return (
    <ModulesContext.Provider value={{ modules, addModule, removeModule }}>
      {children}
    </ModulesContext.Provider>
  );
};

export const useModules = () => {
  const context = useContext(ModulesContext);
  if (!context) {
    throw new Error('useModules must be used within a ModulesProvider');
  }
  return context;
};
