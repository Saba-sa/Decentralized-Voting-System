"use client";
import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
// import Web3 from "web3";
import Errormodal from "@/components/Errormodal";

import { useVotingIntegrationstore } from "../Store/Votestore";
const Castvote = () => {
  const [cnicInput, setCnicInput] = useState("");
  const [randomnoInput, setRandomnoInput] = useState("");
  const [hash, setHash] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [errormsg, setError] = useState("");
  const [tempmsg, settempmsg] = useState("");

  const { contract } = useVotingIntegrationstore();

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

  useEffect(() => {
    checkValidity();
  }, [cnicInput, randomnoInput]);
  // const web3 = typeof window !== "undefined" ? new Web3(window.ethereum) : null;
  const getDetails = async (event) => {
    event.preventDefault();
    try {
      if (!cnicInput.length > 10 && !randomnoInput.length > 0) {
        settempmsg("PLease calculate serial number");
        return;
      }

      const cnicexist = await contract.methods.cnicVotes(cnicInput).call();
      if (!cnicexist) {
        settempmsg("This cnic was never used for voting");
      }
      const temp = "0x" + hash;
      const voteExists = await contract.methods.getVoteRecord(temp).call();
      setCandidateName(voteExists.name);
    } catch (error) {
      if (tempmsg.length > 1) {
        setError(tempmsg);
      } else {
        setError(` Something is wronge try again ${error}`);
      }
    }
  };

  const closeErrorModal = () => {
    setError("");
  };
  return (
    <div className="min-h-screen flex items-center justify-center w-full dark:bg-gray-950 bg-gray-100 p-12">
      <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg px-8 py-6 max-w-4xl">
        <h1 className="text-2xl font-bold text-center mb-4 dark:text-gray-200">
          Vote Cast
        </h1>
        <form action="#">
          <div className="flex gap-4 items-center justify-between">
            <div className="mb-4">
              <label
                htmlFor="cnic"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                CNIC(without dashes)
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
            <span>+</span>
            <div className="mb-4">
              <label
                htmlFor="randomno"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Random no(keep it secret)
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
            <span>=</span>
            <div className="mb-4">
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
            <div className="mb-4 self-end">
              <button
                onClick={getDetails}
                className="bg-blue-600 p-2 text-white rounded-md"
              >
                get
              </button>
            </div>
            <div className="mb-4">
              <label
                htmlFor="candidatename"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                You voted to
              </label>
              <input
                type="text"
                id="candidatename"
                className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="candidate Name "
                value={candidateName}
                readOnly
              />
            </div>
          </div>
        </form>
        {errormsg && (
          <Errormodal message={errormsg} onClose={closeErrorModal} />
        )}
      </div>
    </div>
  );
};

export default Castvote;
