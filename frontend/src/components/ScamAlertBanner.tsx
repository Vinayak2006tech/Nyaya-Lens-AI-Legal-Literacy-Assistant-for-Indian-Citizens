import React from 'react';
import { AlertTriangle, ShieldAlert, PhoneCall, ExternalLink } from 'lucide-react';
import { ScamAssessment } from '../types';

interface ScamAlertBannerProps {
  scam: ScamAssessment;
}

export const ScamAlertBanner: React.FC<ScamAlertBannerProps> = ({ scam }) => {
  if (!scam.detected) return null;

  return (
    <div className="bg-rose-50 border-l-4 border-rose-600 p-4 rounded-r-xl shadow-subtle mb-6 border border-rose-200">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          <ShieldAlert className="h-6 w-6 text-rose-600 animate-pulse" />
        </div>
        <div className="ml-2.5 sm:ml-3 flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xs sm:text-sm font-bold text-rose-900 tracking-wide uppercase">
              ⚠️ {scam.scam_type} DETECTED (Confidence: {(scam.confidence * 100).toFixed(0)}%)
            </h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] sm:text-xs font-semibold bg-rose-200 text-rose-900 flex-shrink-0">
              DO NOT PAY MONEY
            </span>
          </div>
          
          <p className="mt-1 text-sm font-medium text-rose-800">
            {scam.police_warning}
          </p>

          {scam.red_flags.length > 0 && (
            <div className="mt-2 text-xs text-rose-900">
              <span className="font-semibold">Identified Fraud Indicators:</span>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-rose-800">
                {scam.red_flags.map((flag, idx) => (
                  <li key={idx}>{flag}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="tel:1930"
              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-rose-700 hover:bg-rose-800 transition-colors shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5 mr-1.5" />
              Call National Cyber Helpline (1930)
            </a>
            {scam.portal_link && (
              <a
                href={scam.portal_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg text-rose-900 bg-rose-100 hover:bg-rose-200 border border-rose-300 transition-colors"
              >
                File Cyber Crime Report (cybercrime.gov.in)
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
