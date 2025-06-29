import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--error))',
          foreground: 'hsl(var(--error-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        medical: {
          blue: 'hsl(var(--medical-blue))',
          teal: 'hsl(var(--medical-teal))',
          green: 'hsl(var(--medical-green))',
          red: 'hsl(var(--medical-red))',
          orange: 'hsl(var(--medical-orange))',
          purple: 'hsl(var(--medical-purple))',
        },
        status: {
          available: 'hsl(var(--status-available))',
          busy: 'hsl(var(--status-busy))',
          offline: 'hsl(var(--status-offline))',
          emergency: 'hsl(var(--status-emergency))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'medical-sm': 'var(--shadow-sm)',
        'medical-md': 'var(--shadow-md)',
        'medical-lg': 'var(--shadow-lg)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'pulse-medical': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'slide-in-from-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-in-from-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-medical': 'pulse-medical 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in-right': 'slide-in-from-right 0.3s ease-out',
        'slide-in-left': 'slide-in-from-left 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      backgroundImage: {
        'gradient-medical': 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)',
        'gradient-emergency': 'linear-gradient(135deg, hsl(var(--error)) 0%, hsl(var(--warning)) 100%)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;