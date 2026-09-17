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
}

export const DocumentPane: React.FC<DocumentPaneProps> = ({
  documentText,
  onTextChange,
  onAnalyze,
  isAnalyzing,
  clauses,
  activeClauseId,
  onSelectClause,
  currentLanguage
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
      formData.append('file', file);
      try {
        const token = localStorage.getItem('nyaya_token');
        const response = await fetch(apiUrl('/api/upload-document'), {
          method: 'POST',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          body: formData
        });
        const data = await parseResponseJson(response);
        if (data.text) {
          onTextChange(data.text);
          setViewMode('editor');
        }
      } catch (err) {
        console.error('File upload failed:', err);
      }
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(documentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSpeech = () => {
    if (!window.speechSynthesis) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

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
    <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-card flex flex-col h-[calc(100vh-210px)] lg:h-[calc(100vh-140px)] min-h-[460px] overflow-hidden">
      {/* Pane Header */}
      <div className="px-3.5 sm:px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 min-w-0">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-700 flex-shrink-0" />
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide uppercase font-['Outfit'] truncate">
            Legal Document (दस्तावेज़)
          </h2>
          {clauses.length > 0 && (
            <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-semibold border border-indigo-200 whitespace-nowrap hidden sm:inline-block">
              {clauses.length} Clauses
            </span>
          )}
        </div>

        {/* Header Tools */}
        <div className="flex items-center space-x-1.5 flex-wrap">
          {clauses.length > 0 && (
            <div className="flex bg-slate-200 p-0.5 rounded-lg text-xs font-medium">
              <button
                onClick={() => setViewMode('annotated')}
                className={`px-2 py-1 rounded-md transition-all text-[11px] sm:text-xs ${
                  viewMode === 'annotated'
                    ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Annotated
              </button>
              <button
                onClick={() => setViewMode('editor')}
                className={`px-2 py-1 rounded-md transition-all text-[11px] sm:text-xs ${
                  viewMode === 'editor'
                    ? 'bg-white text-indigo-700 shadow-sm font-semibold'
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
                ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title="Read text aloud for low-literacy users"
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-600" />}
            <span className="hidden md:inline">{isSpeaking ? 'Stop Audio' : 'Audio (बोलकर सुनाएं)'}</span>
          </button>

          <button
            onClick={handleCopyText}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
            title="Copy text"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center space-x-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-2 sm:px-2.5 py-1 rounded-lg transition-colors"
            title="Upload PDF, Image (OCR) or Text"
          >
            <UploadCloud className="w-3.5 h-3.5 text-slate-600" />
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
      <div className="flex-1 p-5 overflow-y-auto bg-white font-mono text-xs sm:text-sm leading-relaxed text-slate-800">
        {clauses.length > 0 && viewMode === 'annotated' ? (
          <div className="space-y-4 font-sans">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-xs text-indigo-900 flex items-start space-x-2">
              <Info className="w-4 h-4 text-indigo-700 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Interactive Mode:</strong> Click or hover over any clause below to inspect the 2-axis risk assessment, Indian statute citations, and citizen remedies in the right pane.
              </span>
            </div>

            {clauses.map((clause) => {
              const isActive = activeClauseId === clause.clause_id;
              const borderClass = clause.risk_level === 'HIGH'
                ? 'border-l-4 border-rose-500 bg-rose-50/40 hover:bg-rose-50/80'
                : clause.risk_level === 'MEDIUM'
                ? 'border-l-4 border-amber-500 bg-amber-50/40 hover:bg-amber-50/80'
                : 'border-l-4 border-emerald-500 bg-emerald-50/30 hover:bg-emerald-50/70';

              return (
                <div
                  key={clause.clause_id}
                  id={`doc-${clause.clause_id}`}
                  onClick={() => onSelectClause(clause.clause_id)}
                  className={`p-3.5 rounded-r-xl cursor-pointer transition-all duration-150 border ${borderClass} ${
                    isActive ? 'ring-2 ring-indigo-600 shadow-md bg-white font-medium' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                        Clause {clause.clause_number}
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        {clause.title}
                      </span>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      clause.risk_level === 'HIGH'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : clause.risk_level === 'MEDIUM'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      Risk {clause.risk_score} / 10
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed">
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
            className="w-full h-full p-2 bg-transparent text-slate-900 resize-none focus:outline-none placeholder-slate-400 font-sans text-sm leading-relaxed"
          />
        )}
      </div>

      {/* Pane Footer: Action Trigger */}
      <div className="px-3.5 sm:px-5 py-3 sm:py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <span className="text-[11px] sm:text-xs text-slate-500 truncate">
          {documentText.trim().length > 0
            ? `${documentText.trim().split(/\s+/).length} words | ${documentText.length} characters`
            : 'Paste or upload a document to begin clause scanning'}
        </span>

        <button
          onClick={onAnalyze}
          disabled={isAnalyzing || !documentText.trim()}
          className={`inline-flex items-center justify-center space-x-2 px-4 sm:px-5 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-sm transition-all w-full sm:w-auto ${
            isAnalyzing || !documentText.trim()
              ? 'bg-slate-300 cursor-not-allowed text-slate-500'
              : 'bg-indigo-700 hover:bg-indigo-800 active:scale-98 ring-2 ring-indigo-500/20'
          }`}
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Granite AI Evaluating Clauses...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Analyze Document & Citations</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
