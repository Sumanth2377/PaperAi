export interface ModelEntry {
  name: string;
  category: string;
  frequency: 'High' | 'Medium' | 'Low'; // Approximated frequency
  score?: string; // e.g. "98.5% Accuracy", "0.02 RMSE"
  notes: string;
  citation?: string; // e.g. "Smith et al., 2023"
  paperTitle?: string;
  paperLink?: string;
}

export interface NoveltyCheck {
  isUsed: boolean;
  summary: string;
  details?: string;
  evidenceTitle?: string;
  evidenceLink?: string;
}

export interface AlternativeModel {
  name: string;
  reason: string;
}

export interface ResearchReport {
  topicOverview: string;
  modelsFound: ModelEntry[];
  noveltyCheck: NoveltyCheck;
  insights: string[];
  recommendedAlternatives: AlternativeModel[];
}

export interface SearchSource {
  title?: string;
  uri: string;
}

export interface AnalysisResult {
  report: ResearchReport | null;
  sources: SearchSource[];
  rawText?: string; // Fallback if JSON parsing fails
}