import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { ReportView } from './components/ReportView';
import { analyzeResearchTopic } from './services/geminiService';
import { AnalysisResult } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (topic: string, model: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisData = await analyzeResearchTopic(topic, model);
      setResult(analysisData);
    } catch (err: any) {
      console.error(err);
      setError("An error occurred while analyzing the literature. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (result && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [result]);

  return (
    // Aesthetic: Slate 50 background, Indigo accents
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Header />
      
      <main className="relative flex flex-col items-center">
        <SearchForm onSearch={handleSearch} isLoading={loading} />

        {error && (
          <div className="w-full max-w-3xl px-4 mb-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-900 rounded-r shadow-sm">
              <p className="font-bold font-serif">System Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        <div ref={resultsRef} className="w-full">
          {result && (
            <ReportView result={result} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;