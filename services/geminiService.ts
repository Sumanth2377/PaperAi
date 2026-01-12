import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, ResearchReport, SearchSource } from "../types";

const apiKey = process.env.API_KEY;

/**
 * Robustly extracts and cleans a JSON string from LLM output.
 * Handles potential conversational filler or markdown code blocks.
 */
const cleanJsonString = (str: string): string => {
  const firstBrace = str.indexOf('{');
  const lastBrace = str.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1) {
    return str.substring(firstBrace, lastBrace + 1);
  }
  return str.replace(/```json/g, '').replace(/```/g, '').trim();
};

export const analyzeResearchTopic = async (
  topic: string,
  proposedModel: string = ""
): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  // Always create a new instance to ensure fresh context/key
  const ai = new GoogleGenAI({ apiKey: apiKey });
  const modelName = proposedModel ? proposedModel : "General survey";
  const prompt = `
    You are PaperAI, an intelligent Senior Research Scientist. Your task is to perform an ACCURATE and VERIFIED literature review.

    Research Topic: "${topic}"
    Proposed Model: "${modelName}"

    **LANDSCAPE COMPREHENSIVENESS (QUALITY OVER QUANTITY):**
    - Identify the MOST RELEVANT models or research milestones. Do not force a specific number, but aim for comprehensive coverage (10+ if applicable).
    - If fewer high-quality models exist, list only those. DO NOT fabricate or hallucinate model names to fill a quota.
    - List specific named architectures (e.g., "ResNet-50", "ViT-L/16", "U-Net++", "ST-GNN", etc.) rather than generic terms.
    - Cover the timeline from classical methods to the most recent SOTA (2024-2025).

    **LINK INTEGRITY & SEARCH FOUNDATIONS:**
    - Perform multiple search queries to find real, verifiable papers.
    - **STRICT NO HALLUCINATION POLICY**: Every link provided must be accessible and correct. If you cannot verify a link, verify the paper title exists and leave the link empty ("").
    - Provide a verified 'paperLink' for as many of the models in the 'modelsFound' list as possible.

    **RESPONSE FORMAT (Strict JSON Only):**
    {
      "topicOverview": "Detailed academic context of the research area.",
      "modelsFound": [
        { 
          "name": "Specific Model/Paper Name", 
          "category": "Taxonomy (e.g., Graph Learning, Temporal, etc.)", 
          "frequency": "High" | "Medium" | "Low", 
          "score": "Metric if available, else 'N/A'",
          "notes": "Brief technical insight on the implementation.",
          "citation": "Author et al., Year",
          "paperTitle": "Exact Title",
          "paperLink": "Verified URL or ''" 
        }
      ],
      "noveltyCheck": {
        "isUsed": boolean, 
        "summary": "Novelty Verdict",
        "details": "Evidence-based justification.",
        "evidenceTitle": "Title of most related paper found",
        "evidenceLink": "Verified URL or ''"
      },
      "insights": ["4-6 deep technical observations about current trends"],
      "recommendedAlternatives": [
        { "name": "Model", "reason": "Technical justification for superiority" }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      },
    });

    const text = response.text || "{}";
    const sources: SearchSource[] = [];

    // 1. Extract sources from grounding metadata
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk) => {
        if (chunk.web?.uri) {
          sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        }
      });
    }

    let report: ResearchReport | null = null;
    const jsonStr = cleanJsonString(text);

    try {
      report = JSON.parse(jsonStr) as ResearchReport;
    } catch (e) {
      try {
        const fixedJson = jsonStr.replace(/,\s*([\]}])/g, '$1');
        report = JSON.parse(fixedJson) as ResearchReport;
      } catch (innerError) {
        console.error("JSON Parsing failed.", text);
      }
    }

    // 2. Aggregate links from the report itself into Search Foundations to provide a "Complete" bibliography
    if (report) {
      report.modelsFound.forEach(m => {
        if (m.paperLink && m.paperLink.startsWith('http') && !sources.some(s => s.uri === m.paperLink)) {
          sources.push({ title: m.paperTitle || m.name, uri: m.paperLink });
        }
      });
      if (report.noveltyCheck.evidenceLink && report.noveltyCheck.evidenceLink.startsWith('http') && !sources.some(s => s.uri === report.noveltyCheck.evidenceLink)) {
        sources.push({ title: report.noveltyCheck.evidenceTitle, uri: report.noveltyCheck.evidenceLink });
      }
    }

    return { report, sources, rawText: text };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};