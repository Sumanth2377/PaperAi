import React, { useState } from 'react';
import { Search, ArrowRight, Loader2, Sparkles } from 'lucide-react';

interface SearchFormProps {
  onSearch: (topic: string, model: string) => void;
  isLoading: boolean;
}

const EXAMPLES = [
  { topic: "Deepfakes detection", model: "Capsule Networks" },
  { topic: "Stock market prediction", model: "LSTM with Attention" },
  { topic: "Protein folding", model: "AlphaFold 2" },
];

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [model, setModel] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSearch(topic, model);
    }
  };

  const loadExample = (exTopic: string, exModel: string) => {
    setTopic(exTopic);
    setModel(exModel);
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-16 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10 transition-shadow hover:shadow-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-3">
            Literature Analysis
          </h2>
          <p className="text-slate-500 text-lg font-light">
            Validate research novelty and explore state-of-the-art models.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="topic" className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
              Research Topic <span className="text-indigo-600">*</span>
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Melanoma classification in dermatoscopic images"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="model" className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
              Proposed Model (Optional)
            </label>
            <input
              id="model"
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g., Swin Transformer"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="w-full mt-6 bg-indigo-950 hover:bg-indigo-800 text-white font-medium py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing Literature...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Generate Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {!isLoading && (
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap justify-center gap-2">
            {EXAMPLES.map((ex, idx) => (
              <button
                key={idx}
                onClick={() => loadExample(ex.topic, ex.model)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 rounded-lg text-sm font-medium transition-colors border border-slate-200 hover:border-indigo-200 flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3" />
                <span>{ex.topic}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};