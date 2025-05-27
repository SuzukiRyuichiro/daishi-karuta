import Link from "next/link";
import { Spade, Settings, PlayCircle } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <Link
          href="/"
          className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
        >
          <Spade className="h-8 w-8" />
          <span className="text-2xl font-bold">かるた</span>
        </Link>
        <nav className="flex items-center space-x-2 sm:space-x-6">
          <Link
            href="/"
            className="flex items-center text-md font-medium text-foreground/70 hover:text-primary transition-colors"
          >
            <PlayCircle className="mr-2 h-8 w-8" />
            <span className="hidden sm:block">遊ぶ</span>
          </Link>
          <Link
            href="/setup"
            className="flex items-center text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
          >
            <Settings className="mr-2 h-8 w-8" />
            <span className="hidden sm:block">読み札の設定</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
