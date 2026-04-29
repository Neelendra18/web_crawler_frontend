import React from 'react';

const DropZone: React.FC<{ onDrop: (files: FileList) => void; children?: React.ReactNode }> = ({ onDrop, children }) => {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onDrop(e.dataTransfer.files);
    }
  };
  return (
    <div className="drop-zone" onDrop={handleDrop} onDragOver={e => e.preventDefault()}>
      {children}
    </div>
  );
};

export default DropZone;
