import React from 'react';
import { ThemeProvider } from './theme/ThemeProvider';
import { TopBar } from './components/layout/TopBar';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { RightSidebar } from './components/layout/RightSidebar';
import { Canvas } from './components/canvas/Canvas';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="app-shell">
        <TopBar />
        <div className="app-workspace">
          <LeftSidebar />
          <Canvas />
          <RightSidebar />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
