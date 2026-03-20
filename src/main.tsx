import { CssBaseline,ThemeProvider as MuiThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { JobsProvider } from "./context/JobsContext";
import { SharedTripsProvider } from "./context/SharedTripsContext";
import { StoreProvider } from "./context/StoreContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";
import theme from "./theme";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <StoreProvider>
          <JobsProvider>
            <SharedTripsProvider>
              <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <MuiThemeProvider theme={theme}>
                  <CssBaseline />
                  <App />
                </MuiThemeProvider>
              </BrowserRouter>
            </SharedTripsProvider>
          </JobsProvider>
        </StoreProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
