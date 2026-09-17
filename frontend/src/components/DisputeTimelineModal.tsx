import React from 'react';
import { X, Calendar, Clock, AlertCircle, ArrowRight, CheckCircle2, Shield } from 'lucide-react';

interface DisputeTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle?: string;
}

interface TimelineEvent {
  day: string;
  stage: string;
  actionBy: string;
  title: string;
  description: string;
  statutoryDeadline: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
}

const SAMPLE_TIMELINE: TimelineEvent[] = [
  {
    day: "Day 0",
    stage: "Trigger Event",
    actionBy: "Landlord / Recovery Agent",
    title: "Unilateral Notice / Threat Issued",
    description: "Landlord sends notice demanding unconditional deposit forfeit or recovery agent threatens police arrest.",
    statutoryDeadline: "Immediate",
    urgency: "HIGH"
  },
  {
    day: "Day 1 - 7",
    stage: "Statutory Defense Period",
    actionBy: "Citizen (You)",
    title: "Issue Formal Legal Response",
    description: "Send registered speed post + WhatsApp reply citing Indian Contract Act Sec 74 or RBI Fair Practices Code. Deny unlawful penalties.",
    statutoryDeadline: "Within 7 days of notice",
    urgency: "HIGH"
  },
  {
    day: "Day 15",
    stage: "Cure / Handover Period",
    actionBy: "Joint Inspection",
    title: "Joint Inspection & Keys Handover Memo",
    description: "Hand over vacant possession with signed inspection memo documenting pre-existing wear and tear.",
    statutoryDeadline: "Notice period expiry",
    urgency: "MEDIUM"
  },
  {
    day: "Day 30",
    stage: "Statutory Refund Window",
    actionBy: "Counterparty",
    title: "Mandatory Refund Deadline",
    description: "Model Tenancy Act mandates refund within 30 days of vacation. If unpaid, interest accrues at statutory rate.",
    statutoryDeadline: "30 days from keys handover",
    urgency: "MEDIUM"
  },
  {
    day: "Day 31+",
    stage: "Legal Escalation",
    actionBy: "Citizen (You)",
    title: "File Petition in District Consumer Forum / Rent Authority",
    description: "Submit online complaint on consumerhelpline.gov.in (NCH) or approach Rent Controller for double damages.",
    statutoryDeadline: "Limitation period: 2 years",
    urgency: "LOW"
  }
];

export const DisputeTimelineModal: React.FC<DisputeTimelineModalProps> = ({
  isOpen,
  onClose,
  documentTitle
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                Multi-Document Dispute Escalation Timeline
              </h3>
              <p className="text-xs text-slate-500">
                Track chronological notices, statutory cure windows, and filing deadlines
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

        {/* Content: Timeline Tree */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="relative border-l-2 border-indigo-200 ml-4 pl-6 space-y-6">
            {SAMPLE_TIMELINE.map((event, idx) => (
              <div key={idx} className="relative group">
                {/* Node Bullet */}
                <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${
                  event.urgency === 'HIGH'
                    ? 'bg-rose-600'
                    : event.urgency === 'MEDIUM'
                    ? 'bg-amber-500'
                    : 'bg-emerald-600'
                }`} />

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-indigo-200 hover:bg-white transition-all shadow-subtle">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                        {event.day}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {event.stage} ({event.actionBy})
                      </span>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      event.urgency === 'HIGH'
                        ? 'bg-rose-100 text-rose-800'
                        : event.urgency === 'MEDIUM'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {event.urgency} URGENCY
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    {event.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-2">
                    {event.description}
                  </p>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      <strong>Statutory Deadline:</strong>&nbsp;{event.statutoryDeadline}
                    </span>
                    <span className="text-indigo-600 font-semibold flex items-center">
                      <Shield className="w-3.5 h-3.5 mr-1" />
                      Protected by Law
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Close Timeline
          </button>
        </div>
      </div>
    </div>
  );
};
