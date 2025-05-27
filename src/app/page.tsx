"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { KarutaCard } from "@/components/karuta-card";
import { useKarutaGame, type KarutaGame } from "@/hooks/use-karuta-game";
import { Play, SkipForward, RotateCcw, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const game = useKarutaGame();
  const [isReadingAudio, setIsReadingAudio] = useState(false);
  const [isCardFaceVisible, setIsCardFaceVisible] = useState(false);
  const [currentCardTextForDisplay, setCurrentCardTextForDisplay] = useState<string | null>(null);
  const [isProcessingNext, setIsProcessingNext] = useState(false); // For buffer delay

  const speak = useCallback((text: string, onEndCallback: () => void) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.pitch = 1;
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.onstart = () => setIsReadingAudio(true);
      utterance.onend = () => {
        setIsReadingAudio(false);
        onEndCallback();
      };
      utterance.onerror = (event) => {
        console.error('SpeechSynthesisUtterance.onerror', event);
        setIsReadingAudio(false);
        onEndCallback(); // Ensure game progresses
      };
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis not supported.');
      setIsReadingAudio(true); // Simulate reading start
      setTimeout(() => {
        setIsReadingAudio(false);
        onEndCallback(); // Simulate speech end
      }, 2000); // Simulate 2s speech duration
    }
  }, []);

  const handleReadCard = useCallback((cardText: string | null) => {
    if (cardText) {
      setCurrentCardTextForDisplay(cardText);
      setIsCardFaceVisible(false); // Ensure card is on back
      speak(cardText, () => {
        setIsCardFaceVisible(true); // Flip card after reading
        setIsProcessingNext(false); // Re-enable Next button
      });
    } else {
       setIsProcessingNext(false);
    }
  }, [speak]);

  const handlePlay = () => {
    if (game.isLoading) return;
    setIsProcessingNext(true);
    const firstCard = game.startGame();
    if (firstCard) {
      handleReadCard(firstCard);
    } else {
      setIsProcessingNext(false); // No card to play
    }
  };

  const handleNext = () => {
    if (isReadingAudio || isProcessingNext || !game.isGameActive || game.remainingCount === 0) return;
    
    setIsProcessingNext(true);
    setIsCardFaceVisible(false); // Flip card back

    setTimeout(() => {
      const nextCardText = game.nextCard();
      if (nextCardText) {
        handleReadCard(nextCardText);
      } else {
        // Game over or no next card
        setIsCardFaceVisible(false); // Keep it hidden or show game over
        setCurrentCardTextForDisplay(null);
        setIsProcessingNext(false);
      }
    }, 1500); // 1.5s buffer
  };

  const handleReset = () => {
    window.speechSynthesis?.cancel();
    setIsReadingAudio(false);
    setIsCardFaceVisible(false);
    setCurrentCardTextForDisplay(null);
    setIsProcessingNext(false);
    game.resetGame();
  };
  
  useEffect(() => {
    // Cleanup speech synthesis on component unmount
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (game.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Skeleton className="w-72 h-[26rem] sm:w-80 sm:h-[28rem] md:w-96 md:h-[32rem] rounded-lg" />
        <div className="mt-12 flex space-x-4">
          <Skeleton className="h-12 w-32 rounded-md" />
          <Skeleton className="h-12 w-28 rounded-md" />
        </div>
      </div>
    );
  }

  const isGameOver = game.isGameActive && game.remainingCount === 0 && game.currentCard !== null;
  const canPlayNext = game.isGameActive && !isReadingAudio && !isProcessingNext && game.remainingCount > 0;
  const canStartGame = !game.isGameActive && game.deck.length > 0;
  
  let playButtonText = "ゲームスタート";
  let playButtonIcon = <Play className="mr-2 h-5 w-5" />;
  let playButtonAction = handlePlay;
  let playButtonDisabled = isReadingAudio || isProcessingNext || game.deck.length === 0;

  if (game.isGameActive) {
    if (isGameOver && isCardFaceVisible) { // Last card shown
      playButtonText = "もう一度遊ぶ";
      playButtonIcon = <RotateCcw className="mr-2 h-5 w-5" />;
      playButtonAction = handlePlay; // This will call startGame which resets and shuffles
      playButtonDisabled = isReadingAudio || isProcessingNext;
    } else { // Mid-game
      playButtonText = "次の読み札";
      playButtonIcon = <SkipForward className="mr-2 h-5 w-5" />;
      playButtonAction = handleNext;
      playButtonDisabled = !canPlayNext || isReadingAudio || isProcessingNext;
    }
  } else if (game.deck.length === 0) {
      playButtonText = "読み札がありません。設定画面で読み札を登録して下さい。";
      playButtonDisabled = true; // Disabled because no deck
  }
  
  if (isProcessingNext || (isReadingAudio && game.isGameActive && !isGameOver) ) {
     playButtonIcon = <Loader2 className="mr-2 h-5 w-5 animate-spin" />;
  }


  return (
    <div className="flex flex-col items-center justify-center text-center py-10">
      <KarutaCard
        text={currentCardTextForDisplay}
        isFlipped={isCardFaceVisible && !isProcessingNext}
        isLoading={isProcessingNext && !currentCardTextForDisplay}
      />
      
      <div className="mt-12 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <Button 
          onClick={playButtonAction} 
          disabled={playButtonDisabled} 
          size="lg"
          className="w-48"
          aria-live="polite"
        >
          {playButtonIcon}
          {playButtonText}
        </Button>
        <Button 
          onClick={handleReset} 
          variant="outline" 
          size="lg" 
          disabled={isReadingAudio || isProcessingNext || (!game.isGameActive && game.currentIndex === -1)}
          className="w-40"
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          リセット
        </Button>
      </div>

      {game.isGameActive && game.totalCount > 0 && (
        <p className="mt-8 text-sm text-muted-foreground">
          Card {game.totalCount - game.remainingCount - (game.currentCard ? 0:1) } of {game.totalCount}
          {isGameOver && isCardFaceVisible && " - All cards read!"}
        </p>
      )}
       {game.deck.length === 0 && !game.isLoading && (
         <p className="mt-8 text-destructive">
           The deck is empty. Please go to 'Setup Deck' to add cards.
         </p>
       )}
    </div>
  );
}
