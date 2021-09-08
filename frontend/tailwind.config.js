const plugin = require("tailwindcss/plugin");

module.exports = {
  mode: "jit",
  prefix: "",
  purge: {
    content: ["./src/**/*.{html,ts}"],
  },
  darkMode: "class",
  theme: {
    screens: {
      sm: "var(--screen-width-sm)",
      md: "var(--screen-width-md)",
      lg: "var(--screen-width-lg)"
    },
    colors: {
      transparent: "transparent",
      black: "black",
      white: "white",
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
    },
    extend: {
      spacing: {
        0.625: "0.15625rem", // 2.5px
        1.25: "0.313rem",    // 5px
        3.75: "0.938rem",    // 15px
        4.5: "1.125rem",     // 18px
      },
      borderWidth: {
        1: "1px",
      },
    },
  },
  variants: {
    extend: {},
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
        ".max-w-unset": {
          "max-width": "unset",
        },
        ".h-unset": {
          "height": "unset",
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    }),
  ],
};
