import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Scale, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  Volume2, 
  Layers, 
  SlidersHorizontal,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ClauseEvaluation, DocumentAnalysisResult } from '../types';

interface RiskAnalysisPaneProps {
  analysis: DocumentAnalysisResult | null;
  isAnalyzing: boolean;
  activeClauseId: string | null;
  onSelectClause: (clauseId: string) => void;
  onOpenFairClause: (clause: ClauseEvaluation) => void;
  currentLanguage: string;
  isDarkMode?: boolean;
}

export const RiskAnalysisPane: React.FC<RiskAnalysisPaneProps> = ({
  analysis,
  isAnalyzing,
  activeClauseId,
  onSelectClause,
  onOpenFairClause,
  currentLanguage,
  isDarkMode = true
}) => {
  const [filterRisk, setFilterRisk] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [expandedStatuteId, setExpandedStatuteId] = useState<string | null>(null);

  if (isAnalyzing) {
    return (
      <div className={`backdrop-blur-md rounded-2xl shadow-card h-[calc(100dvh-200px)] sm:h-[calc(100dvh-220px)] lg:h-[calc(100vh-140px)] min-h-[400px] sm:min-h-[460px] flex flex-col items-center justify-center p-5 sm:p-8 text-center transition-colors duration-200 border ${
        isDarkMode 
          ? 'bg-slate-900/90 border-slate-800 text-slate-100' 
          : 'bg-white/95 border-slate-200/90 text-slate-900'
      }`}>
        <div className="w-16 h-16 relative mb-4">
          <div className={`w-16 h-16 rounded-full border-4 animate-spin ${
            isDarkMode ? 'border-slate-800 border-t-indigo-500' : 'border-slate-100 border-t-indigo-600'
          }`} />
          <Scale className={`w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
            isDarkMode ? 'text-indigo-400' : 'text-indigo-700'
          }`} />
        </div>
        <h3 className={`text-base sm:text-lg font-bold mb-1 font-['Outfit'] ${
          isDarkMode ? 'text-white' : 'text-slate-900'
        }`}>
          IBM Granite 3 Clause Segmentation & Statutory Audit
        </h3>
        <p className={`text-xs max-w-md mb-4 px-2 ${
          isDarkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Evaluating contractual terms against Indian Contract Act 1872, Consumer Protection Act 2019, Model Tenancy Act, and RBI Fair Practices...
        </p>
        <div className={`w-48 sm:w-64 rounded-full h-2 overflow-hidden ${
          isDarkMode ? 'bg-slate-800' : 'bg-slate-100'
        }`}>
          <div className="bg-indigo-600 h-2 rounded-full animate-pulse-subtle w-3/4" />
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className={`backdrop-blur-md rounded-2xl shadow-card h-[calc(100dvh-200px)] sm:h-[calc(100dvh-220px)] lg:h-[calc(100vh-140px)] min-h-[400px] sm:min-h-[460px] flex flex-col items-center justify-center p-5 sm:p-8 text-center transition-colors duration-200 border ${
        isDarkMode
          ? 'bg-slate-900/90 border-slate-800 text-slate-100'
          : 'bg-white/95 border-slate-200/90 text-slate-900'
      }`}>
        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4 shadow-sm border ${
          isDarkMode
            ? 'bg-indigo-950/60 border-indigo-800/80 text-indigo-400'
            : 'bg-indigo-50 border-indigo-100 text-indigo-700'
        }`}>
          <Scale className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <h3 className={`text-base sm:text-lg font-bold mb-2 font-['Outfit'] ${
          isDarkMode ? 'text-white' : 'text-slate-900'
        }`}>
          Awaiting Document Analysis
        </h3>
        <p className={`text-xs sm:text-sm max-w-sm mb-6 leading-relaxed px-2 ${
          isDarkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Select a sample Indian rental agreement, bank loan notice, or FIR from the top bar, or paste your own document on the left and click <strong>"Analyze Document & Citations"</strong>.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 max-w-xs text-left text-xs">
          <div className={`p-2.5 rounded-lg border ${
            isDarkMode ? 'bg-slate-800/70 border-slate-700/80 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <span className={`font-semibold block mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>⚖️ Statute Match</span>
            Indian Contract Act, CPA 2019, RERA, Rent Control.
          </div>
          <div className={`p-2.5 rounded-lg border ${
            isDarkMode ? 'bg-slate-800/70 border-slate-700/80 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <span className={`font-semibold block mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>🎯 2-Axis Score</span>
            Risk Score (0-10) vs AI Confidence level.
          </div>
        </div>
      </div>
    );
  }

  const filteredClauses = analysis.clauses.filter((c) => {
    if (filterRisk === 'ALL') return true;
    return c.risk_level === filterRisk;
  });

  const highRiskCount = analysis.clauses.filter(c => c.risk_level === 'HIGH').length;
  const medRiskCount = analysis.clauses.filter(c => c.risk_level === 'MEDIUM').length;
  const lowRiskCount = analysis.clauses.filter(c => c.risk_level === 'LOW').length;

  const playSpeechForClause = (clause: ClauseEvaluation) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(clause.voice_speech_text);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`backdrop-blur-md rounded-2xl shadow-card flex flex-col h-[calc(100dvh-200px)] sm:h-[calc(100dvh-220px)] lg:h-[calc(100vh-140px)] min-h-[400px] sm:min-h-[460px] overflow-hidden transition-colors duration-200 border ${
      isDarkMode
        ? 'bg-slate-900/90 border-slate-800 text-slate-100'
        : 'bg-white/95 border-slate-200/90 text-slate-900'
    }`}>
      {/* Pane Header: 2-Axis Score Meter */}
      <div className={`p-3.5 sm:p-4 border-b transition-colors ${
        isDarkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Overall Risk Score */}
          <div className="flex items-center space-x-3">
            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex flex-col items-center justify-center font-bold shadow-sm flex-shrink-0 ${
              analysis.overall_risk_score >= 6.5
                ? 'bg-rose-600 text-white'
                : analysis.overall_risk_score >= 3.5
                ? 'bg-amber-500 text-white'
                : 'bg-emerald-600 text-white'
            }`}>
              <span className="text-sm sm:text-base leading-none">{analysis.overall_risk_score}</span>
              <span className="text-[8px] sm:text-[9px] uppercase font-semibold">/ 10</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Document Risk Profile
                </span>
                <span className={`text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                  analysis.overall_risk_level === 'HIGH'
                    ? isDarkMode ? 'bg-rose-950/80 text-rose-300 border border-rose-800' : 'bg-rose-100 text-rose-800 border border-rose-200'
                    : analysis.overall_risk_level === 'MEDIUM'
                    ? isDarkMode ? 'bg-amber-950/80 text-amber-300 border border-amber-800' : 'bg-amber-100 text-amber-800 border border-amber-200'
                    : isDarkMode ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {analysis.overall_risk_level} RISK
                </span>
              </div>
              <p className={`text-[11px] sm:text-xs truncate sm:whitespace-normal ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                AI Confidence: <strong className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>{(analysis.average_confidence * 100).toFixed(0)}%</strong> | Grounded in Bare Acts
              </p>
            </div>
          </div>

          {/* Filter Chips */}
          <div className={`flex items-center space-x-1 text-xs p-0.5 rounded-lg font-medium overflow-x-auto max-w-full border ${
            isDarkMode ? 'bg-slate-800/80 border-slate-700/70' : 'bg-slate-200 border-transparent'
          }`}>
            <button
              onClick={() => setFilterRisk('ALL')}
              className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap ${
                filterRisk === 'ALL'
                  ? isDarkMode ? 'bg-slate-700 text-white shadow-sm font-semibold' : 'bg-white text-slate-900 shadow-sm font-semibold'
                  : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({analysis.clauses.length})
            </button>
            <button
              onClick={() => setFilterRisk('HIGH')}
              className={`px-2 py-1 rounded-md transition-all flex items-center space-x-1 whitespace-nowrap ${
                filterRisk === 'HIGH'
                  ? 'bg-rose-600 text-white shadow-sm font-semibold'
                  : isDarkMode ? 'text-rose-400 hover:text-rose-300' : 'text-rose-700 hover:text-rose-900'
              }`}
            >
              <span>High ({highRiskCount})</span>
            </button>
            <button
              onClick={() => setFilterRisk('MEDIUM')}
              className={`px-2 py-1 rounded-md transition-all whitespace-nowrap ${
                filterRisk === 'MEDIUM'
                  ? 'bg-amber-500 text-white shadow-sm font-semibold'
                  : isDarkMode ? 'text-amber-400 hover:text-amber-300' : 'text-amber-700 hover:text-amber-900'
              }`}
            >
              Med ({medRiskCount})
            </button>
            <button
              onClick={() => setFilterRisk('LOW')}
              className={`px-2 py-1 rounded-md transition-all whitespace-nowrap ${
                filterRisk === 'LOW'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : isDarkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-700 hover:text-emerald-900'
              }`}
            >
              Fair ({lowRiskCount})
            </button>
          </div>
        </div>
      </div>

      {/* Clauses Deck */}
      <div className={`flex-1 p-4 overflow-y-auto space-y-4 ${
        isDarkMode ? 'bg-slate-950/40' : 'bg-slate-50/50'
      }`}>
        {filteredClauses.map((clause) => {
          const isSelected = activeClauseId === clause.clause_id;
          const isStatuteExpanded = expandedStatuteId === clause.clause_id;

          const explanation = clause.vernacular_explanation[currentLanguage] || clause.plain_language_explanation;

          return (
            <div
              key={clause.clause_id}
              id={`card-${clause.clause_id}`}
              onClick={() => onSelectClause(clause.clause_id)}
              className={`border rounded-xl p-4 transition-all duration-200 cursor-pointer shadow-subtle ${
                isSelected
                  ? isDarkMode
                    ? 'bg-slate-800/90 border-indigo-500 ring-2 ring-indigo-500/30 shadow-md text-slate-100'
                    : 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                  : isDarkMode
                    ? 'bg-slate-900/85 border-slate-800 hover:border-slate-700 text-slate-100 hover:shadow-card'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-card'
              }`}
            >
              {/* Card Header: 2-Axis Score & Category */}
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                      isDarkMode
                        ? 'bg-slate-800 text-slate-300 border-slate-700'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      Clause {clause.clause_number}
                    </span>
                    <span className={`text-xs font-semibold ${
                      isDarkMode ? 'text-indigo-400' : 'text-indigo-700'
                    }`}>
                      {clause.category}
                    </span>
                  </div>
                  <h4 className={`text-sm font-bold ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {clause.title}
                  </h4>
                </div>

                {/* 2-Axis Score Badge */}
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                    clause.risk_level === 'HIGH'
                      ? isDarkMode ? 'bg-rose-950/60 text-rose-300 border-rose-800/80' : 'bg-rose-50 text-rose-700 border-rose-200'
                      : clause.risk_level === 'MEDIUM'
                      ? isDarkMode ? 'bg-amber-950/60 text-amber-300 border-amber-800/80' : 'bg-amber-50 text-amber-700 border-amber-200'
                      : isDarkMode ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    Risk: {clause.risk_score} / 10
                  </span>
                  <span className={`text-[10px] mt-0.5 font-medium ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Confidence: {(clause.confidence_score * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Clause Raw Excerpt */}
              <div className={`p-2.5 rounded-lg text-xs font-mono mb-3 line-clamp-2 border ${
                isDarkMode
                  ? 'bg-slate-950/80 text-slate-300 border-slate-800'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}>
                "{clause.raw_text}"
              </div>

              {/* Plain Language Vernacular Explanation */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Plain Language Explanation ({currentLanguage}):
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playSpeechForClause(clause);
                    }}
                    className={`inline-flex items-center space-x-1 text-[11px] font-medium ${
                      isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
                    }`}
                    title="Listen to plain explanation"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>सुनें (Listen)</span>
                  </button>
                </div>
                <p className={`text-xs sm:text-sm leading-relaxed font-sans p-2.5 rounded-lg border ${
                  isDarkMode
                    ? 'bg-amber-950/25 text-amber-100 border-amber-800/40'
                    : 'bg-amber-50/40 text-slate-800 border-amber-100'
                }`}>
                  {explanation}
                </p>
              </div>

              {/* Verified Indian Statute Citation Chip */}
              {clause.statute_citation && (
                <div className="mb-3">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedStatuteId(isStatuteExpanded ? null : clause.clause_id);
                    }}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors border ${
                      isDarkMode
                        ? 'bg-indigo-950/50 hover:bg-indigo-900/60 border-indigo-800/80 text-indigo-200'
                        : 'bg-indigo-50 hover:bg-indigo-100/70 border-indigo-200 text-indigo-950'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Scale className={`w-4 h-4 flex-shrink-0 ${
                        isDarkMode ? 'text-indigo-400' : 'text-indigo-700'
                      }`} />
                      <span className="font-semibold">
                        Grounded in Law: {clause.statute_citation.act} ({clause.statute_citation.section})
                      </span>
                    </div>
                    {isStatuteExpanded ? (
                      <ChevronUp className={`w-4 h-4 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    ) : (
                      <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    )}
                  </div>

                  {/* Expanded Statute Accordion */}
                  {isStatuteExpanded && (
                    <div className={`mt-1.5 p-3 rounded-lg text-xs space-y-2 shadow-subtle border ${
                      isDarkMode
                        ? 'bg-slate-900 border-indigo-900/80 text-slate-300'
                        : 'bg-white border-indigo-100 text-slate-600'
                    }`}>
                      <div>
                        <span className={`font-bold block mb-0.5 ${
                          isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {clause.statute_citation.title}
                        </span>
                        <p className={`leading-relaxed ${
                          isDarkMode ? 'text-slate-300' : 'text-slate-600'
                        }`}>
                          {clause.statute_citation.summary}
                        </p>
                      </div>
                      <div className={`pt-1.5 border-t flex flex-col gap-1 ${
                        isDarkMode ? 'border-slate-800' : 'border-slate-100'
                      }`}>
                        <span className={`text-[11px] ${
                          isDarkMode ? 'text-indigo-300' : 'text-indigo-900'
                        }`}>
                          <strong>Prescribed Legal Authority:</strong> {clause.statute_citation.authority}
                        </span>
                        <span className={`text-[11px] ${
                          isDarkMode ? 'text-emerald-300' : 'text-emerald-800'
                        }`}>
                          <strong>Statutory Remedy:</strong> {clause.statute_citation.remedy}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Actionable Next Steps */}
              {clause.actionable_steps && clause.actionable_steps.length > 0 && (
                <div className="mb-3 text-xs">
                  <span className={`font-bold block mb-1 ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-900'
                  }`}>
                    Citizen Action Checklist:
                  </span>
                  <ul className="space-y-1">
                    {clause.actionable_steps.map((step, idx) => (
                      <li key={idx} className={`flex items-start space-x-1.5 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Compare with Fair Template Button */}
              {clause.fair_template_match && (
                <div className={`pt-2 border-t flex flex-col sm:flex-row sm:justify-end ${
                  isDarkMode ? 'border-slate-800' : 'border-slate-100'
                }`}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenFairClause(clause);
                    }}
                    className={`inline-flex items-center justify-center space-x-1.5 text-xs font-semibold px-3 py-2 sm:py-1.5 rounded-lg transition-colors shadow-subtle w-full sm:w-auto min-h-[42px] sm:min-h-0 border ${
                      isDarkMode
                        ? 'text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/80 border-indigo-800/80'
                        : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border-indigo-200'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Compare with Fair Model Clause</span>
                    <ArrowRight className="w-3 h-3 ml-0.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
