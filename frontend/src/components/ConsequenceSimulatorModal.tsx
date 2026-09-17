import React, { useState } from 'react';
import { X, Sparkles, Send, ShieldCheck, AlertCircle, Scale, CheckCircle2, ArrowRight } from 'lucide-react';
import { ConsequenceResponse } from '../types';

interface ConsequenceSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType?: string;
  currentLanguage: string;
}

const PRESET_SCENARIOS = [
  "What if I break my lease early after 3 months?",
  "What if the recovery agent calls my family or workplace?",
  "Can the landlord enter my flat unannounced with a master key?",
  "What if I refuse a sudden 20% rent increase on WhatsApp?"
];

export const ConsequenceSimulatorModal: React.FC<ConsequenceSimulatorModalProps> = ({
  isOpen,
  onClose,
  documentType = "Rental Agreement",
  currentLanguage
}) => {
  const [scenario, setScenario] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ConsequenceResponse | null>(null);

  if (!isOpen) return null;

  const handleSimulate = async (queryText?: string) => {
    const q = queryText || scenario;
    if (!q.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const token = localStorage.getItem('nyaya_token');
      const response = await fetch('/api/simulate-consequence', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          scenario: q,
          document_type: documentType,
          language: currentLanguage
        })
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Simulation failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 via-white to-amber-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                "What Would Happen to Me?" — Consequence Simulator
              </h3>
              <p className="text-xs text-slate-500">
                Simulate real legal consequences before taking action under Indian law
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
          {/* Quick Scenario Buttons */}
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Common Scenarios:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_SCENARIOS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setScenario(preset);
                    handleSimulate(preset);
                  }}
                  className="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-800 text-slate-700 border border-slate-200 hover:border-indigo-200 px-3 py-1.5 rounded-lg text-left transition-all"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Scenario Input Box */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSimulate()}
              placeholder="Ask a scenario: e.g. What if I vacate without notice? What if recovery agents visit my home?"
              className="flex-1 text-xs sm:text-sm bg-slate-50 text-slate-900 border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder-slate-400"
            />
            <button
              onClick={() => handleSimulate()}
              disabled={isLoading || !scenario.trim()}
              className={`inline-flex items-center space-x-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-sm transition-all ${
                isLoading || !scenario.trim()
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-98'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Simulate</span>
            </button>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="py-8 text-center">
              <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500">
                Evaluating statutory shields and Supreme Court precedents...
              </p>
            </div>
          )}

          {/* Simulation Results Card */}
          {result && !isLoading && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3.5 text-xs animate-in fade-in duration-200">
              {/* Immediate threat vs Legal Reality */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
                  <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block mb-1 flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" />
                    What Counterparty Threatens:
                  </span>
                  <p className="text-slate-800 leading-relaxed">
                    {result.immediate_consequence}
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1 flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    Actual Legal Reality (Bare Act):
                  </span>
                  <p className="text-slate-800 leading-relaxed">
                    {result.legal_reality}
                  </p>
                </div>
              </div>

              {/* Statutory Shield & Citizen Rights */}
              <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center">
                    <Scale className="w-4 h-4 text-indigo-700 mr-1.5" />
                    Your Statutory Shield:
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {result.success_probability}
                  </span>
                </div>
                <p className="text-slate-700 font-medium leading-relaxed">
                  {result.statutory_shield}
                </p>
                <p className="text-slate-600 leading-relaxed">
                  {result.tenant_rights}
                </p>
              </div>

              {/* Exact Recommended Action to take */}
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-lg p-3">
                <span className="text-xs font-bold text-indigo-950 block mb-1">
                  Exact Recommended Step:
                </span>
                <p className="text-indigo-900 font-mono text-[11px] leading-relaxed bg-white/80 p-2.5 rounded border border-indigo-100">
                  {result.practical_action}
                </p>
              </div>

              <p className="text-[10px] text-slate-400 italic text-center">
                {result.disclaimer}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
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
