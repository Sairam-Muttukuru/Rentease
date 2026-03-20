import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("theme") || "light";
        }
        return "light";
    });

    useEffect(() => {
        const root = document.documentElement;
        const body = document.body;

        if (theme === "dark") {
            root.classList.add("dark");
            body.style.backgroundColor = "#020617";
            body.style.color = "#f8fafc";
        } else {
            root.classList.remove("dark");
            body.style.backgroundColor = "#ffffff";
            body.style.color = "#0f172a";
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
