import React from 'react'

const Candidatelist = ({ id, setId, name, selectedPerson, handleCandidateSelection }) => {
  console.log('id',id)
  return (
    <>
      <label htmlFor={name}
        className="transition-all duration-1000 bg-white hover:bg-blue-500 hover:shadow-xl m-2 p-2 relative  group cursor-pointer  flex items-center justify-start "
      >
        <input type="radio" id={name} name="candidate"
          value={name}
          checked={selectedPerson === name}
          onChange={handleCandidateSelection}
          onClick={() => setId(id)}

          className="form-checkbox h-5 w-5 text-blue-600" />
        <div className="absolute bg-blue-500/50 top-0 left-0 w-32 h-1  transition-all duration-200 group-hover:bg-white group-hover:w-1/2"></div>
        <div className="py-2 px-9 relative">

          <h2 className="mt-3 text-xl font-semibold text-gray-800 group-hover:text-white">
            {name}
          </h2>

        </div>
      </label>

    </>

  )
}

export default Candidatelist