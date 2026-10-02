import React, { useState } from 'react';
import { Button, Popover, Typography, Tag, message } from 'antd';
import {
  SunOutlined, MoonOutlined, EyeOutlined, ThunderboltOutlined,
  CheckCircleFilled, BgColorsOutlined, DownOutlined
} from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';

const { Text } = Typography;

export const ThemeToggle = ({ style, className, size = 'default' }) => {
  const { themeMode, setThemeMode, THEME_MODES } = useTheme();
  const [open, setOpen] = useState(false);

  const modeIcons = {
    light: <SunOutlined style={{ color: '#F59E0B', fontSize: 18 }} />,
    dark: <MoonOutlined style={{ color: '#38BDF8', fontSize: 18 }} />,
    eyecare: <EyeOutlined style={{ color: '#D98C00', fontSize: 18 }} />,
    oled: <ThunderboltOutlined style={{ color: '#00F0FF', fontSize: 18 }} />,
  };

  const activeTheme = (THEME_MODES && THEME_MODES[themeMode?.toUpperCase()]) || {
    key: 'light', name: 'Daylight Executive', accent: '#1769AA'
  };

  const handleSelect = (key) => {
    setThemeMode(key);
    const selected = THEME_MODES[key.toUpperCase()];
    message.success({
      content: `Atmosphere set to ${selected.name}`,
      key: 'atmosphere_toast',
      duration: 2,
    });
    setOpen(false);
  };

  const content = (
    <div style={{ width: 290, padding: 4 }}>
      <div style={{ paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Text bold style={{ fontSize: 14, display: 'block', color: '#FFFFFF' }}>Display Atmosphere Engine</Text>
          <Text style={{ fontSize: 11, color: '#94A3B8' }}>Select visual contrast & eye-care mode</Text>
        </div>
        <Tag color="cyan" style={{ fontSize: 10, fontWeight: 700, margin: 0, border: 'none', background: 'rgba(6, 182, 212, 0.2)', color: '#38BDF8' }}>PRO</Tag>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {THEME_MODES && Object.values(THEME_MODES).map((mode) => {
          const isSelected = themeMode === mode.key;
          return (
            <div
              key={mode.key}
              onClick={() => handleSelect(mode.key)}
              style={{
                padding: '12px 14px',
                borderRadius: 10,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: isSelected ? 'rgba(6, 182, 212, 0.14)' : 'rgba(255, 255, 255, 0.03)',
                border: isSelected ? `1.5px solid ${mode.accent}` : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: isSelected ? `0 0 14px ${mode.accent}35` : 'none',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)', padding: 8, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {modeIcons[mode.key] || <BgColorsOutlined style={{ color: mode.accent, fontSize: 18 }} />}
                </div>
                <div>
                  <Text bold style={{ fontSize: 13, display: 'block', color: isSelected ? '#FFFFFF' : '#E2E8F0' }}>
                    {mode.name}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#94A3B8', display: 'block', lineHeight: 1.3 }}>
                    {mode.desc}
                  </Text>
                </div>
              </div>
              {isSelected && <CheckCircleFilled style={{ color: mode.accent, fontSize: 16 }} />}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
      overlayClassName="atmosphere-popover-overlay"
    >
      <Button
        className={className}
        style={{
          borderRadius: 24,
          padding: size === 'large' ? '0 18px' : '0 14px',
          height: size === 'large' ? 40 : 36,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          fontWeight: 600,
          fontSize: 13,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          color: '#F8FAFC',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
          backdropFilter: 'blur(12px)',
          transition: 'all 0.25s ease',
          cursor: 'pointer',
          ...style,
        }}
      >
        {modeIcons[themeMode] || <BgColorsOutlined style={{ color: activeTheme.accent, fontSize: 16 }} />}
        <span>{activeTheme.name}</span>
        <DownOutlined style={{ fontSize: 10, color: '#94A3B8', marginLeft: 2 }} />
      </Button>
    </Popover>
  );
};

export default ThemeToggle;


