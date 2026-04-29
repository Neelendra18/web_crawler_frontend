import React from 'react';

const Modal: React.FC<{ open: boolean; onClose: () => void; title: string; children: React.ReactNode; actions?: React.ReactNode }> = ({ open, onClose, title, children, actions }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay open">
      <div className="modal">
        <div className="modal-title">{title}</div>
        <div className="modal-body">{children}</div>
        <div className="modal-actions">{actions}</div>
      </div>
    </div>
  );
};

export default Modal;
