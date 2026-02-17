import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#03CD8C", // EVzone green
    },
    secondary: {
      main: "#F77F00", // EVzone orange
    },
    background: {
      default: "#0f172a",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#64748b",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 9999,
        },
      },
    },
  },
});

export default theme;
