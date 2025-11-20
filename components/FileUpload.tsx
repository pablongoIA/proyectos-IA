
import React, { useCallback, useRef } from 'react';
import { UploadIcon, FileIcon } from './Icons';

interface FileUploadProps {
  label: string;
  onFileSelect: (file: File | null) => void;
  file: File | null;
  id: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, onFileSelect, file, id }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    onFileSelect(selectedFile);
  };

  const onDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  }, []);

  const onDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0] || null;
    if (droppedFile && (droppedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || droppedFile.name.endsWith('.xlsx'))) {
      onFileSelect(droppedFile);
    }
  }, [onFileSelect]);


  return (
    <div className="flex flex-col w-full">
      <label htmlFor={id} className="mb-2 font-semibold text-gray-300">{label}</label>
      <label
        htmlFor={id}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center w-full h-48 px-4 transition bg-slate-800 border-2 border-slate-700 border-dashed rounded-lg cursor-pointer hover:border-teal-500 hover:bg-slate-700/50 group`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
          {file ? (
            <>
              <FileIcon className="w-10 h-10 mb-3 text-teal-400" />
              <p className="font-bold text-gray-200 break-all">{file.name}</p>
              <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
              <button 
                onClick={(e) => { 
                  e.preventDefault(); 
                  onFileSelect(null);
                  if (inputRef.current) {
                    inputRef.current.value = "";
                  }
                }} 
                className="mt-2 text-sm text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </>
          ) : (
            <>
              <UploadIcon className="w-10 h-10 mb-3 text-gray-400 group-hover:text-teal-400 transition-colors" />
              <p className="mb-2 text-sm text-gray-400">
                <span className="font-semibold text-teal-400">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">XLSX files only</p>
            </>
          )}
        </div>
        <input 
          id={id} 
          ref={inputRef}
          type="file" 
          className="hidden" 
          onChange={handleFileChange}
          accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        />
      </label>
    </div>
  );
};
