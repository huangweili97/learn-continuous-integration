import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
// ... 其他导入保持不变

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="app">
        <ThemeToggle />
        {/* 其他组件内容 */}
      </div>
    </ThemeProvider>
  );
};

export default App; 