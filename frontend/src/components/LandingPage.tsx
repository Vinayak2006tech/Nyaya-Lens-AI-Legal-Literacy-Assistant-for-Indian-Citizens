import React, { useState } from 'react';
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
  LogOut,
  Gavel,
  Check,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileSearch,
  Sparkle,
  Sun,
  Moon
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
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

interface ShowcaseDoc {
  id: string;
  type: string;
  title: string;
  hindiTitle: string;
  badge: string;
  badgeColor: string;
  originalClause: string;
  riskScore: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  plainLanguage: {
    en: string;
    hi: string;
  };
  statute: {
    act: string;
    section: string;
    provision: string;
    authority: string;
  };
  actionItems: string[];
}

const SHOWCASE_DOCS: ShowcaseDoc[] = [
  {
    id: 'rent',
    type: 'Rental Agreement',
    title: 'Arbitrary Security Deposit Forfeiture & Lock-in Clause',
    hindiTitle: 'किराया समझौता: मनमाना डिपॉजिट जब्ती व पेनल्टी क्लॉज',
    badge: 'Rental Lease',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    originalClause: 'Clause 14: In case the Tenant vacates prior to the expiry of the mandatory 11-month lock-in period for any reason whatsoever, the entire security deposit of Rs. 95,000 shall stand unconditionally forfeited as liquidated damages, along with a penal surcharge of Rs. 1,000 per day until re-letting.',
    riskScore: 9.2,
    riskLevel: 'HIGH',
    plainLanguage: {
      en: 'The landlord is claiming 100% of your ₹95,000 deposit plus an illegal ₹1,000/day penalty if you move out before 11 months. Indian law strictly prohibits unreasonable penal forfeiture that does not represent actual documented damage.',
      hi: 'मकान मालिक आपसे 11 महीने से पहले खाली करने पर पूरा ₹95,000 डिपॉजिट जब्त करने और ₹1,000 प्रतिदिन का अतिरिक्त जुर्माना वसूलने का दावा कर रहा है। भारतीय कानून बिना वास्तविक नुकसान के ऐसा भारी जुर्माना लगाने की सख्त मनाही करता है।'
    },
    statute: {
      act: 'Indian Contract Act, 1872',
      section: 'Section 74',
      provision: 'Compensation for breach of contract where penalty is stipulated — Court awards only reasonable compensation, penal forfeitures are void.',
      authority: 'Rent Authority / Civil Court / National Consumer Forum (NCH 1915)'
    },
    actionItems: [
      'Do not sign this clause without the statutory 30-day notice exception.',
      'Cite Section 74 of the Indian Contract Act in your written lease reply.',
      'Demand replacement with the Model Tenancy Act 2021 standard 1-month notice clause.'
    ]
  },
  {
    id: 'fir',
    type: 'Police / Cyber Notice',
    title: 'Extortionate "Digital Arrest" & Counterfeit Police Summons',
    hindiTitle: 'फर्जी डिजिटल अरेस्ट व साइबर जबरन वसूली नोटिस',
    badge: 'Police / Cyber FIR',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    originalClause: 'OFFICIAL ORDER OF DIGITAL ARREST: You are under continuous video surveillance by the Cyber Crime Investigation Cell. You are commanded to stay inside your room on Skype/WhatsApp video call and transfer Rs. 1,40,000 to the RBI Clearing Escrow account for asset verification or face instant non-bailable arrest under BNS Sec 351.',
    riskScore: 10.0,
    riskLevel: 'HIGH',
    plainLanguage: {
      en: 'CRITICAL ALERT: This is a criminal extortion scam! There is NO such concept as "Digital Arrest" in the Indian legal system or Bharatiya Nagarik Suraksha Sanhita (BNSS). Real police or CBI officers never conduct arrests over Skype or ask you to transfer funds.',
      hi: 'गंभीर चेतावनी: यह एक फर्जी साइबर जबरन वसूली फ्रॉड है! भारतीय न्याय प्रणाली या पुलिस कानून में "डिजिटल अरेस्ट" जैसा कोई प्रावधान नहीं है। वास्तविक पुलिस या जांच एजेंसियां कभी भी व्हाट्सएप/स्काइप पर पैसे ट्रांसफर करने को नहीं कहती हैं।'
    },
    statute: {
      act: 'Bharatiya Nyaya Sanhita, 2023 & IT Act, 2000',
      section: 'BNS Sec 318(4) & IT Act Sec 66D',
      provision: 'Cheating by personation and extortion via computer resources — punishable with rigorous imprisonment up to 7 years.',
      authority: 'National Cyber Crime Reporting Portal (cybercrime.gov.in) / Dial 1930'
    },
    actionItems: [
      'DO NOT transfer any money to any account or UPI address.',
      'Immediately terminate the video call and report the phone number to 1930.',
      'File an official complaint on the government portal: cybercrime.gov.in.'
    ]
  },
  {
    id: 'loan',
    type: 'Bank Loan Contract',
    title: 'Unilateral Floating Rate & Predatory Recovery Agent Rights',
    hindiTitle: 'बैंक लोन अनुबंध: मनमाना ब्याज दर व अनैतिक वसूली क्लॉज',
    badge: 'Loan & Credit',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    originalClause: 'Clause 8.3: The Lender reserves the unrestricted unilateral prerogative to revise interest rates retrospectively. In event of 1 EMI delay, Lender reserves right to contact borrower relatives, employers, and deploy field recovery associates at residence between 06:00 to 22:00 hours.',
    riskScore: 8.5,
    riskLevel: 'HIGH',
    plainLanguage: {
      en: 'The NBFC/lender is granting itself the right to raise your interest rates retroactively and harass your employer or family. This directly violates the RBI Fair Practices Code, which strictly forbids contacting third parties or using coercive recovery methods.',
      hi: 'बैंक या लोन ऐप खुद को बिना आपकी सहमति के पिछली तारीख से ब्याज दरें बढ़ाने और आपके परिवार या कार्यस्थल पर फोन कर परेशान करने का अधिकार दे रहा है। यह आरबीआई की निष्पक्ष वसूली आचार संहिता (Fair Practices Code) का खुला उल्लंघन है।'
    },
    statute: {
      act: 'RBI Fair Practices Code & SARFAESI Act',
      section: 'RBI Circular DOR.FPC.REC.76/03.10.001',
      provision: 'Banks and recovery agents are barred from verbal intimidation, contacting third parties, or visiting borrowers at inappropriate hours.',
      authority: 'RBI Ombudsman (cms.rbi.org.in) / Consumer Commission'
    },
    actionItems: [
      'Cite the RBI Master Direction on Recovery Agents in a formal email to the Bank Nodal Officer.',
      'Keep call recordings of any harassment by recovery associates as statutory evidence.',
      'Escalate to the RBI Ombudsman portal if the bank does not resolve the grievance in 30 days.'
    ]
  },
  {
    id: 'rera',
    type: 'Builder-Buyer Agreement',
    title: 'Unfair Possession Delay & Asymmetric Interest Penalty',
    hindiTitle: 'बिल्डर-खरीदार एग्रीमेंट: कब्जा में देरी पर एकतरफा शर्तें',
    badge: 'Real Estate / RERA',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    originalClause: 'Clause 22: If Buyer delays installment, interest at 18% p.a. compounded monthly shall be charged. If Developer delays flat handover beyond scheduled date, Developer shall pay only Rs. 5 per sq.ft. per month of super area as grace compensation.',
    riskScore: 7.8,
    riskLevel: 'HIGH',
    plainLanguage: {
      en: 'The builder charges you an aggressive 18% penalty for late payment, but pays you a measly ₹5/sq.ft. for years of delay. Under RERA Section 18, both parties MUST pay the exact same prescribed interest rate (SBI MCLR + 2%).',
      hi: 'बिल्डर आपसे किश्त में देरी पर 18% भारी ब्याज मांग रहा है, लेकिन खुद फ्लैट देने में वर्षों की देरी करने पर केवल ₹5 प्रति वर्ग फुट की मामूली छूट दे रहा है। रेरा (RERA) कानून के अनुसार दोनों पक्षों पर समान ब्याज दर लागू होना अनिवार्य है।'
    },
    statute: {
      act: 'Real Estate (Regulation and Development) Act, 2016 (RERA)',
      section: 'Section 18 & Section 2(za)',
      provision: 'Equal interest rate for buyer and promoter on default — Promoter liable to pay monthly interest at prescribed bank rate until physical possession.',
      authority: 'State RERA Tribunal & MahaRERA / UP-RERA Authorities'
    },
    actionItems: [
      'Do not accept token compensation; cite Section 18 of RERA 2016.',
      'File an online complaint before your state RERA adjudicating officer.',
      'Demand interest from the committed date of possession until actual occupancy certificate.'
    ]
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onStart,
  onSelectPreset,
  demoDocuments,
  currentUser,
  onOpenAuth,
  onLogout,
  isDarkMode = true,
  onToggleDarkMode
}) => {
  const [selectedShowcaseId, setSelectedShowcaseId] = useState<string>('rent');
  const [showcaseLang, setShowcaseLang] = useState<'en' | 'hi'>('hi');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const activeShowcase = SHOWCASE_DOCS.find(d => d.id === selectedShowcaseId) || SHOWCASE_DOCS[0];

  const handleProtectedAction = (action: () => void) => {
    if (!currentUser) {
      onOpenAuth();
    } else {
      action();
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const FAQS = [
    {
      q: "Can I paste documents in Hindi, Tamil, or other regional Indian languages?",
      a: "Yes! Nyaya Lens natively supports English, Hindi (हिन्दी), Tamil (தமிழ்), Bengali, Telugu, and other Indian languages. The AI segments the native text, explains the clauses in plain language, and maps them to applicable national and state Bare Acts."
    },
    {
      q: "How does Nyaya Lens identify the exact Indian statute involved?",
      a: "Unlike generic chat models that hallucinate US laws, Nyaya Lens is trained with grounded statutory knowledge bases covering the Indian Contract Act 1872, Consumer Protection Act 2019, Model Tenancy Act 2021, RERA 2016, RBI Fair Practices Code, and Bharatiya Nyaya Sanhita (BNS) 2023."
    },
    {
      q: "What should I do if a fake police or 'Digital Arrest' summons is detected?",
      a: "Nyaya Lens immediately triggers an emergency Scam Alert Banner with the confidence score, highlights extortion indicators, and provides direct one-touch links to dial 1930 (National Cyber Crime Helpline) and file a complaint on cybercrime.gov.in."
    },
    {
      q: "Is my uploaded document private and secure?",
      a: "Completely. All user sessions are authenticated and protected under strict Indian DPDP Act 2023 standards. Documents are analyzed via secure API pipelines and are never used to train public models."
    },
    {
      q: "Can I use Nyaya Lens to negotiate a fairer agreement before signing?",
      a: "Yes! Using the 'Compare with Fair Model Clause' feature, Nyaya Lens displays a side-by-side comparison with legally balanced model clauses. You can copy fair statutory wording in one click to present to your landlord, employer, or vendor."
    }
  ];

  return (
    <div className={`relative min-h-screen font-sans transition-colors duration-200 overflow-hidden ${
      isDarkMode 
        ? 'bg-slate-950 text-slate-100 selection:bg-indigo-900 selection:text-indigo-100' 
        : 'bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900'
    }`}>
      {/* Background Interactive LineWaves Canvas */}
      <div className={`absolute inset-0 z-0 pointer-events-auto transition-opacity duration-300 ${
        isDarkMode ? 'opacity-30' : 'opacity-40'
      }`}>
        <LineWaves
          speed={0.22}
          innerLineCount={30}
          outerLineCount={36}
          warpIntensity={0.85}
          rotation={-35}
          edgeFadeWidth={0.18}
          colorCycleSpeed={0.8}
          brightness={isDarkMode ? 0.85 : 0.7}
          color1="#4f46e5"
          color2="#d97706"
          color3="#059669"
          enableMouseInteraction={true}
          mouseInfluence={2.2}
          lightMode={!isDarkMode}
        />
      </div>

      {/* Modern Gradient Backdrop Accents */}
      <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-colors ${
        isDarkMode ? 'bg-indigo-600/20' : 'bg-indigo-200/40'
      }`} />
      <div className={`absolute top-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-colors ${
        isDarkMode ? 'bg-amber-600/15' : 'bg-amber-200/35'
      }`} />
      <div className={`absolute bottom-10 left-1/3 w-[500px] h-[300px] rounded-full blur-3xl pointer-events-none transition-colors ${
        isDarkMode ? 'bg-emerald-600/15' : 'bg-emerald-200/35'
      }`} />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-24">
        
        {/* Top Mini Brand Navigation */}
        <header className={`flex items-center justify-between pb-4 sm:pb-8 border-b gap-2 sm:gap-3 transition-colors ${
          isDarkMode ? 'border-slate-800/80' : 'border-slate-200'
        }`}>
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-400/30 flex-shrink-0">
              <Scale className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className={`text-lg sm:text-2xl font-bold tracking-tight font-['Outfit'] truncate ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Nyaya Lens
                </span>
                <span className="text-[10px] sm:text-[11px] font-extrabold text-amber-500 bg-amber-500/10 border border-amber-500/30 px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap hidden xs:inline-block">
                  न्याय लेन्स
                </span>
              </div>
              <span className={`text-xs font-medium hidden md:inline truncate block ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                AI Legal-Literacy Assistant for Indian Citizens
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-3 flex-shrink-0">
            <span className={`hidden lg:inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border shadow-xs ${
              isDarkMode 
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60' 
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
              Grounded in Indian Bare Acts & watsonx
            </span>

            {/* Sun / Moon Theme Toggle */}
            {onToggleDarkMode && (
              <button
                onClick={onToggleDarkMode}
                className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl border transition-all flex items-center justify-center ${
                  isDarkMode 
                    ? 'bg-slate-800/80 border-slate-700 text-amber-400 hover:text-amber-300 hover:bg-slate-700/80' 
                    : 'bg-white border-slate-300 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 shadow-xs'
                }`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            {currentUser ? (
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <div className={`flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl max-w-[120px] sm:max-w-[200px] border ${
                  isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
                }`}>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-indigo-500 text-white font-bold text-[10px] sm:text-xs flex items-center justify-center flex-shrink-0">
                    {currentUser.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold truncate hidden sm:inline">{currentUser.name}</span>
                </div>
                <button
                  onClick={onStart}
                  className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/30 active:scale-98"
                >
                  <span>Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={onLogout}
                  className={`inline-flex items-center justify-center p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                    isDarkMode 
                      ? 'text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-900/50 border-rose-800/50' 
                      : 'text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border-rose-200 shadow-xs'
                  }`}
                  title="Sign out of your account"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <button
                  onClick={onOpenAuth}
                  className={`inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                    isDarkMode 
                      ? 'text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700 border-slate-700' 
                      : 'text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border-slate-300 shadow-xs'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Log In</span>
                </button>
                <button
                  onClick={onOpenAuth}
                  className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-md shadow-amber-400/20 active:scale-98"
                >
                  <span><span className="xs:hidden">Register</span><span className="hidden xs:inline">Register Free</span></span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-8 sm:pt-16 pb-8 sm:pb-12 text-center max-w-4xl mx-auto px-2 sm:px-0">
          {/* Tagline Pill */}
          <div className={`inline-flex items-center space-x-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold mb-5 sm:mb-6 shadow-sm backdrop-blur-sm border ${
            isDarkMode 
              ? 'bg-indigo-950/80 border-indigo-700/60 text-indigo-300' 
              : 'bg-indigo-50 border-indigo-200 text-indigo-800'
          }`}>
            <Sparkle className="w-3.5 h-3.5 text-amber-500 animate-pulse flex-shrink-0" />
            <span className="text-center">AI Legal Literacy & Statutory Defense for Every Indian Citizen</span>
          </div>

          {/* Retro SplitFlap Live Dispatcher */}
          <div className="flex flex-col items-center justify-center mb-6 sm:mb-7 w-full max-w-full">
            <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1 rounded-t-xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-amber-600 border border-b-0 border-indigo-500/80 text-[9px] sm:text-[11px] uppercase font-mono tracking-wider text-amber-200 shadow-md">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-ping mr-0.5" />
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 -ml-2 sm:-ml-2.5" />
              <span className="font-bold">LIVE STATUTORY CITATION SCANNER</span>
            </div>
            <div className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 shadow-2xl flex items-center justify-center w-full max-w-full overflow-hidden ring-2 sm:ring-4 ring-indigo-500/10 backdrop-blur-md transition-colors ${
              isDarkMode 
                ? 'bg-slate-950/90 border-indigo-500/50 shadow-indigo-950/80' 
                : 'bg-white/90 border-indigo-300/80 shadow-indigo-200/50'
            }`}>
              <SplitFlapText
                words={['NYAYA LENS', 'LEGAL SHIELD', 'BARE ACT SYNC', 'PLAIN HINDI', 'CITIZEN POWER']}
                flipDuration={0.12}
                stagger={0.06}
                cycleDelay={2400}
                charset="alphanumeric"
                flipsPerChar={8}
                tileColor={isDarkMode ? '#0f172a' : '#1e1b4b'}
                textColor="#f8fafc"
                tileRadius={6}
                gap="clamp(2px, 0.8vw, 6px)"
                fontSize="clamp(12px, 3.8vw, 28px)"
                loop
                padTo={13}
              />
            </div>
          </div>

          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-['Outfit'] leading-tight mb-4 sm:mb-5">
            <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>
              Paste Any Indian Legal Document.
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 bg-clip-text text-transparent">
              Know Your Rights & Exact Next Steps.
            </span>
          </h1>

          <p className={`text-sm sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-2xl mx-auto font-normal ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Whether it's an <strong>unfair rental lease</strong>, a <strong>threatening bank loan notice</strong>, a <strong>counterfeit police FIR</strong>, or a <strong>builder agreement</strong> — Nyaya Lens parses every clause, scores the risk, explains traps in plain Hindi/English, and cites the <em>actual Indian statute</em> protecting you.
          </p>

          <div className="flex flex-col xs:flex-row items-center justify-center gap-2.5 sm:gap-4 w-full">
            <button
              onClick={() => handleProtectedAction(onStart)}
              className="w-full xs:w-auto inline-flex items-center justify-center space-x-2.5 px-6 sm:px-8 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-lg shadow-amber-400/25 transition-all active:scale-98 ring-2 ring-amber-400/30"
            >
              <FileSearch className="w-4 h-4 text-slate-950" />
              <span>{currentUser ? 'Open Legal Workspace' : 'Get Started — Paste Your Document'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            {demoDocuments.length > 0 && (
              <button
                onClick={() => handleProtectedAction(() => onSelectPreset(demoDocuments[0]))}
                className={`w-full xs:w-auto inline-flex items-center justify-center space-x-2 px-5 sm:px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                  isDarkMode 
                    ? 'text-slate-200 bg-slate-800/90 hover:bg-slate-700/90 border-slate-700 hover:border-slate-600' 
                    : 'text-slate-700 bg-white hover:bg-slate-50 border-slate-300 shadow-xs'
                }`}
              >
                <span>Try Sample Rental Agreement</span>
                <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
              </button>
            )}
          </div>

          <div className={`mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-medium ${
            isDarkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            <span className="flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-500" />
              100% Free for Citizens
            </span>
            <span className="flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-500" />
              English, हिन्दी, தமிழ், বাংলা
            </span>
            <span className="flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-500" />
              Grounded in Indian Bare Acts
            </span>
            <span className="flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-500" />
              DPDP Act 2023 Compliant
            </span>
          </div>
        </section>

        {/* Interactive Live Document Scanner Sandbox */}
        <section className="mb-20">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block mb-1">
              Interactive Live Demonstration
            </span>
            <h2 className={`text-2xl sm:text-3xl font-bold font-['Outfit'] ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              See How Nyaya Lens Decodes Cryptic Legalese
            </h2>
            <p className={`text-xs sm:text-sm mt-1 max-w-xl mx-auto ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Select an Indian document type below to see the clause segmentation, risk score, plain vernacular explanation, and exact legal remedy in action.
            </p>
          </div>

          {/* Document Selector Tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto max-w-full pb-2 px-1">
            {SHOWCASE_DOCS.map(doc => (
              <button
                key={doc.id}
                onClick={() => setSelectedShowcaseId(doc.id)}
                className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center space-x-2 border flex-shrink-0 ${
                  selectedShowcaseId === doc.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400 border-transparent'
                    : isDarkMode 
                      ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border-slate-700/80' 
                      : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200 shadow-xs'
                }`}
              >
                <span>{doc.type}</span>
              </button>
            ))}
          </div>

          {/* Interactive Inspection Card Container */}
          <div className={`rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl backdrop-blur-xl border transition-colors ${
            isDarkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-white/95 border-slate-200 shadow-xl'
          }`}>
            <div className="flex flex-col lg:flex-row gap-5 sm:gap-6">
              
              {/* Left Column: Original Cryptic Legal Clause */}
              <div className={`lg:w-5/12 flex flex-col justify-between rounded-xl sm:rounded-2xl p-4 sm:p-6 border transition-colors ${
                isDarkMode ? 'bg-slate-900/90 border-slate-800 text-slate-200' : 'bg-slate-50/90 border-slate-200 text-slate-900'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      Original Legalese Document
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${activeShowcase.badgeColor}`}>
                      {activeShowcase.badge}
                    </span>
                  </div>
                  
                  <h3 className={`text-base font-bold mb-3 ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {activeShowcase.title}
                  </h3>

                  <div className={`p-3.5 rounded-xl border text-xs sm:text-sm font-mono leading-relaxed relative overflow-hidden ${
                    isDarkMode 
                      ? 'bg-slate-950/80 border-rose-900/40 text-slate-300' 
                      : 'bg-white border-rose-200 text-slate-800 shadow-xs'
                  }`}>
                    <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
                    {activeShowcase.originalClause}
                  </div>
                </div>

                <div className={`mt-5 pt-4 border-t flex items-center justify-between text-xs ${
                  isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
                }`}>
                  <span>Clause Risk Evaluation:</span>
                  <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg font-bold border ${
                    isDarkMode ? 'bg-rose-950/80 text-rose-300 border-rose-800' : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    <span>Risk {activeShowcase.riskScore}/10 ({activeShowcase.riskLevel})</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Nyaya Lens Plain Language Breakdown & Indian Statute */}
              <div className={`lg:w-7/12 flex flex-col justify-between rounded-xl sm:rounded-2xl p-4 sm:p-6 border transition-colors ${
                isDarkMode 
                  ? 'bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-900 border-indigo-900/50' 
                  : 'bg-gradient-to-b from-indigo-50/50 via-white to-white border-indigo-100'
              }`}>
                <div>
                  {/* Language Toggle */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span className={`text-xs font-bold uppercase tracking-wider ${
                        isDarkMode ? 'text-amber-300' : 'text-amber-700'
                      }`}>
                        Plain Language Explanation
                      </span>
                    </div>
                    
                    <div className={`flex items-center space-x-1 p-1 rounded-lg border text-xs ${
                      isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
                    }`}>
                      <button
                        onClick={() => setShowcaseLang('hi')}
                        className={`px-2.5 py-1 rounded-md transition-all font-semibold ${
                          showcaseLang === 'hi' 
                            ? 'bg-indigo-600 text-white shadow-sm' 
                            : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        हिन्दी (Hindi)
                      </button>
                      <button
                        onClick={() => setShowcaseLang('en')}
                        className={`px-2.5 py-1 rounded-md transition-all font-semibold ${
                          showcaseLang === 'en' 
                            ? 'bg-indigo-600 text-white shadow-sm' 
                            : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        English
                      </button>
                    </div>
                  </div>

                  {/* Plain Language Box */}
                  <div className={`p-4 rounded-xl mb-4 text-xs sm:text-sm leading-relaxed font-sans border ${
                    isDarkMode 
                      ? 'bg-amber-950/25 border-amber-500/30 text-amber-100' 
                      : 'bg-amber-50/70 border-amber-200 text-amber-950'
                  }`}>
                    <p>{activeShowcase.plainLanguage[showcaseLang]}</p>
                  </div>

                  {/* Statute Citation Pill */}
                  <div className={`p-3.5 rounded-xl mb-4 text-xs border ${
                    isDarkMode 
                      ? 'bg-indigo-950/50 border-indigo-600/40 text-slate-300' 
                      : 'bg-indigo-50/80 border-indigo-200 text-slate-700'
                  }`}>
                    <div className={`flex items-center space-x-2 font-bold mb-1 ${
                      isDarkMode ? 'text-indigo-300' : 'text-indigo-900'
                    }`}>
                      <Scale className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                      <span>Grounded Indian Law: {activeShowcase.statute.act} ({activeShowcase.statute.section})</span>
                    </div>
                    <p className={`mb-2 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {activeShowcase.statute.provision}
                    </p>
                    <div className="text-[11px] font-semibold flex items-center">
                      <span className={`mr-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Enforcement Authority:</span>
                      <span className={isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}>{activeShowcase.statute.authority}</span>
                    </div>
                  </div>

                  {/* Citizen Action Checklist */}
                  <div className="text-xs mb-4">
                    <span className={`font-bold block mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Citizen Action Checklist (What to Do Next):
                    </span>
                    <ul className="space-y-1.5">
                      {activeShowcase.actionItems.map((item, idx) => (
                        <li key={idx} className={`flex items-start space-x-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Trigger Full Scan CTA */}
                <div className={`pt-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
                  isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
                }`}>
                  <span className="text-[11px]">
                    Want to inspect your real agreement with custom audio playback?
                  </span>
                  <button
                    onClick={() => handleProtectedAction(onStart)}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-sm"
                  >
                    <span>Scan in Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 4 Pillars of Nyaya Lens */}
        <section className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest block mb-1">
              Core Capabilities
            </span>
            <h2 className={`text-2xl sm:text-3xl font-bold font-['Outfit'] ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Why Indian Citizens Rely on Nyaya Lens
            </h2>
            <p className={`text-xs sm:text-sm mt-2 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Unlike generic US-centric legal chatbots, Nyaya Lens is engineered specifically for Indian law, Indian languages, and Indian consumer realities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className={`border rounded-2xl p-6 transition-all duration-200 shadow-subtle group ${
              isDarkMode 
                ? 'bg-slate-950/70 border-slate-800 hover:border-indigo-500/50' 
                : 'bg-white border-slate-200 hover:border-indigo-500/50 shadow-sm hover:shadow-md'
            }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border ${
                isDarkMode ? 'bg-indigo-950/80 border-indigo-700/40 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-700'
              }`}>
                <FileText className="w-6 h-6" />
              </div>
              <h3 className={`text-base font-bold mb-2 font-['Outfit'] ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                1. Any Document, Any Language
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Paste raw agreements or upload notices in Hindi, English, Tamil, or regional scripts. IBM Granite parses the full text without losing legal context.
              </p>
            </div>

            <div className={`border rounded-2xl p-6 transition-all duration-200 shadow-subtle group ${
              isDarkMode 
                ? 'bg-slate-950/70 border-slate-800 hover:border-amber-500/50' 
                : 'bg-white border-slate-200 hover:border-amber-500/50 shadow-sm hover:shadow-md'
            }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border ${
                isDarkMode ? 'bg-amber-950/80 border-amber-700/40 text-amber-400' : 'bg-amber-50 border-amber-100 text-amber-700'
              }`}>
                <Volume2 className="w-6 h-6" />
              </div>
              <h3 className={`text-base font-bold mb-2 font-['Outfit'] ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                2. Plain Vernacular & Voice
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Translates convoluted Latin terms and confusing clauses into crystal-clear everyday language. Includes high-fidelity audio readouts for low-literacy citizens.
              </p>
            </div>

            <div className={`border rounded-2xl p-6 transition-all duration-200 shadow-subtle group ${
              isDarkMode 
                ? 'bg-slate-950/70 border-slate-800 hover:border-rose-500/50' 
                : 'bg-white border-slate-200 hover:border-rose-500/50 shadow-sm hover:shadow-md'
            }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border ${
                isDarkMode ? 'bg-rose-950/80 border-rose-700/40 text-rose-400' : 'bg-rose-50 border-rose-100 text-rose-700'
              }`}>
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className={`text-base font-bold mb-2 font-['Outfit'] ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                3. 2-Axis Risk Scoring (0–10)
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Measures clause risk severity alongside AI model confidence. Flags illegal forfeiture, unilateral penalty escalation, and scam arrest patterns instantly.
              </p>
            </div>

            <div className={`border rounded-2xl p-6 transition-all duration-200 shadow-subtle group ${
              isDarkMode 
                ? 'bg-slate-950/70 border-slate-800 hover:border-emerald-500/50' 
                : 'bg-white border-slate-200 hover:border-emerald-500/50 shadow-sm hover:shadow-md'
            }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border ${
                isDarkMode ? 'bg-emerald-950/80 border-emerald-700/40 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-700'
              }`}>
                <Gavel className="w-6 h-6" />
              </div>
              <h3 className={`text-base font-bold mb-2 font-['Outfit'] ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                4. Real Statute Citations
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Every risk flag is grounded in Section numbers from the Indian Contract Act, CPA 2019, RERA, Model Tenancy Act, and RBI Master Directions.
              </p>
            </div>
          </div>
        </section>

        {/* Indian Statutory Grounding Ticker */}
        <section className={`border rounded-2xl p-6 sm:p-8 mb-20 shadow-lg transition-colors ${
          isDarkMode ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-white shadow-sm'
        }`}>
          <div className="flex items-center space-x-2.5 mb-5">
            <Scale className={`w-5 h-5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <h3 className={`text-base font-bold font-['Outfit'] ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Pre-Loaded Indian Statute Knowledge Base
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-semibold">
            {[
              'Contract Act 1872 (Sec 74)',
              'Consumer Protection 2019',
              'Model Tenancy Act 2021',
              'RBI Fair Practices Code',
              'IT Act 2000 (Sec 66D)',
              'Bharatiya Nyaya Sanhita 2023'
            ].map((statuteName, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded-xl border text-center transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-900/90 border-slate-800 text-slate-300' 
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                {statuteName}
              </div>
            ))}
          </div>
        </section>

        {/* Real-World Citizen Defense Stories */}
        <section className="mb-20">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block mb-1">
              Empowering Citizens
            </span>
            <h2 className={`text-2xl sm:text-3xl font-bold font-['Outfit'] ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              How Citizens Defend Their Rights
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`border rounded-2xl p-6 transition-colors ${
              isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center space-x-2 text-emerald-500 text-xs font-bold mb-3">
                <Check className="w-4 h-4" />
                <span>SAVED ₹75,000 DEPOSIT</span>
              </div>
              <h4 className={`text-sm font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                "Landlord dropped the unfair 11-month forfeit"
              </h4>
              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                "When moving cities, my Bengaluru landlord cited a lock-in clause to seize 2 months deposit. I showed the Nyaya Lens Section 74 citation and the landlord immediately agreed to a standard 1-month notice."
              </p>
              <div className={`mt-4 pt-3 border-t text-[11px] font-semibold ${
                isDarkMode ? 'border-slate-800/80 text-slate-500' : 'border-slate-100 text-slate-400'
              }`}>
                — Ramesh K., Software Engineer, Bengaluru
              </div>
            </div>

            <div className={`border rounded-2xl p-6 transition-colors ${
              isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center space-x-2 text-rose-500 text-xs font-bold mb-3">
                <ShieldAlert className="w-4 h-4" />
                <span>AVOIDED ₹2 LAKH SCAM</span>
              </div>
              <h4 className={`text-sm font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                "Spotted a fake CBI arrest order in seconds"
              </h4>
              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                "I received an official-looking police letter threatening digital arrest for courier drugs. Pasted it into Nyaya Lens, and it lit up with a 10/10 scam alert, guiding me straight to dial 1930 instead of paying."
              </p>
              <div className={`mt-4 pt-3 border-t text-[11px] font-semibold ${
                isDarkMode ? 'border-slate-800/80 text-slate-500' : 'border-slate-100 text-slate-400'
              }`}>
                — Sunita V., Homemaker, Delhi NCR
              </div>
            </div>

            <div className={`border rounded-2xl p-6 transition-colors ${
              isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center space-x-2 text-amber-500 text-xs font-bold mb-3">
                <Gavel className="w-4 h-4" />
                <span>RECOVERY HARASSMENT STOPPED</span>
              </div>
              <h4 className={`text-sm font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                "Stopped illegal late-night recovery calls"
              </h4>
              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                "A loan app was calling my workplace. Nyaya Lens gave me the exact RBI Fair Practices Code circular. Once I emailed the bank nodal officer with that citation, all third-party calls ceased within 24 hours."
              </p>
              <div className={`mt-4 pt-3 border-t text-[11px] font-semibold ${
                isDarkMode ? 'border-slate-800/80 text-slate-500' : 'border-slate-100 text-slate-400'
              }`}>
                — Amit P., Small Business Owner, Pune
              </div>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions Accordion */}
        <section className="mb-20 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest block mb-1">
              Common Questions
            </span>
            <h2 className={`text-2xl sm:text-3xl font-bold font-['Outfit'] ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className={`border rounded-2xl overflow-hidden transition-all ${
                  isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className={`w-full p-4 sm:p-5 flex items-center justify-between text-left text-sm font-bold transition-colors ${
                    isDarkMode ? 'text-white hover:text-indigo-300' : 'text-slate-900 hover:text-indigo-600'
                  }`}
                >
                  <span className="pr-4">{faq.q}</span>
                  {openFaqIndex === idx ? (
                    <ChevronUp className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  )}
                </button>
                {openFaqIndex === idx && (
                  <div className={`px-4 sm:px-5 pb-5 text-xs sm:text-sm leading-relaxed border-t pt-3 ${
                    isDarkMode ? 'text-slate-300 border-slate-800/80' : 'text-slate-600 border-slate-100'
                  }`}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Call to Action Banner */}
        <section className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-amber-600 rounded-3xl p-8 sm:p-12 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold font-['Outfit'] mb-3">
              Never Sign a Legal Document Blindly Again.
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 mb-6 leading-relaxed">
              Join thousands of Indian citizens protecting their deposits, savings, and peace of mind with IBM Granite AI and Indian statutory verification.
            </p>
            <button
              onClick={() => handleProtectedAction(onStart)}
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-white hover:bg-slate-100 transition-all shadow-lg active:scale-98"
            >
              <FileSearch className="w-4 h-4 text-indigo-700" />
              <span>{currentUser ? 'Enter Workspace & Scan' : 'Register Free & Analyze Document'}</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </section>

        {/* Footer with Government Helplines */}
        <footer className={`mt-14 pt-6 border-t flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs gap-3 text-center sm:text-left ${
          isDarkMode ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-600'
        }`}>
          <div>
            © 2026 Nyaya Lens (न्याय लेन्स) — Powered by IBM Granite 3 & watsonx.governance.
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-2">
            <span>Consumer Helpline: <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>1915</strong></span>
            <span>Cybercrime: <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>1930</strong></span>
            <span>NALSA Legal Aid: <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>15100</strong></span>
          </div>
        </footer>

      </div>
    </div>
  );
};

