import { useState } from "react";

const EMOJIS = ["🌍", "🚀", "✨", "🎉", "👋", "💫", "🌈", "⭐"];

const Index = () => {
  const [clicks, setClicks] = useState(0);
  const [scattered, setScattered] = useState<{ id: number; emoji: string; x: number; y: number }[]>([]);

  const handleClick = (e: React.MouseEvent) => {
    setClicks((c) => c + 1);
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    const id = Date.now();
    setScattered((s) => [...s.slice(-20), { id, emoji, x: e.clientX, y: e.clientY }]);
    setTimeout(() => setScattered((s) => s.filter((item) => item.id !== id)), 1500);
  };

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background cursor-pointer select-none"
      onClick={handleClick}
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />

      {/* Floating emojis background */}
      <span className="pointer-events-none absolute top-[10%] left-[15%] text-6xl animate-float opacity-40">🌍</span>
      <span className="pointer-events-none absolute top-[20%] right-[20%] text-5xl animate-float opacity-30" style={{ animationDelay: "1s" }}>🚀</span>
      <span className="pointer-events-none absolute bottom-[15%] left-[25%] text-5xl animate-float opacity-30" style={{ animationDelay: "2s" }}>✨</span>
      <span className="pointer-events-none absolute bottom-[25%] right-[15%] text-4xl animate-float opacity-25" style={{ animationDelay: "0.5s" }}>👋</span>

      {/* Main content */}
      <div className="relative z-10 text-center px-6">
        <h1 className="text-7xl sm:text-9xl font-extrabold tracking-tight animate-pop-in">
          <span className="text-primary">hellow</span>{" "}
          <span className="animate-wiggle inline-block text-secondary">worled</span>
        </h1>
        <p className="mt-6 text-xl sm:text-2xl text-muted-foreground animate-pop-in" style={{ animationDelay: "0.3s", opacity: 0 }}>
          we out here ✌️
        </p>

        {clicks > 0 && (
          <p className="mt-8 text-lg text-muted-foreground/70 transition-all">
            {clicks < 5 ? `${clicks} click${clicks > 1 ? "s" : ""} 👀` :
             clicks < 15 ? `${clicks} clicks! keep going 🔥` :
             clicks < 30 ? `${clicks} clicks!! you're unstoppable 🚀` :
             `${clicks} clicks!!! absolute legend 👑`}
          </p>
        )}
      </div>

      {/* Scattered click emojis */}
      {scattered.map(({ id, emoji, x, y }) => (
        <span
          key={id}
          className="pointer-events-none fixed text-3xl animate-pop-in"
          style={{ left: x - 16, top: y - 16 }}
        >
          {emoji}
        </span>
      ))}

      <p className="absolute bottom-8 text-sm text-muted-foreground/50">click anywhere ✨</p>
    </div>
  );
};

export default Index;
