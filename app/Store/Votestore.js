"use client";
import React, { useEffect, useState } from "react";
import { useContext, createContext } from "react";
import Handlevote from "../../out/VotingSystem.sol/HandleVote.json";
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

  const router = useRouter();
  useEffect(() => {
    const InitializeContract = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });
          setWeb3(web3Instance);

          // const networkId = await web3Instance.eth.net.getId();
          const { abi, networks } = Handlevote;
          // const deployedNetwork = networks[networkId];
          const networkData = networks["local"];
          const contractAddress = networkData?.address;

          // if (deployedNetwork && deployedNetwork.address) {
          if (contractAddress) {
            // const contractAddress = deployedNetwork.address;
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
              const currentAccount = accounts[0];

              if (currentAccount.toLowerCase() === ownerAddress.toLowerCase()) {
                setIsOwner(true);
              } else {
                setIsOwner(false);
              }
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
