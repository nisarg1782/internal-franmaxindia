import { useState, useEffect } from 'react';

// Main application component that renders the countdown timer.
export default function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <CountdownTimer />
    </div>
  );
}

// The core component for the countdown timer.
function CountdownTimer() {
  // Set the target date for the countdown. You can change this to any future date.
  const targetDate = new Date('2025-09-14T09:59:59');

  // State to hold the remaining time.
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  // Function to calculate the time left until the target date.
  function calculateTimeLeft() {
    const difference = +targetDate - +new Date();
    let remainingTime = {};

    if (difference > 0) {
      remainingTime = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      // If the countdown is over, set all values to 0.
      remainingTime = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return remainingTime;
  }

  // Effect hook to update the timer every second.
  useEffect(() => {
    // Set up a timeout to recalculate time every 1000ms (1 second).
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clean up the timer when the component unmounts or the state changes.
    return () => clearTimeout(timer);
  });

  // Helper function to render a single timer box.
  const TimerBox = ({ value, label }) => (
    <div className="flex flex-col items-center justify-center w-36 h-36 md:w-48 md:h-48 bg-blue-600 rounded-2xl shadow-lg m-2">
      <span className="text-5xl md:text-6xl font-extrabold text-white">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-lg md:text-xl font-medium text-white uppercase mt-1">
        {label}
      </span>
    </div>
  );

  // Check if the countdown has finished.
  const isFinished = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <div className="flex flex-col items-center p-4 max-w-6xl mx-auto">
      <p className="text-lg sm:text-xl font-medium text-center mb-4 uppercase text-gray-700 dark:text-gray-300">
        DON'T MISS THE OPPORTUNITY... BE THERE TO BE THE CHANGE
      </p>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-center">
        A Must Visit For Everyone in the Education &amp; skills sector
      </h1>
      <div className="flex justify-center flex-wrap">
        {isFinished ? (
          <span className="text-4xl text-green-500 font-semibold">Countdown Finished!</span>
        ) : (
          <>
            <TimerBox value={timeLeft.days} label="Days" />
            <TimerBox value={timeLeft.hours} label="Hours" />
            <TimerBox value={timeLeft.minutes} label="Minutes" />
            <TimerBox value={timeLeft.seconds} label="Seconds" />
          </>
        )}
      </div>
      <div className="mt-8 text-center text-lg">
        <p className="font-semibold text-gray-700 dark:text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="inline w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          DATE: 14 September 2025
        </p>
      </div>
      <button className="mt-8 px-8 py-4 bg-yellow-500 text-white font-bold rounded-lg shadow-lg hover:bg-yellow-600 transition-colors uppercase">
        Register Now
      </button>
    </div>
  );
}
