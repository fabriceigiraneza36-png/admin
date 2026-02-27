import React from "react";
import Modal from "./Modal";
import { HiOutlineExclamation } from "react-icons/hi";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  loading = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Action"
      size="sm"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Processing..." : confirmText}
          </button>
        </>
      }
    >
      <div className="confirm-dialog">
        <div className="confirm-icon">
          <HiOutlineExclamation />
        </div>
        <h3>{title}</h3>
        <p>{message}</p>
      </div>
    </Modal>
  );
}