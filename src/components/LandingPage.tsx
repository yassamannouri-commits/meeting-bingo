import { Button } from './ui/Button';

interface Props {
  onStart: () => void;
}

export function LandingPage({ onStart }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Hero */}
        <div className="space-y-3">
          <div className="text-6xl">🎯</div>
          <h1 className="text-4xl font-bold text-gray-900">Meeting Bingo</h1>
          <p className="text-lg text-gray-600">
            Turn boring meetings into a game. Auto-fills when buzzwords are spoken.
          </p>
        </div>

        <Button size="lg" onClick={onStart} className="w-full">
          New Game
        </Button>

        {/* How it works */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-left space-y-4">
          <h2 className="font-semibold text-gray-800 text-center">How it works</h2>
          <div className="space-y-3">
            {[
              { icon: '1️⃣', text: 'Pick a buzzword category' },
              { icon: '2️⃣', text: 'Tap the mic to start listening during your meeting' },
              { icon: '3️⃣', text: 'Squares fill automatically when words are detected' },
            ].map(step => (
              <div key={step.icon} className="flex items-start gap-3">
                <span className="text-xl">{step.icon}</span>
                <span className="text-gray-700 pt-0.5">{step.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <p className="text-xs text-gray-400">
          🔒 All processing is local — no audio ever leaves your device
        </p>
      </div>
    </div>
  );
}
