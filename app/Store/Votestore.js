"use client";
import React, { useEffect, useState } from "react";
import { useContext, createContext } from "react";
import Handlevote from "../contract/HandleVote.json";
import Web3 from "web3";
import { useRouter } from "next/navigation";

const VotingIntegrationstore = createContext();

const Votestore = ({ children }) => {
  const [contract, setContract] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isAllCandidatesAdded, setisAllCandidatesAdded] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [web3, setWeb3] = useState(null);
  const [startTimer, setStartTimer] = useState(false);
  const [targetTime, setTargetTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);

  const router = useRouter();
  useEffect(() => {
    const InitializeContract = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });
          setWeb3(web3Instance);

          const { abi, networks } = Handlevote;
          const networkData = networks[11155111];
          const contractAddress = networkData?.address;

          if (contractAddress) {
            const contractInstance = new web3Instance.eth.Contract(
              abi,
              contractAddress
            );
            setContract(contractInstance);

            try {
              const ownerAddress = await contractInstance.methods
                .owner()
                .call();
              const accounts = await web3Instance.eth.getAccounts();
              console.log("accounts", web3, accounts);
              const currentAccount = accounts[0];

              setIsOwner(
                currentAccount.toLowerCase() === ownerAddress.toLowerCase()
              );
            } catch (methodCallError) {
              console.error("Error calling 'owner' method:", methodCallError);
            }

            setLoading(false);
          } else {
            setLoading(false);
          }
        } catch (initializationError) {
          console.error("Error initializing contract:", initializationError);
          setLoading(false);
        }
      } else {
        console.error("Please install MetaMask.");
        alert("MetaMask is required to connect.");
        setLoading(false);
      }
    };

    InitializeContract();
  }, []);
  return (
    <VotingIntegrationstore.Provider
      value={{
        contract,
        isOwner,
        isLoading,
        router,
        isAllCandidatesAdded,
        setisAllCandidatesAdded,
        startTimer,
        setStartTimer,
        targetTime,
        setTargetTime,
        currentTime,
        setCurrentTime,
      }}
    >
      {children}
    </VotingIntegrationstore.Provider>
  );
};

const useVotingIntegrationstore = () => {
  return useContext(VotingIntegrationstore);
};

export { Votestore, useVotingIntegrationstore };
