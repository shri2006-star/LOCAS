import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { bankingTheme } from '../theme/themeConfig';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const THEME_MODES = {
  LIGHT: { key: 'light', name: 'Daylight Executive', icon: '☀️', bg: '#FFFFFF', accent: '#1769AA', desc: 'Crisp light mode for daylight banking' },
  DARK: { key: 'dark', name: 'Midnight Sapphire', icon: '🌙', bg: '#071628', accent: '#38BDF8', desc: 'Deep sapphire navy dark mode' },
  EYECARE: { key: 'eyecare', name: 'Eye-Care Warm Tint', icon: '👁️', bg: '#F7F3E9', accent: '#D98C00', desc: 'Warm sepia anti-glare mode for document auditing' },
  OLED: { key: 'oled', name: 'OLED High Contrast', icon: '🌌', bg: '#000000', accent: '#00F0FF', desc: 'Ultra-contrast pure black display' },
};

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(() => {
    const saved = localStorage.getItem('locas_atmosphere_mode');
    if (saved && THEME_MODES[saved.toUpperCase()]) return saved;
    const oldDark = localStorage.getItem('locas_theme_mode');
    return oldDark === 'dark' ? 'dark' : 'light';
  });

  const darkMode = themeMode === 'dark' || themeMode === 'oled';

  useEffect(() => {
    localStorage.setItem('locas_atmosphere_mode', themeMode);
    localStorage.setItem('locas_theme_mode', darkMode ? 'dark' : 'light');

    document.body.classList.remove('light-mode', 'dark-mode', 'eyecare-mode', 'oled-mode');
    document.body.classList.add(`${themeMode}-mode`);
  }, [themeMode, darkMode]);

  const switchTheme = (modeKey) => {
    setThemeMode(modeKey);
  };

  const toggleTheme = () => {
    setThemeMode(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'eyecare';
      if (prev === 'eyecare') return 'oled';
      return 'light';
    });
  };

  const modeConfigs = {
    light: {
      algorithm: antdTheme.defaultAlgorithm,
      token: {
        ...bankingTheme.token,
        colorPrimary: '#1769AA',
        colorBgBase: '#F5F7FA',
        colorBgContainer: '#FFFFFF',
        colorBgElevated: '#FFFFFF',
        colorBgLayout: '#F5F7FA',
        colorTextBase: '#0F172A',
        colorText: '#0F172A',
        colorTextHeading: '#0F172A',
        colorTextSecondary: '#475569',
        colorBorder: '#E2E8F0',
      },
    },
    dark: {
      algorithm: antdTheme.darkAlgorithm,
      token: {
        ...bankingTheme.token,
        colorPrimary: '#38BDF8',
        colorBgBase: '#071628',
        colorBgContainer: '#0F2744',
        colorBgElevated: '#133054',
        colorBgLayout: '#071628',
        colorTextBase: '#F8FAFC',
        colorText: '#F8FAFC',
        colorTextHeading: '#FFFFFF',
        colorTextSecondary: '#94A3B8',
        colorBorder: '#1E3A5F',
      },
    },
    eyecare: {
      algorithm: antdTheme.defaultAlgorithm,
      token: {
        ...bankingTheme.token,
        colorPrimary: '#D98C00',
        colorBgBase: '#F7F3E9',
        colorBgContainer: '#FFFDF9',
        colorBgElevated: '#F3EBDD',
        colorBgLayout: '#F7F3E9',
        colorTextBase: '#3D2C1E',
        colorText: '#3D2C1E',
        colorTextHeading: '#3D2C1E',
        colorTextSecondary: '#6E5D4F',
        colorBorder: '#E6D8C3',
      },
    },
    oled: {
      algorithm: antdTheme.darkAlgorithm,
      token: {
        ...bankingTheme.token,
        colorPrimary: '#00F0FF',
        colorBgBase: '#000000',
        colorBgContainer: '#0A0A0A',
        colorBgElevated: '#141414',
        colorBgLayout: '#000000',
        colorTextBase: '#FFFFFF',
        colorText: '#FFFFFF',
        colorTextHeading: '#FFFFFF',
        colorTextSecondary: '#A3A3A3',
        colorBorder: '#262626',
      },
    },
  };

  const dynamicAntdTheme = modeConfigs[themeMode] || modeConfigs.light;

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode: switchTheme, darkMode, toggleTheme, THEME_MODES }}>
      <ConfigProvider theme={dynamicAntdTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

