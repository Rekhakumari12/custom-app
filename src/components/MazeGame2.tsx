import React, { useState, useEffect } from "react";
import {
  Heart,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Clock,
} from "lucide-react";

type Cell = {
  walls: boolean[]; // top, right, bottom, left
  visited: boolean;
  isPath: boolean;
  isPlayer: boolean;
  isEnd: boolean;
  message?: string;
};

type Level = "easy" | "medium" | "hard";

type GameSession = {
  startTime: Date;
  level: Level;
};

const SIZES = {
  easy: 8,
  medium: 12,
  hard: 16,
};

const MESSAGES = [
  "You're my sunshine! 🌞",
  "Keep going, my love! 💕",
  "You make me smile! 😊",
  "You're amazing! ✨",
  "I believe in you! 💫",
];

export const MazeGame2: React.FC = () => {
  const [level, setLevel] = useState<Level>("easy");
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [gameWon, setGameWon] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentSession, setCurrentSession] = useState<GameSession | null>(
    null
  );
  const [lastActive, setLastActive] = useState<string>("");

  const generateMaze = (size: number) => {
    const newMaze: Cell[][] = Array(size)
      .fill(null)
      .map(() =>
        Array(size)
          .fill(null)
          .map(() => ({
            walls: [true, true, true, true],
            visited: false,
            isPath: false,
            isPlayer: false,
            isEnd: false,
          }))
      );

    const stack: [number, number][] = [];
    const startX = 0;
    const startY = 0;

    newMaze[startY][startX].visited = true;
    stack.push([startX, startY]);

    while (stack.length > 0) {
      const [currentX, currentY] = stack[stack.length - 1];
      const neighbors: [number, number, number][] = [];

      if (currentY > 0 && !newMaze[currentY - 1][currentX].visited)
        neighbors.push([currentX, currentY - 1, 0]);
      if (currentX < size - 1 && !newMaze[currentY][currentX + 1].visited)
        neighbors.push([currentX + 1, currentY, 1]);
      if (currentY < size - 1 && !newMaze[currentY + 1][currentX].visited)
        neighbors.push([currentX, currentY + 1, 2]);
      if (currentX > 0 && !newMaze[currentY][currentX - 1].visited)
        neighbors.push([currentX - 1, currentY, 3]);

      if (neighbors.length > 0) {
        const [nextX, nextY, wallIndex] =
          neighbors[Math.floor(Math.random() * neighbors.length)];
        newMaze[currentY][currentX].walls[wallIndex] = false;
        newMaze[nextY][nextX].walls[(wallIndex + 2) % 4] = false;
        newMaze[nextY][nextX].visited = true;
        stack.push([nextX, nextY]);
      } else {
        stack.pop();
      }
    }

    newMaze[size - 1][size - 1].isEnd = true;

    for (let i = 0; i < 3; i++) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      if (!(x === 0 && y === 0) && !(x === size - 1 && y === size - 1)) {
        newMaze[y][x].message =
          MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
      }
    }

    return newMaze;
  };

  const initializeGame = (selectedLevel: Level) => {
    const size = SIZES[selectedLevel];
    const newMaze = generateMaze(size);
    newMaze[0][0].isPlayer = true;
    setMaze(newMaze);
    setPlayerPos({ x: 0, y: 0 });
    setGameWon(false);
    setCurrentMessage("");
    setCurrentSession({
      startTime: new Date(),
      level: selectedLevel,
    });

    const sessions = JSON.parse(localStorage.getItem("gameSessions") || "[]");
    sessions.push({
      timestamp: new Date().toISOString(),
      level: selectedLevel,
    });
    localStorage.setItem("gameSessions", JSON.stringify(sessions));
    setLastActive(new Date().toLocaleString());
  };

  useEffect(() => {
    initializeGame(level);

    const sessions = JSON.parse(localStorage.getItem("gameSessions") || "[]");
    if (sessions.length > 0) {
      setLastActive(
        new Date(sessions[sessions.length - 1].timestamp).toLocaleString()
      );
    }
  }, [level]);

  const movePlayer = (dx: number, dy: number) => {
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if (newX >= 0 && newX < maze[0].length && newY >= 0 && newY < maze.length) {
      const currentCell = maze[playerPos.y][playerPos.x];
      const wallIndex = dx === 1 ? 1 : dx === -1 ? 3 : dy === 1 ? 2 : 0;

      if (!currentCell.walls[wallIndex]) {
        const newMaze = [...maze];
        newMaze[playerPos.y][playerPos.x].isPlayer = false;
        newMaze[newY][newX].isPlayer = true;

        if (newMaze[newY][newX].message) {
          setCurrentMessage(newMaze[newY][newX].message || "");
        }

        if (newMaze[newY][newX].isEnd) {
          setGameWon(true);
          const completions = JSON.parse(
            localStorage.getItem("gameCompletions") || "[]"
          );
          completions.push({
            timestamp: new Date().toISOString(),
            level,
            duration: currentSession
              ? (new Date().getTime() -
                  new Date(currentSession.startTime).getTime()) /
                1000
              : 0,
          });
          localStorage.setItem("gameCompletions", JSON.stringify(completions));
        }

        setMaze(newMaze);
        setPlayerPos({ x: newX, y: newY });
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameWon) return;

      switch (e.key) {
        case "ArrowUp":
          movePlayer(0, -1);
          break;
        case "ArrowRight":
          movePlayer(1, 0);
          break;
        case "ArrowDown":
          movePlayer(0, 1);
          break;
        case "ArrowLeft":
          movePlayer(-1, 0);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [playerPos, maze, gameWon]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-red-200 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-pink-600 mb-4">Love Maze</h1>
        <div className="space-x-4">
          {(["easy", "medium", "hard"] as Level[]).map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`px-4 py-2 rounded-full ${
                level === l
                  ? "bg-pink-500 text-white"
                  : "bg-white text-pink-500 hover:bg-pink-100"
              } transition-all duration-300`}
            >
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 flex items-center justify-center space-x-2 text-pink-600">
        <Clock size={20} />
        <span>Last played: {lastActive}</span>
      </div>

      {currentMessage && (
        <div className="mb-4 p-4 bg-white rounded-lg shadow-lg animate-bounce">
          <p className="text-pink-500 font-semibold">{currentMessage}</p>
        </div>
      )}

      <div className="bg-white p-4 sm:p-8 rounded-lg shadow-xl">
        <div
          className="grid gap-0.5"
          style={{
            gridTemplateColumns: `repeat(${maze.length}, minmax(0, 1fr))`,
          }}
        >
          {maze.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className={`w-10 h-10 sm:w-10 sm:h-10 relative ${
                  cell.isEnd ? "bg-pink-100" : "bg-white"
                }`}
                style={{
                  borderTop: cell.walls[0] ? "2px solid #FF69B4" : "none",
                  borderRight: cell.walls[1] ? "2px solid #FF69B4" : "none",
                  borderBottom: cell.walls[2] ? "2px solid #FF69B4" : "none",
                  borderLeft: cell.walls[3] ? "2px solid #FF69B4" : "none",
                }}
              >
                {cell.isPlayer && (
                  <Heart
                    className="absolute inset-0 m-auto text-red-500 animate-pulse sm:text-xl text-lg"
                    size={20}
                  />
                )}
                {cell.isEnd && !cell.isPlayer && (
                  <Heart
                    className="absolute inset-0 m-auto text-pink-300 sm:text-xl text-lg"
                    size={20}
                  />
                )}
                {cell.message && !cell.isPlayer && (
                  <span className="absolute inset-0 m-auto text-2xl">💌</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {gameWon && (
        <div className="mt-8 text-center animate-bounce">
          <h2 className="text-xl font-bold text-pink-600 mb-2 py-8">
            🌸 Congratulations, Baby! You found your way to my heart. But let's
            be real, you were already there. 🌸
          </h2>
          <button
            onClick={() => initializeGame(level)}
            className="px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors duration-300"
          >
            Firse kheloge?
          </button>
        </div>
      )}

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => movePlayer(0, -1)}
          className="p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
        >
          <ArrowUp size={24} />
        </button>
        <button
          onClick={() => movePlayer(0, 1)}
          className="p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
        >
          <ArrowDown size={24} />
        </button>
        <button
          onClick={() => movePlayer(-1, 0)}
          className="p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
        >
          <ArrowLeft size={24} />
        </button>
        <button
          onClick={() => movePlayer(1, 0)}
          className="p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
        >
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
};
