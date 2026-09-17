import React from 'react';
import { 
  Scale, 
  ArrowRight, 
  ShieldAlert, 
  Sparkles, 
  BookOpen, 
  History, 
  Volume2, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  PhoneCall,
  Lock,
  User,
  LogOut
} from 'lucide-react';
import LineWaves from './LineWaves';
import SplitFlapText from './SplitFlapText';
import { DemoDocument, UserProfile } from '../types';

interface LandingPageProps {
  onStart: () => void;
  onSelectPreset: (doc: DemoDocument) => void;
  demoDocuments: DemoDocument[];
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStart,
  onSelectPreset,
  demoDocuments,
  currentUser,
  onOpenAuth,
  onLogout
}) => {
  const handleProtectedAction = (action: () => void) => {
    if (!currentUser) {
      onOpenAuth();
    } else {
      action();
    }
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* React Bits LineWaves Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-auto">
        <LineWaves
          speed={0.25}
          innerLineCount={28}
          outerLineCount={32}
          warpIntensity={0.8}
          rotation={-45}
          edgeFadeWidth={0.15}
          colorCycleSpeed={0.9}
          brightness={0.7}
          color1="#4338ca"
          color2="#d97706"
          color3="#059669"
          enableMouseInteraction={true}
          mouseInfluence={2.0}
          lightMode={true}
        />
      </div>

      {/* Subtle background gradient overlay to keep text ultra crisp */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/80 via-white/90 to-white pointer-events-none" />

      {/* Main Landing Page Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {/* Top Mini Brand Navigation */}
        <div className="flex items-center justify-between pb-8 border-b border-slate-200/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-amber-600 flex items-center justify-center text-white shadow-sm ring-2 ring-indigo-50">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-['Outfit']">
                  Nyaya Lens
                </span>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                  न्याय लेन्स
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                AI Legal-Literacy Assistant for Indian Citizens
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="hidden lg:inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              IBM Granite 3 & watsonx.governance
            </span>

            {currentUser ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {currentUser.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-slate-800">{currentUser.name}</span>
                </div>
                <button
                  onClick={onStart}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-700 hover:bg-indigo-800 transition-all shadow-sm active:scale-98"
                >
                  <span>Go to Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onLogout}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all shadow-2xs"
                  title="Sign out of your account"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenAuth}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-indigo-700 bg-white border border-slate-300 hover:border-indigo-300 transition-all shadow-2xs"
                >
                  <Lock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Log In</span>
                </button>
                <button
                  onClick={onOpenAuth}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-700 hover:bg-indigo-800 transition-all shadow-sm active:scale-98"
                >
                  <span>Register Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center pt-14 pb-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold mb-6 shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Never sign or accept a predatory Indian legal document blindly</span>
          </div>

          {/* React Bits SplitFlapText Mechanical Departure Board */}
          <div className="flex flex-col items-center justify-center mb-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-t-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 border border-b-0 border-indigo-500 text-[11px] uppercase font-mono tracking-wider text-amber-300 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-0.5" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 -ml-2.5" />
              <span className="font-semibold">LIVE LEGAL MONITOR &bull; AI DISPATCH</span>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-950 border-2 border-indigo-500/40 shadow-xl shadow-indigo-950/30 flex items-center justify-center max-w-full overflow-x-auto ring-4 ring-indigo-500/15">
              <SplitFlapText
                words={['NYAYA LENS', 'LEGAL SHIELD', 'LAUNCH READY', 'SYNC ONLINE', 'SIGNAL LIVE', 'CITIZEN POWER']}
                flipDuration={0.12}
                stagger={0.06}
                cycleDelay={2400}
                charset="alphanumeric"
                flipsPerChar={8}
                tileColor="#1e1b4b"
                textColor="#f8fafc"
                tileRadius={8}
                gap={6}
                fontSize={32}
                loop
                padTo={13}
              />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-['Outfit'] leading-tight mb-5">
            <span className="bg-gradient-to-r from-indigo-900 via-indigo-700 to-indigo-800 bg-clip-text text-transparent">
              Understand Every Clause.
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent">
              Defend Every Right.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 font-normal">
            Paste any Indian rental agreement, bank loan notice, police FIR, or legal summons.
            <strong> Nyaya Lens</strong> segments each clause, scores risk on a 2-axis scale (0–10),
            explains traps in plain Hindi or English, and cites the <em>actual Indian statute</em> protecting you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => handleProtectedAction(onStart)}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white bg-indigo-700 hover:bg-indigo-800 shadow-md hover:shadow-lg transition-all active:scale-98 ring-2 ring-indigo-500/20"
            >
              <Lock className="w-4 h-4 text-indigo-200" />
              <span>{currentUser ? 'Enter Legal Workspace' : 'Log In to Access Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {demoDocuments.length > 0 && (
              <button
                onClick={() => handleProtectedAction(() => onSelectPreset(demoDocuments[0]))}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 shadow-xs transition-all"
              >
                <span>Try Rental Agreement Demo</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
            <span className="flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Sign-in required for document security
            </span>
            <span className="flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              English, हिन्दी, தமிழ் support
            </span>
            <span className="flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              DPDP Act 2023 Compliant
            </span>
          </div>
        </div>

        {/* Quick Sample Presets Showcase */}
        <div className="mb-20">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Interactive Test Cases
            </span>
            <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
              Explore Common Predatory Documents
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {currentUser ? 'Click any card to analyze in workspace' : 'Log in required to analyze full clauses'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {demoDocuments.map((doc) => (
              <div
                key={doc.id}
                onClick={() => handleProtectedAction(() => onSelectPreset(doc))}
                className="bg-white/95 border border-slate-200 hover:border-indigo-400 rounded-2xl p-5 cursor-pointer shadow-subtle hover:shadow-card transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {doc.category}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {doc.language}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors mb-2">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {doc.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                  <span className="flex items-center">
                    {!currentUser && <Lock className="w-3 h-3 mr-1 text-slate-400" />}
                    <span>Analyze this sample</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step-by-Step Guide: How to Use Nyaya Lens */}
        <div className="bg-slate-50/90 border border-slate-200 rounded-3xl p-6 sm:p-10 mb-20 shadow-subtle">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-1">
              Step-by-Step Walkthrough
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Outfit']">
              How Nyaya Lens Works in 5 Steps
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Unlike generic chatbots that guess legal answers, Nyaya Lens performs synchronized clause segmentation and Bare Act verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm mb-3">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Document Ingestion
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Paste any legal agreement or upload PDF/TXT/OCR images in English, Hindi, or regional languages.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm mb-3">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Clause Segmentation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                IBM Granite parses the document into distinct clauses (Security Deposit, Inspection, Recovery, Penalty).
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm mb-3">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                2-Axis Risk Scoring
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Each clause receives a Risk Score (0–10) and an AI Confidence Score based on Indian legal enforceability.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm mb-3">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Statute Citations
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explains traps in plain Hindi/English and cites actual Bare Acts (Contract Act Sec 74, CPA 2019, RERA).
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm mb-3">
                5
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Actionable Defense
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Download a custom defense checklist with direct links to National Consumer Helpline, RERA, and Cyber 1930.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="mb-20">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-1">
              Built for Impact
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Outfit']">
              Every Feature Designed for the Common Citizen
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-card transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 font-['Outfit']">
                "What Would Happen to Me" Simulator
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ask scenarios like *"What if I break my lease early?"* or *"Can recovery agents call my boss?"*. AI explains the counterparty threat vs statutory reality.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-card transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 font-['Outfit']">
                Side-by-Side Fair Model Diff
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Compare predatory clauses against standard model clauses from the Model Tenancy Act 2021. Copy fair phrasing in one click to renegotiate.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-card transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-4">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 font-['Outfit']">
                Scam & Digital Arrest Red-Flag Detector
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Flags counterfeit police notices, digital arrest threats, and extortion UPI links. Alerts you immediately with 1930 Cyber Helpline guidance.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-card transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                <Volume2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 font-['Outfit']">
                Voice Readout for Low-Literacy Users
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Accessibility matters. Users can click "बोलकर सुनाएं" to listen to clause explanations and risks read aloud in Hindi or Indian English.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-card transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4">
                <History className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 font-['Outfit']">
                Dispute Escalation Timeline
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tracks notice cycles, statutory 30-day cure windows, inspection handover memos, and court filing deadlines so you never miss a legal date.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-card transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 font-['Outfit']">
                watsonx.governance Verifiable Audit
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Logs every inference hash, cited Bare Act section, and hallucination guardrail check into a transparent, verifiable compliance registry.
              </p>
            </div>
          </div>
        </div>

        {/* Indian Statutory Grounding Banner */}
        <div className="border border-slate-200 bg-white/90 rounded-2xl p-6 sm:p-8 mb-16 shadow-subtle">
          <div className="flex items-center space-x-2 mb-4">
            <Scale className="w-5 h-5 text-indigo-700" />
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
              Pre-Loaded Indian Statute Knowledge Base
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-semibold text-slate-700">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
              Contract Act 1872
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
              Consumer Protection 2019
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
              Model Tenancy Act 2021
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
              RBI Fair Practices Code
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
              IT Act 2000 (Sec 66D)
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
              BNS 2023 (Sec 351)
            </div>
          </div>
        </div>

        {/* Bottom Call to Action Banner */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-amber-600 rounded-3xl p-8 sm:p-12 text-white text-center shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold font-['Outfit'] mb-3">
            Ready to Protect Yourself Against Predatory Clauses?
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-xl mx-auto mb-6">
            Free for all Indian citizens. Test any tenancy lease, loan agreement, or bank notice in under 10 seconds.
          </p>
          <button
            onClick={() => handleProtectedAction(onStart)}
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl text-sm font-bold text-indigo-900 bg-white hover:bg-slate-100 transition-all shadow-md active:scale-98"
          >
            <Lock className="w-4 h-4 text-indigo-700" />
            <span>{currentUser ? 'Open Nyaya Lens Workspace' : 'Sign In to Open Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Footer */}
        <div className="mt-14 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            © 2026 Nyaya Lens (न्याय लेन्स) — Built with IBM Granite 3 & watsonx.ai.
          </div>
          <div className="flex items-center space-x-4">
            <span>Consumer Helpline: <strong>1915</strong></span>
            <span>Cybercrime: <strong>1930</strong></span>
            <span>NALSA Legal Aid: <strong>15100</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
