import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, FileText, Menu, X, ChevronRight, 
  MapPin, TrendingUp, ShieldCheck, Search, PlayCircle,
  Briefcase, Building2, Zap, Activity, Globe, MessageSquare,
  ArrowUpRight, ArrowDownRight, Minus, Radio, Landmark,
  Mic, Newspaper
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import PollCard from './components/PollCard';
import GeminiEditor from './components/GeminiEditor';
import { Poll } from './types';

// --- MOCK DATA ---
const HIGHLIGHT_POLLS: Poll[] = [
  {
    id: 'p1',
    category: 'Approve',
    question: 'Ma ku qanacsan tahay waxqabadka Xukuumadda Federaalka?',
    totalVotes: 1240,
    data: [
      { label: 'Approve', value: 45, color: '#10b981' },
      { label: 'Disapprove', value: 38, color: '#ef4444' },
      { label: 'Unsure', value: 17, color: '#9ca3af' },
    ]
  },
  {
    id: 'p2',
    category: 'Trust',
    question: 'Ma ku kalsoontahay garsoorka dalka?',
    totalVotes: 980,
    data: [
      { label: 'Trust', value: 22, color: '#10b981' },
      { label: 'Distrust', value: 65, color: '#ef4444' },
      { label: 'Neutral', value: 13, color: '#9ca3af' },
    ]
  },
  {
    id: 'p3',
    category: 'Support',
    question: 'Ma taageersantahay siyaasadda cusub ee amniga?',
    totalVotes: 2100,
    data: [
      { label: 'Support', value: 72, color: '#10b981' },
      { label: 'Oppose', value: 20, color: '#ef4444' },
      { label: 'Unsure', value: 8, color: '#9ca3af' },
    ]
  }
];

const INDEX_DATA = [
  { title: 'Service Quality', value: 42, history: [30, 35, 38, 42] },
  { title: 'Access to Services', value: 35, history: [32, 33, 34, 35] },
  { title: 'Transparency', value: 28, history: [25, 26, 24, 28] },
  { title: 'Public Trust', value: 48, history: [40, 42, 45, 48] },
  { title: 'Efficiency', value: 39, history: [35, 36, 38, 39] },
  { title: 'Welfare Impact', value: 31, history: [30, 29, 30, 31] },
];

const STATES = [
  'Banaadir', 'Galmudug', 'Hirshabelle', 'Puntland', 'Jubbaland', 'Koonfur Galbeed'
];

const CATEGORIES = [
  { name: 'Approve / Disapprove', icon: <ShieldCheck size={20} /> },
  { name: 'Favorable / Unfavorable', icon: <TrendingUp size={20} /> },
  { name: 'Support / Oppose', icon: <Users size={20} /> },
  { name: 'For / Against', icon: <FileText size={20} /> },
  { name: 'Likely / Unlikely', icon: <BarChart3 size={20} /> },
  { name: 'Agree / Disagree', icon: <ShieldCheck size={20} /> },
];

// Mock Data for Top 100 Business Feature
const TOP_COMPANIES = [
  { rank: 1, name: 'Hormuud Telecom', industry: 'Telecom', mentions: '15.2k', score: 94, trend: 'up' },
  { rank: 2, name: 'Dahabshiil Group', industry: 'Finance', mentions: '12.8k', score: 91, trend: 'up' },
  { rank: 3, name: 'IBS Bank', industry: 'Banking', mentions: '8.3k', score: 85, trend: 'stable' },
  { rank: 4, name: 'Somtel', industry: 'Telecom', mentions: '7.9k', score: 78, trend: 'down' },
  { rank: 5, name: 'Premier Bank', industry: 'Banking', mentions: '6.5k', score: 76, trend: 'up' },
  { rank: 6, name: 'Hass Petroleum', industry: 'Energy', mentions: '5.2k', score: 72, trend: 'stable' },
  { rank: 7, name: 'Jazeera Palace', industry: 'Hospitality', mentions: '4.8k', score: 69, trend: 'up' },
];

