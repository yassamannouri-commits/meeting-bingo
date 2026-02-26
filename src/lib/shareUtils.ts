import { GameState } from '../types';

export function formatShareText(game: GameState): string {
  if (!game.card) return '';

  const elapsed = game.startedAt && game.completedAt
    ? Math.round((game.completedAt - game.startedAt) / 1000)
    : 0;
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  const grid = game.card.squares
    .map(row => row.map(sq => sq.isFilled ? '🟦' : '⬜').join(''))
    .join('\n');

  return [
    '🎯 Meeting Bingo!',
    '',
    grid,
    '',
    `⏱ ${timeStr} | ${game.filledCount}/25 squares`,
    game.winningWord ? `🏆 Winning word: "${game.winningWord}"` : '',
    '',
    'Play at meetingbingo.vercel.app',
  ].filter(line => line !== undefined).join('\n');
}

export async function shareResult(game: GameState): Promise<'shared' | 'copied'> {
  const text = formatShareText(game);

  if (navigator.share) {
    try {
      await navigator.share({ title: 'Meeting Bingo', text });
      return 'shared';
    } catch {
      // Fall through to clipboard
    }
  }

  await navigator.clipboard.writeText(text);
  return 'copied';
}
