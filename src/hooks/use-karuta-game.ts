"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

const DECK_STORAGE_KEY = "karutaKickerDeck";
const DEFAULT_DECK: string[] = [
  "猿も木から落ちる",
  "石の上にも三年",
  "七転び八起き",
  "花より団子",
  "急がば回れ",
];

export interface KarutaGame {
  deck: string[];
  currentCard: string | null;
  isGameActive: boolean;
  remainingCount: number;
  totalCount: number;
  isLoading: boolean;
  loadDeck: () => void;
  saveDeck: (newDeck: string[]) => void;
  startGame: () => string | null;
  nextCard: () => string | null;
  resetGame: () => void;
}

export function useKarutaGame(): KarutaGame {
  const [deck, setDeck] = useState<string[]>([]);
  const [shuffledDeck, setShuffledDeck] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [currentCard, setCurrentCard] = useState<string | null>(null);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const loadDeck = useCallback(() => {
    setIsLoading(true);
    try {
      const storedDeck = localStorage.getItem(DECK_STORAGE_KEY);
      if (storedDeck) {
        const parsedDeck = JSON.parse(storedDeck);
        if (
          Array.isArray(parsedDeck) &&
          parsedDeck.every((item) => typeof item === "string") &&
          parsedDeck.length > 0
        ) {
          setDeck(parsedDeck);
        } else {
          setDeck(DEFAULT_DECK);
          localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(DEFAULT_DECK)); // Save default if invalid
        }
      } else {
        setDeck(DEFAULT_DECK);
        localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(DEFAULT_DECK));
      }
    } catch (error) {
      console.error("Failed to load deck from localStorage:", error);
      setDeck(DEFAULT_DECK); // Fallback to default deck on error
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadDeck();
  }, [loadDeck]);

  const saveDeck = (newDeck: string[]) => {
    if (newDeck.length === 0) {
      toast({
        title: "エラー",
        description: "読み札がありません。デフォルトの読み札を使います。",
        variant: "destructive",
      });
      setDeck(DEFAULT_DECK);
      localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(DEFAULT_DECK));
      return;
    }
    setDeck(newDeck);
    localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(newDeck));
    toast({ title: "保存完了", description: "読み札が登録されました。" });
    resetGame(); // Reset game state as deck has changed
  };

  const shuffleArray = (array: string[]): string[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const startGame = (): string | null => {
    if (deck.length === 0) {
      toast({
        title: "エラー",
        description: "読み札がありません。読み札を登録して下さい。",
        variant: "destructive",
      });
      return null;
    }
    const newShuffledDeck = shuffleArray(deck);
    setShuffledDeck(newShuffledDeck);
    setCurrentIndex(0);
    setCurrentCard(newShuffledDeck[0]);
    setIsGameActive(true);
    return newShuffledDeck[0];
  };

  const nextCard = (): string | null => {
    if (!isGameActive || currentIndex >= shuffledDeck.length - 1) {
      setIsGameActive(false);
      setCurrentCard(null); // No more cards or game not active
      return null;
    }
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setCurrentCard(shuffledDeck[nextIndex]);
    return shuffledDeck[nextIndex];
  };

  const resetGame = () => {
    setShuffledDeck([]);
    setCurrentIndex(-1);
    setCurrentCard(null);
    setIsGameActive(false);
  };

  return {
    deck,
    currentCard,
    isGameActive,
    remainingCount:
      isGameActive && shuffledDeck.length > 0
        ? shuffledDeck.length - (currentIndex + 1)
        : 0,
    totalCount: deck.length,
    isLoading,
    loadDeck,
    saveDeck,
    startGame,
    nextCard,
    resetGame,
  };
}
