import React from 'react';

const Successmodal = ({ msg, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white text-green-700 rounded-lg shadow-lg p-6 relative max-w-sm mx-auto overflow-hidden">
        <h2 className="text-xl font-semibold mb-4">Success</h2>
        <p className='break-words overflow-hidden'>{msg}</p>
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl font-bold p-2 rounded-full border border-gray-400"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Successmodal;
