import { ApolloProvider } from "@apollo/client/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { apolloClient } from "./services/apolloService.ts";
import { ThemeProvider } from "./modules/Theme/ThemeProvider.tsx";
import { Toaster } from "./components/ui/sonner.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <ThemeProvider defaultTheme="dark" storageKey="sadbits-ui-theme">
        <App />
        <Toaster richColors />
      </ThemeProvider>
    </ApolloProvider>
  </StrictMode>
);
