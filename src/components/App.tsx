import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProgressProvider } from './context/ProgressContexts';
import { Toaster } from './ui/toaster';
import routes from './routes';

const App: React.FC = () => {
  return (
    <Router>
      <ProgressProvider>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            <Routes>
              {routes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
        <Toaster />
      </ProgressProvider>
    </Router>
  );
};

export default App;