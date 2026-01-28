/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": "#004225", // British Racing Green
                "primary-hover": "#005c33",
                "primary-bright": "#11d473", // For Menu/FAQ
                "primary-darker": "#10502f", // For Contact
                "gold": "#D4AF37", // For About page
                "accent-text": "#d4d4d8", // Light grey for text
                "background-light": "#f6f8f7",
                "background-dark": "#050505", // Matte Black
                "surface-dark": "#0a0a0a", // Slightly lighter black for cards
                "surface-border": "#1a1a1a", // Subtle border
                "accent-dark": "#1a1a1a", // Borders/Separators
                "card-dark": "#0a0a0a",
                "text-muted": "#737373",
                "border-green": "#1c4532",

                // Keep default shadcn-like variables for compatibility if needed, but map them to new theme
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                // primary: {
                //     DEFAULT: "hsl(var(--primary))",
                //     foreground: "hsl(var(--primary-foreground))",
                // },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"],
                "serif": ["Playfair Display", "serif"],
                "georgian": ["Noto Sans Georgian", "sans-serif"],
                sans: ["Inter", "sans-serif"], // Default sans
            },
            borderRadius: {
                lg: "0.5rem",
                md: "0.375rem",
                sm: "0.25rem",
                full: "9999px"
            },
        },
    },
    plugins: [],
}
