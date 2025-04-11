import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import FakeStackOverflow from "./components/fakestackoverflow";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <FakeStackOverflow />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App; 