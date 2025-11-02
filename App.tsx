
import React, { useState, useCallback } from 'react';
import { AdvancedExplanation } from './types';
import { generateAdvancedExplanation } from './services/geminiService';
import ExplanationView from './components/ExplanationView';
import InputView from './components/InputView';

const App: React.FC = () => {
  const [transcript, setTranscript] = useState<string>('');
  const [explanation, setExplanation] = useState<AdvancedExplanation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!transcript.trim()) {
      setError('Please enter some text to explain.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateAdvancedExplanation(transcript);
      setExplanation(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [transcript]);

  const handleReset = useCallback(() => {
    setTranscript('');
    setExplanation(null);
    setError(null);
    setIsLoading(false);
  }, []);
  
  return (
    <div className="min-h-screen bg-[#0b0d10] text-[#e7edf3] w-full">
      {explanation ? (
        <ExplanationView 
          explanation={explanation} 
          onReset={handleReset} 
          rawTranscript={transcript}
        />
      ) : (
        <InputView
          transcript={transcript}
          setTranscript={setTranscript}
          onSubmit={handleGenerate}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
};

export default App;
