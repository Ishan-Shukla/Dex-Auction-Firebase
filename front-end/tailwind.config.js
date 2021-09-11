module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: {
        "Line-Background": "url('/src/img/Curve_Line.svg')",
        "Logo": "url('/src/img/Logo.jpg')",
      },
      boxShadow:{
        bar: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
      },
      fontFamily: {
        'Hanseif-Rough': ['Hansief-Rough'],
        'Hanseif': ['Hansief'],
        'sans': ['Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
    variants: {
      extend: {},
    },
    plugins: [
      require('@mjwebs/tailwindcss-frosted'),
    ],
  },
};
