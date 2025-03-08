import { Modal, Button } from "@nextui-org/react";
import { useState } from "react";

export const CancelOrderModal = ({ isOpen, onClose }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      className="w-full h-full flex items-center justify-center bg-gray-100"
    >
      <div className="w-full h-full flex flex-col items-center justify-center bg-white p-6 shadow-lg">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Welcome to Popup</h3>
        <p className="text-gray-600">This is a normal popup with data.</p>
        <div className="flex gap-4 mt-6">
          <Button auto color="primary" onClick={() => alert("Submitted!")}>Submit</Button>
          <Button auto color="error" onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};
