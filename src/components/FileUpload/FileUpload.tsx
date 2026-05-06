import React, { useRef, useState } from 'react';
import './FileUpload.css';

interface FileUploadProps {
  label: string;
  accept: string;
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  disabled?: boolean;
  maxSizeMB?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept,
  onFileSelect,
  selectedFile,
  disabled = false,
  maxSizeMB = 10,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    setError(null);

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const errorMsg = `File size exceeds ${maxSizeMB}MB limit`;
      setError(errorMsg);
      console.warn('File validation failed', {
        error: errorMsg,
        fileSize: file.size,
        maxSize: maxSizeBytes,
      });
      return false;
    }

    // Check file type
    const allowedTypes = accept.split(',').map(type => type.trim());
    const isValidType = allowedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      return file.type === type;
    });

    if (!isValidType) {
      const errorMsg = `Invalid file type. Allowed: ${accept}`;
      setError(errorMsg);
      console.warn('File validation failed', {
        error: errorMsg,
        fileType: file.type,
        allowedTypes,
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File | null) => {
    if (file && validateFile(file)) {
      onFileSelect(file);
      console.info('File selected', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });
    } else if (!file) {
      onFileSelect(null);
      setError(null);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);

    const file = event.dataTransfer.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = (event: React.MouseEvent) => {
    event.stopPropagation();
    onFileSelect(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    console.info('File removed');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="file-upload">
      <label className="file-upload-label">{label}</label>
      <div
        className={`file-upload-dropzone ${dragOver ? 'drag-over' : ''} ${disabled ? 'disabled' : ''} ${error ? 'error' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          disabled={disabled}
          style={{ display: 'none' }}
        />

        {selectedFile ? (
          <div className="file-upload-selected">
            <div className="file-info">
              <div className="file-name">{selectedFile.name}</div>
              <div className="file-size">{formatFileSize(selectedFile.size)}</div>
            </div>
            <button
              type="button"
              className="file-remove-btn"
              onClick={handleRemove}
              disabled={disabled}
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="file-upload-placeholder">
            <div className="upload-icon">📎</div>
            <div className="upload-text">
              <span className="primary-text">Click to upload or drag and drop</span>
              <span className="secondary-text">
                {accept} (max {maxSizeMB}MB)
              </span>
            </div>
          </div>
        )}
      </div>
      {error && <div className="file-upload-error">{error}</div>}
    </div>
  );
};

export default FileUpload;
