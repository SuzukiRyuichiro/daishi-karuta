"use client";

import type { LucideIcon } from 'lucide-react';
import { Sparkles } from 'lucide-react';

interface KarutaCardProps {
  text: string | null;
  isFlipped: boolean;
  isLoading?: boolean;
  backContent?: React.ReactNode | { icon?: LucideIcon; text?: string };
}

export function KarutaCard({ text, isFlipped, isLoading, backContent }: KarutaCardProps) {
  const defaultBackIcon = Sparkles;
  let backDisplay: React.ReactNode;

  if (isLoading) {
    backDisplay = <p className="text-lg  text-accent">読み込み中...</p>;
  } else if (backContent) {
    if (React.isValidElement(backContent)) {
      backDisplay = backContent;
    } else if (typeof backContent === 'object' && backContent !== null) {
      const IconComponent = backContent.icon || defaultBackIcon;
      backDisplay = (
        <div className="flex flex-col items-center justify-center text-accent">
          <IconComponent className="w-16 h-16 mb-2" />
          {backContent.text && <p className=" text-lg">{backContent.text}</p>}
        </div>
      );
    }
  } else {
     backDisplay = (
        <div className="flex flex-col items-center justify-center text-accent opacity-70">
        </div>
      );
  }


  return (
    <div className={`card-container-perspective w-72 h-[26rem] sm:w-96 sm:h-[32rem] ${isFlipped ? 'flipped' : ''}`}>
      <div className="card-inner-rotate">
        <div className="card-face card-face-back p-4">
          {backDisplay}
        </div>
        <div className="card-face card-face-front p-6">
          {text ? (
            <p className=" text-xl sm:text-2xl md:text-3xl text-foreground whitespace-pre-line text-center leading-relaxed">
              {text}
            </p>
          ) : (
            <p className=" text-xl text-muted-foreground">...</p>
          )}
        </div>
      </div>
    </div>
  );
}
