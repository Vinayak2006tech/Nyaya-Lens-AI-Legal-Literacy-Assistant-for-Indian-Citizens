import React, { useState } from 'react';
import { 
  Scale, 
  ShieldCheck, 
  History, 
  Sparkles, 
  Languages, 
  CheckSquare, 
  Menu, 
  X,
  FileText,
  PhoneCall,
  User,
  LogOut,
  Lock
} from 'lucide-react';
import { DemoDocument, UserProfile } from '../types';

interface NavbarProps {
  currentLanguage: string;
  onSelectLanguage: (lang: string) => void;
  demoDocuments: DemoDocument[];
  onSelectDemoDoc: (doc: DemoDocument) => void;
  onOpenSimulator: () => void;
  onOpenGovernance: () => void;
  onOpenTimeline: () => void;
  onToggleChecklist: () => void;
  checklistCount: number;
  onGoHome?: () => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLanguage,
  onSelectLanguage,
  demoDocuments,
  onSelectDemoDoc,
  onOpenSimulator,
  onOpenGovernance,
  onOpenTimeline,
  onToggleChecklist,
  checklistCount,
  onGoHome,
  currentUser,
  onOpenAuth,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Logo */}
          <div 
            onClick={onGoHome}
            className="flex items-center space-x-2.5 sm:space-x-3 flex-shrink-0 cursor-pointer group"
            title="Return to Nyaya Lens Home & User Guide"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-amber-600 flex items-center justify-center text-white shadow-sm ring-2 ring-indigo-50 group-hover:scale-105 transition-transform">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-['Outfit'] group-hover:text-indigo-700 transition-colors">
                  Nyaya Lens
                </span>
                <span className="text-xs sm:text-sm font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                  न्याय लेन्स
                </span>
                <span className="hidden xl:inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  IBM Granite 3
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                AI Legal Literacy & Clause Risk Assistant for Indian Citizens
              </p>
            </div>
          </div>

          {/* Desktop Controls (lg and above) */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Demo Document Selector */}
            <div className="relative">
              <select
                onChange={(e) => {
                  const doc = demoDocuments.find(d => d.id === e.target.value);
                  if (doc) onSelectDemoDoc(doc);
                }}
                className="text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer max-w-[180px] xl:max-w-[220px] truncate"
                defaultValue=""
              >
                <option value="" disabled>Load Demo Document...</option>
                {demoDocuments.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    📄 {doc.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5">
              <Languages className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
              {(['English', 'Hindi', 'Tamil'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onSelectLanguage(lang)}
                  className={`text-xs px-2 py-1 rounded-md font-medium transition-all ${
                    currentLanguage === lang
                      ? 'bg-white text-indigo-700 shadow-xs font-semibold border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang === 'Hindi' ? 'हिन्दी' : lang === 'Tamil' ? 'தமிழ்' : 'Eng'}
                </button>
              ))}
            </div>

            {/* Simulator Button */}
            <button
              onClick={onOpenSimulator}
              className="inline-flex items-center space-x-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1.5 rounded-lg transition-colors"
              title="Test real-world legal outcomes of breaking clauses"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Simulator</span>
            </button>

            {/* Timeline Button */}
            <button
              onClick={onOpenTimeline}
              className="inline-flex items-center space-x-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg transition-colors"
              title="Multi-document dispute timeline tracker"
            >
              <History className="w-3.5 h-3.5 text-slate-500" />
              <span>Timeline</span>
            </button>

            {/* Governance Audit Button */}
            <button
              onClick={onOpenGovernance}
              className="inline-flex items-center space-x-1 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-lg transition-colors"
              title="View IBM watsonx.governance verification and hallucination logs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden xl:inline">watsonx.governance</span>
              <span className="xl:hidden">Audit</span>
            </button>

            {/* Actionable Checklist Toggle */}
            <button
              onClick={onToggleChecklist}
              className="relative inline-flex items-center space-x-1 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <CheckSquare className="w-3.5 h-3.5 text-slate-700" />
              <span>Checklist</span>
              {checklistCount > 0 && (
                <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-rose-600 rounded-full">
                  {checklistCount}
                </span>
              )}
            </button>

            {/* User Auth Section */}
            {currentUser ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">
                    {getInitials(currentUser.name)}
                  </div>
                  <div className="text-left hidden xl:block">
                    <span className="text-xs font-bold text-slate-900 block leading-tight truncate max-w-[90px]">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-slate-500 block leading-tight">
                      {currentUser.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors shadow-2xs"
                  title="Sign out of Nyaya Lens"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 px-3 py-1.5 rounded-lg transition-colors shadow-xs ml-1"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
            )}
          </div>

          {/* Mobile & Tablet Compact Controls (< lg) */}
          <div className="flex items-center space-x-2 lg:hidden">
            {/* User Avatar & Sign Out on mobile */}
            {currentUser ? (
              <div className="flex items-center space-x-1.5">
                <div 
                  className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs"
                  title={`Logged in as ${currentUser.name}`}
                >
                  {getInitials(currentUser.name)}
                </div>
                <button
                  onClick={onLogout}
                  className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg"
                  title="Sign Out"
                >
                  <LogOut className="w-3 h-3 text-rose-600" />
                  <span className="text-[11px]">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1.5 rounded-lg"
              >
                <Lock className="w-3 h-3" />
                <span>Sign In</span>
              </button>
            )}

            {/* Quick Simulator Icon button on mobile */}
            <button
              onClick={onOpenSimulator}
              className="p-2 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg"
              title="What If Simulator"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Quick Checklist Button on mobile */}
            <button
              onClick={onToggleChecklist}
              className="relative p-2 text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg"
              title="Defense Checklist"
            >
              <CheckSquare className="w-4 h-4" />
              {checklistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-rose-600 rounded-full">
                  {checklistCount}
                </span>
              )}
            </button>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {/* User Profile Card on mobile */}
          {currentUser ? (
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  {getInitials(currentUser.name)}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{currentUser.name}</span>
                  <span className="text-[11px] text-slate-500 block">{currentUser.role}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 px-2 py-1 bg-rose-50 border border-rose-200 rounded-lg"
              >
                Log Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onOpenAuth();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              <Lock className="w-4 h-4" />
              <span>Log In or Create Citizen Account</span>
            </button>
          )}

          {/* Demo Documents */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Select Sample Legal Document:
            </label>
            <select
              onChange={(e) => {
                const doc = demoDocuments.find(d => d.id === e.target.value);
                if (doc) {
                  onSelectDemoDoc(doc);
                  setMobileMenuOpen(false);
                }
              }}
              className="w-full text-xs font-medium bg-slate-50 text-slate-800 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              defaultValue=""
            >
              <option value="" disabled>Load Demo Document...</option>
              {demoDocuments.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  📄 {doc.title}
                </option>
              ))}
            </select>
          </div>

          {/* Language Switcher */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Explanation Language:
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
              {(['English', 'Hindi', 'Tamil'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    onSelectLanguage(lang);
                  }}
                  className={`text-xs py-1.5 rounded-md font-medium text-center transition-all ${
                    currentLanguage === lang
                      ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang === 'Hindi' ? 'हिन्दी' : lang === 'Tamil' ? 'தமிழ்' : 'English'}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Action Navigation Grid */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onOpenSimulator();
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-semibold text-left transition-colors"
            >
              <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span>"What If I..." Simulator</span>
            </button>

            <button
              onClick={() => {
                onOpenTimeline();
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold text-left transition-colors"
            >
              <History className="w-4 h-4 text-slate-600 flex-shrink-0" />
              <span>Dispute Timeline</span>
            </button>

            <button
              onClick={() => {
                onOpenGovernance();
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold text-left transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>watsonx.governance</span>
            </button>

            <button
              onClick={() => {
                onToggleChecklist();
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-semibold text-left transition-colors"
            >
              <CheckSquare className="w-4 h-4 text-slate-700 flex-shrink-0" />
              <span>Checklist ({checklistCount})</span>
            </button>
          </div>

          {/* Helplines reminder */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center">
              <PhoneCall className="w-3 h-3 mr-1 text-slate-400" />
              Consumer Helpline: <strong>1915</strong>
            </span>
            <span>Cyber Helpline: <strong>1930</strong></span>
          </div>
        </div>
      )}
    </header>
  );
};
