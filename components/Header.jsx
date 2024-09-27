"use client";
import { usePathname } from "next/navigation"; 
import Link from "next/link";
import Web3 from "web3";
import { useEffect, useState } from "react";
import { useVotingIntegrationstore } from "../store/Dvotingstore"; 

export default function Header() {
  const pathname = usePathname(); 
  const {connectedWallet, setconnectedWallet } = useVotingIntegrationstore();

 const [walletConnected, setWalletConnected] = useState(
    connectedWallet ? `${connectedWallet.slice(0, 6)}...${connectedWallet.slice(-4)}` : "Connect Wallet"
  );

  

 useEffect(() => {
    const handleAccountsChanged = async (accounts) => {
      if (accounts.length > 0) {
        setconnectedWallet(accounts[0]);
      } else {
        setconnectedWallet("");
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [setconnectedWallet]);


   useEffect(() => {
    if (connectedWallet) {
      setWalletConnected(`${connectedWallet.slice(0, 6)}...${connectedWallet.slice(-4)}`);
    } else {
      setWalletConnected("Connect Wallet");
    }
  }, [connectedWallet]);


const connectWallet = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const walletAddress = accounts[0];

      setconnectedWallet(walletAddress);
      const truncatedAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
      setWalletConnected(truncatedAddress);
      
      return web3;
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      alert("Failed to connect. Please try again.");
    }
  } else {
    alert("MetaMask not found. Please install MetaMask.");
  }

  };

  return (
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-3xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          <Link href="/">Dvoting</Link>
        </div>

        <nav className="flex space-x-6">
          <Link
            href="/castvote"
            className={`${
              pathname === "/castvote"
                ? "text-green-400 border-b-2 border-green-400"
                : "text-gray-300 hover:text-green-400"
            } text-lg font-medium transition duration-300 ease-in-out`}
          >
            Cast Vote
          </Link>
          <Link
            href="/resultcheck"
            className={`${
              pathname === "/resultcheck"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-300 hover:text-blue-400"
            } text-lg font-medium transition duration-300 ease-in-out`}
          >
            Check Result
          </Link>
        </nav>

        <button 
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 px-5 rounded-full shadow-lg hover:shadow-yellow-400 transition duration-300 ease-in-out" 
          onClick={connectWallet}
        >
          {walletConnected ? walletConnected : "Connect Wallet"}
        </button>
      </div>
    </header>
  );
}
