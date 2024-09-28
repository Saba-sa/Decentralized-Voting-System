"use client";
import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import Candidatelist from "../../components/Candidatelist";
import { useVotingIntegrationstore } from "../../store/Dvotingstore";
import Loader from "../loader/Page";
import Successmodal from "../../components/Modalforsucess";
import Errormodal from "../../components/Modalforeorr";
import { useRouter } from "next/navigation";

const Castvote = () => {
  const [cnic, setCnic] = useState("");
  const [randomno, setrandomno] = useState("");
  const [hash, setHash] = useState("");
  const [candidateDetail, setCandidateDetail] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [idofcan, setId] = useState(0);
  const [loader, setLoader] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const { contract, contractWallet, timeup } = useVotingIntegrationstore();
  const router = useRouter();

  const calculateHash = () => {
    if (cnic && randomno) {
      const input = cnic + randomno;
      const hashResult = CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
      setHash(hashResult);
    }
  };
  useEffect(() => {
    setLoader(true)
    if (timeup) {
      setLoader(false)
      router.push("/resultcheck");
    }
  }, [timeup]);
  const checkValidity = () => {
    const regestForCnic = /^\d{13}$/;
    if (regestForCnic.test(cnic) && randomno.length >= 1) {
      calculateHash();
      setErrorMessage("");
    } else {
      setHash("");
      if (!regestForCnic.test(cnic)) {
        setErrorMessage("Invalid CNIC. CNIC must be 13 digits.");
      } else {
        setErrorMessage("Random number is required.");
      }
    }
  };

  const handleCandidateSelection = (e) => {
    setSelectedCandidate(e.target.value);
    setId(e.target.id);
  };

  const castVote = async (event) => {
    event.preventDefault();
    setLoader(true);
    try {
      if (!selectedCandidate) {
        setErrorModalMessage("Please select a candidate.");
        setShowErrorModal(true);
        setLoader(false);
        return;
      }

      if (!cnic || !randomno) {
        setErrorModalMessage("Please complete all fields.");
        setShowErrorModal(true);

        setLoader(false);
        return;
      }

      if (!hash) {
        setErrorModalMessage(
          "Hash not generated. Check CNIC and random number."
        );
        setShowErrorModal(true);

        setLoader(false);
        return;
      }

      const temp = "0x".concat(hash);
      await contract.methods
        .balletPaper(temp, cnic, idofcan)
        .send({ from: window.ethereum.selectedAddress });

      setSuccessMsg("Vote cast successfully!");
      setShowSuccessModal(true);
      setLoader(false);
      setCnic("");
      setrandomno("");
      setHash("");
    } catch (error) {
      setLoader(false);
      setErrorModalMessage(
        `Error casting vote: ${error.message.split(":")[0]}`
      );
      setShowErrorModal(true);
    }
  };

  const getCandidateDetail = async () => {
    try {
      const count = await contractWallet.methods.candidateCount().call();
      const candidatesList = [];
      for (let i = 0; i < Number(count); i++) {
        const detail = await contractWallet.methods.getCandidate(i).call();
        candidatesList.push({ id: i, name: detail.name });
      }
      setCandidateDetail(candidatesList);
      setLoader(false);
    } catch (error) {
      setErrorModalMessage(
        `Error fetching candidate details: ${error.message}`
      );
      setShowErrorModal(true);
    }
  };

  useEffect(() => {
    checkValidity();
  }, [cnic, randomno]);

  useEffect(() => {
    if (contract) {
      getCandidateDetail();
    }
  
  }, [contract]);

  const closeSuccessModal = () => setShowSuccessModal(false);
  const closeErrorModal = () => setShowErrorModal(false);

  return (
    <div className="container mx-auto p-6 bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg rounded-lg my-12 overflow-hidden ">
      {loader ? (
        <Loader />
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            Cast Your Vote
          </h1>
          <form onSubmit={castVote} className="space-y-6">
            <div>
              <label
                htmlFor="cnic"
                className="block text-lg font-medium mb-2 text-green-400"
              >
                CNIC
              </label>
              <input
                id="cnic"
                type="text"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
                className="border border-gray-600 p-2 w-full rounded-lg text-gray-900"
                placeholder="Enter CNIC"
                required
              />
            </div>

            <div>
              <label
                htmlFor="random-number"
                className="block text-lg font-medium mb-2 text-green-400"
              >
                Random Number
              </label>
              <input
                id="random-number"
                type="text"
                value={randomno}
                onChange={(e) => setrandomno(e.target.value)}
                className="border border-gray-600 p-2 w-full rounded-lg text-gray-900"
                placeholder="Enter random number"
                required
              />
            </div>

            {errorMessage && (
              <div className="text-red-500">
                <p>{errorMessage}</p>
              </div>
            )}

            {hash && (
              <div>
                <label className="block text-lg font-medium mb-2 text-blue-400">
                  Hash
                </label>
                <p className="border border-gray-600 p-2 rounded-lg bg-gray-800 text-gray-300">
                  {hash}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-lg font-medium mb-2 text-blue-400">
                Select Candidate
              </label>
              {candidateDetail?.length > 0 ? (
                candidateDetail.map((candidate) => (
                  <Candidatelist
                    key={candidate.id}
                    candidate={candidate}
                    setSelectedCandidate={setSelectedCandidate}
                    setId={setId}
                    selectedCandidate={selectedCandidate}
                    handleCandidateSelection={handleCandidateSelection}
                  />
                ))
              ) : (
                <p>Loading candidates...</p>
              )}
            </div>

            <button
              type="submit"
              className="bg-green-400 hover:bg-green-500 text-gray-900 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
            >
              Cast Vote
            </button>
          </form>
          {showSuccessModal && (
            <Successmodal msg={successMsg} onClose={closeSuccessModal} />
          )}
          {showErrorModal && (
            <Errormodal msg={errorModalMessage} onClose={closeErrorModal} />
          )}
        </>
      )}
    </div>
  );
};

export default Castvote;
