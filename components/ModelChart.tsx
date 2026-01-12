import React from 'react';
import { ModelEntry } from '../types';
import { ExternalLink, FileText } from 'lucide-react';

interface ModelChartProps {
  data: ModelEntry[];
}

export const ModelChart: React.FC<ModelChartProps> = ({ data }) => {
  // Sort data: High frequency first
  const sortedData = [...data].sort((a, b) => {
    const freqMap = { 'High': 3, 'Medium': 2, 'Low': 1 };
    return freqMap[b.frequency] - freqMap[a.frequency];
  });

  return (
    <div className="w-full space-y-4">
      {sortedData.map((item, index) => {
        const isHigh = item.frequency === 'High';
        
        // Colors - Royal Aesthetic Palette
        const rankColor = isHigh ? 'bg-indigo-900 text-white' : 'bg-slate-200 text-slate-700';
        const barColor = isHigh ? 'bg-indigo-600' : 'bg-slate-300';
        const widthPercentage = isHigh ? '90%' : item.frequency === 'Medium' ? '60%' : '35%';

        // Resolve Link Logic: 
        // 1. Use direct link if available. 
        // 2. If paperTitle exists, search for that specific title. 
        // 3. Fallback to searching the model name + topic context.
        let linkUrl = item.paperLink;
        if (!linkUrl) {
            const query = item.paperTitle 
                ? `"${item.paperTitle}"` // Quote title for exact match
                : `${item.name} ${item.category} original paper`;
            linkUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`;
        }

        const linkText = item.paperTitle || item.citation || "View Research Paper";

        return (
          <div 
            key={index} 
            className="group relative bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Header Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${rankColor}`}>
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg leading-tight font-serif">{item.name}</h4>
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wide">{item.category}</span>
                </div>
              </div>
              
              {/* Score Badge */}
              {item.score && item.score !== 'N/A' && (
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
                  <span className="text-xs font-bold text-slate-500">SCORE</span>
                  <span className="text-sm font-semibold text-slate-800">{item.score}</span>
                </div>
              )}
            </div>

            {/* Visual Bar */}
            <div className="relative h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
              <div 
                className={`h-full rounded-full ${barColor}`} 
                style={{ width: widthPercentage }}
              />
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              {item.notes}
            </p>

            {/* Link Placement */}
            <div className="border-t border-slate-100 pt-2 mt-2">
              <a 
                href={linkUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-medium text-indigo-700 hover:text-indigo-900 hover:underline decoration-indigo-700/30 underline-offset-2 transition-all"
              >
                <FileText className="w-4 h-4 mr-2" />
                <span className="truncate max-w-xl">{linkText}</span>
                <ExternalLink className="w-3 h-3 ml-1.5 opacity-50" />
              </a>
            </div>

          </div>
        );
      })}
    </div>
  );
};