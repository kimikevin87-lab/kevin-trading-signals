import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Target, 
  History, 
  Settings, 
  ShieldCheck, 
  Zap, 
  Clock, 
  TrendingUp,
  AlertCircle,
  FileSearch,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Upload,
  BarChart3,
  Mail,
  ZapOff
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { STRATEGY_GATES, MOCK_SIGNALS } from './lib/strategy';
import { Signal, Pair, Direction } from './types';

// Components
const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
      active 
        ? 'bg-blue-600/20 text-blue-400 border-l-4 border-blue-500' 
        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const MarketCard = ({ pair, price, change, status }: any) => (
  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl backdrop-blur-sm relative group overflow-hidden">
    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="flex justify-between items-center mb-2">
      <span className="text-slate-400 text-sm font-medium">{pair}</span>
      <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-black ${status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
        {status}
      </span>
    </div>
    <div className="text-2xl font-bold text-white mb-1 font-mono tracking-tight">{price}</div>
    <div className={`text-xs font-bold ${change >= 0 ? 'text-green-400' : 'text-red-400'} flex items-center`}>
      {change >= 0 ? <TrendingUp size={12} className="mr-1" /> : <TrendingUp size={12} className="mr-1 rotate-180" />}
      {change >= 0 ? '+' : ''}{change}%
    </div>
  </div>
);

const SignalView = ({ signal }: { signal: Signal }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-[#0f1218] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative"
  >
    <div className={`absolute top-0 left-0 w-full h-1.5 ${signal.direction === 'BUY' ? 'bg-green-500' : 'bg-red-500'}`} />
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-3xl font-black text-white tracking-tighter">{signal.pair}</span>
            <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest ${signal.direction === 'BUY' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
              {signal.direction}
            </span>
            <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded-md">{signal.timeframe}</span>
          </div>
          <div className="flex items-center text-slate-500 text-sm font-medium">
            <Clock size={14} className="mr-1.5" />
            <span>{signal.timestamp} EAT</span>
            <span className="mx-2">•</span>
            <span className="text-blue-500 font-bold flex items-center">
              <CheckCircle2 size={14} className="mr-1" /> ALL GATES PASSED
            </span>
          </div>
        </div>
        
        <div className="bg-slate-800/30 border border-slate-700/50 p-4 rounded-xl flex items-center space-x-4">
          <div className="text-right">
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Ensemble Total</div>
            <div className={`text-3xl font-black leading-none ${signal.ensemble.ensembleScore >= 3 ? 'text-green-400' : 'text-red-400'}`}>
              {signal.ensemble.ensembleScore > 0 ? '+' : ''}{signal.ensemble.ensembleScore.toFixed(2)}
            </div>
          </div>
          <div className="w-px h-10 bg-slate-700/50" />
          <div className="text-center">
             <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Agreement</div>
             <div className="text-xl font-bold text-white">{signal.ensemble.agreement}/3</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-[#161b22] p-4 rounded-xl border border-slate-800/50 shadow-inner group">
          <div className="text-[10px] text-slate-500 font-black uppercase mb-2">Entry Price</div>
          <div className="text-xl font-mono font-bold text-white group-hover:text-blue-400 transition-colors">{signal.price.toFixed(5)}</div>
        </div>
        <div className="bg-[#161b22] p-4 rounded-xl border border-slate-800/50 shadow-inner group">
          <div className="text-[10px] text-slate-500 font-black uppercase mb-2">Stop Loss</div>
          <div className="text-xl font-mono font-bold text-red-400 group-hover:text-red-300 transition-colors">{signal.stopLoss.toFixed(5)}</div>
        </div>
        <div className="bg-[#161b22] p-4 rounded-xl border border-slate-800/50 shadow-inner group">
          <div className="text-[10px] text-slate-500 font-black uppercase mb-2">Take Profit</div>
          <div className="text-xl font-mono font-bold text-green-400 group-hover:text-green-300 transition-colors">{signal.takeProfit.toFixed(5)}</div>
        </div>
        <div className="bg-[#161b22] p-4 rounded-xl border border-slate-800/50 shadow-inner group">
          <div className="text-[10px] text-slate-500 font-black uppercase mb-2">Lot Size ($1k)</div>
          <div className="text-xl font-mono font-bold text-blue-400 group-hover:text-blue-300 transition-colors">{signal.lotSize} lots</div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-400 flex items-center uppercase tracking-[0.2em]">
            <ShieldCheck size={16} className="mr-2 text-blue-500" /> System Verification Check
          </h3>
          <span className="h-px flex-1 mx-4 bg-slate-800" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {STRATEGY_GATES.map((gate) => (
            <div key={gate.id} className="flex items-start space-x-3 bg-slate-800/20 p-3 rounded-lg border border-slate-800/50 hover:border-slate-700 transition-colors">
              <CheckCircle2 size={14} className="text-green-500 mt-1 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-[11px] font-black text-slate-200 uppercase truncate mb-0.5">{gate.name}</div>
                <div className="text-[10px] text-slate-500 leading-tight">{gate.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex space-x-8">
              <div className="text-center">
                <div className="text-[10px] text-slate-600 font-black uppercase mb-2">Executioner</div>
                <div className="text-lg font-bold text-slate-300">+{signal.ensemble.traderA.score}</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-slate-600 font-black uppercase mb-2">Strategist</div>
                <div className="text-lg font-bold text-slate-300">+{signal.ensemble.traderB.score}</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-slate-600 font-black uppercase mb-2">Institutional</div>
                <div className="text-lg font-bold text-slate-300">+{signal.ensemble.traderC.score}</div>
              </div>
           </div>
           
           <div className="flex items-center space-x-2 text-slate-500 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50">
             <Mail size={14} />
             <span className="text-[10px] font-bold uppercase tracking-wider">Dispatched to omonikevin469@gmail.com</span>
           </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const AnalysisPortal = ({ onSignalGenerated }: { onSignalGenerated: () => void }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [steps, setSteps] = useState<string[]>([]);
  const [activeSignal, setActiveSignal] = useState<Signal | null>(null);

  const analysisFlow = [
    'Scanning EURUSD, XAUUSD, USDJPY price action...',
    'Detecting liquidity sweeps on M15/H1 timeframes...',
    'Executioner (Trader A) scoring FORT checklist...',
    'Strategist (Trader B) checking Daily/4H/1H alignment...',
    'Institutional Tracker (Trader C) mapping OB & FVG zones...',
    'Calculating Ensemble Score...',
    'Verifying 7-Gate safety protocol...',
    'Generating final signal & risk parameters...'
  ];

  const startAnalysis = async () => {
    setAnalyzing(true);
    setActiveSignal(null);
    setSteps([]);
    
    for (const step of analysisFlow) {
      setSteps(prev => [...prev, step]);
      await new Promise(r => setTimeout(r, 600));
    }

    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Finalizing trade execution plan...',
        success: () => {
          setAnalyzing(false);
          setActiveSignal(MOCK_SIGNALS[0]);
          onSignalGenerated();
          return 'Signal Approved: BANK OF KEVIN strategy conditions met.';
        },
        error: 'Market conditions do not meet 7-Gate criteria.',
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0f1218] border border-slate-800 rounded-3xl p-10 text-center relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />
        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20 text-blue-500">
            <Zap size={32} />
          </div>
          <h2 className="text-3xl font-black text-white mb-3 tracking-tighter uppercase italic">Bank of Kevin AI Analyst</h2>
          <p className="text-slate-400 mb-10 max-w-lg mx-auto leading-relaxed">
            The core engine that powers the Bank of Kevin strategy. Applying 3-Trader ensemble voting and 7-Gate confirmation to secure maximum consistency.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <button 
              disabled={analyzing}
              className="w-full md:w-auto flex items-center justify-center space-x-3 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-2xl transition-all border border-slate-700 font-bold group/btn"
            >
              <Upload size={20} className="group-hover/btn:scale-110 transition-transform" />
              <span>Vision Upload</span>
            </button>
            <button 
              onClick={startAnalysis}
              disabled={analyzing}
              className="w-full md:w-auto flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl transition-all font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 disabled:opacity-50 relative overflow-hidden group/scan"
            >
              <BarChart3 size={20} className={`${analyzing ? 'animate-pulse' : 'group-hover/scan:scale-110 transition-transform'}`} />
              <span>{analyzing ? 'Scanning...' : 'Manual Analysis'}</span>
              {analyzing && <motion.div layoutId="progress" className="absolute bottom-0 left-0 h-1 bg-white/50" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 5 }} />}
            </button>
          </div>
        </div>

        {analyzing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 text-left bg-black/40 p-6 rounded-2xl border border-slate-800 font-mono text-xs space-y-2"
          >
            {steps.map((step, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center text-blue-400"
              >
                <ChevronRight size={12} className="mr-2 text-blue-600" />
                <span className="text-slate-300">{step}</span>
                <span className="ml-auto text-blue-500 font-bold italic">SUCCESS</span>
              </motion.div>
            ))}
            <div className="animate-pulse text-white flex items-center mt-4">
              <span className="w-1 h-3 bg-blue-500 mr-2" />
              Processing market data...
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {activeSignal && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <SignalView signal={activeSignal} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MantraSection = () => (
  <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-500/20 rounded-3xl p-8 relative overflow-hidden group h-full flex flex-col">
    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
      <ShieldCheck size={200} />
    </div>
    
    <div className="relative z-10 flex-1">
      <h3 className="text-blue-400 font-black uppercase tracking-[0.3em] text-xs mb-8 flex items-center">
        <Zap size={16} className="mr-2 fill-blue-500" /> Trading Mantra
      </h3>
      
      <div className="space-y-6 font-serif italic text-slate-300 text-xl leading-relaxed">
        <p className="border-l-2 border-blue-500/30 pl-4 hover:border-blue-500 transition-colors">"I don't need excitement. I need consistency."</p>
        <p className="border-l-2 border-blue-500/30 pl-4 hover:border-blue-500 transition-colors">"I don't chase setups. I wait for the sweep."</p>
        <p className="border-l-2 border-blue-500/30 pl-4 hover:border-blue-500 transition-colors">"I don't hope. I follow my rules."</p>
        <p className="border-l-2 border-blue-500/30 pl-4 hover:border-blue-500 transition-colors">"I trade only NY Overlap. Maximum focus."</p>
        <p className="border-l-2 border-blue-500/30 pl-4 hover:border-blue-500 transition-colors">"The system works. Now I let it run."</p>
      </div>
    </div>

    <div className="mt-12 pt-8 border-t border-blue-500/10 flex items-center justify-between relative z-10">
      <span className="text-[10px] text-blue-500 font-black tracking-[0.4em] uppercase">One kept promise at a time.</span>
      <div className="flex space-x-1">
        {[1,2,3].map(i => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
        ))}
      </div>
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isNySession, setIsNySession] = useState(false);
  const [signalCount, setSignalCount] = useState(0);

  useEffect(() => {
    const checkSession = () => {
      const eatTime = new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' });
      const hours = new Date(eatTime).getHours();
      setIsNySession(hours >= 16 && hours < 20);
    };
    checkSession();
    const interval = setInterval(checkSession, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#06080a] text-slate-200 selection:bg-blue-600/30 font-sans antialiased">
      <Toaster position="top-right" theme="dark" richColors closeButton />
      
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-[#0a0c10] border-r border-slate-800/60 hidden lg:flex flex-col p-8 z-30">
        <div className="mb-14 flex items-center space-x-4 px-2">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-2xl shadow-blue-600/30 transform -rotate-3">
            K
          </div>
          <div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic block leading-none">Bank of Kevin</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Institutional Edge</span>
          </div>
        </div>

        <nav className="flex-1 space-y-3">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Operations Center" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarItem 
            icon={Target} 
            label="Signal Repository" 
            active={activeTab === 'signals'} 
            onClick={() => setActiveTab('signals')} 
          />
          <SidebarItem 
            icon={History} 
            label="Performance Log" 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
          />
          <SidebarItem 
            icon={Settings} 
            label="System Config" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
        </nav>

        <div className="mt-auto space-y-4">
          <div className="bg-[#11141b] rounded-2xl p-5 border border-slate-800/50">
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3">Today's Risk Profile</div>
            <div className="flex justify-between items-end mb-2">
               <span className="text-xs font-bold text-slate-400">Trades Executed</span>
               <span className="text-sm font-black text-white">{signalCount}/2</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${(signalCount / 2) * 100}%` }}
                 className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
               />
            </div>
          </div>
          
          <div className="bg-blue-600/10 rounded-2xl p-5 border border-blue-600/20">
            <div className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-1">Account Liquidity</div>
            <div className="text-2xl font-black text-white tracking-tighter">$1,000.00</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen relative">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        {/* Top Header */}
        <header className="sticky top-0 bg-[#06080a]/80 backdrop-blur-2xl border-b border-slate-800/50 px-6 lg:px-12 py-5 flex items-center justify-between z-20">
          <div className="flex items-center space-x-6">
            <h1 className="text-lg font-black text-white uppercase tracking-wider">{activeTab}</h1>
            <div className={`flex items-center space-x-2.5 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border transition-colors ${isNySession ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
              <div className={`w-2 h-2 rounded-full ${isNySession ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`} />
              <span>{isNySession ? 'NY OVERLAP LIVE' : 'OUTSIDE TRADING HOURS'}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-5">
            <div className="hidden sm:flex items-center space-x-3 text-[10px] font-black tracking-widest text-slate-400 bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800/50">
              <span className="text-blue-500">DXY: 104.23</span>
              <span className="text-slate-700">|</span>
              <span className="text-green-500">10Y: 4.12%</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white transition-colors cursor-pointer">
              <AlertCircle size={20} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 lg:p-12 max-w-7xl mx-auto space-y-12 relative z-10">
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MarketCard pair="EURUSD" price="1.08452" change={0.12} status="Active" />
                <MarketCard pair="XAUUSD" price="2345.50" change={-0.45} status="Active" />
                <MarketCard pair="USDJPY" price="151.84" change={0.08} status="Active" />
              </div>

              {/* Main Analysis Area */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 items-stretch">
                <div className="xl:col-span-2">
                  <AnalysisPortal onSignalGenerated={() => setSignalCount(prev => Math.min(2, prev + 1))} />
                </div>
                <div className="h-full">
                  <MantraSection />
                </div>
              </div>

              {/* Guidelines Section */}
              <div className="bg-[#0f1218]/50 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center">
                    <ShieldCheck size={18} className="mr-3 text-blue-500" /> Operational Directives
                  </h3>
                  <div className="text-[10px] font-black text-slate-600 bg-slate-800/30 px-3 py-1 rounded-lg">FIRM CONSTRAINTS</div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { label: 'Max Exposure', value: '2 Trades Daily', icon: Target, desc: 'Strict no-revenge policy' },
                    { label: 'Risk Protocol', value: '2.0% Per Setup', icon: ShieldCheck, desc: 'Fixed lot calculation' },
                    { label: 'Drawdown Limit', value: '5.0% Daily', icon: TrendingUp, desc: 'Auto-kill session trigger' },
                    { label: 'NY Windows', value: '4:00-8:00 PM', icon: Clock, desc: 'EAT Timezone only' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-5 group">
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-blue-500 group-hover:scale-110 transition-transform">
                        <item.icon size={22} />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">{item.label}</div>
                        <div className="text-base font-black text-white mb-0.5">{item.value}</div>
                        <div className="text-[10px] text-slate-600 font-bold">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'signals' && (
             <div className="space-y-8">
               <div className="flex items-center justify-between">
                 <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Signal Repository</h2>
                 <div className="flex space-x-2">
                    <button className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg text-xs font-bold text-slate-400">All Pairs</button>
                    <button className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg text-xs font-bold text-slate-400">Past 24h</button>
                 </div>
               </div>
               <div className="grid grid-cols-1 gap-8">
                 {MOCK_SIGNALS.map(signal => (
                   <SignalView key={signal.id} signal={signal} />
                 ))}
                 {signalCount === 0 && (
                   <div className="bg-slate-900/30 border border-slate-800 border-dashed rounded-3xl p-20 text-center">
                      <ZapOff className="mx-auto mb-4 text-slate-700" size={48} />
                      <p className="text-slate-500 font-bold uppercase tracking-widest">No active signals detected in this session</p>
                   </div>
                 )}
               </div>
             </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-[#0f1218] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-blue-600/10 p-8 border-b border-slate-800">
                  <h2 className="text-2xl font-black text-white tracking-tight uppercase italic mb-2">System Configuration</h2>
                  <p className="text-slate-400 text-sm">Fine-tune the Bank of Kevin core algorithm and notification routing.</p>
                </div>
                
                <div className="p-10 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Notification Node</label>
                      <div className="bg-black/40 border border-slate-800 p-5 rounded-2xl flex items-center justify-between group hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center space-x-4">
                           <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500">
                             <Mail size={20} />
                           </div>
                           <div>
                             <div className="text-sm font-black text-white">omonikevin469@gmail.com</div>
                             <div className="text-[10px] text-slate-500 font-bold uppercase">Primary Signal Recipient</div>
                           </div>
                        </div>
                        <button className="text-[10px] font-black text-blue-500 uppercase">Change</button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Risk Parameters</label>
                      <div className="bg-black/40 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                           <div className="w-10 h-10 bg-green-600/10 rounded-xl flex items-center justify-center text-green-500">
                             <Target size={20} />
                           </div>
                           <div>
                             <div className="text-sm font-black text-white">$1,000.00 USD</div>
                             <div className="text-[10px] text-slate-500 font-bold uppercase">Equity Base for Lots</div>
                           </div>
                        </div>
                        <button className="text-[10px] font-black text-green-500 uppercase">Edit</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6 pt-10 border-t border-slate-800">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Active Market Spectrum</h3>
                    <div className="flex flex-wrap gap-3">
                      {['EURUSD', 'XAUUSD', 'USDJPY'].map(p => (
                        <div key={p} className="flex items-center space-x-3 bg-slate-800/50 px-5 py-3 rounded-xl border border-slate-800 hover:border-blue-500/30 transition-colors">
                           <div className="w-2 h-2 rounded-full bg-blue-500" />
                           <span className="text-xs font-black text-slate-200 tracking-wider">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6 pt-10 border-t border-slate-800">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Operational Cycle</h3>
                    <div className="flex flex-wrap gap-3">
                      {['Monday', 'Tuesday', 'Thursday', 'Friday'].map(d => (
                        <div key={d} className="flex items-center space-x-3 bg-green-600/10 px-5 py-3 rounded-xl border border-green-500/20">
                           <CheckCircle2 size={14} className="text-green-500" />
                           <span className="text-xs font-black text-green-400 tracking-wider uppercase">{d}</span>
                        </div>
                      ))}
                      <div className="flex items-center space-x-3 bg-red-600/10 px-5 py-3 rounded-xl border border-red-500/20 opacity-60">
                         <XCircle size={14} className="text-red-500" />
                         <span className="text-xs font-black text-red-400 tracking-wider uppercase">Wednesday (FOMC)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Footer Nav */}
      <div className="fixed bottom-0 left-0 w-full bg-[#0a0c10]/95 backdrop-blur-xl border-t border-slate-800 p-5 flex justify-around lg:hidden z-30">
        <button onClick={() => setActiveTab('dashboard')} className={`p-2 transition-colors ${activeTab === 'dashboard' ? 'text-blue-500' : 'text-slate-600'}`}>
          <LayoutDashboard size={24} />
        </button>
        <button onClick={() => setActiveTab('signals')} className={`p-2 transition-colors ${activeTab === 'signals' ? 'text-blue-500' : 'text-slate-600'}`}>
          <Target size={24} />
        </button>
        <button onClick={() => setActiveTab('history')} className={`p-2 transition-colors ${activeTab === 'history' ? 'text-blue-500' : 'text-slate-600'}`}>
          <History size={24} />
        </button>
        <button onClick={() => setActiveTab('settings')} className={`p-2 transition-colors ${activeTab === 'settings' ? 'text-blue-500' : 'text-slate-600'}`}>
          <Settings size={24} />
        </button>
      </div>
    </div>
  );
}