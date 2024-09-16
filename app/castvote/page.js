"use client";
import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import Candidatelist from "@/components/Candidatelist";
import Web3 from "web3";
import Errormodal from "@/components/Errormodal";
import Successmodal from "@/components/Successmodal";
import { useVotingIntegrationstore } from "../Store/Votestore";
import Loader from "../loader/Page";

const Castvote = () => {
  const [cnicInput, setCnicInput] = useState("");
  const [randomnoInput, setRandomnoInput] = useState("");
  const [hash, setHash] = useState("");
  const [candidateDetail, setCandidateDetail] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [idofcan, setId] = useState(0);
  const [errormsg, setError] = useState("");
  const [sucessMsg, setSuccess] = useState("");
  const [loader, setLoader] = useState(false);
  const { contract, router, startTimer } = useVotingIntegrationstore();

  const calculateHash = () => {
    const input = cnicInput + randomnoInput;
    const hashResult = CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
    setHash(hashResult);
  };

  const checkValidity = () => {
    const regestForCnic = /^\d{13}$/;
    if (regestForCnic.test(cnicInput) && randomnoInput.length >= 1) {
      calculateHash();
    }
  };

  const handleCandidateSelection = (e) => {
    setSelectedPerson(e.target.value);
  };

  useEffect(() => {
    checkValidity();
  }, [cnicInput, randomnoInput]);

  useEffect(() => {
    const getdetail = async () => {
      if (contract) {
        getCandidateDetail();
      }
    };
    getdetail();
  }, [contract]);

  useEffect(() => {
    if (!startTimer) {
      router.push("/resultcheck");
    }
  }, [startTimer]);

  const web3 = typeof window !== "undefined" ? new Web3(window.ethereum) : null;

  const castVote = async (event) => {
    event.preventDefault();
    setLoader(true);
    try {
      const accounts = await web3.eth.getAccounts();
      if (idofcan.length < 0) {
        setLoader(false);
        setError("Any candidate must be selected");
        return;
      }

      if (!cnicInput || !randomnoInput) {
        setLoader(false);
        setError("Please calculate serial number");
        return;
      }

      const selectedAccount = accounts[0];
      const temp = "0x".concat(hash);
      await contract.methods
        .balletPaper(temp, cnicInput, idofcan)
        .send({ from: selectedAccount, gas: 3000000 });

      setLoader(false);
      setSuccess("Vote cast successfully");
      setTimeout(() => {
        router.push("/checkvote");
      }, 2000);
    } catch (error) {
      setLoader(false);
      setError(
        `Error while casting vote. Please fill the fields carefully: ${error.message}`
      );
    }
  };

  const getCandidateDetail = async () => {
    try {
      const count = await contract.methods.candidateCount().call();
      const candidatesList = [];
      for (let i = 0; i < Number(count); i++) {
        const detail = await contract.methods.getCandidate(i).call();
        candidatesList.push({ id: i, name: detail.name });
      }
      setCandidateDetail(candidatesList);
    } catch (error) {
      setError(`Error fetching candidate details: ${error.message}`);
    }
  };

  const closeSuccessModal = () => {
    setSuccess("");
  };

  const closeErrorModal = () => {
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full dark:bg-gray-950 bg-gray-100 p-6 md:p-12">
      {loader ? (
        <Loader />
      ) : (
        startTimer && (
          <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg px-6 py-6 max-w-full md:max-w-4xl w-full">
            <h1 className="text-2xl font-bold text-center mb-6 dark:text-gray-200">
              Cast Your Vote
            </h1>
            <form onSubmit={castVote}>
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="w-full">
                  <label
                    htmlFor="cnic"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    CNIC (without dashes)
                  </label>
                  <input
                    type="text"
                    id="cnic"
                    className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Your CNIC"
                    required
                    value={cnicInput}
                    onChange={(e) => {
                      setCnicInput(e.target.value);
                      checkValidity();
                    }}
                  />
                </div>

                <div className="w-full">
                  <label
                    htmlFor="randomno"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Random no (keep it secret)
                  </label>
                  <input
                    type="text"
                    id="randomno"
                    className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Random phrase or number"
                    required
                    value={randomnoInput}
                    onChange={(e) => {
                      setRandomnoInput(e.target.value);
                      checkValidity();
                    }}
                  />
                </div>

                <div className="w-full">
                  <label
                    htmlFor="serialno"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Ballet Serial No
                  </label>
                  <input
                    type="text"
                    id="serialno"
                    className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ballet paper serial no"
                    value={hash}
                    readOnly
                  />
                </div>
              </div>

              <div className="my-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                    Candidates
                  </h2>
                  <p className="mt-2 text-base text-gray-600">
                    Your vote is your voice! Choose the candidate who truly
                    represents your values.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {candidateDetail.length > 0 ? (
                    candidateDetail.map((item) => (
                      <Candidatelist
                        key={item.id}
                        id={item.id}
                        setId={setId}
                        name={item.name}
                        selectedPerson={selectedPerson}
                        handleCandidateSelection={handleCandidateSelection}
                      />
                    ))
                  ) : (
                    <p>Loading candidates...</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cast Vote
              </button>
            </form>

            {sucessMsg && (
              <Successmodal message={sucessMsg} onClose={closeSuccessModal} />
            )}

            {errormsg && (
              <Errormodal message={errormsg} onClose={closeErrorModal} />
            )}
          </div>
        )
      )}
    </div>
  );
};

export default Castvote;