const LIVE_SIGNALS = [
  { source: 'Facebook', text: 'Hormuud announces new agricultural grants...', time: 'Just now', type: 'positive' },
  { source: 'Hiiraan Online', text: 'Market analysis: Banking sector sees growth...', time: '2m ago', type: 'neutral' },
  { source: 'Twitter', text: 'Service disruption reported in Wadajir area...', time: '5m ago', type: 'negative' },
  { source: 'Caasimada', text: 'Dahabshiil opens new branch in...', time: '8m ago', type: 'positive' },
  { source: 'TikTok', text: 'Trending review of new data plans...', time: '12m ago', type: 'neutral' },
];

// Mock Data for Top 25 Politicians Feature
const TOP_POLITICIANS = [
  { rank: 1, name: 'Hassan Sheikh Mohamud', role: 'President', mentions: '45.2k', score: 98, trend: 'up' },
  { rank: 2, name: 'Hamza Abdi Barre', role: 'Prime Minister', mentions: '32.1k', score: 92, trend: 'stable' },
  { rank: 3, name: 'Said Abdullahi Deni', role: 'President of Puntland', mentions: '28.4k', score: 88, trend: 'up' },
  { rank: 4, name: 'Ahmed Madobe', role: 'President of Jubbaland', mentions: '25.9k', score: 85, trend: 'down' },
  { rank: 5, name: 'Muse Bihi Abdi', role: 'Somaliland', mentions: '21.5k', score: 82, trend: 'up' },
  { rank: 6, name: 'Ali Gudlawe', role: 'President of Hirshabelle', mentions: '18.2k', score: 75, trend: 'stable' },
  { rank: 7, name: 'Ahmed Qoorqoor', role: 'President of Galmudug', mentions: '15.8k', score: 72, trend: 'down' },
  { rank: 8, name: 'Laftagareen', role: 'President of SW', mentions: '14.5k', score: 70, trend: 'up' },
  { rank: 9, name: 'Abdirahman Abdishakur', role: 'MP / Opposition', mentions: '12.1k', score: 68, trend: 'up' },
  { rank: 10, name: 'Fawzia Yusuf Adam', role: 'Former FM', mentions: '9.8k', score: 65, trend: 'stable' },
  { rank: 11, name: 'Salah Ahmed Jama', role: 'Deputy PM', mentions: '8.4k', score: 62, trend: 'stable' },
  { rank: 12, name: 'Mukhtar Robow', role: 'Minister', mentions: '7.9k', score: 60, trend: 'down' },
  { rank: 13, name: 'Sheikh Adan Madobe', role: 'Speaker of House', mentions: '7.2k', score: 58, trend: 'stable' },
  { rank: 14, name: 'Abdi Hashi', role: 'Speaker of Senate', mentions: '6.8k', score: 55, trend: 'stable' },
  { rank: 15, name: 'Sadia Yasin Samatar', role: 'Deputy Speaker', mentions: '6.5k', score: 54, trend: 'up' },
  { rank: 16, name: 'Ahmed Fiqi', role: 'Minister', mentions: '6.1k', score: 52, trend: 'up' },
  { rank: 17, name: 'Hassan Ali Khaire', role: 'Former PM', mentions: '5.9k', score: 50, trend: 'down' },
  { rank: 18, name: 'Mohamed Abdullahi Farmaajo', role: 'Former President', mentions: '5.8k', score: 49, trend: 'stable' },
  { rank: 19, name: 'Sharif Sheikh Ahmed', role: 'Former President', mentions: '5.5k', score: 48, trend: 'stable' },
  { rank: 20, name: 'Khadija Mohamed Diriye', role: 'Minister', mentions: '5.2k', score: 47, trend: 'up' },
  { rank: 21, name: 'Abshir Omar Huruse', role: 'Former FM', mentions: '4.8k', score: 45, trend: 'down' },
  { rank: 22, name: 'Yusuf Garaad', role: 'Diplomat', mentions: '4.5k', score: 44, trend: 'stable' },
  { rank: 23, name: 'Ali Jeyte', role: 'Hiiraan Admin', mentions: '4.2k', score: 42, trend: 'up' },
  { rank: 24, name: 'Mahad Salad', role: 'NISA Director', mentions: '4.0k', score: 41, trend: 'stable' },
  { rank: 25, name: 'Odowaa Yusuf', role: 'Former Army Chief', mentions: '3.8k', score: 40, trend: 'down' },
];

