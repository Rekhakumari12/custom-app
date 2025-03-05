import React, { useEffect, useRef, useState } from 'react'
import { Heart, Music, Music2, ArrowDown } from 'lucide-react'
import { HeartButton } from './components/HeartButton'
import { MazeGame } from './components/MazeGame'

import backgroundMusic from './assets/Ishq-Lost Found.mp3'

function App() {
  const [showMessage, setShowMessage] = useState(false)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const audioRef = useRef(new Audio(backgroundMusic)) // Create audio instance
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = true // Start muted
    }
  }, [])
  const toggleMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(backgroundMusic) // Create audio only on user interaction
      audioRef.current.loop = true // Enable looping
    }

    if (isMusicPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch((error) => console.log('Playback error:', error)) // Catch any errors
    }

    setIsMusicPlaying(!isMusicPlaying)
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-pastel-pink via-pastel-peach to-pastel-lavender">
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
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-romance-800 mb-6">
            I love you Samay, baby! ❤️
          </h1>
          <p className="text-xl text-romance-600 mb-8">
            I've already made a promise to time, now I'm just waiting for the day when you’ll be
            right in front of me. Distance is only physical my heart is always with you. 💕
          </p>
          <div className="animate-float">
            <Heart className="w-16 h-16 text-romance-500 mx-auto" fill="currentColor" />
          </div>
          <ArrowDown className="w-8 h-8 text-romance-600 mx-auto mt-12 animate-bounce" />
        </div>
      </section>

      {/* Secret Message Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-romance-50 to-pastel-lavender">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-romance-800 mb-8">Mere Dil Ka Raaz</h2>
          <div className="relative">
            <HeartButton onClick={() => setShowMessage(!showMessage)} className="mx-auto mb-6" />
            {showMessage && (
              <div className="bg-white rounded-lg p-6 shadow-lg animate-float">
                <p className="text-lg text-romance-600">
                  Jab saamne hoge toh haal kya hoga? Shayad main ‘loading…’ mein freeze ho jau! 😂
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Game Section */}
      <section className="py-20 px-6 bg-white/80">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-romance-800 mb-8">Find Your Way to Me</h2>
          <p className="text-romance-600 mb-8">
            Guide your heart through the maze to reach mine! 💝
          </p>
          <MazeGame />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-romance-800 text-white py-8 px-6 text-center">
        <p>Dil se banaya, sirf tumare liye 💖</p>
      </footer>
    </div>
  )
}

export default App
