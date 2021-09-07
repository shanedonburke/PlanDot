const plugin = require("tailwindcss/plugin");

module.exports = {
  mode: "jit",
  prefix: "",
  purge: {
    content: ["./src/**/*.{html,ts}"],
  },
  darkMode: "class",
  theme: {
    colors: {
      black: "black",
      white: "white",
      snow: "#fafafa",
      ghost: "#eff0f0",
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
        50: "var(--accant-50)",
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
    },
    extend: {
      spacing: {
        0.625: "0.15625rem", // 2.5px
        1.25: "0.313rem", // 5px
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
  ],
};
