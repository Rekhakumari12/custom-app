import React, { useState, useEffect, useCallback } from 'react'
import { Heart, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react'

const GRID_SIZE = 10
const WALL_PROBABILITY = 0.2

interface Position {
  x: number
  y: number
}

interface MazeCell {
  isWall: boolean
  isPath: boolean
}

interface TouchPosition {
  x: number
  y: number
}

export const MazeGame: React.FC = () => {
  const [maze, setMaze] = useState<MazeCell[][]>([])
  const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: 0 })
  const [goalPos] = useState<Position>({ x: GRID_SIZE - 1, y: GRID_SIZE - 1 })
  const [won, setWon] = useState(false)
  const [touchStart, setTouchStart] = useState<TouchPosition | null>(null)

  const generateMaze = () => {
    const newMaze: MazeCell[][] = []
    for (let i = 0; i < GRID_SIZE; i++) {
      const row: MazeCell[] = []
      for (let j = 0; j < GRID_SIZE; j++) {
        row.push({
          isWall:
            Math.random() < WALL_PROBABILITY &&
            !(i === 0 && j === 0) &&
            !(i === GRID_SIZE - 1 && j === GRID_SIZE - 1),
          isPath: false,
        })
      }
      newMaze.push(row)
    }
    return newMaze
  }

  const initGame = () => {
    setMaze(generateMaze())
    setPlayerPos({ x: 0, y: 0 })
    setWon(false)
  }

  useEffect(() => {
    initGame()
  }, [])

  const movePlayer = useCallback(
    (dx: number, dy: number) => {
      if (won) return

      const newX = playerPos.x + dx
      const newY = playerPos.y + dy

      if (
        newX >= 0 &&
        newX < GRID_SIZE &&
        newY >= 0 &&
        newY < GRID_SIZE &&
        !maze[newY][newX].isWall
      ) {
        setPlayerPos({ x: newX, y: newY })

        if (newX === goalPos.x && newY === goalPos.y) {
          setWon(true)
        }
      }
    },
    [playerPos, maze, won, goalPos]
  )

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (won) return

      switch (e.key) {
        case 'ArrowUp':
          movePlayer(0, -1)
          break
        case 'ArrowDown':
          movePlayer(0, 1)
          break
        case 'ArrowLeft':
          movePlayer(-1, 0)
          break
        case 'ArrowRight':
          movePlayer(1, 0)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [movePlayer, won])

  // Touch controls
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
    })
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y
    const minSwipeDistance = 30

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        movePlayer(deltaX > 0 ? 1 : -1, 0)
      }
    } else {
      if (Math.abs(deltaY) > minSwipeDistance) {
        movePlayer(0, deltaY > 0 ? 1 : -1)
      }
    }

    setTouchStart(null)
  }

  const ControlButton: React.FC<{
    direction: 'up' | 'down' | 'left' | 'right'
    onClick: () => void
  }> = ({ direction, onClick }) => {
    const Icon = {
      up: ArrowUp,
      down: ArrowDown,
      left: ArrowLeft,
      right: ArrowRight,
    }[direction]

    return (
      <button
        onClick={onClick}
        className="w-12 h-12 bg-romance-500/80 rounded-full flex items-center justify-center text-white hover:bg-romance-600 active:bg-romance-700 transition-colors"
        aria-label={`Move ${direction}`}
      >
        <Icon className="w-6 h-6" />
      </button>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {won ? (
        <div className="text-center animate-float">
          <p className="text-xl text-romance-600 mb-4">
            Congratulations, Pglu! You found your way to my heart. But let's be real, you were
            already there. 💖
          </p>
          <button
            onClick={initGame}
            className="bg-romance-500 text-white px-6 py-2 rounded-full hover:bg-romance-600 transition-colors"
          >
            Play Again
          </button>
        </div>
      ) : (
        <>
          <div
            className="bg-white p-4 rounded-lg shadow-lg touch-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
            >
              {maze.map((row, y) =>
                row.map((cell, x) => (
                  <div
                    key={`${x}-${y}`}
                    className={`w-8 h-8 flex items-center justify-center rounded-sm
                      ${cell.isWall ? 'bg-romance-800' : 'bg-romance-50'}
                      ${playerPos.x === x && playerPos.y === y ? 'bg-romance-300' : ''}
                      ${x === goalPos.x && y === goalPos.y ? 'bg-romance-100' : ''}`}
                  >
                    {playerPos.x === x && playerPos.y === y && (
                      <div className="animate-[pulse_1.5s_ease-in-out_infinite] transform hover:scale-110 transition-transform">
                        <Heart
                          className="w-6 h-6 text-romance-500 drop-shadow-lg"
                          fill="currentColor"
                          strokeWidth={1.5}
                        />
                      </div>
                    )}
                    {x === goalPos.x &&
                      y === goalPos.y &&
                      !(playerPos.x === x && playerPos.y === y) && (
                        <div className="animate-[heartbeat_1s_ease-in-out_infinite]">
                          <Heart
                            className="w-6 h-6 text-romance-500 drop-shadow-lg"
                            fill="currentColor"
                            strokeWidth={1.5}
                          />
                        </div>
                      )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden">
            <div className="grid gap-4 w-min mx-auto">
              <div className="col-start-2">
                <ControlButton direction="up" onClick={() => movePlayer(0, -1)} />
              </div>
              <div className="col-start-1">
                <ControlButton direction="left" onClick={() => movePlayer(-1, 0)} />
              </div>
              <div className="col-start-2">
                <ControlButton direction="down" onClick={() => movePlayer(0, 1)} />
              </div>
              <div className="col-start-3">
                <ControlButton direction="right" onClick={() => movePlayer(1, 0)} />
              </div>
            </div>
          </div>

          <p className="text-romance-600 md:block hidden">Use arrow keys to move</p>
          <p className="text-romance-600 md:hidden">Use buttons or swipe to move</p>
        </>
      )}
    </div>
  )
}
