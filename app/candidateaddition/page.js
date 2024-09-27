"use client";
import { useEffect, useState } from "react";
import { useVotingIntegrationstore } from "@/store/Dvotingstore";
import { useRouter } from "next/navigation";
import Loader from "../loader/Page";
export default function Page() {
  const [candidateName, setCandidateName] = useState("");
  const [allAdded, setAllAdded] = useState(false);
  const [loadershow, setloadershow] = useState(true);
  const {
    isOwner,
    contract,
    contractWallet,
    isAllCandidatesAdded,
    setisAllCandidatesAdded,
  } = useVotingIntegrationstore();
  const router = useRouter();
console.log('is owner',isOwner,contract,contractWallet,isAllCandidatesAdded)
  useEffect(() => {
    const checkIfaddes = async () => {
      if (contract) {
        console.log('inside contract use effect ')
        const allcandidates = await contractWallet.methods
          .allCandidatesadded()
          .call();
        console.log("all canidate added", allcandidates);
        if (allcandidates || !isOwner) {
          router.push("/castvote");
          setloadershow(false);
        } else {
          setloadershow(false);
        }
      }
    };
    checkIfaddes();
  }, [isAllCandidatesAdded, isOwner, router]);

  const handleAddCandidate = async (event) => {
    event.preventDefault();
    if (contract) {
      setloadershow(true);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const selectedAddress = accounts[0];
      console.log('account',selectedAddress)
      await contract.methods
        .addCandidate(candidateName.trim())
        .send({ from: selectedAddress });

      setCandidateName("");

      console.log("checked", allAdded);
      if (allAdded) {
        await contract.methods
          .setAllCandidatesAdded()
          .send({ from: window.ethereum.selectedAddress});
        await contract.methods
          .setVotingEndTime()
          .send({ from: window.ethereum.selectedAddress});
        const allcandidates = await contractWallet.methods
          .allCandidatesadded()
          .call();
        console.log("contract in candidate addition all setted", allcandidates);

        setisAllCandidatesAdded(allcandidates);
        setloadershow(false);
        router.push("/castvote");
      }
      setloadershow(false);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-800 text-white shadow-lg rounded-lg my-8">
      {loadershow ? (
        <Loader />
      ) : (
        <>
          {" "}
          <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-800">
            Add Candidates
          </h1>
          <form onSubmit={handleAddCandidate} className="space-y-6">
            <div>
              <label
                htmlFor="candidate-name"
                className="block text-lg font-medium mb-2 text-green-600"
              >
                Candidate Name
              </label>
              <input
                id="candidate-name"
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="border border-gray-600 p-2 w-full rounded-lg text-gray-900"
                placeholder="Enter candidate name"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                id="all-added"
                type="checkbox"
                checked={allAdded}
                onChange={() => setAllAdded(!allAdded)}
                className="mr-2 accent-green-800"
              />
              <label htmlFor="all-added" className="text-lg text-blue-600">
                All candidates added
              </label>
            </div>

            <button
              type="submit"
              className="bg-green-400 hover:bg-green-600 text-gray-900 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
            >
              Add Candidate
            </button>
          </form>
        </>
      )}
    </div>
  );
}
