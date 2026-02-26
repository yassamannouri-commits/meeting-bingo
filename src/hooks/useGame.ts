import { useState, useCallback } from 'react';
import { GameState, CategoryId, BingoCard } from '../types';
import { generateCard, getCardWords } from '../lib/cardGenerator';
import { checkForBingo, countFilled } from '../lib/bingoChecker';
import { detectWordsWithAliases } from '../lib/wordDetector';
import { useSpeechRecognition } from './useSpeechRecognition';

const INITIAL_STATE: GameState = {
  status: 'idle',
  category: null,
  card: null,
  isListening: false,
  startedAt: null,
  completedAt: null,
  winningLine: null,
  winningWord: null,
  filledCount: 0,
};

export function useGame() {
  const [game, setGame] = useState<GameState>(INITIAL_STATE);
  const speech = useSpeechRecognition();

  const handleTranscript = useCallback((transcript: string) => {
    setGame(prev => {
      if (!prev.card || prev.status !== 'playing') return prev;

      const filledWords = new Set(
        prev.card.squares.flat()
          .filter(sq => sq.isFilled && !sq.isFreeSpace)
          .map(sq => sq.word.toLowerCase()),
      );

      const detected = detectWordsWithAliases(transcript, getCardWords(prev.card), filledWords);
      if (detected.length === 0) return prev;

      const newCard: BingoCard = {
        ...prev.card,
        squares: prev.card.squares.map(row =>
          row.map(sq =>
            detected.some(w => w.toLowerCase() === sq.word.toLowerCase())
              ? { ...sq, isFilled: true, isAutoFilled: true, filledAt: Date.now() }
              : sq,
          ),
        ),
      };

      const winningLine = checkForBingo(newCard);
      const winningWord = winningLine
        ? detected.find(w =>
            newCard.squares.flat()
              .filter(sq => winningLine.squares.includes(sq.id) && sq.isAutoFilled)
              .some(sq => sq.word.toLowerCase() === w.toLowerCase()),
          ) ?? detected[0]
        : null;

      return {
        ...prev,
        card: { ...newCard, words: prev.card.words },
        filledCount: countFilled(newCard),
        winningLine: winningLine ?? prev.winningLine,
        winningWord: winningWord ?? prev.winningWord,
        status: winningLine ? 'won' : prev.status,
        completedAt: winningLine ? Date.now() : prev.completedAt,
      };
    });
  }, []);

  const startGame = useCallback((categoryId: CategoryId) => {
    const card = generateCard(categoryId);
    setGame({
      status: 'playing',
      category: categoryId,
      card,
      isListening: false,
      startedAt: Date.now(),
      completedAt: null,
      winningLine: null,
      winningWord: null,
      filledCount: countFilled(card),
    });
  }, []);

  const toggleSquare = useCallback((row: number, col: number) => {
    setGame(prev => {
      if (!prev.card || prev.status !== 'playing') return prev;
      const sq = prev.card.squares[row][col];
      if (sq.isFreeSpace) return prev;

      const newCard: BingoCard = {
        ...prev.card,
        squares: prev.card.squares.map((r, ri) =>
          r.map((s, ci) =>
            ri === row && ci === col
              ? { ...s, isFilled: !s.isFilled, isAutoFilled: false, filledAt: !s.isFilled ? Date.now() : null }
              : s,
          ),
        ),
      };

      const winningLine = checkForBingo(newCard);
      return {
        ...prev,
        card: newCard,
        filledCount: countFilled(newCard),
        winningLine: winningLine ?? prev.winningLine,
        winningWord: winningLine ? sq.word : prev.winningWord,
        status: winningLine ? 'won' : prev.status,
        completedAt: winningLine ? Date.now() : prev.completedAt,
      };
    });
  }, []);

  const toggleListening = useCallback(() => {
    setGame(prev => {
      if (prev.isListening) {
        speech.stopListening();
        return { ...prev, isListening: false };
      } else {
        speech.startListening(handleTranscript);
        return { ...prev, isListening: true };
      }
    });
  }, [speech, handleTranscript]);

  const newCard = useCallback(() => {
    setGame(prev => {
      if (!prev.category) return prev;
      const card = generateCard(prev.category);
      return { ...prev, card, filledCount: countFilled(card), winningLine: null, winningWord: null, status: 'playing' };
    });
  }, []);

  const resetGame = useCallback(() => {
    speech.stopListening();
    setGame(INITIAL_STATE);
  }, [speech]);

  return {
    game,
    speech,
    startGame,
    toggleSquare,
    toggleListening,
    newCard,
    resetGame,
  };
}
