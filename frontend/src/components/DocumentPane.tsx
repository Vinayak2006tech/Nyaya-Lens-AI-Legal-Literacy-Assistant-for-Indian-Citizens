import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Volume2, VolumeX, Sparkles, RefreshCw, Copy, Check, Info } from 'lucide-react';
import { ClauseEvaluation } from '../types';
import { apiUrl, parseResponseJson } from '../config/api';

interface DocumentPaneProps {
  documentText: string;
  onTextChange: (text: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  clauses: ClauseEvaluation[];
  activeClauseId: string | null;
  onSelectClause: (clauseId: string) => void;
  currentLanguage: string;
  isDarkMode?: boolean;
}

export const DocumentPane: React.FC<DocumentPaneProps> = ({
  documentText,
  onTextChange,
  onAnalyze,
  isAnalyzing,
  clauses,
  activeClauseId,
  onSelectClause,
  currentLanguage,
  isDarkMode = true
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'editor' | 'annotated'>('editor');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        onTextChange(content);
        setViewMode('editor');
      };
      reader.readAsText(file);
    } else {
      const formData = new FormData();
      formData.append('document', file);
      try {
        const res = await fetch(apiUrl('/api/extract-text'), {
          method: 'POST',
          body: formData
        });
        const data = await parseResponseJson<{ text: string }>(res);
        if (data.text) {
          onTextChange(data.text);
          setViewMode('editor');
        }
      } catch (err) {
        console.error('File extraction failed:', err);
      }
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(documentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSpeech = () => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const textToRead = clauses.length > 0 
        ? clauses.map(c => `Clause ${c.clause_number}: ${c.title}. ${c.plain_language_explanation}`).join('. ')
        : documentText;

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      
      // Try finding appropriate Indian English or Hindi voice
      const voices = window.speechSynthesis.getVoices();
      const indianVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('hi-IN'));
      if (indianVoice) utterance.voice = indianVoice;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className={`backdrop-blur-md border rounded-2xl shadow-card flex flex-col h-[calc(100vh-210px)] lg:h-[calc(100vh-140px)] min-h-[460px] overflow-hidden transition-colors ${
      isDarkMode 
        ? 'bg-slate-900/90 border-slate-800 text-slate-100' 
        : 'bg-white/95 border-slate-200/90 text-slate-900'
    }`}>
      {/* Pane Header */}
      <div className={`px-3.5 sm:px-5 py-3 border-b flex flex-wrap items-center justify-between gap-2 transition-colors ${
        isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center space-x-2 min-w-0">
          <FileText className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-700'}`} />
          <h2 className={`text-xs sm:text-sm font-bold tracking-wide uppercase font-['Outfit'] truncate ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Legal Document (दस्तावेज़)
          </h2>
          {clauses.length > 0 && (
            <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold border whitespace-nowrap hidden sm:inline-block ${
              isDarkMode 
                ? 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60' 
                : 'bg-indigo-100 text-indigo-800 border-indigo-200'
            }`}>
              {clauses.length} Clauses
            </span>
          )}
        </div>

        {/* Header Tools */}
        <div className="flex items-center space-x-1.5 flex-wrap">
          {clauses.length > 0 && (
            <div className={`flex p-0.5 rounded-lg text-xs font-medium border ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-200'
            }`}>
              <button
                onClick={() => setViewMode('annotated')}
                className={`px-2 py-1 rounded-md transition-all text-[11px] sm:text-xs ${
                  viewMode === 'annotated'
                    ? isDarkMode
                      ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                      : 'bg-white text-indigo-700 shadow-sm font-semibold'
                    : isDarkMode
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Annotated
              </button>
              <button
                onClick={() => setViewMode('editor')}
                className={`px-2 py-1 rounded-md transition-all text-[11px] sm:text-xs ${
                  viewMode === 'editor'
                    ? isDarkMode
                      ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                      : 'bg-white text-indigo-700 shadow-sm font-semibold'
                    : isDarkMode
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Raw Text
              </button>
            </div>
          )}

          <button
            onClick={toggleSpeech}
            className={`inline-flex items-center space-x-1 text-xs px-2 sm:px-2.5 py-1 rounded-lg border transition-colors ${
              isSpeaking
                ? 'bg-rose-950/60 text-rose-300 border-rose-800/60 animate-pulse'
                : isDarkMode
                ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title="Read text aloud for low-literacy users"
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-400" />}
            <span className="hidden md:inline">{isSpeaking ? 'Stop Audio' : 'Audio (बोलकर सुनाएं)'}</span>
          </button>

          <button
            onClick={handleCopyText}
            className={`p-1.5 rounded-lg transition-colors border ${
              isDarkMode
                ? 'text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 border-slate-700'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200 border-transparent'
            }`}
            title="Copy text"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className={`inline-flex items-center space-x-1 text-xs font-medium px-2 sm:px-2.5 py-1 rounded-lg transition-colors border ${
              isDarkMode
                ? 'text-slate-200 bg-slate-800 hover:bg-slate-700 border-slate-700'
                : 'text-slate-700 bg-white hover:bg-slate-100 border-slate-200'
            }`}
            title="Upload PDF, Image (OCR) or Text"
          >
            <UploadCloud className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Upload</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.pdf,.doc,.docx"
            className="hidden"
          />
        </div>
      </div>

      {/* Pane Content Area */}
      <div className={`flex-1 p-5 overflow-y-auto font-mono text-xs sm:text-sm leading-relaxed transition-colors ${
        isDarkMode ? 'bg-slate-900/60 text-slate-200' : 'bg-white text-slate-800'
      }`}>
        {clauses.length > 0 && viewMode === 'annotated' ? (
          <div className="space-y-4 font-sans">
            <div className={`rounded-xl p-3 text-xs flex items-start space-x-2 border ${
              isDarkMode 
                ? 'bg-indigo-950/40 border-indigo-800/50 text-indigo-200' 
                : 'bg-indigo-50 border-indigo-200 text-indigo-900'
            }`}>
              <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Interactive Mode:</strong> Click or hover over any clause below to inspect the 2-axis risk assessment, Indian statute citations, and citizen remedies in the right pane.
              </span>
            </div>

            {clauses.map((clause) => {
              const isActive = activeClauseId === clause.clause_id;
              const borderClass = clause.risk_level === 'HIGH'
                ? isDarkMode 
                  ? 'border-l-4 border-rose-500 bg-rose-950/30 hover:bg-rose-950/50 border-slate-800' 
                  : 'border-l-4 border-rose-500 bg-rose-50/40 hover:bg-rose-50/80 border-slate-200'
                : clause.risk_level === 'MEDIUM'
                ? isDarkMode 
                  ? 'border-l-4 border-amber-500 bg-amber-950/30 hover:bg-amber-950/50 border-slate-800' 
                  : 'border-l-4 border-amber-500 bg-amber-50/40 hover:bg-amber-50/80 border-slate-200'
                : isDarkMode 
                  ? 'border-l-4 border-emerald-500 bg-emerald-950/30 hover:bg-emerald-950/50 border-slate-800' 
                  : 'border-l-4 border-emerald-500 bg-emerald-50/30 hover:bg-emerald-50/70 border-slate-200';

              return (
                <div
                  key={clause.clause_id}
                  id={`doc-${clause.clause_id}`}
                  onClick={() => onSelectClause(clause.clause_id)}
                  className={`p-3.5 rounded-r-xl cursor-pointer transition-all duration-150 border ${borderClass} ${
                    isActive 
                      ? isDarkMode 
                        ? 'ring-2 ring-indigo-400 shadow-lg bg-slate-900 font-medium' 
                        : 'ring-2 ring-indigo-600 shadow-md bg-white font-medium' 
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        isDarkMode ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-slate-200 text-slate-800'
                      }`}>
                        Clause {clause.clause_number}
                      </span>
                      <span className={`text-xs font-semibold ${isDarkMode ? 'text-indigo-300' : 'text-slate-700'}`}>
                        {clause.title}
                      </span>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      clause.risk_level === 'HIGH'
                        ? isDarkMode
                          ? 'bg-rose-950/60 text-rose-300 border-rose-800/60'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                        : clause.risk_level === 'MEDIUM'
                        ? isDarkMode
                          ? 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                        : isDarkMode
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      Risk {clause.risk_score} / 10
                    </span>
                  </div>

                  <p className={`text-xs sm:text-sm whitespace-pre-line leading-relaxed ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-800'
                  }`}>
                    {clause.raw_text}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <textarea
            value={documentText}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Paste your rental agreement, bank loan notice, police FIR, or legal summons here in English, Hindi, or any Indian regional language..."
            className={`w-full h-full p-2 bg-transparent resize-none focus:outline-none font-sans text-sm leading-relaxed ${
              isDarkMode 
                ? 'text-slate-100 placeholder-slate-500' 
                : 'text-slate-900 placeholder-slate-400'
            }`}
          />
        )}
      </div>

      {/* Pane Footer: Action Trigger */}
      <div className={`px-3.5 sm:px-5 py-3 sm:py-3.5 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors ${
        isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <span className={`text-[11px] sm:text-xs truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {documentText.trim().length > 0
            ? `${documentText.trim().split(/\s+/).length} words | ${documentText.length} characters`
            : 'Paste or upload a document to begin clause scanning'}
        </span>

        <button
          onClick={onAnalyze}
          disabled={isAnalyzing || !documentText.trim()}
          className={`inline-flex items-center justify-center space-x-2 px-4 sm:px-5 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all w-full sm:w-auto ${
            isAnalyzing || !documentText.trim()
              ? isDarkMode
                ? 'bg-slate-800 cursor-not-allowed text-slate-500 border border-slate-700'
                : 'bg-slate-300 cursor-not-allowed text-slate-500'
              : isDarkMode
              ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold active:scale-98 shadow-md shadow-amber-400/20'
              : 'bg-indigo-700 hover:bg-indigo-800 text-white active:scale-98 ring-2 ring-indigo-500/20'
          }`}
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Granite AI Evaluating Clauses...</span>
            </>
          ) : (
            <>
              <Sparkles className={`w-4 h-4 ${isDarkMode ? 'text-slate-950' : 'text-amber-300'}`} />
              <span>Analyze Document & Citations</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
