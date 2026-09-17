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
}

export const RiskAnalysisPane: React.FC<RiskAnalysisPaneProps> = ({
  analysis,
  isAnalyzing,
  activeClauseId,
  onSelectClause,
  onOpenFairClause,
  currentLanguage
}) => {
  const [filterRisk, setFilterRisk] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [expandedStatuteId, setExpandedStatuteId] = useState<string | null>(null);

  if (isAnalyzing) {
    return (
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-card h-[calc(100vh-210px)] lg:h-[calc(100vh-140px)] min-h-[460px] flex flex-col items-center justify-center p-5 sm:p-8 text-center">
        <div className="w-16 h-16 relative mb-4">
          <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin" />
          <Scale className="w-6 h-6 text-indigo-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 font-['Outfit']">
          IBM Granite 3 Clause Segmentation & Statutory Audit
        </h3>
        <p className="text-xs text-slate-500 max-w-md mb-4 px-2">
          Evaluating contractual terms against Indian Contract Act 1872, Consumer Protection Act 2019, Model Tenancy Act, and RBI Fair Practices...
        </p>
        <div className="w-48 sm:w-64 bg-slate-100 rounded-full h-2 overflow-hidden">
          <div className="bg-indigo-600 h-2 rounded-full animate-pulse-subtle w-3/4" />
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-card h-[calc(100vh-210px)] lg:h-[calc(100vh-140px)] min-h-[460px] flex flex-col items-center justify-center p-5 sm:p-8 text-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 mb-4 shadow-sm">
          <Scale className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 font-['Outfit']">
          Awaiting Document Analysis
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-6 leading-relaxed px-2">
          Select a sample Indian rental agreement, bank loan notice, or FIR from the top bar, or paste your own document on the left and click <strong>"Analyze Document & Citations"</strong>.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 max-w-xs text-left text-xs text-slate-600">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="font-semibold text-slate-900 block mb-1">⚖️ Statute Match</span>
            Indian Contract Act, CPA 2019, RERA, Rent Control.
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="font-semibold text-slate-900 block mb-1">🎯 2-Axis Score</span>
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
    <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-card flex flex-col h-[calc(100vh-210px)] lg:h-[calc(100vh-140px)] min-h-[460px] overflow-hidden">
      {/* Pane Header: 2-Axis Score Meter */}
      <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200">
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
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                  Document Risk Profile
                </span>
                <span className={`text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                  analysis.overall_risk_level === 'HIGH'
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : analysis.overall_risk_level === 'MEDIUM'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {analysis.overall_risk_level} RISK
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 truncate sm:whitespace-normal">
                AI Confidence: <strong className="text-slate-800">{(analysis.average_confidence * 100).toFixed(0)}%</strong> | Grounded in Bare Acts
              </p>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center space-x-1 text-xs bg-slate-200 p-0.5 rounded-lg font-medium overflow-x-auto max-w-full">
            <button
              onClick={() => setFilterRisk('ALL')}
              className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap ${
                filterRisk === 'ALL' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({analysis.clauses.length})
            </button>
            <button
              onClick={() => setFilterRisk('HIGH')}
              className={`px-2 py-1 rounded-md transition-all flex items-center space-x-1 whitespace-nowrap ${
                filterRisk === 'HIGH' ? 'bg-rose-600 text-white shadow-sm font-semibold' : 'text-rose-700 hover:text-rose-900'
              }`}
            >
              <span>High ({highRiskCount})</span>
            </button>
            <button
              onClick={() => setFilterRisk('MEDIUM')}
              className={`px-2 py-1 rounded-md transition-all whitespace-nowrap ${
                filterRisk === 'MEDIUM' ? 'bg-amber-500 text-white shadow-sm font-semibold' : 'text-amber-700 hover:text-amber-900'
              }`}
            >
              Med ({medRiskCount})
            </button>
            <button
              onClick={() => setFilterRisk('LOW')}
              className={`px-2 py-1 rounded-md transition-all whitespace-nowrap ${
                filterRisk === 'LOW' ? 'bg-emerald-600 text-white shadow-sm font-semibold' : 'text-emerald-700 hover:text-emerald-900'
              }`}
            >
              Fair ({lowRiskCount})
            </button>
          </div>
        </div>
      </div>

      {/* Clauses Deck */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        {filteredClauses.map((clause) => {
          const isSelected = activeClauseId === clause.clause_id;
          const isStatuteExpanded = expandedStatuteId === clause.clause_id;

          const explanation = clause.vernacular_explanation[currentLanguage] || clause.plain_language_explanation;

          return (
            <div
              key={clause.clause_id}
              id={`card-${clause.clause_id}`}
              onClick={() => onSelectClause(clause.clause_id)}
              className={`bg-white border rounded-xl p-4 transition-all duration-200 cursor-pointer shadow-subtle hover:shadow-card ${
                isSelected
                  ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Card Header: 2-Axis Score & Category */}
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      Clause {clause.clause_number}
                    </span>
                    <span className="text-xs font-semibold text-indigo-700">
                      {clause.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {clause.title}
                  </h4>
                </div>

                {/* 2-Axis Score Badge */}
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                    clause.risk_level === 'HIGH'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : clause.risk_level === 'MEDIUM'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    Risk: {clause.risk_score} / 10
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5 font-medium">
                    Confidence: {(clause.confidence_score * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Clause Raw Excerpt */}
              <div className="p-2.5 bg-slate-50 rounded-lg text-xs font-mono text-slate-700 border border-slate-200 mb-3 line-clamp-2">
                "{clause.raw_text}"
              </div>

              {/* Plain Language Vernacular Explanation */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Plain Language Explanation ({currentLanguage}):
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playSpeechForClause(clause);
                    }}
                    className="inline-flex items-center space-x-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
                    title="Listen to plain explanation"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>सुनें (Listen)</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans bg-amber-50/40 p-2.5 rounded-lg border border-amber-100">
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
                    className="flex items-center justify-between p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100/70 border border-indigo-200 text-indigo-950 text-xs cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <Scale className="w-4 h-4 text-indigo-700 flex-shrink-0" />
                      <span className="font-semibold">
                        Grounded in Law: {clause.statute_citation.act} ({clause.statute_citation.section})
                      </span>
                    </div>
                    {isStatuteExpanded ? (
                      <ChevronUp className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-indigo-600" />
                    )}
                  </div>

                  {/* Expanded Statute Accordion */}
                  {isStatuteExpanded && (
                    <div className="mt-1.5 p-3 rounded-lg bg-white border border-indigo-100 text-xs space-y-2 shadow-subtle">
                      <div>
                        <span className="font-bold text-slate-900 block mb-0.5">
                          {clause.statute_citation.title}
                        </span>
                        <p className="text-slate-600 leading-relaxed">
                          {clause.statute_citation.summary}
                        </p>
                      </div>
                      <div className="pt-1.5 border-t border-slate-100 flex flex-col gap-1">
                        <span className="text-[11px] text-indigo-900">
                          <strong>Prescribed Legal Authority:</strong> {clause.statute_citation.authority}
                        </span>
                        <span className="text-[11px] text-emerald-800">
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
                  <span className="font-bold text-slate-900 block mb-1">
                    Citizen Action Checklist:
                  </span>
                  <ul className="space-y-1">
                    {clause.actionable_steps.map((step, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5 text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Compare with Fair Template Button */}
              {clause.fair_template_match && (
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenFairClause(clause);
                    }}
                    className="inline-flex items-center justify-center space-x-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-2 sm:py-1.5 rounded-lg transition-colors shadow-subtle w-full sm:w-auto"
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
