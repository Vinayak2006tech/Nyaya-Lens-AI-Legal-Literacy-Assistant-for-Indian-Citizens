import React, { useState } from 'react';
import { X, Check, Copy, Scale, ShieldAlert, ArrowRight, BookOpen } from 'lucide-react';
import { ClauseEvaluation } from '../types';

interface FairClauseModalProps {
  clause: ClauseEvaluation | null;
  onClose: () => void;
  isDarkMode?: boolean;
}

export const FairClauseModal: React.FC<FairClauseModalProps> = ({ clause, onClose, isDarkMode = true }) => {
  const [copied, setCopied] = useState(false);

  if (!clause || !clause.fair_template_match) return null;

  const fair = clause.fair_template_match;

  const handleCopyFairText = () => {
    navigator.clipboard.writeText(fair.fair_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4">
      <div className={`rounded-2xl shadow-2xl border max-w-3xl w-full max-h-[90dvh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className={`px-4 sm:px-6 py-3 sm:py-4 border-b flex items-center justify-between ${
          isDarkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center space-x-2 min-w-0">
            <Scale className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-700'}`} />
            <h3 className={`text-sm sm:text-base font-bold font-['Outfit'] truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Clause Comparison: Your Clause vs Standard Fair Model Template
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors flex-shrink-0 ${
              isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Your Document's Clause */}
            <div className={`border rounded-xl p-4 ${
              isDarkMode ? 'bg-rose-950/30 border-rose-900/60 text-rose-200' : 'bg-rose-50/50 border-rose-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold uppercase tracking-wider flex items-center ${
                  isDarkMode ? 'text-rose-300' : 'text-rose-800'
                }`}>
                  <ShieldAlert className="w-3.5 h-3.5 mr-1 text-rose-500" />
                  Your Clause (Predatory / Unilateral)
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  isDarkMode ? 'bg-rose-900/80 text-rose-200 border border-rose-700' : 'bg-rose-200 text-rose-900'
                }`}>
                  Risk: {clause.risk_score} / 10
                </span>
              </div>
              <p className={`text-xs sm:text-sm font-mono leading-relaxed p-3 rounded-lg border ${
                isDarkMode ? 'bg-slate-950/70 text-rose-100 border-rose-900/40' : 'bg-white/80 text-slate-800 border-rose-100'
              }`}>
                "{clause.raw_text}"
              </p>
            </div>

            {/* Right: Fair Template Clause */}
            <div className={`border rounded-xl p-4 ${
              isDarkMode ? 'bg-emerald-950/30 border-emerald-900/60 text-emerald-200' : 'bg-emerald-50/50 border-emerald-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold uppercase tracking-wider flex items-center ${
                  isDarkMode ? 'text-emerald-300' : 'text-emerald-800'
                }`}>
                  <BookOpen className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                  Government Model Fair Clause
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  isDarkMode ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-700' : 'bg-emerald-200 text-emerald-900'
                }`}>
                  Fair (Risk 1.0)
                </span>
              </div>
              <p className={`text-xs sm:text-sm font-sans leading-relaxed p-3 rounded-lg border mb-2 ${
                isDarkMode ? 'bg-slate-950/70 text-emerald-100 border-emerald-900/40' : 'bg-white/80 text-slate-800 border-emerald-100'
              }`}>
                {fair.fair_text}
              </p>
              <div className="flex justify-end">
                <button
                  onClick={handleCopyFairText}
                  className={`inline-flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors border ${
                    isDarkMode
                      ? 'text-emerald-300 bg-slate-800 hover:bg-emerald-950/80 border-emerald-700/60'
                      : 'text-emerald-700 hover:text-emerald-800 bg-white border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Fair Clause' : 'Copy Fair Text for Landlord'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Key Differences List */}
          <div className={`border rounded-xl p-4 ${
            isDarkMode ? 'bg-slate-800/60 border-slate-700/80' : 'bg-slate-50 border-slate-200'
          }`}>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${
              isDarkMode ? 'text-slate-200' : 'text-slate-900'
            }`}>
              Why the Model Clause Protects You:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {fair.key_differences.map((diff, i) => (
                <div key={i} className={`flex items-start space-x-2 text-xs ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{diff}</span>
                </div>
              ))}
            </div>
            <div className={`mt-3 pt-2 border-t text-xs font-medium flex items-center space-x-1 ${
              isDarkMode ? 'border-slate-700 text-indigo-300' : 'border-slate-200 text-indigo-900'
            }`}>
              <Scale className={`w-3.5 h-3.5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-700'}`} />
              <span><strong>Legal Basis:</strong> {fair.law_reference}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-3 border-t flex justify-end ${
          isDarkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors border ${
              isDarkMode
                ? 'text-slate-300 bg-slate-800 border-slate-700 hover:bg-slate-700 hover:text-white'
                : 'text-slate-700 bg-white border-slate-300 hover:bg-slate-100'
            }`}
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
