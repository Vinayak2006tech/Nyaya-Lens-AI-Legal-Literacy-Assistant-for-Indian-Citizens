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
import { 
  ClauseEvaluation, 
  DocumentAnalysisResult, 
  DemoDocument,
  UserProfile 
} from './types';

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

  // Modals state
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isGovernanceOpen, setIsGovernanceOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [selectedFairClause, setSelectedFairClause] = useState<ClauseEvaluation | null>(null);

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
        fetch('/api/auth/me', {
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
    fetch('/api/demo-documents')
      .then(res => res.json())
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
      const response = await fetch('/api/analyze-document', {
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

      const result: DocumentAnalysisResult = await response.json();
      setAnalysisResult(result);

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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
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
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Scam Alert Banner if triggered */}
        {analysisResult?.scam_assessment && (
          <ScamAlertBanner scam={analysisResult.scam_assessment} />
        )}

        {/* Split-Pane Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Pane: Document Ingestion & Interactive Clause Viewer */}
          <div className="lg:col-span-6 w-full">
            <DocumentPane
              documentText={documentText}
              onTextChange={setDocumentText}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              clauses={analysisResult?.clauses || []}
              activeClauseId={activeClauseId}
              onSelectClause={handleSelectClause}
              currentLanguage={currentLanguage}
            />
          </div>

          {/* Right Pane: Live 2-Axis Risk Annotations & Statute Citations */}
          <div className="lg:col-span-6 w-full">
            <RiskAnalysisPane
              analysis={analysisResult}
              isAnalyzing={isAnalyzing}
              activeClauseId={activeClauseId}
              onSelectClause={handleSelectClause}
              onOpenFairClause={(clause) => setSelectedFairClause(clause)}
              currentLanguage={currentLanguage}
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
  );
};

export default App;
