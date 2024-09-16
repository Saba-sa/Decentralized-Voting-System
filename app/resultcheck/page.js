"use client";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { useVotingIntegrationstore } from "../Store/Votestore";
import Errormodal from "../../components/Errormodal";
import Timer from "@/components/Timer";

const Resultcheck = () => {
  const { contract, startTimer } = useVotingIntegrationstore();

  const [CandidateDetail, setCandidateDetail] = useState([]);
  const [tempCandidate, settempCandidate] = useState([]);
  const [winner, setWinner] = useState([]);
  const [errormsg, setError] = useState("");
  // const [isContractReady, setIsContractReady] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
    } else {
      setError("MetaMask is not installed.");
    }
  }, []);

  const showResult = async () => {
    try {
      console.log("temp", tempCandidate);
      if (!web3 || !contract) return; // Check if web3 and contract are initialized
      // const accounts = await web3.eth.getAccounts();
      const candidateDetails = await contract.methods.getResult().call();
      setCandidateDetail([...candidateDetails]);

      const tempCandidates = candidateDetails.map((i) => i.candidateName);
      settempCandidate([...tempCandidates]);

      const tempcandidateNames = [];

      candidateDetails.forEach((candidate) => {
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

      const allEqual = tempcandidateNames.every(
        (candidate) => candidate.votesCount === maxVotes
      );

      if (allEqual) {
        setWinner([{ name: "all have same votes", votesCount: maxVotes }]);
      } else {
        setWinner([...tempcandidateNames]);
      }
    } catch (error) {
      setError(`Error getting result: ${error.message}`);
    }
  };

  useEffect(() => {
    if (!startTimer && showResults) {
      console.log("Timer has ended, showing result.");
      showResult();
    }
  }, [startTimer, showResults]);

  const onTimerEnd = () => {
    setShowResults(true);
  };

  const closeErrorModal = () => {
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900  rounded-lg px-8 py-6 w-[90%] max-w-8xl">
        <h1 className="text-2xl font-bold text-center mb-4 dark:text-gray-200">
          Result
        </h1>
        {startTimer ? (
          <Timer onTimerEnd={onTimerEnd} />
        ) : (
          <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-100 dark:bg-gray-950">
            <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg px-8 py-6 mb-8 max-w-md w-full">
              <h1 className="text-2xl font-bold text-center mb-4 dark:text-gray-200">
                Winner
              </h1>
              <p className="text-lg font-medium text-gray-800 dark:text-gray-300">
                Name: {winner[0]?.name}
              </p>
              <p className="text-lg font-medium text-gray-800 dark:text-gray-300">
                Votes: {winner[0]?.votesCount}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg px-8 py-6 max-w-2lg w-full">
              <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">
                Votes Details
              </h2>
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Hash
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Votes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {CandidateDetail.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                        {item.serialNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                        {item.candidateName}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {errormsg && <Errormodal message={errormsg} onClose={closeErrorModal} />}
    </div>
  );
};

export default Resultcheck;
