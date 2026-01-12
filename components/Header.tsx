import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-6 border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="bg-indigo-900 text-white p-2 rounded-lg shadow-sm transition-transform group-hover:scale-105">
            <BookOpen className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-serif font-bold tracking-tight text-slate-900">
            Paper<span className="text-indigo-700">AI</span>
          </h1>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wide">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          <span>Research Assistant</span>
        </div>
      </div>
    </header>
  );
};