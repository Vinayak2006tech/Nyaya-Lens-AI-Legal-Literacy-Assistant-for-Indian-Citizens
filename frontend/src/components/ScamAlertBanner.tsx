import React from 'react';
import { AlertTriangle, ShieldAlert, PhoneCall, ExternalLink } from 'lucide-react';
import { ScamAssessment } from '../types';

interface ScamAlertBannerProps {
  scam: ScamAssessment;
  isDarkMode?: boolean;
}

export const ScamAlertBanner: React.FC<ScamAlertBannerProps> = ({ scam, isDarkMode = true }) => {
  if (!scam.detected) return null;

  return (
    <div className={`border-l-4 border-rose-600 p-4 rounded-r-xl shadow-subtle mb-6 border transition-colors ${
      isDarkMode 
        ? 'bg-rose-950/40 border-rose-800/60 text-rose-200' 
        : 'bg-rose-50 border-rose-200 text-rose-900'
    }`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          <ShieldAlert className="h-6 w-6 text-rose-500 animate-pulse" />
        </div>
        <div className="ml-2.5 sm:ml-3 flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className={`text-xs sm:text-sm font-bold tracking-wide uppercase ${
              isDarkMode ? 'text-rose-200' : 'text-rose-900'
            }`}>
              ⚠️ {scam.scam_type} DETECTED (Confidence: {(scam.confidence * 100).toFixed(0)}%)
            </h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] sm:text-xs font-semibold flex-shrink-0 ${
              isDarkMode ? 'bg-rose-900/80 text-rose-200 border border-rose-700' : 'bg-rose-200 text-rose-900'
            }`}>
              DO NOT PAY MONEY
            </span>
          </div>
          
          <p className={`mt-1 text-sm font-medium ${
            isDarkMode ? 'text-rose-300' : 'text-rose-800'
          }`}>
            {scam.police_warning}
          </p>

          {scam.red_flags.length > 0 && (
            <div className={`mt-2 text-xs ${isDarkMode ? 'text-rose-200' : 'text-rose-900'}`}>
              <span className="font-semibold">Identified Fraud Indicators:</span>
              <ul className={`list-disc list-inside mt-1 space-y-0.5 ${
                isDarkMode ? 'text-rose-300' : 'text-rose-800'
              }`}>
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
                className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${
                  isDarkMode
                    ? 'text-rose-200 bg-rose-900/60 hover:bg-rose-900 border-rose-700'
                    : 'text-rose-900 bg-rose-100 hover:bg-rose-200 border-rose-300'
                }`}
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
