// frontend/src/components/EmployeeForm/DeleteConfirmModal.tsx
import React from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface DeleteConfirmModalProps {
  employee: { id: string; name: string } | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const modalVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
};

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  employee,
  onConfirm,
  onCancel,
}) => {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="bg-white rounded-2xl max-w-md w-full p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Delete Employee</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <strong>{employee.name}</strong>? This
          action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};