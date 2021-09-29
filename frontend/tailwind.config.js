const plugin = require("tailwindcss/plugin");

module.exports = {
  prefix: "",
  purge: {
    enabled: true,
    content: ["./src/**/*.{html,ts,css,scss}"],
  },
  darkMode: "class",
  theme: {
    screens: {
      xs: "400px",
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      transparent: "transparent",
      black: "black",
      white: "white",
      blue: "blue",
      dimsnow: "#f5f5f5",
      snow: "#fafafa",
      ghost: "#eff0f0",
      gray: "#bbbbbb",
      primary: {
        50: "var(--primary-50)",
        100: "var(--primary-100)",
        200: "var(--primary-200)",
        300: "var(--primary-300)",
        400: "var(--primary-400)",
        500: "var(--primary-500)",
        600: "var(--primary-600)",
        700: "var(--primary-700)",
        800: "var(--primary-800)",
        900: "var(--primary-900)",
      },
      accent: {
        50: "var(--accent-50)",
        100: "var(--accent-100)",
        200: "var(--accent-200)",
        300: "var(--accent-300)",
        400: "var(--accent-400)",
        500: "var(--accent-500)",
        600: "var(--accent-600)",
        700: "var(--accent-700)",
        800: "var(--accent-800)",
        900: "var(--accent-900)",
      },
      warn: {
        50: "var(--warn-50)",
        100: "var(--warn-100)",
        200: "var(--warn-200)",
        300: "var(--warn-300)",
        400: "var(--warn-400)",
        500: "var(--warn-500)",
        600: "var(--warn-600)",
        700: "var(--warn-700)",
        800: "var(--warn-800)",
        900: "var(--warn-900)",
      },
      "#555": "#555",
      "#323232": "#323232",
      "#ccc": "#ccc",
      "#aaaaaa": "#aaaaaa",
      "#888888": "#888888",
      "#666666": "#666666",
    },
    extend: {
      spacing: {
        0.625: "0.15625rem", // 2.5px
        1.25: "0.313rem", // 5px
        3.75: "0.938rem", // 15px
        4.5: "1.125rem", // 18px,
        "1.5px": "1.5px",
        "3px": "3px",
        "25px": "25px",
        "40px": "40px",
      },
      borderWidth: {
        1: "1px",
      },
      minWidth: {
        "40px": "40px",
        "90px": "90px",
        "300px": "300px",
      },
      width: {
        "30%": "30%",
        "45%": "45%",
        "50%": "50%",
        "80%": "80%",
        "64px": "64px",
        "90px": "90px",
        "140px": "140px",
        "500px": "500px",
        "600px": "600px",
        "800px": "800px",
      },
      height: {
        "32px": "32px",
        "36px": "36px",
        "40px": "40px",
        "200px": "200px",
      },
      zIndex: {
        "-1": "-1",
        1: "1",
        2: "2",
      },
      borderRadius: {
        "4px": "4px",
        "5px": "5px",
        "10px": "10px",
        "16px": "16px",
      },
      inset: {
        "54px": "54px",
        "67px": "67px",
        "75px": "75px",
        "85%": "85%",
      },
      fontSize: {
        "11px": "11px",
        "15px": "15px",
      },
      lineHeight: {
        "1.2em": "1.2em",
        "1.4em": "1.4em",
        0.8: "0.8",
        1.6: "1.6",
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["active"],
      backgroundOpacity: ["active"],
      textColor: ["active"],
    },
  },
  important: true,
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".scroll-snap-x": {
          "scroll-snap-type": "x mandatory",
        },
        ".scroll-snap-none": {
          "scroll-snap-type": "none",
        },
        ".scroll-align-center": {
          "scroll-snap-align": "center",
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    }),
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".w-full-plus-1": {
          width: "calc(100% + 1px)",
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    }),
  ],
};
