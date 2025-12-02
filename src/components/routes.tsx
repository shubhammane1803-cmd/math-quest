import HomePage from './pages/HomePage';
import GamePlayPage from './pages/GamePlayPage';
import MiniGamePage from './pages/MinigamePage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <HomePage />,
  },
  {
    name: 'Play Level',
    path: '/play/:levelId',
    element: <GamePlayPage />,
  },
  {
    name: 'Mini Game',
    path: '/minigame/:gameId',
    element: <MiniGamePage />,
  },
];

export default routes;