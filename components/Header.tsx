
import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
                AI Document Auditor
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
                Automatically find discrepancies between Excel documents. Upload a master file and a file to audit, and let the AI do the hard work.
            </p>
        </header>
    );
};
