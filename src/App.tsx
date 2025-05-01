import { useRef, useState } from "react";
import { Heart, Music, Music2, ArrowDown } from "lucide-react";

import backgroundMusic from "./assets/Ishq-Lost Found.mp3";
import Countdown from "./components/CountDown";
import { MazeGame2 } from "./components/MazeGame2";

function App() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(new Audio(backgroundMusic));

  const toggleMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(backgroundMusic);
      audioRef.current.loop = true;
    }

    if (isMusicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.log("Playback error:", error);
      });
    }

    setIsMusicPlaying(!isMusicPlaying);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-red-200">
      {/* Header */}
      <header className="fixed top-0 right-0 p-4 z-50">
        <button
          onClick={toggleMusic}
          className="bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
        >
          {isMusicPlaying ? (
            <Music2 className="w-6 h-6 text-romance-600" />
          ) : (
            <Music className="w-6 h-6 text-romance-600" />
          )}
        </button>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <div className="">
          <p className="text-xl text-romance-600 mb-8">
            <Countdown day={27} month={5} year={2025} />
          </p>
          <div className="animate-float">
            <Heart
              className="w-16 h-16 text-romance-500 mx-auto"
              fill="currentColor"
            />
          </div>
          <ArrowDown className="w-8 h-8 text-romance-600 mx-auto mt-12 animate-bounce" />
        </div>
      </section>

      {/* Game Section */}
      <section className="py-20 bg-white/80">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-pink-600 mb-8">
            Find Your Way to Me
          </h2>
          <p className="text-romance-600 mb-8">
            Guide your heart through the maze to reach mine! 💝
          </p>
          <MazeGame2 />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-pink-500 text-white py-8 px-6 text-center">
        <p>Dil se banaya, sirf tumare liye 🤍</p>
      </footer>
    </div>
  );
}

export default App;
