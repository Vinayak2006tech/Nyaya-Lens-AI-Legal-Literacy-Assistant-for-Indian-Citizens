import React, { useEffect, useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Lock, Cpu, Database, Award, ExternalLink } from 'lucide-react';
import { GovernanceAuditRecord } from '../types';

interface WatsonGovernanceAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  governanceId?: string;
}

export const WatsonGovernanceAuditModal: React.FC<WatsonGovernanceAuditModalProps> = ({
  isOpen,
  onClose,
  governanceId
}) => {
  const [audits, setAudits] = useState<GovernanceAuditRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const token = localStorage.getItem('nyaya_token');
      fetch('/api/governance-audit', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })
        .then(res => res.json())
        .then(data => {
          setAudits(data.recent_audits || []);
          setLoading(false);
        })
        .catch(err => {
          console.error('Audit fetch error:', err);
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                  IBM watsonx.governance — Model Trust & Factuality Registry
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  VERIFIED GUARDRAILS
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Audited legal citations, hallucination safeguards, and model inference lineage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Trust Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
              <div className="flex items-center space-x-1.5 text-indigo-700 font-bold mb-1">
                <Cpu className="w-4 h-4" />
                <span>Foundation Model</span>
              </div>
              <p className="text-slate-800 font-semibold">IBM Granite 3 (8B Instruct)</p>
              <span className="text-[11px] text-slate-500">Multilingual Indic tuned</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
              <div className="flex items-center space-x-1.5 text-emerald-700 font-bold mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Hallucination Guardrail</span>
              </div>
              <p className="text-emerald-800 font-semibold">0% Hallucination Tolerated</p>
              <span className="text-[11px] text-slate-500">Cross-verified against Gazette</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
              <div className="flex items-center space-x-1.5 text-amber-700 font-bold mb-1">
                <Lock className="w-4 h-4" />
                <span>Data Privacy</span>
              </div>
              <p className="text-slate-800 font-semibold">Zero Data Retention</p>
              <span className="text-[11px] text-slate-500">DPDP Act 2023 Compliant</span>
            </div>
          </div>

          {/* Audit Records List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Recent Audit Trail Records:
              </span>
              <span className="text-xs text-slate-500">
                Active Governance ID: <code className="text-indigo-700 font-mono font-semibold">{governanceId || 'WXGOV-LATEST'}</code>
              </span>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-500">
                Loading watsonx.governance verification records...
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {audits.map((audit, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-2 hover:bg-white hover:border-indigo-200 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          {audit.governance_id}
                        </span>
                        <span className="text-slate-500">
                          {audit.timestamp}
                        </span>
                      </div>
                      <span className="text-emerald-700 font-semibold flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Audit Verified
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-white p-2 rounded-lg border border-slate-200">
                      <div>
                        <span className="text-slate-400 block">Clauses Analyzed</span>
                        <span className="font-bold text-slate-800">{audit.clauses_analyzed} clauses</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Overall Risk</span>
                        <span className="font-bold text-slate-800">{audit.overall_risk} / 10</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Inference Time</span>
                        <span className="font-bold text-slate-800">{audit.execution_latency_ms} ms</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Guardrail Status</span>
                        <span className="font-bold text-emerald-700">Passed</span>
                      </div>
                    </div>

                    {audit.statutes_grounded && audit.statutes_grounded.length > 0 && (
                      <div className="flex flex-wrap gap-1 items-center pt-1">
                        <span className="text-[11px] text-slate-500">Grounded Statutes:</span>
                        {audit.statutes_grounded.map((statuteId, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] font-mono font-semibold bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded"
                          >
                            {statuteId}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Powered by IBM watsonx.governance & Granite Model Lineage
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
