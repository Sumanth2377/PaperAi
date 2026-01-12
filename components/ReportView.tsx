import React from 'react';
import {
  FileText,
  Lightbulb,
  TrendingUp,
  ExternalLink,
  Zap,
  Layers,
  Cpu,
  ShieldCheck,
  Search,
  Library,
  AlertTriangle
} from 'lucide-react';
import { AnalysisResult } from '../types';
import { ModelChart } from './ModelChart';

interface ReportViewProps {
  result: AnalysisResult;
}

export const ReportView: React.FC<ReportViewProps> = ({ result }) => {
  const { report, sources, rawText } = result;

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white border border-red-200 rounded-xl shadow-sm mt-8">
        <h2 className="text-lg font-bold text-red-700 mb-4 font-serif">Analysis Parsing Issue</h2>
        <p className="text-slate-700 mb-4">
          The analysis generated raw text but could not be formatted perfectly.
        </p>
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 font-mono text-sm text-slate-800 whitespace-pre-wrap max-h-[500px] overflow-y-auto">
          {rawText}
        </div>
      </div>
    );
  }

  const isNovel = !report.noveltyCheck.isUsed;

  return (
    <div className="max-w-6xl mx-auto px-6 pb-20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pt-8">

      {/* Disclaimer */}
      <div className="p-4 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 text-sm flex items-start shadow-sm">
        <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>AI-Generated Content:</strong> Please independently verify all citations and model details.
          While we strive for accuracy, generative models can occasionally produce incorrect or "hallucinated" references.
        </p>
      </div>

      {/* 1. Overview Card */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <div className="flex items-center space-x-2 text-indigo-800 mb-4 border-b border-slate-100 pb-2">
          <FileText className="w-5 h-5" />
          <h2 className="text-sm font-bold uppercase tracking-widest">Topic Overview</h2>
        </div>
        <p className="text-xl font-serif text-slate-800 leading-relaxed">
          {report.topicOverview}
        </p>
      </section>

      {/* 2. Novelty Assessment with Proof Link */}
      <section className={`rounded-2xl border p-8 shadow-sm relative overflow-hidden
        ${isNovel
          ? 'bg-emerald-50 border-emerald-100'
          : 'bg-amber-50 border-amber-100'
        }`}>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className={`flex-shrink-0 p-4 rounded-2xl bg-white border shadow-sm
            ${isNovel ? 'text-emerald-700 border-emerald-100' : 'text-amber-700 border-amber-100'}`}>
            {isNovel ? <Zap className="w-8 h-8" /> : <Layers className="w-8 h-8" />}
          </div>
          <div className="flex-1">
            <h2 className={`text-2xl font-serif font-bold mb-3 ${isNovel ? 'text-emerald-900' : 'text-amber-900'}`}>
              {report.noveltyCheck.summary}
            </h2>
            <p className={`text-lg leading-relaxed mb-6 ${isNovel ? 'text-emerald-800' : 'text-amber-900'}`}>
              {report.noveltyCheck.details}
            </p>

            {/* Evidence Proof Section */}
            {(report.noveltyCheck.evidenceTitle || report.noveltyCheck.evidenceLink) && (
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4
                ${isNovel ? 'bg-emerald-100/50 border-emerald-200' : 'bg-amber-100/50 border-amber-200'}`}>
                <div className="flex items-center gap-3">
                  <ShieldCheck className={`w-5 h-5 ${isNovel ? 'text-emerald-700' : 'text-amber-700'}`} />
                  <div className="text-sm">
                    <span className="font-bold block uppercase tracking-tight text-[10px] opacity-60 mb-0.5">
                      {isNovel ? 'Closest Existing Work' : 'Primary Evidence Paper'}
                    </span>
                    <span className="font-semibold text-slate-900 line-clamp-1">
                      {report.noveltyCheck.evidenceTitle || "Research Evidence Base"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {report.noveltyCheck.evidenceLink && report.noveltyCheck.evidenceLink.startsWith('http') ? (
                    <a
                      href={report.noveltyCheck.evidenceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all
                        ${isNovel ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-amber-600 text-white hover:bg-amber-700'}`}
                    >
                      View Paper
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  ) : null}

                  <a
                    href={`https://scholar.google.com/scholar?q=${encodeURIComponent(report.noveltyCheck.evidenceTitle || "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold bg-slate-800 text-white hover:bg-slate-900 shadow-sm transition-all"
                  >
                    Search Scholar
                    <Search className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* 3. Existing Models */}
        <section className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-slate-800">
            <TrendingUp className="w-5 h-5" />
            <h3 className="text-lg font-bold font-serif text-indigo-950 uppercase tracking-tight">Comprehensive Model Landscape</h3>
          </div>

          <div className="bg-slate-50/50 rounded-2xl border border-slate-200 p-6">
            <ModelChart data={report.modelsFound} />
          </div>
        </section>

        {/* 4. Insights & Alternatives */}
        <div className="space-y-8">
          <section className="bg-indigo-950 text-white rounded-2xl shadow-xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform">
              <Lightbulb className="w-20 h-20" />
            </div>
            <h3 className="text-lg font-bold mb-6 flex items-center text-white border-b border-indigo-800 pb-2 relative z-10">
              <Lightbulb className="w-5 h-5 mr-3 text-amber-400" />
              Strategic Insights
            </h3>
            <ul className="space-y-5 relative z-10">
              {report.insights.map((insight, i) => (
                <li key={i} className="flex items-start text-indigo-100 text-sm leading-relaxed">
                  <span className="flex-shrink-0 w-2 h-2 mt-1.5 bg-amber-400 rounded-full mr-4 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                  {insight}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center border-b border-slate-100 pb-2">
              <Cpu className="w-5 h-5 mr-3 text-indigo-700" />
              SOTA Alternatives
            </h3>
            <div className="space-y-4">
              {report.recommendedAlternatives.map((alt, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors cursor-default">
                  <h4 className="font-bold text-indigo-900 text-sm mb-1">{alt.name}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{alt.reason}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* 5. Sources Footer (Search Foundations) */}
      {sources.length > 0 && (
        <section className="pt-12 border-t border-slate-200">
          <div className="flex items-center justify-center gap-2 mb-8 text-slate-400">
            <Library className="w-4 h-4" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-center">Comprehensive Search Foundations</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sources.map((source, idx) => (
              <a
                key={idx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all duration-200"
              >
                <span className="text-xs font-bold text-indigo-700 mb-1 opacity-80 group-hover:opacity-100">Paper Reference</span>
                <span className="text-sm font-semibold text-slate-700 line-clamp-2 leading-snug mb-2 group-hover:text-indigo-900">
                  {source.title || new URL(source.uri).hostname}
                </span>
                <div className="mt-auto flex items-center text-[10px] text-slate-400 font-mono group-hover:text-indigo-500">
                  <span className="truncate">{new URL(source.uri).hostname}</span>
                  <ExternalLink className="w-3 h-3 ml-1.5 opacity-40 group-hover:opacity-100" />
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};