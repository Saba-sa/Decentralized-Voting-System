"use client";
import React, { useEffect, useState } from "react";
import { useVotingIntegrationstore } from "../app/Store/Votestore";

const Timer = () => {
  const { startTimer, setStartTimer, contract, targetTime, setTargetTime, currentTime, setCurrentTime } = useVotingIntegrationstore();
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const fetchCurrentTime = async () => {
      if (startTimer && !targetTime) {
        const time = await contract.methods.getCurrentTime().call();
        const timestamp = Number(time) * 1000; 
        const currentDate = new Date(timestamp);
        setCurrentTime(currentDate);

        const threeHoursLaterTimestamp = timestamp + 3 * 60 * 60 * 1000;
        setTargetTime(new Date(threeHoursLaterTimestamp));
      }
    };

    fetchCurrentTime();
  }, [startTimer, targetTime, contract, setCurrentTime, setTargetTime]);

  useEffect(() => {
    if (targetTime && currentTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const timeDifference = targetTime.getTime() - now.getTime();

        if (timeDifference <= 0) {
          clearInterval(interval);
          setTimeLeft("0h 0m 0s");
          setStartTimer(false); 
        } else {
          const hours = Math.floor(timeDifference / (1000 * 60 * 60));
          const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [targetTime, currentTime, setStartTimer]);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 border border-gray-300 rounded-lg shadow-lg p-4 m-4">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Time Left:</h2>
      <div className="text-2xl font-bold text-blue-600">{timeLeft}</div>
    </div>
  );
};

export default Timer;
