import { GameState } from '../types';
import { BingoCard } from './BingoCard';
import { TranscriptPanel } from './TranscriptPanel';
import { GameControls } from './GameControls';
import { CATEGORIES } from '../data/categories';

interface Props {
  game: GameState;
  speech: {
    isSupported: boolean;
    isListening: boolean;
    transcript: string;
    interimTranscript: string;
  };
  detectedWords: string[];
  onToggleSquare: (row: number, col: number) => void;
  onToggleListening: () => void;
  onNewCard: () => void;
  onHome: () => void;
}

export function GameBoard({ game, speech, detectedWords, onToggleSquare, onToggleListening, onNewCard, onHome }: Props) {
  const category = CATEGORIES.find(c => c.id === game.category);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-sm space-y-3">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">{category?.icon}</span>
            <h1 className="text-xl font-bold text-gray-900">{category?.name}</h1>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            {game.filledCount}/25 filled
            {game.isListening && <span className="ml-2 text-red-500">● live</span>}
          </p>
        </div>

        {/* Card */}
        {game.card && (
          <BingoCard
            card={game.card}
            winningLine={game.winningLine}
            onSquareClick={onToggleSquare}
          />
        )}

        {/* Transcript */}
        <TranscriptPanel
          transcript={speech.transcript}
          interimTranscript={speech.interimTranscript}
          detectedWords={detectedWords}
          isListening={speech.isListening}
          isSupported={speech.isSupported}
        />

        {/* Controls */}
        <GameControls
          isListening={game.isListening}
          isSupported={speech.isSupported}
          onToggleListening={onToggleListening}
          onNewCard={onNewCard}
          onHome={onHome}
        />
      </div>
    </div>
  );
}
