import React from "react";

const Candidatelist = ({ candidate,setId, selectedCandidate,setSelectedCandidate, handleCandidateSelection }) => {
  

  return (
    <div className="space-y-4  cursor-pointer" onClick={()=>{setId(candidate.id); setSelectedCandidate(candidate.name)}}>
          <div  className="flex items-center p-4 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 shadow-sm" 
>
            <input
              type="radio"
              id={candidate.id}
              name="candidate"
              value={candidate.name}
              checked={selectedCandidate === candidate.name}
              onChange={handleCandidateSelection} 
              className="mr-3 accent-green-500"

            />
            <label htmlFor={`${candidate.id}`} className="text-lg font-medium text-gray-800 dark:text-gray-200">
              {candidate.name}
            </label>
          </div>
   
    </div>
  );
};

export default Candidatelist;