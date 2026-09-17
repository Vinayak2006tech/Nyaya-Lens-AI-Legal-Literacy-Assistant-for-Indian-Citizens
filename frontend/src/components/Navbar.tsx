import React, { useState, useRef, useEffect } from 'react';
import { 
  Scale, 
  ShieldCheck, 
  History, 
  Sparkles, 
  Languages, 
  CheckSquare, 
  Menu, 
  X,
  PhoneCall,
  LogOut,
  Lock,
  ChevronDown
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
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-1.5 sm:gap-3 w-full">
          
          {/* Brand & Logo (Left) */}
          <div 
            onClick={onGoHome}
            className="flex items-center space-x-2 sm:space-x-2.5 flex-shrink-0 cursor-pointer group select-none"
            title="Return to Nyaya Lens Home"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-amber-600 flex items-center justify-center text-white shadow-xs ring-2 ring-indigo-50 group-hover:scale-105 transition-transform flex-shrink-0">
              <Scale className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 font-['Outfit'] group-hover:text-indigo-700 transition-colors whitespace-nowrap">
                Nyaya Lens
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-full whitespace-nowrap hidden xs:inline-block">
                न्याय लेन्स
              </span>
            </div>
          </div>

          {/* Desktop Controls (lg: 1024px and up - unified flex container) */}
          <div className="hidden lg:flex items-center space-x-1.5 xl:space-x-2 flex-shrink-1 min-w-0">
            {/* Demo Document Selector */}
            <div className="relative flex-shrink-0">
              <select
                onChange={(e) => {
                  const doc = demoDocuments.find(d => d.id === e.target.value);
                  if (doc) onSelectDemoDoc(doc);
                }}
                className="text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer w-28 xl:w-44 truncate"
                defaultValue=""
                title="Select Demo Legal Document"
              >
                <option value="" disabled>Load Demo...</option>
                {demoDocuments.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    📄 {doc.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5 flex-shrink-0">
              <Languages className="w-3 h-3 text-slate-400 ml-1 mr-0.5" />
              {(['English', 'Hindi', 'Tamil'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onSelectLanguage(lang)}
                  className={`text-[11px] px-1.5 py-1 rounded font-medium transition-all ${
                    currentLanguage === lang
                      ? 'bg-white text-indigo-700 shadow-xs font-bold border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title={`Switch explanation to ${lang}`}
                >
                  {lang === 'Hindi' ? 'हिन्दी' : lang === 'Tamil' ? 'தமிழ்' : 'EN'}
                </button>
              ))}
            </div>

            {/* Simulator Button */}
            <button
              onClick={onOpenSimulator}
              className="inline-flex items-center space-x-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-1.5 rounded-lg transition-colors flex-shrink-0"
              title="Test real-world legal outcomes of breaking clauses"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
              <span className="hidden xl:inline">Simulator</span>
            </button>

            {/* Timeline Button */}
            <button
              onClick={onOpenTimeline}
              className="inline-flex items-center space-x-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-lg transition-colors flex-shrink-0"
              title="Dispute Timeline Tracker"
            >
              <History className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span className="hidden xl:inline">Timeline</span>
            </button>

            {/* Governance Audit Button */}
            <button
              onClick={onOpenGovernance}
              className="inline-flex items-center space-x-1 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-1.5 rounded-lg transition-colors flex-shrink-0"
              title="IBM watsonx.governance verification logs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="hidden 2xl:inline">watsonx.governance</span>
              <span className="hidden xl:inline 2xl:hidden">Audit</span>
            </button>

            {/* Checklist Toggle */}
            <button
              onClick={onToggleChecklist}
              className="relative inline-flex items-center space-x-1 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-2 py-1.5 rounded-lg transition-colors flex-shrink-0"
              title="Defense Checklist"
            >
              <CheckSquare className="w-3.5 h-3.5 text-slate-700 flex-shrink-0" />
              <span className="hidden xl:inline">Checklist</span>
              {checklistCount > 0 && (
                <span className="inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-rose-600 rounded-full">
                  {checklistCount}
                </span>
              )}
            </button>

            {/* User Auth Section (Always strictly positioned inside header) */}
            {currentUser ? (
              <div ref={userMenuRef} className="relative flex items-center space-x-1.5 pl-1 border-l border-slate-200 flex-shrink-0">
                {/* Profile Pill with Dropdown Trigger */}
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg transition-colors"
                  title="Account details"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0 shadow-2xs">
                    {getInitials(currentUser.name)}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 max-w-[80px] xl:max-w-[110px] truncate hidden sm:inline">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {/* Inline Sign Out Button (Always visible on desktop!) */}
                <button
                  onClick={onLogout}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors shadow-2xs flex-shrink-0"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                  <span className="whitespace-nowrap">Sign Out</span>
                </button>

                {/* Dropdown Menu on Profile Click */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3.5 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-indigo-700 font-medium truncate">{currentUser.role}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 px-3 py-1.5 rounded-lg transition-colors shadow-xs ml-1 flex-shrink-0 whitespace-nowrap"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
            )}
          </div>

          {/* Mobile & Tablet Controls (< lg: Clean, completely non-overflowing) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 lg:hidden flex-shrink-0">
            {/* Quick Checklist Notification Icon */}
            <button
              onClick={onToggleChecklist}
              className="relative p-1.5 sm:p-2 text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
              title="Defense Checklist"
            >
              <CheckSquare className="w-4 h-4 text-slate-800" />
              {checklistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-rose-600 rounded-full ring-2 ring-white">
                  {checklistCount}
                </span>
              )}
            </button>

            {/* Mobile Auth Button */}
            {currentUser ? (
              <div className="flex items-center space-x-1">
                <div 
                  className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs flex-shrink-0"
                  title={`Logged in as ${currentUser.name}`}
                >
                  {getInitials(currentUser.name)}
                </div>
                <button
                  onClick={onLogout}
                  className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex-shrink-0"
                  title="Sign out of account"
                >
                  <LogOut className="w-3 h-3 text-rose-600" />
                  <span className="text-[11px] whitespace-nowrap">Exit</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-1 rounded-lg transition-colors flex-shrink-0"
              >
                <Lock className="w-3 h-3" />
                <span className="text-[11px]">Sign In</span>
              </button>
            )}

            {/* Hamburger Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-indigo-600" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 top-16 bg-slate-900/40 backdrop-blur-xs z-30 lg:hidden animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative z-40 lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3.5 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto animate-in slide-in-from-top-3 duration-200">
            
            {/* User Profile Card */}
            {currentUser ? (
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {getInitials(currentUser.name)}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-900 block truncate">{currentUser.name}</span>
                    <span className="text-[11px] text-slate-500 block truncate">{currentUser.role}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-lg transition-colors flex-shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 p-3 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                <Lock className="w-4 h-4" />
                <span>Log In or Create Citizen Account</span>
              </button>
            )}

            {/* Demo Document Selector */}
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

            {/* Language Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Explanation Language:
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
                {(['English', 'Hindi', 'Tamil'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      onSelectLanguage(lang);
                    }}
                    className={`text-xs py-2 rounded-lg font-medium text-center transition-all ${
                      currentLanguage === lang
                        ? 'bg-white text-indigo-700 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lang === 'Hindi' ? 'हिन्दी' : lang === 'Tamil' ? 'தமிழ்' : 'English'}
                  </button>
                ))}
              </div>
            </div>

            {/* Tools Grid */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Legal Literacy Tools:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onOpenSimulator();
                    setMobileMenuOpen(false);
                  }}
                  className="flex flex-col items-start p-3 rounded-xl bg-indigo-50/70 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 transition-colors"
                >
                  <div className="flex items-center space-x-1.5 mb-1 text-indigo-700 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span>Simulator</span>
                  </div>
                  <span className="text-[11px] text-slate-600 text-left leading-tight">
                    Simulate real-world clause breach outcomes
                  </span>
                </button>

                <button
                  onClick={() => {
                    onOpenTimeline();
                    setMobileMenuOpen(false);
                  }}
                  className="flex flex-col items-start p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200 transition-colors"
                >
                  <div className="flex items-center space-x-1.5 mb-1 text-slate-800 font-bold text-xs">
                    <History className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    <span>Timeline</span>
                  </div>
                  <span className="text-[11px] text-slate-600 text-left leading-tight">
                    Multi-document dispute chronologies
                  </span>
                </button>

                <button
                  onClick={() => {
                    onOpenGovernance();
                    setMobileMenuOpen(false);
                  }}
                  className="flex flex-col items-start p-3 rounded-xl bg-emerald-50/70 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition-colors"
                >
                  <div className="flex items-center space-x-1.5 mb-1 text-emerald-800 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Governance</span>
                  </div>
                  <span className="text-[11px] text-slate-600 text-left leading-tight">
                    watsonx verification audit logs
                  </span>
                </button>

                <button
                  onClick={() => {
                    onToggleChecklist();
                    setMobileMenuOpen(false);
                  }}
                  className="flex flex-col items-start p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between w-full mb-1 text-slate-800 font-bold text-xs">
                    <div className="flex items-center space-x-1.5">
                      <CheckSquare className="w-4 h-4 text-slate-700 flex-shrink-0" />
                      <span>Checklist</span>
                    </div>
                    {checklistCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold text-white bg-rose-600 rounded-full">
                        {checklistCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-600 text-left leading-tight">
                    Actionable defense next steps
                  </span>
                </button>
              </div>
            </div>

            {/* Helplines */}
            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
              <a href="tel:1915" className="flex items-center hover:text-indigo-600 transition-colors">
                <PhoneCall className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                <span>Consumer Helpline: <strong>1915</strong></span>
              </a>
              <a href="tel:1930" className="hover:text-indigo-600 transition-colors font-medium">
                Cyber: <strong>1930</strong>
              </a>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
