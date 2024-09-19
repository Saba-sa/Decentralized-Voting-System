"use client";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { useContext, createContext } from "react";
import HandleVote from "../out/VotingSystem.sol/HandleVote.json";

const VotingIntegrationstore = createContext();

const Votestore = ({ children }) => {
  const [contract, setContract] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [connectedWallet, setconnectedWallet] = useState("");
  const [ownersAddress, setownersAddress] = useState("");
  const [isAllCandidatesAdded, setisAllCandidatesAdded] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [startTimer, setStartTimer] = useState(false);
  useEffect(() => {
    if (connectedWallet === ownersAddress) {
      setIsOwner(true);
    }
  }, [contract, connectedWallet, isAllCandidatesAdded]);
  const getContractDetails = async () => {
    if (connectedWallet.length > 1) {
      try {
        const web3Instance = new Web3(window.ethereum);
        const { abi, networks } = HandleVote;

        const networkData = networks["local"];
        console.log("network data", networkData);
        // const networkData = networks[11155111];
        const contractAddress = networkData?.address;

        if (contractAddress) {
          const contractInstance = new web3Instance.eth.Contract(
            abi,
            contractAddress
          );
          setContract(contractInstance);

          try {
            const ownerAddress = await contractInstance.methods.owner().call();
            setownersAddress(ownerAddress);
          } catch (methodCallError) {
            console.error("Error calling 'owner' method:", methodCallError);
          }
        }
      } catch (initializationError) {
        console.error("Error initializing contract:", initializationError);
      }
    } else {
      console.error("Please connect MetaMask first");
      alert("Please connect MetaMask first.");
    }
  };
  useEffect(() => {
    getContractDetails();
  }, [connectedWallet]);
  useEffect(() => {
    if (connectedWallet) {
      getContractDetails();
    }
    const reconnectWallet = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setconnectedWallet(accounts[0]);
        }
      }
    };
    reconnectWallet();
  }, []);

  return (
    <VotingIntegrationstore.Provider
      value={{
        contract,
        setContract,
        isOwner,
        setIsOwner,
        isAllCandidatesAdded,
        setisAllCandidatesAdded,
        startTimer,
        isLoading,
        setLoading,
        setStartTimer,
        connectedWallet,
        setconnectedWallet,
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
