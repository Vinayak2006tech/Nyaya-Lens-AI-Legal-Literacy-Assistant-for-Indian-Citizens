import React, { useState } from 'react';
import { X, CheckSquare, ExternalLink, Download, ShieldCheck, Scale, PhoneCall, Check } from 'lucide-react';
import { ActionChecklistItem } from '../types';

interface ActionableChecklistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: ActionChecklistItem[];
  documentTitle?: string;
}

export const ActionableChecklistDrawer: React.FC<ActionableChecklistDrawerProps> = ({
  isOpen,
  onClose,
  items,
  documentTitle
}) => {
  const [completedIndices, setCompletedIndices] = useState<number[]>([]);

  if (!isOpen) return null;

  const toggleComplete = (idx: number) => {
    if (completedIndices.includes(idx)) {
      setCompletedIndices(completedIndices.filter(i => i !== idx));
    } else {
      setCompletedIndices([...completedIndices, idx]);
    }
  };

  const handleDownloadChecklist = () => {
    const textContent = `NYAYA LENS (न्याय लेन्स) — ACTIONABLE LEGAL DEFENSE CHECKLIST\nDocument: ${documentTitle || 'Legal Document'}\nGenerated on: ${new Date().toLocaleDateString()}\n\n` +
      items.map((item, i) => 
        `[ ] STEP ${i + 1}: ${item.action}\n    Related Clause: ${item.clause_title}\n    Statute: ${item.statute}\n    Grievance Authority: ${item.authority}\n    Portal URL: ${item.portal_link}\n`
      ).join('\n') +
      `\n\nEMERGENCY HELPLINES IN INDIA:\n- National Consumer Helpline: 1915\n- National Cyber Crime Helpline: 1930\n- RBI Banking Ombudsman: 14448\n- Free Legal Aid (NALSA): 15100\n`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NyayaLens_Defense_Checklist_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 border-l border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-indigo-700" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">
                Actionable Citizen Checklist
              </h3>
              <p className="text-xs text-slate-500">
                {items.length} recommended legal defense actions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-slate-50/50">
          {items.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No predatory clauses or high-risk action items flagged.
            </div>
          ) : (
            items.map((item, idx) => {
              const isChecked = completedIndices.includes(idx);

              return (
                <div
                  key={idx}
                  onClick={() => toggleComplete(idx)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-50/40 border-emerald-200 opacity-80'
                      : 'bg-white border-slate-200 hover:border-indigo-300 shadow-subtle'
                  }`}
                >
                  <div className="flex items-start space-x-2.5">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                      isChecked
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}>
                      {isChecked && <Check className="w-3 h-3" />}
                    </div>

                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900">
                          {item.clause_title}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          item.risk_level === 'HIGH'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.risk_level}
                        </span>
                      </div>

                      <p className={`leading-relaxed text-slate-700 mb-2 ${isChecked ? 'line-through text-slate-400' : ''}`}>
                        {item.action}
                      </p>

                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1 text-[11px]">
                        <span className="text-indigo-700 font-medium">
                          {item.statute}
                        </span>
                        {item.portal_link && (
                          <a
                            href={item.portal_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center text-slate-600 hover:text-indigo-700 underline font-medium"
                          >
                            {item.authority}
                            <ExternalLink className="w-3 h-3 ml-0.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 space-y-2">
          <button
            onClick={handleDownloadChecklist}
            disabled={items.length === 0}
            className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 transition-colors shadow-sm disabled:bg-slate-300"
          >
            <Download className="w-4 h-4" />
            <span>Download Action Checklist (.txt)</span>
          </button>
          <div className="text-[11px] text-center text-slate-500">
            Emergency Consumer Helpline: <strong>1915</strong> | Cybercrime: <strong>1930</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
