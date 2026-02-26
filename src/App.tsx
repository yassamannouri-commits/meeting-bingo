import { useState, useCallback } from 'react';
import { useGame } from './hooks/useGame';
import { LandingPage } from './components/LandingPage';
import { CategorySelect } from './components/CategorySelect';
import { GameBoard } from './components/GameBoard';
import { WinScreen } from './components/WinScreen';
import { ToastContainer } from './components/ui/Toast';
import { Toast } from './types';

type Screen = 'landing' | 'category' | 'game' | 'win';

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [detectedWords, setDetectedWords] = useState<string[]>([]);
  const { game, speech, startGame, toggleSquare, toggleListening, newCard, resetGame } = useGame();

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleStartGame = useCallback(() => {
    setScreen('category');
  }, []);

  const handleCategorySelect = useCallback((categoryId: Parameters<typeof startGame>[0]) => {
    startGame(categoryId);
    setDetectedWords([]);
    setScreen('game');
  }, [startGame]);

  const handleToggleListening = useCallback(() => {
    toggleListening();
  }, [toggleListening]);

  const handleSquareClick = useCallback((row: number, col: number) => {
    toggleSquare(row, col);
  }, [toggleSquare]);

  const handleNewCard = useCallback(() => {
    newCard();
    setDetectedWords([]);
  }, [newCard]);

  const handleHome = useCallback(() => {
    resetGame();
    setScreen('landing');
  }, [resetGame]);

  const handlePlayAgain = useCallback(() => {
    setScreen('category');
  }, []);

  // Navigate to win screen when game is won
  if (game.status === 'won' && screen === 'game') {
    setScreen('win');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {screen === 'landing' && <LandingPage onStart={handleStartGame} />}
      {screen === 'category' && (
        <CategorySelect onSelect={handleCategorySelect} onBack={handleHome} />
      )}
      {screen === 'game' && game.card && (
        <GameBoard
          game={game}
          speech={speech}
          detectedWords={detectedWords}
          onToggleSquare={handleSquareClick}
          onToggleListening={handleToggleListening}
          onNewCard={handleNewCard}
          onHome={handleHome}
        />
      )}
      {screen === 'win' && (
        <WinScreen game={game} onPlayAgain={handlePlayAgain} onHome={handleHome} />
      )}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
