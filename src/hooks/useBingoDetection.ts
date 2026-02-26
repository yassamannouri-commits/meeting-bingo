import { useMemo } from 'react';
import { BingoCard, WinningLine } from '../types';
import { checkForBingo } from '../lib/bingoChecker';

export function useBingoDetection(card: BingoCard | null): WinningLine | null {
  return useMemo(() => (card ? checkForBingo(card) : null), [card]);
}
