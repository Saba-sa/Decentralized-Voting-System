"use client";
import React, { useState, useEffect } from "react";
import { useVotingIntegrationstore } from "../../store/Dvotingstore";
import Loader from "../loader/Page";

const Page = () => {
  const [candidateDetails, setCandidateDetail] = useState([]);
  const [winner, setWinner] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [loader, setLoader] = useState(true);
  const [tempCandidate, settempCandidate] = useState([]);
  const { contract, setTimeup } = useVotingIntegrationstore();

  useEffect(() => {
    const fetchVotingData = async () => {
      if (!contract) return;
      try {
        const allCandidatesAdded = await contract.methods
          .allCandidatesadded()
          .call();
        if (allCandidatesAdded) {
          const targetTime = Number(
            await contract.methods.getVotingEndTime().call()
          );

          const currentTime = Math.floor(Date.now() / 1000);

          if (currentTime >= targetTime) {
            setIsTimerActive(false);
            showResult();
            setTimeup(true);
            setLoader(false);
          } else {
            setIsTimerActive(true);
            const initialTimeInSeconds = targetTime - currentTime;
            const initialTimeInMillis = initialTimeInSeconds * 1000;
            setTimer(initialTimeInMillis);
            setLoader(false);

            const interval = setInterval(async () => {
              try {
                const updatedTime = Math.floor(Date.now() / 1000);
                const remainingTime = (targetTime - updatedTime) * 1000;
                if (remainingTime <= 0) {
                  
                  clearInterval(interval);
                  setIsTimerActive(false);
                  setTimeup(true);
                  showResult();
                } else {
                  setTimer(remainingTime);
                }
              } catch (error) {
                console.error("Error fetching current time:", error);
              }
            }, 1000);

            return () => clearInterval(interval);
          }
        }
      } catch (error) {
        console.error("Error fetching voting data:", error);
      }
    };
    fetchVotingData();
  }, [contract]);
  console.log(tempCandidate)
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const showResult = async () => {
    if (!web3 || !contract) return;
    try {
      const candidateResults = await contract.methods.getResult().call();
      setCandidateDetail([...candidateResults]);

      const tempCandidates = candidateResults.map((i) => i.candidateName);
      settempCandidate([...tempCandidates]);

      const tempcandidateNames = [];

      candidateResults.forEach((candidate) => {
        const existingCandidate = tempcandidateNames.find(
          (item) => item.name === candidate.candidateName
        );

        if (existingCandidate) {
          existingCandidate.votesCount++;
        } else {
          tempcandidateNames.push({
            name: candidate.candidateName,
            votesCount: 1,
          });
        }
      });

 tempcandidateNames.sort((a, b) => b.votesCount - a.votesCount);
    const maxVotes = tempcandidateNames[0]?.votesCount;
  if (tempcandidateNames.length === 1) {
      setWinner([tempcandidateNames[0]]);
    } else {
       
 const allEqual = tempcandidateNames.every(
      (candidate) => candidate.votesCount === maxVotes
    );
      if (allEqual) {
        setWinner([{ name: "All have same votes", votesCount: "All got same votes" }]);
      }  else {
      
      setWinner([{ name: "Two or more  have same votes", votesCount: "Two or more got same votes" }]); 
    }}
    } catch (error) {
      console.error(`Error showing results: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg rounded-lg my-12 overflow-hidden">
      {loader ? (
        <Loader />
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            Voting Results
          </h1>
          {isTimerActive ? (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-green-400">Timer</h2>
              <p className="text-lg font-medium">{formatTime(timer)}</p>
            </div>
          ) : (
            <>
              {winner && (
                <div className="bg-green-100 text-green-700 p-4 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold">Winner</h2>
                  <p className="text-lg">{winner[0]?.name}</p>
                  <p className="text-md">{winner[0]?.votesCount}</p>
                </div>
              )}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-blue-400">Results</h2>
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Candidate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Hash
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {candidateDetails.map((candidate) => (
                      <tr key={candidate.serialNo}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {candidate.candidateName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {candidate.serialNo}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Page;
