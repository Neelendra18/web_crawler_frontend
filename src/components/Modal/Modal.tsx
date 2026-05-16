import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';


const Modal: React.FC<{ open: boolean; onClose: () => void; title: string; children: React.ReactNode; actions?: React.ReactNode }> = ({ open, title, children, actions }) => {
  if (!open) return null;
  const modalContent = (
    <div className="modal-root">
      <div className="modal-overlay open">
        <div className="modal">
          <div className="modal-title">{title}</div>
          <div className="modal-body">{children}</div>
          <div className="modal-actions">{actions}</div>
        </div>
      </div>
    </div>
  );
  // Use portal if document is available (browser)
  if (typeof document !== 'undefined') {
    const root = document.getElementById('root');
    return root ? ReactDOM.createPortal(modalContent, root) : modalContent;
  }
  // SSR fallback
  return modalContent;
};

export default Modal;
