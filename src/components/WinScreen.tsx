import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { GameState } from '../types';
import { CATEGORIES } from '../data/categories';
import { shareResult } from '../lib/shareUtils';
import { Button } from './ui/Button';

interface Props {
  game: GameState;
  onPlayAgain: () => void;
  onHome: () => void;
}

export function WinScreen({ game, onPlayAgain, onHome }: Props) {
  const [shareStatus, setShareStatus] = useState<'idle' | 'shared' | 'copied'>('idle');
  const category = CATEGORIES.find(c => c.id === game.category);

  const elapsed = game.startedAt && game.completedAt
    ? Math.round((game.completedAt - game.startedAt) / 1000)
    : 0;
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  useEffect(() => {
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
  }, []);

  const handleShare = async () => {
    const result = await shareResult(game);
    setShareStatus(result);
    setTimeout(() => setShareStatus('idle'), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center p-6">
      <div className="max-w-sm w-full text-center space-y-6">
        {/* Celebration */}
        <div className="space-y-2">
          <div className="text-7xl animate-bounce-in">🎉</div>
          <h1 className="text-5xl font-black text-green-600 tracking-wide">BINGO!</h1>
          {game.winningWord && (
            <p className="text-gray-600">
              Winning word: <span className="font-semibold text-gray-800">"{game.winningWord}"</span>
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">{timeStr}</div>
            <div className="text-xs text-gray-500 mt-0.5">Time</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{game.filledCount}</div>
            <div className="text-xs text-gray-500 mt-0.5">Squares</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{category?.icon}</div>
            <div className="text-xs text-gray-500 mt-0.5">{category?.name}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button size="lg" onClick={handleShare} className="w-full" variant="secondary">
            {shareStatus === 'shared' ? '✓ Shared!' : shareStatus === 'copied' ? '✓ Copied!' : '📤 Share Result'}
          </Button>
          <Button size="lg" onClick={onPlayAgain} className="w-full">
            🎯 Play Again
          </Button>
          <Button variant="ghost" onClick={onHome} className="w-full">
            ← Home
          </Button>
        </div>
      </div>
    </div>
  );
}
