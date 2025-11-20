
import React from 'react';

interface ResultDisplayProps {
    result: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-teal-400 mb-4">Audit Results</h2>
            <div className="p-6 bg-slate-900/70 border border-slate-700 rounded-lg max-h-[60vh] overflow-y-auto">
                <pre className="text-gray-300 whitespace-pre-wrap font-sans text-sm sm:text-base leading-relaxed">
                    {result}
                </pre>
            </div>
        </div>
    );
};
