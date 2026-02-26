import { Button } from './ui/Button';

interface Props {
  isListening: boolean;
  isSupported: boolean;
  onToggleListening: () => void;
  onNewCard: () => void;
  onHome: () => void;
}

export function GameControls({ isListening, isSupported, onToggleListening, onNewCard, onHome }: Props) {
  return (
    <div className="flex gap-2 mt-4 flex-wrap">
      {isSupported && (
        <Button
          variant={isListening ? 'secondary' : 'primary'}
          onClick={onToggleListening}
          className="flex-1"
        >
          {isListening ? '⏹ Stop' : '🎙️ Listen'}
        </Button>
      )}
      <Button variant="secondary" onClick={onNewCard}>
        🔀 New Card
      </Button>
      <Button variant="ghost" size="sm" onClick={onHome}>
        ← Home
      </Button>
    </div>
  );
}
