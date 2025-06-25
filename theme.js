// theme.js
export const theme = {
  colors: {
    primary:    '#9C27B0',  // purple accent
    background: '#000000',  // pure black
    card:       '#1E1E1E',  // very dark grey (still distinct from pure black)
    text:       '#FFFFFF',  // white
    muted:      '#888888',  // grey for placeholders/secondary text
    inputBg:    '#121212',  // for inputs
  },
  spacing: (factor) => factor * 8,
  borderRadius: 8,
};
