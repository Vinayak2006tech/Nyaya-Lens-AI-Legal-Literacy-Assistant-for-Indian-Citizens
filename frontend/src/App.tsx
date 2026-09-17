import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { DocumentPane } from './components/DocumentPane';
import { RiskAnalysisPane } from './components/RiskAnalysisPane';
import { ScamAlertBanner } from './components/ScamAlertBanner';
import { ConsequenceSimulatorModal } from './components/ConsequenceSimulatorModal';
import { FairClauseModal } from './components/FairClauseModal';
import { WatsonGovernanceAuditModal } from './components/WatsonGovernanceAuditModal';
import { DisputeTimelineModal } from './components/DisputeTimelineModal';
import { ActionableChecklistDrawer } from './components/ActionableChecklistDrawer';
import { AuthModal } from './components/AuthModal';
import LineWaves from './components/LineWaves';
import { FileText, ShieldCheck } from 'lucide-react';
import { 
  ClauseEvaluation, 
  DocumentAnalysisResult, 
  DemoDocument, 
  UserProfile 
} from './types';
import { apiUrl, parseResponseJson } from './config/api';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'workspace'>('landing');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [currentLanguage, setCurrentLanguage] = useState<string>('English');
  const [demoDocuments, setDemoDocuments] = useState<DemoDocument[]>([]);
  const [documentText, setDocumentText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysisResult | null>(null);
  const [activeClauseId, setActiveClauseId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'document' | 'analysis'>('document');

  // Modals state
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isGovernanceOpen, setIsGovernanceOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [selectedFairClause, setSelectedFairClause] = useState<ClauseEvaluation | null>(null);

  // Dark mode state for workspace
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('nyaya_theme');
    return saved ? saved === 'dark' : true;
  });

  const handleToggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('nyaya_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  // Initialize Auth & Demo Documents on load
  useEffect(() => {
    const savedToken = localStorage.getItem('nyaya_token');
    const savedUser = localStorage.getItem('nyaya_user');

    if (savedToken && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        setAuthToken(savedToken);

        // Verify token validity with backend
        fetch(apiUrl('/api/auth/me'), {
          headers: { 'Authorization': `Bearer ${savedToken}` }
        })
        .then(res => {
          if (!res.ok) {
            localStorage.removeItem('nyaya_token');
            localStorage.removeItem('nyaya_user');
            setCurrentUser(null);
            setAuthToken(null);
          }
        })
        .catch(() => {});
      } catch (e) {
        localStorage.removeItem('nyaya_token');
        localStorage.removeItem('nyaya_user');
      }
    }

    // Fetch demo documents
    fetch(apiUrl('/api/demo-documents'))
      .then(res => parseResponseJson<DemoDocument[]>(res))
      .then((data: DemoDocument[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setDemoDocuments(data);
          setDocumentText(data[0].content);
        }
      })
      .catch(err => console.error('Failed to load demo documents:', err));
  }, []);

  const handleLoginSuccess = (user: UserProfile, token: string) => {
    setCurrentUser(user);
    setAuthToken(token);
    setCurrentView('workspace');
  };

  const handleLogout = () => {
    localStorage.removeItem('nyaya_token');
    localStorage.removeItem('nyaya_user');
    setCurrentUser(null);
    setAuthToken(null);
    setCurrentView('landing');
  };

  const handleSelectDemoDoc = (doc: DemoDocument) => {
    setDocumentText(doc.content);
    setAnalysisResult(null);
    setActiveClauseId(null);
    setMobileTab('document');
  };

  const handleLaunchPreset = (doc: DemoDocument) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    handleSelectDemoDoc(doc);
    setCurrentView('workspace');
  };

  const handleStartWorkspace = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setCurrentView('workspace');
  };

  const handleAnalyze = async () => {
    if (!currentUser || !authToken) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!documentText.trim()) return;

    setIsAnalyzing(true);
    setActiveClauseId(null);

    try {
      const response = await fetch(apiUrl('/api/analyze-document'), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          text: documentText,
          language: currentLanguage
        })
      });

      if (response.status === 401) {
        handleLogout();
        setIsAuthModalOpen(true);
        return;
      }

      const result: DocumentAnalysisResult = await parseResponseJson<DocumentAnalysisResult>(response);
      setAnalysisResult(result);
      setMobileTab('analysis');

      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.85 },
          colors: ['#4f46e5', '#f59e0b', '#10b981']
        });
      } catch (e) {}

    } catch (err) {
      console.error('Analysis error:', err);
      alert('Failed to analyze document. Please ensure services are active.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectClause = (clauseId: string) => {
    setActiveClauseId(clauseId);
    const cardEl = document.getElementById(`card-${clauseId}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    const docEl = document.getElementById(`doc-${clauseId}`);
    if (docEl) {
      docEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  if (currentView === 'landing') {
    return (
      <>
        <LandingPage
          onStart={handleStartWorkspace}
          onSelectPreset={handleLaunchPreset}
          demoDocuments={demoDocuments}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  return (
    <div className={`relative min-h-screen flex flex-col font-sans transition-colors duration-200 overflow-hidden ${
      isDarkMode 
        ? 'bg-slate-950 text-slate-100 selection:bg-indigo-900 selection:text-indigo-100' 
        : 'bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900'
    }`}>
      {/* Background Interactive LineWaves Canvas for Workplace */}
      <div className={`absolute inset-0 z-0 pointer-events-auto transition-opacity duration-300 ${
        isDarkMode ? 'opacity-35' : 'opacity-40'
      }`}>
        <LineWaves
          speed={0.2}
          innerLineCount={28}
          outerLineCount={34}
          warpIntensity={0.8}
          rotation={-38}
          edgeFadeWidth={0.16}
          colorCycleSpeed={0.85}
          brightness={isDarkMode ? 0.9 : 0.75}
          color1="#4338ca"
          color2="#d97706"
          color3="#059669"
          enableMouseInteraction={true}
          mouseInfluence={2.0}
          lightMode={!isDarkMode}
        />
      </div>

      {/* Subtle background gradient overlay to keep document editor & analysis ultra crisp */}
      <div className={`absolute inset-0 z-0 pointer-events-none transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-b from-slate-950/75 via-slate-950/85 to-slate-950/95' 
          : 'bg-gradient-to-b from-white/70 via-slate-50/80 to-slate-100/90'
      }`} />

      {/* Foreground Workspace Content */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Top Navigation */}
        <Navbar
          currentLanguage={currentLanguage}
          onSelectLanguage={setCurrentLanguage}
          demoDocuments={demoDocuments}
          onSelectDemoDoc={handleSelectDemoDoc}
          onOpenSimulator={() => setIsSimulatorOpen(true)}
          onOpenGovernance={() => setIsGovernanceOpen(true)}
          onOpenTimeline={() => setIsTimelineOpen(true)}
          onToggleChecklist={() => setIsChecklistOpen(!isChecklistOpen)}
          checklistCount={analysisResult?.actionable_checklist.length || 0}
          onGoHome={() => setCurrentView('landing')}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
        />

        {/* Main Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-5">
          {/* Scam Alert Banner if triggered */}
          {analysisResult?.scam_assessment && (
            <ScamAlertBanner scam={analysisResult.scam_assessment} isDarkMode={isDarkMode} />
          )}

          {/* Mobile View Segmented Switcher (< lg screens) */}
          <div className={`lg:hidden flex items-center p-1 rounded-xl mb-3.5 text-xs font-semibold shadow-inner border transition-colors ${
            isDarkMode ? 'bg-slate-800/90 border-slate-700/80' : 'bg-slate-200/90 border-slate-300/60'
          }`}>
          <button
            onClick={() => setMobileTab('document')}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-lg transition-all ${
              mobileTab === 'document'
                ? isDarkMode ? 'bg-slate-900 text-indigo-300 shadow-sm' : 'bg-white text-indigo-900 shadow-sm'
                : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-indigo-500" />
            <span>Document (दस्तावेज़)</span>
          </button>
          <button
            onClick={() => setMobileTab('analysis')}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-lg transition-all relative ${
              mobileTab === 'analysis'
                ? isDarkMode ? 'bg-slate-900 text-indigo-300 shadow-sm' : 'bg-white text-indigo-900 shadow-sm'
                : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            <span>Risk Analysis (विश्लेषण)</span>
            {analysisResult && (
              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                analysisResult.overall_risk_score >= 6.5
                  ? isDarkMode ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-rose-100 text-rose-700'
                  : analysisResult.overall_risk_score >= 3.5
                  ? isDarkMode ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-amber-100 text-amber-700'
                  : isDarkMode ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {analysisResult.overall_risk_score}/10
              </span>
            )}
          </button>
        </div>

        {/* Split-Pane Layout: Responsive Tab-based on < lg, Side-by-Side on lg+ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          {/* Left Pane: Document Ingestion & Interactive Clause Viewer */}
          <div className={`lg:col-span-6 w-full ${mobileTab === 'document' ? 'block' : 'hidden lg:block'}`}>
            <DocumentPane
              documentText={documentText}
              onTextChange={setDocumentText}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              clauses={analysisResult?.clauses || []}
              activeClauseId={activeClauseId}
              onSelectClause={(id) => {
                handleSelectClause(id);
                if (window.innerWidth < 1024) {
                  setMobileTab('analysis');
                }
              }}
              currentLanguage={currentLanguage}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Right Pane: Live 2-Axis Risk Annotations & Statute Citations */}
          <div className={`lg:col-span-6 w-full ${mobileTab === 'analysis' ? 'block' : 'hidden lg:block'}`}>
            <RiskAnalysisPane
              analysis={analysisResult}
              isAnalyzing={isAnalyzing}
              activeClauseId={activeClauseId}
              onSelectClause={handleSelectClause}
              onOpenFairClause={(clause) => setSelectedFairClause(clause)}
              currentLanguage={currentLanguage}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </main>

      {/* Feature Modals & Drawers */}
      <ConsequenceSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        currentLanguage={currentLanguage}
      />

      <FairClauseModal
        clause={selectedFairClause}
        onClose={() => setSelectedFairClause(null)}
        isDarkMode={isDarkMode}
      />

      <WatsonGovernanceAuditModal
        isOpen={isGovernanceOpen}
        onClose={() => setIsGovernanceOpen(false)}
        governanceId={analysisResult?.watson_governance_id}
      />

      <DisputeTimelineModal
        isOpen={isTimelineOpen}
        onClose={() => setIsTimelineOpen(false)}
      />

      <ActionableChecklistDrawer
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
        items={analysisResult?.actionable_checklist || []}
        documentTitle={analysisResult?.title}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      </div>
    </div>
  );
};

export default App;
