"use client";
import React, { useEffect, useState } from "react";
// import Web3 from "web3";
import { useVotingIntegrationstore } from "../Store/Votestore";
import Errormodal from "@/components/Errormodal";
import Successmodal from "@/components/Successmodal";

const Candidateaddition = () => {
  const {
    contract,
    router,
    setisAllCandidatesAdded,
    isAllCandidatesAdded,
    setStartTimer,
  } = useVotingIntegrationstore();

  const [candidateName, setCandidateName] = useState("");
  const [isNotChecked, setIsNotChecked] = useState(false);
  const [errormsg, setError] = useState("");
  const [sucessMsg, setSuccess] = useState("");

  // const web3 = typeof window !== "undefined" ? new Web3(window.ethereum) : null;

  useEffect(() => {
    const checkCompletionStatus = () => {
      if (isAllCandidatesAdded === true) {
        router.push("/castvote");
      }
    };

    checkCompletionStatus();
  }, [router, isAllCandidatesAdded]);

  const handleAddCandidate = async (event) => {
    event.preventDefault();
    try {
      // const accounts = await web3.eth.getAccounts();
      if (!candidateName) {
        setError("Candidate name is required");
        return;
      }

      await contract.methods
        .addCandidate(candidateName)
        .send({ from: window.ethereum.selectedAddress, gas: 3000000 });
      setSuccess("Candidate added successfully");
      setCandidateName("");
      if (isNotChecked) {
        setSuccess("All candidates are added.");
        setisAllCandidatesAdded(true);
        setStartTimer(true);
        router.push("/castvote");
      }
    } catch (error) {
      setError("Error adding candidate:", error);
    }
  };

  const closeSuccessModal = () => {
    setSuccess("");
  };

  const closeErrorModal = () => {
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full dark:bg-gray-950 bg-gray-100">
      <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg px-6 py-8 max-w-lg w-full sm:max-w-2xl md:max-w-4xl mx-4 sm:mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 dark:text-gray-200">
          Add candidate
        </h1>
        <form onSubmit={handleAddCandidate}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="shadow-sm rounded-md w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Candidate Name"
              required
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 sm:h-5 sm:w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:outline-none mr-2"
                onClick={() => setIsNotChecked(true)}
              />
              <label
                htmlFor="remember"
                className="block text-sm sm:text-base text-gray-700 dark:text-gray-300"
              >
                Yes, I have added all candidates
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 sm:py-3 sm:px-5 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add
          </button>
        </form>

        {sucessMsg && (
          <Successmodal message={sucessMsg} onClose={closeSuccessModal} />
        )}

        {errormsg && (
          <Errormodal message={errormsg} onClose={closeErrorModal} />
        )}
      </div>
    </div>
  );
};

export default Candidateaddition;
