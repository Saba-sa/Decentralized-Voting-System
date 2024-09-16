// "use client";
// import React, { useEffect, useState } from "react";
// import { useVotingIntegrationstore } from "../app/Store/Votestore";

// const Timer = () => {
//   const { startTimer, setStartTimer, contract } = useVotingIntegrationstore();
//   const [currentTime, setCurrentTime] = useState(null);
//   const [targetTime, setTargetTime] = useState(null);
//   const [timeLeft, setTimeLeft] = useState("");

//   useEffect(() => {
//     const fetchCurrentTime = async () => {
//       if (startTimer) {
//         const time = await contract.methods.getCurrentTime().call();
//         const timestamp = Number(time) * 1000;
//         const currentDate = new Date(timestamp);
//         setCurrentTime(currentDate);

//         const threeHoursLaterTimestamp = timestamp + 3 * 60 * 60 * 1000;
//         setTargetTime(new Date(threeHoursLaterTimestamp));
//       }
//     };

//     fetchCurrentTime();
//   }, [startTimer]);

//   useEffect(() => {
//     const interval = setInterval(async () => {
//       if (startTimer && targetTime) {
//         const time = await contract.methods.getCurrentTime().call();
//         const timestamp = Number(time) * 1000;
//         const currentDate = new Date(timestamp);
//         setCurrentTime(currentDate);

//         const timeDifference = Math.max(
//           0,
//           Math.floor((targetTime - currentDate) / 1000)
//         );

//         setTimeLeft(`${Math.floor(timeDifference / 60)}m ${timeDifference % 60}s`);

//         if (currentDate >= targetTime) {
//           setStartTimer(false);
//           clearInterval(interval);
//         }
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [startTimer, targetTime, contract, setStartTimer]);

//   return (
//     startTimer && (
//       <div className="min-h-screen flex items-center justify-center w-full dark:bg-gray-950 bg-gray-100">
//         <h1 className="text-2xl">Timer</h1>
//         <p>Time Left: {timeLeft}</p>
//       </div>
//     )
//   );
// };

// export default Timer;
