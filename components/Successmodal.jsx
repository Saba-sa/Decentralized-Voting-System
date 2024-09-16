import React from 'react';

const Successmodal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-75">
      <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <div className="p-4 sm:p-10 text-center overflow-y-auto">
          <span className="mb-4 inline-flex justify-center items-center w-[100px] h-[100px] rounded-full border-4 border-green-50 bg-green-100 text-green-500">
            <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
              <path d="M6.293 9.293a1 1 0 0 1 1.414 0L12 12.586l4-4a1 1 0 1 1 1.414 1.414l-5 5a1 1 0 0 1-1.414 0L6.293 9.293a1 1 0 0 1 0-1.414z"></path>
            </svg>
          </span>
          <h3 className="mb-2 text-2xl font-bold text-gray-800">Success</h3>
          <p className="text-gray-500">{message}</p>

          <div className="mt-6 flex justify-center gap-x-4">
            <button
              onClick={onClose}
              type="button"
              className="py-2.5 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Successmodal;
