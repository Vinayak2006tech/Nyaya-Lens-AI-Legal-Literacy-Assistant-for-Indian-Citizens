import React, { useState } from 'react';
import { X, Check, Copy, Scale, ShieldAlert, ArrowRight, BookOpen } from 'lucide-react';
import { ClauseEvaluation } from '../types';

interface FairClauseModalProps {
  clause: ClauseEvaluation | null;
  onClose: () => void;
}

export const FairClauseModal: React.FC<FairClauseModalProps> = ({ clause, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!clause || !clause.fair_template_match) return null;

  const fair = clause.fair_template_match;

  const handleCopyFairText = () => {
    navigator.clipboard.writeText(fair.fair_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-indigo-700" />
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
              Clause Comparison: Your Clause vs Standard Fair Model Template
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Your Document's Clause */}
            <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center">
                  <ShieldAlert className="w-3.5 h-3.5 mr-1 text-rose-600" />
                  Your Clause (Predatory / Unilateral)
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-200 text-rose-900">
                  Risk: {clause.risk_score} / 10
                </span>
              </div>
              <p className="text-xs sm:text-sm font-mono text-slate-800 leading-relaxed bg-white/80 p-3 rounded-lg border border-rose-100">
                "{clause.raw_text}"
              </p>
            </div>

            {/* Right: Fair Template Clause */}
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center">
                  <BookOpen className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Government Model Fair Clause
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                  Fair (Risk 1.0)
                </span>
              </div>
              <p className="text-xs sm:text-sm font-sans text-slate-800 leading-relaxed bg-white/80 p-3 rounded-lg border border-emerald-100 mb-2">
                {fair.fair_text}
              </p>
              <div className="flex justify-end">
                <button
                  onClick={handleCopyFairText}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-white border border-emerald-300 px-2.5 py-1 rounded-lg shadow-xs hover:bg-emerald-50 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Fair Clause' : 'Copy Fair Text for Landlord'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Key Differences List */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Why the Model Clause Protects You:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {fair.key_differences.map((diff, i) => (
                <div key={i} className="flex items-start space-x-2 text-xs text-slate-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{diff}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 text-xs text-indigo-900 font-medium flex items-center space-x-1">
              <Scale className="w-3.5 h-3.5 text-indigo-700" />
              <span><strong>Legal Basis:</strong> {fair.law_reference}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
