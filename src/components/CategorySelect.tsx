import { CategoryId } from '../types';
import { CATEGORIES } from '../data/categories';
import { Button } from './ui/Button';

interface Props {
  onSelect: (id: CategoryId) => void;
  onBack: () => void;
}

export function CategorySelect({ onSelect, onBack }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-gray-900">Choose a Category</h2>
          <p className="text-gray-500 text-sm">Pick your meeting type</p>
        </div>

        <div className="space-y-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className="w-full bg-white rounded-xl border-2 border-gray-200 p-4 text-left
                hover:border-blue-400 hover:shadow-md transition-all duration-150 active:scale-[0.99]"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{cat.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900">{cat.name}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{cat.description}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {cat.words.slice(0, 5).map(word => (
                      <span key={word} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {word}
                      </span>
                    ))}
                    <span className="text-xs text-gray-400 px-1 py-0.5">+{cat.words.length - 5} more</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <Button variant="ghost" size="sm" onClick={onBack} className="w-full">
          ← Back
        </Button>
      </div>
    </div>
  );
}
