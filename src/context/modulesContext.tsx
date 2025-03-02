'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ModulesContextType {
  modules: string[];
  addModule: (moduleName: string) => void;
  removeModule: (moduleName: string) => void;
}

const ModulesContext = createContext<ModulesContextType | undefined>(undefined);

export const ModulesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modules, setModules] = useState<string[]>([]);

  // ✅ Load from localStorage on mount
  useEffect(() => {
    const savedModules = localStorage.getItem('modules');
    if (savedModules) {
      setModules(JSON.parse(savedModules));
    } else {
      setModules(['Versiculos']); // Default modules
    }
  }, []);

  // ✅ Save to localStorage on state change
  useEffect(() => {
    localStorage.setItem('modules', JSON.stringify(modules));
  }, [modules]);

  const addModule = (moduleName: string) => {
    setModules((prev) => {
      if (!prev.includes(moduleName)) {
        return [...prev, moduleName];
      }
      return prev; // Avoid duplicates
    });
  };

  const removeModule = (moduleName: string) => {
    setModules((prev) => prev.filter((module) => module !== moduleName));
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
