
import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { Spinner } from './components/Spinner';
import { auditDocuments } from './services/geminiService';
import { Header } from './components/Header';
import { ResultDisplay } from './components/ResultDisplay';

// This tells TypeScript that the XLSX object is available globally, loaded from the CDN
declare const XLSX: any;

const App: React.FC = () => {
  const [masterFile, setMasterFile] = useState<File | null>(null);
  const [auditFile, setAuditFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fileToText = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = event.target?.result;
          if (!data) {
            reject(new Error("Failed to read file data."));
            return;
          }
          const workbook = XLSX.read(data, { type: 'binary' });
          let fullText = '';
          workbook.SheetNames.forEach((sheetName: string) => {
            const worksheet = workbook.Sheets[sheetName];
            const csv = XLSX.utils.sheet_to_csv(worksheet);
            fullText += `Sheet: ${sheetName}\n\n${csv}\n\n---\n\n`;
          });
          resolve(fullText);
        } catch (e) {
          reject(e);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  }, []);

  const handleAudit = useCallback(async () => {
    if (!masterFile || !auditFile) {
      setError("Please upload both files before starting the audit.");
      return;
    }

    setIsLoading(true);
    setAuditResult('');
    setError(null);

    try {
      const masterFileContent = await fileToText(masterFile);
      const auditFileContent = await fileToText(auditFile);

      const result = await auditDocuments(masterFileContent, auditFileContent);
      setAuditResult(result);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during the audit.";
      setError(`Failed to process documents: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [masterFile, auditFile, fileToText]);

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        
        <main className="mt-8 bg-slate-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-2xl border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <FileUpload 
              label="Master Document (Template)" 
              onFileSelect={setMasterFile} 
              file={masterFile}
              id="master-file"
            />
            <FileUpload 
              label="Document to Audit" 
              onFileSelect={setAuditFile}
              file={auditFile}
              id="audit-file"
            />
          </div>
          
          <div className="mt-8 text-center">
            <button
              onClick={handleAudit}
              disabled={!masterFile || !auditFile || isLoading}
              className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-10 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-500/50 shadow-lg disabled:shadow-none"
            >
              {isLoading ? 'Auditing...' : 'Find Discrepancies'}
            </button>
          </div>

          {isLoading && (
            <div className="mt-8 flex flex-col items-center justify-center text-center">
              <Spinner />
              <p className="mt-4 text-lg text-teal-400 animate-pulse">
                AI is analyzing your documents...
              </p>
              <p className="text-sm text-slate-400">This may take a moment.</p>
            </div>
          )}

          {error && (
            <div className="mt-8 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
              <h3 className="font-bold">Error</h3>
              <p>{error}</p>
            </div>
          )}

          {auditResult && !isLoading && (
            <ResultDisplay result={auditResult} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
