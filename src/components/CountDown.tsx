import React, { useState, useEffect } from "react";

interface CountdownProps {
  day: number;
  month: number; // 1-based (e.g., May = 5)
  year: number;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown: React.FC<CountdownProps> = ({ day, month, year }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const calculateTimeLeft = (targetDate: number): TimeLeft | null => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      setIsTimeUp(true);
      return null;
    }

    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    };
  };

  useEffect(() => {
    const targetDate = new Date(year, month - 1, day, 0, 0, 0).getTime();

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [day, month, year]);

  if (isTimeUp) {
    return (
      <div className="text-3xl text-center text-pink-500 font-bold py-6">
        🎉 It's finally here! I'm so happy we're together at last 💖
      </div>
    );
  }

  return (
    <div className="text-center py-6">
      <div className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-romance-500">
        {timeLeft ? (
          <>
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}
            {timeLeft.seconds}s
          </>
        ) : (
          "Loading..."
        )}
      </div>
      <div className="mt-4 text-lg sm:text-xl text-pink-600">
        Let’s meet where dreams end and reality begins 🌸
      </div>
    </div>
  );
};

export default Countdown;
