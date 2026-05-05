import React from 'react';

const DropZone: React.FC<{ onDrop: (files: FileList) => void; children?: React.ReactNode }> = ({ onDrop, children }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onDrop(e.dataTransfer.files);
    }
  };
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onDrop(e.target.files);
    }
  };
  return (
    <div className="drop-zone" onDrop={handleDrop} onDragOver={e => e.preventDefault()} onClick={handleClick} style={{ userSelect: 'none' }}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        multiple
      />
      {children}
    </div>
  );
};

export default DropZone;
