
import React from 'react';
import Loading from './Loading';

interface InputViewProps {
  transcript: string;
  setTranscript: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: string | null;
}

const InputView: React.FC<InputViewProps> = ({ transcript, setTranscript, onSubmit, isLoading, error }) => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl text-center">
        <div className="relative inline-block mb-4">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#6ea8ff] to-[#9b8cff] rounded-lg blur-lg opacity-50"></div>
            <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-300 py-2">
                Universal Explainer
            </h1>
        </div>
        <p className="max-w-xl mx-auto mt-4 text-base sm:text-lg text-slate-400">
          Paste any text, transcript, or concept below. Our AI will break it down into a comprehensive, multi-layered explanation perfect for any level of understanding.
        </p>

        <div className="mt-10 w-full">
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your text here... For example: 'Explain the concept of quantum entanglement.'"
            className="w-full h-48 p-4 text-base bg-[#0f1217] border border-white/10 rounded-lg resize-none focus:ring-2 focus:ring-[#6ea8ff]/50 focus:outline-none transition-shadow duration-300 placeholder-slate-500"
            disabled={isLoading}
          />
        </div>

        {error && (
            <div className="mt-4 text-sm text-red-400 bg-red-900/30 border border-red-500/50 rounded-md p-3 text-left">
                <p><strong>Error:</strong> {error}</p>
            </div>
        )}

        <div className="mt-6">
          <button
            onClick={onSubmit}
            disabled={isLoading || !transcript.trim()}
            className="w-full sm:w-auto px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-[#6ea8ff] to-[#9b8cff] rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#6ea8ff]/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loading className="w-6 h-6" />
                <span>Analyzing...</span>
              </div>
            ) : (
              'Generate Explanation'
            )}
          </button>
        </div>
      </div>
    </main>
  );
};

export default InputView;