const POLITICAL_SIGNALS = [
  { source: 'Twitter', text: 'President Hassan Sheikh arrives in Dhusamareb for security talks...', time: '2m ago', type: 'breaking' },
  { source: 'Hiiraan Online', text: 'Parliamentary debate heats up over new electoral bill...', time: '5m ago', type: 'neutral' },
  { source: 'Facebook Live', text: 'PM Hamza addressing the cabinet on economic reform...', time: '12m ago', type: 'live' },
  { source: 'Caasimada', text: 'Puntland issues statement regarding federal constitution...', time: '18m ago', type: 'alert' },
  { source: 'Universal TV', text: 'Jubbaland forces announce new operation against AS...', time: '25m ago', type: 'breaking' },
  { source: 'Garowe Online', text: 'Opposition leaders meeting in Mogadishu concluded...', time: '32m ago', type: 'neutral' },
  { source: 'SNTV', text: 'Mogadishu Mayor launches new road project in Hamar Jajab...', time: '40m ago', type: 'positive' },
];

const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSignalIndex, setActiveSignalIndex] = useState(0);
  const [activePoliticalSignalIndex, setActivePoliticalSignalIndex] = useState(0);

  // Rotate live business signals
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSignalIndex((prev) => (prev + 1) % LIVE_SIGNALS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Rotate live political signals
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePoliticalSignalIndex((prev) => (prev + 1) % POLITICAL_SIGNALS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen font-sans text-npi-text overflow-x-hidden selection:bg-npi-gold selection:text-npi-dark">
      
      {/* --- HEADER --- */}
      <header className="fixed w-full top-0 z-50 bg-npi-dark/95 backdrop-blur-md border-b border-npi-gold/20">
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="font-serif text-3xl md:text-4xl text-npi-gold font-bold tracking-tighter">
              NPI
            </div>
            <div className="hidden md:block h-8 w-px bg-npi-gold/30"></div>
            <div className="hidden md:block text-xs text-gray-400 tracking-wide uppercase">
              National Public<br/>Insights
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#" className="hover:text-npi-gold transition-colors">Home</a>
            <a href="#about" className="hover:text-npi-gold transition-colors">About Us</a>
            <a href="#polls" className="hover:text-npi-gold transition-colors">Polls</a>
            <a href="#index" className="hover:text-npi-gold transition-colors">NPI Index</a>
            <a href="#business" className="hover:text-npi-gold transition-colors">Business</a>
            <a href="#politics" className="hover:text-npi-gold transition-colors">Politics</a>
            <a href="#reports" className="hover:text-npi-gold transition-colors">Reports</a>
            <button className="px-5 py-2 rounded-full border border-npi-gold/50 text-npi-gold hover:bg-npi-gold hover:text-npi-dark transition-all">
              Join Panel
            </button>
          </nav>

          <button className="md:hidden text-npi-gold" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-npi-dark border-b border-npi-gold/20 p-4 space-y-4">
            <a href="#" className="block py-2 hover:text-npi-gold">Home</a>
            <a href="#about" className="block py-2 hover:text-npi-gold">About Us</a>
            <a href="#polls" className="block py-2 hover:text-npi-gold">Polls</a>
            <a href="#index" className="block py-2 hover:text-npi-gold">NPI Index</a>
            <a href="#business" className="block py-2 hover:text-npi-gold">Business</a>
             <a href="#politics" className="block py-2 hover:text-npi-gold">Politics</a>
            <a href="#reports" className="block py-2 hover:text-npi-gold">Reports</a>
          </div>
        )}
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-npi-dark overflow-hidden flex flex-col items-center justify-center text-center px-4">
        {/* Abstract Map Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-npi-red fill-current transform scale-150 translate-y-20">
            <path d="M45,-75C58.3,-69.3,69.1,-58.3,76.5,-46.3C83.9,-34.3,87.9,-21.3,86.6,-8.7C85.3,3.9,78.7,16.1,70.6,27.3C62.5,38.5,52.9,48.7,42.1,56.7C31.3,64.7,19.3,70.5,6.5,72.6C-6.3,74.7,-19.9,73.1,-32.8,66.8C-45.7,60.5,-57.9,49.5,-66.9,36.5C-75.9,23.5,-81.7,8.5,-80.6,-6.1C-79.5,-20.7,-71.5,-34.9,-60.8,-45.5C-50.1,-56.1,-36.7,-63.1,-23.3,-68.7C-9.9,-74.3,3.5,-78.5,16.9,-78.9C30.3,-79.3,43.7,-75.9,45,-75Z" transform="translate(100 100)" />
          </svg>
        </div>
        
        {/* Chart Line Decorative */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-npi-gold/20 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-32 opacity-20 pointer-events-none">
          <svg viewBox="0 0 500 100" className="w-full h-full stroke-npi-gold fill-none stroke-2">
             <polyline points="0,100 50,80 100,90 150,60 200,70 250,40 300,50 350,20 400,30 450,10 500,0" />
             <circle cx="50" cy="80" r="3" className="fill-npi-gold" />
             <circle cx="150" cy="60" r="3" className="fill-npi-gold" />
             <circle cx="250" cy="40" r="3" className="fill-npi-gold" />
             <circle cx="350" cy="20" r="3" className="fill-npi-gold" />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6 animate-fade-in-up">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-npi-gold mb-2 tracking-tight">
            NPI <span className="font-sans font-light text-white opacity-90 mx-2 text-3xl md:text-5xl tracking-normal border-l border-white/20 pl-4">National Public Insights</span>
          </h1>
          <h2 className="text-2xl md:text-3xl text-white font-medium italic font-serif">
            Codka Shacabka Soomaaliyeed
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Xog dhab ah. Qiimeyn cad. Aragtida bulshada oo la arki karo.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <a href="#polls" className="w-full sm:w-auto px-8 py-4 bg-npi-red border border-npi-gold/30 rounded-lg text-white font-semibold hover:bg-npi-red/80 transition-all shadow-[0_0_20px_rgba(61,10,10,0.6)]">
              View Today’s Polls
            </a>
            <a href="#index" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-npi-gold text-npi-gold rounded-lg font-semibold hover:bg-npi-gold/10 transition-all">
              Explore the NPI Index
            </a>
          </div>
        </div>
      </section>

      {/* --- HIGHLIGHTS SECTION --- */}
      <section id="polls" className="py-20 bg-npi-dark relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-npi-gold font-bold tracking-widest uppercase text-sm mb-2">Today's Public Insight</h2>
              <h3 className="font-serif text-3xl md:text-4xl text-white">Daily Highlights</h3>
            </div>
            <div className="hidden md:flex gap-2 text-sm text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Live</span>
              <span>Updated: 2 hours ago</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HIGHLIGHT_POLLS.map(poll => (
              <PollCard key={poll.id} poll={poll} variant="highlight" />
            ))}
          </div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section id="about" className="py-20 bg-npi-red/10 border-y border-npi-gold/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">Waa maxay NPI Somalia?</h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              NPI waa platform Soomaaliyeed oo ku takhasustay xog ururin, codbixin siyaasadeed, iyo qiimeynta adeegyada dalka. Waxaan bulshada u soo bandhignaa xog cad oo la isku halleyn karo oo ku saabsan waxa ay shacabka Soomaaliyeed ka qabaan arrimaha dalka.
            </p>
            <button className="text-npi-gold hover:text-white flex items-center gap-2 mx-auto font-medium transition-colors">
              Read More About Us <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* --- VISUAL LAB (AI) --- */}
      <section className="container mx-auto px-4 md:px-6">
        <GeminiEditor />
      </section>

      {/* --- NPI INDEX SECTION --- */}
      <section id="index" className="py-20 bg-npi-dark">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-npi-gold font-serif text-3xl md:text-4xl mb-2">NPI National Index</h2>
              <p className="text-gray-400">Xaaladda adeegyada iyo kalsoonida shacabka – bishan.</p>
            </div>
            <button className="mt-4 md:mt-0 px-6 py-2 border border-white/20 rounded hover:bg-white/5 transition-colors text-sm">
              Open Full Index
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INDEX_DATA.map((item, idx) => (
              <div key={idx} className="bg-npi-dark/40 border border-white/5 p-6 rounded-lg hover:border-npi-gold/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium text-lg text-gray-200">{item.title}</h4>
                  <span className={`text-2xl font-serif font-bold ${item.value >= 40 ? 'text-green-500' : item.value >= 30 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {item.value}
                  </span>
                </div>
                <div className="h-24 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={item.history.map((val, i) => ({ idx: i, val }))}>
                      <Line type="monotone" dataKey="val" stroke="#D4AF37" strokeWidth={2} dot={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a0505', border: '1px solid #333' }}
                        itemStyle={{ color: '#D4AF37' }}
                        labelStyle={{ display: 'none' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BUSINESS INSIGHTS SECTION --- */}
      <section id="business" className="py-20 bg-gradient-to-b from-npi-dark to-npi-red/10 border-t border-npi-gold/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-npi-gold font-bold tracking-widest uppercase text-sm mb-2 flex items-center gap-2">
                <Briefcase size={16} /> Business Insights
              </h2>
              <h3 className="font-serif text-3xl md:text-4xl text-white">Somalia Business Pulse</h3>
              <p className="text-gray-400 mt-2 max-w-xl">
                Real-time tracking of market sentiment, influential businesses, and economic indicators based on social media and news data.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-green-400 bg-green-900/20 px-3 py-1 rounded border border-green-500/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              LIVE DATA FEED ACTIVE
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Live Feed Column */}
            <div className="lg:col-span-1 bg-black/40 border border-npi-gold/20 rounded-lg p-0 overflow-hidden flex flex-col h-[500px]">
              <div className="bg-npi-gold/10 p-3 border-b border-npi-gold/20 flex justify-between items-center">
                <span className="text-xs font-mono text-npi-gold flex items-center gap-2">
                  <Activity size={14} /> LIVE SIGNALS (24h)
                </span>
                <span className="text-[10px] text-gray-500">SOURCE: SOCIAL & WEB</span>
              </div>
              
              <div className="flex-1 overflow-hidden relative p-4 space-y-4">
                {/* Scanline effect */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>
                
                {LIVE_SIGNALS.map((signal, idx) => (
                  <div 
                    key={idx}
                    className={`transform transition-all duration-500 border-l-2 p-3 bg-white/5 rounded-r
                      ${idx === activeSignalIndex ? 'opacity-100 scale-105 border-npi-gold bg-white/10' : 'opacity-60 border-transparent'}
                    `}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded
                        ${signal.source === 'Facebook' ? 'bg-blue-600' : 
                          signal.source === 'Twitter' ? 'bg-sky-500' : 
                          signal.source === 'TikTok' ? 'bg-pink-600' : 'bg-gray-600'} text-white`}>
                        {signal.source}
                      </span>
                      <span className="text-[10px] text-gray-400">{signal.time}</span>
                    </div>
                    <p className="text-sm text-gray-200 line-clamp-2">{signal.text}</p>
                    <div className={`mt-2 h-0.5 w-full rounded-full ${
                      signal.type === 'positive' ? 'bg-green-500' : 
                      signal.type === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                    }`}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 100 Leaderboard */}
            <div className="lg:col-span-2 bg-npi-dark/60 border border-white/10 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-serif text-xl text-white flex items-center gap-2">
                  <Building2 className="text-npi-gold" /> Top Influential Businesses
                </h4>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-xs bg-npi-gold text-npi-dark font-bold rounded">Top 100</button>
                  <button className="px-3 py-1 text-xs bg-white/5 text-gray-400 hover:text-white transition-colors rounded">Rising</button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-400 uppercase bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-4 py-3">Rank</th>
                      <th className="px-4 py-3">Company</th>
                      <th className="px-4 py-3">Industry</th>
                      <th className="px-4 py-3 text-right">Mentions (24h)</th>
                      <th className="px-4 py-3 text-right">Impact Score</th>
                      <th className="px-4 py-3 text-center">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {TOP_COMPANIES.map((company) => (
                      <tr key={company.rank} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 font-mono text-npi-gold">#{company.rank}</td>
                        <td className="px-4 py-3 font-medium text-white">{company.name}</td>
                        <td className="px-4 py-3 text-gray-400">{company.industry}</td>
                        <td className="px-4 py-3 text-right text-gray-300">{company.mentions}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-block w-16 bg-gray-700 rounded-full h-1.5 overflow-hidden align-middle mr-2">
                            <div className="bg-npi-gold h-full" style={{ width: `${company.score}%` }}></div>
                          </div>
                          <span className="font-bold text-white">{company.score}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {company.trend === 'up' ? <ArrowUpRight size={16} className="text-green-500 inline" /> :
                           company.trend === 'down' ? <ArrowDownRight size={16} className="text-red-500 inline" /> :
                           <Minus size={16} className="text-gray-500 inline" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-center">
                 <button className="text-xs text-npi-gold hover:underline">View All 100 Companies</button>
              </div>
            </div>
          </div>
          
          {/* Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-npi-dark p-6 rounded-lg border border-green-900/30 flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs uppercase">Business Confidence</p>
                <p className="text-2xl font-bold text-white mt-1">68.4 <span className="text-sm font-normal text-green-500 ml-2">+2.1%</span></p>
              </div>
              <div className="p-3 bg-green-900/20 rounded-full text-green-500"><TrendingUp size={24} /></div>
            </div>
            <div className="bg-npi-dark p-6 rounded-lg border border-blue-900/30 flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs uppercase">Investment Interest</p>
                <p className="text-2xl font-bold text-white mt-1">High <span className="text-sm font-normal text-gray-500 ml-2">Steady</span></p>
              </div>
              <div className="p-3 bg-blue-900/20 rounded-full text-blue-500"><Globe size={24} /></div>
            </div>
            <div className="bg-npi-dark p-6 rounded-lg border border-yellow-900/30 flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs uppercase">Energy Sector</p>
                <p className="text-2xl font-bold text-white mt-1">Expanding <span className="text-sm font-normal text-green-500 ml-2">Rapidly</span></p>
              </div>
              <div className="p-3 bg-yellow-900/20 rounded-full text-yellow-500"><Zap size={24} /></div>
            </div>
          </div>
        </div>
      </section>

       {/* --- POLITICS SECTION (NEW) --- */}
       <section id="politics" className="py-20 bg-npi-dark relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-npi-gold/10 via-npi-gold/40 to-npi-gold/10"></div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-npi-gold font-bold tracking-widest uppercase text-sm mb-2 flex items-center gap-2">
                <Landmark size={16} /> NPI Political Pulse
              </h2>
              <h3 className="font-serif text-3xl md:text-4xl text-white">Top Influential Politicians</h3>
              <p className="text-gray-400 mt-2 max-w-xl">
                Tracking political influence and public sentiment in real-time across Somalia's digital landscape over the last 24 hours.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-red-400 bg-red-900/20 px-3 py-1 rounded border border-red-500/30">
              <Radio size={12} className="animate-pulse" />
              LIVE MONITORING
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Top 25 Leaderboard (Takes up 8 columns) */}
            <div className="lg:col-span-8 bg-npi-dark/60 border border-white/10 rounded-lg flex flex-col h-[600px]">
              <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                <h4 className="font-serif text-lg text-white flex items-center gap-2">
                  <Mic size={18} className="text-npi-gold" /> 24h Influence Ranking
                </h4>
                <div className="text-xs text-gray-400">Updated: Just now</div>
              </div>
              
              <div className="overflow-y-auto flex-1 custom-scrollbar">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-400 uppercase bg-black/20 sticky top-0 backdrop-blur-sm z-10">
                    <tr>
                      <th className="px-6 py-3">Rank</th>
                      <th className="px-6 py-3">Politician</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3 text-right">Mentions</th>
                      <th className="px-6 py-3 text-right">Score</th>
                      <th className="px-6 py-3 text-center">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {TOP_POLITICIANS.map((politician) => (
                      <tr key={politician.rank} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-3 font-mono text-npi-gold font-bold group-hover:scale-110 transition-transform origin-left">
                          #{politician.rank}
                        </td>
                        <td className="px-6 py-3 font-medium text-white">{politician.name}</td>
                        <td className="px-6 py-3 text-gray-400 text-xs">{politician.role}</td>
                        <td className="px-6 py-3 text-right text-gray-300 font-mono">{politician.mentions}</td>
                        <td className="px-6 py-3 text-right">
                          <span className={`font-bold ${
                            politician.score > 90 ? 'text-green-400' : 
                            politician.score > 70 ? 'text-blue-400' : 
                            politician.score > 50 ? 'text-yellow-400' : 'text-gray-400'
                          }`}>{politician.score}</span>
                        </td>
                        <td className="px-6 py-3 text-center">
                          {politician.trend === 'up' ? <ArrowUpRight size={16} className="text-green-500 inline" /> :
                           politician.trend === 'down' ? <ArrowDownRight size={16} className="text-red-500 inline" /> :
                           <Minus size={16} className="text-gray-500 inline" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Live Political Wire (Takes up 4 columns) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-[#0a0a0a] border border-npi-gold/30 rounded-lg p-0 overflow-hidden flex flex-col h-[400px] shadow-lg shadow-npi-gold/5">
                <div className="bg-red-900/20 p-3 border-b border-npi-gold/20 flex justify-between items-center">
                  <span className="text-xs font-mono text-npi-gold flex items-center gap-2">
                    <Newspaper size={14} /> POLITICAL WIRE
                  </span>
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                </div>
                
                <div className="flex-1 overflow-hidden relative p-4 space-y-4">
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_2px,#000_3px)] bg-[length:100%_4px] pointer-events-none opacity-30"></div>
                  
                  {POLITICAL_SIGNALS.map((signal, idx) => (
                    <div 
                      key={idx}
                      className={`transition-all duration-700 p-3 rounded border-l-2
                        ${idx === activePoliticalSignalIndex ? 'bg-white/10 border-npi-gold translate-x-0 opacity-100' : 'bg-transparent border-gray-800 translate-x-2 opacity-50'}
                      `}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[9px] uppercase font-bold px-1.5 rounded
                           ${signal.type === 'breaking' ? 'bg-red-600 animate-pulse' : 
                             signal.type === 'live' ? 'bg-green-600' : 
                             signal.type === 'alert' ? 'bg-orange-500' : 'bg-gray-700'} text-white`}>
                          {signal.type}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">{signal.time}</span>
                      </div>
                      <div className="text-xs text-npi-gold/70 mb-1">{signal.source}</div>
                      <p className="text-sm text-gray-200 leading-snug">{signal.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stat Card */}
              <div className="bg-npi-dark border border-white/10 rounded-lg p-5">
                <h5 className="text-gray-400 text-xs uppercase mb-3">Topic Sentiment Analysis</h5>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white">Elections</span>
                      <span className="text-red-400">Heated</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                      <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white">Security</span>
                      <span className="text-yellow-400">Concerned</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                      <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white">Economy</span>
                      <span className="text-blue-400">Optimistic</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
       </section>

      {/* --- CATEGORIES GRID --- */}
      <section className="py-20 bg-npi-dark border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-center font-serif text-3xl text-white mb-12">Explore by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat, idx) => (
              <button key={idx} className="group p-6 bg-white/5 border border-white/5 hover:bg-npi-gold hover:border-npi-gold rounded-lg transition-all duration-300 flex flex-col items-center gap-3 text-center">
                <div className="text-npi-gold group-hover:text-npi-dark transition-colors">
                  {cat.icon}
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-npi-dark">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- STATE INSIGHTS --- */}
      <section className="py-20 bg-black/40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-2">NPI State Insights</h2>
            <p className="text-gray-400">Aragtida shacabka gobollada Soomaaliya.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {STATES.map((state, idx) => (
              <div key={idx} className="relative group overflow-hidden rounded-lg aspect-video bg-npi-red/20 border border-white/10 hover:border-npi-gold/50 transition-all cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                  <span className="text-white font-serif text-lg group-hover:text-npi-gold transition-colors">{state}</span>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="text-npi-gold" size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- YOUTH & WOMEN HUB --- */}
      <section className="py-20 bg-npi-dark">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-900/20 to-npi-dark border border-blue-500/20 rounded-xl p-8 hover:border-blue-500/40 transition-all">
              <h3 className="font-serif text-2xl text-blue-100 mb-2">NPI Youth Platform</h3>
              <p className="text-gray-400 mb-6">Sahan ku saabsan: shaqo la’aanta, waxbarashada, mustaqbalka.</p>
              <button className="text-blue-400 hover:text-blue-300 flex items-center gap-2 font-medium">
                Explore Youth Insight <ArrowUpRight size={16} />
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/20 to-npi-dark border border-purple-500/20 rounded-xl p-8 hover:border-purple-500/40 transition-all">
              <h3 className="font-serif text-2xl text-purple-100 mb-2">NPI Women Insight</h3>
              <p className="text-gray-400 mb-6">Sahan ku saabsan: amniga, caafimaadka, adeegsiga adeegyada bulshada.</p>
              <button className="text-purple-400 hover:text-purple-300 flex items-center gap-2 font-medium">
                Explore Women Insight <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- REPORTS --- */}
      <section id="reports" className="py-20 bg-npi-dark/50 border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl text-white">Latest Reports</h2>
            <button className="text-npi-gold hover:underline text-sm">View Archive</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Weekly NPI Report', 'Monthly Index Report', 'Special Topic: Healthcare'].map((title, i) => (
              <div key={i} className="group bg-white/5 rounded-lg overflow-hidden border border-white/5 hover:border-npi-gold/30 transition-all">
                <div className="h-40 bg-gray-800 flex items-center justify-center text-gray-600 group-hover:bg-gray-700 transition-colors">
                  <FileText size={40} />
                </div>
                <div className="p-6">
                  <h4 className="text-white font-medium mb-2 group-hover:text-npi-gold transition-colors">{title}</h4>
                  <button className="text-xs text-gray-400 hover:text-white flex items-center gap-1 mt-2">
                    Download PDF <ArrowDownRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-24 bg-npi-red relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">Ku biir Panel-ka NPI Somalia</h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10">
            Ku dar codkaaga. Qaado sahanno fudud oo aan eex lahayn oo ka qayb noqo dadka wax beddela.
          </p>
          <button className="bg-npi-gold text-npi-dark font-bold text-lg px-10 py-4 rounded-full hover:bg-white hover:text-npi-red transition-all shadow-xl">
            Join Now
          </button>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-black text-gray-400 py-16 border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="font-serif text-2xl text-npi-gold font-bold mb-6">NPI Somalia</div>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Methodology</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Poll Categories</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Approve/Disapprove</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Trust/Distrust</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support/Oppose</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Agree/Disagree</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Reports Archive</a></li>
                <li><a href="#" className="hover:text-white transition-colors">NPI Index</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Media</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-npi-gold hover:text-black transition-all">
                  <span className="sr-only">Facebook</span> F
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-npi-gold hover:text-black transition-all">
                  <span className="sr-only">Telegram</span> T
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-npi-gold hover:text-black transition-all">
                  <span className="sr-only">YouTube</span> Y
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-600">
            © 2025 NPI Somalia – All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;