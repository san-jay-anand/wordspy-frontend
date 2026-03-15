// frontend/src/context/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("wordspy_theme") !== "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("wordspy_theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark(d => !d);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}