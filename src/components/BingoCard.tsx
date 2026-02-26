import { BingoCard as BingoCardType, WinningLine } from '../types';
import { BingoSquare } from './BingoSquare';

const HEADERS = ['B', 'I', 'N', 'G', 'O'];

interface Props {
  card: BingoCardType;
  winningLine: WinningLine | null;
  onSquareClick: (row: number, col: number) => void;
}

export function BingoCard({ card, winningLine, onSquareClick }: Props) {
  const winningIds = new Set(winningLine?.squares ?? []);

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="grid grid-cols-5 gap-1 mb-1">
        {HEADERS.map(h => (
          <div key={h} className="text-center font-bold text-blue-600 text-lg">{h}</div>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-1">
        {card.squares.flat().map(square => (
          <BingoSquare
            key={square.id}
            square={square}
            isWinningSquare={winningIds.has(square.id)}
            onClick={() => onSquareClick(square.row, square.col)}
          />
        ))}
      </div>
    </div>
  );
}
