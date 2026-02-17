
import React, { useState, useEffect } from 'react';
import { AppTheme } from './types';
import { THEME_PRESETS } from './constants';
import DashboardPreview from './components/DashboardPreview';
import { generateThemeFromAI } from './services/geminiService';

interface ThemeCardProps {
  theme: AppTheme;
  isActive: boolean;
  onClick: () => void;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ theme, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`group relative flex flex-col w-full p-2.5 rounded-xl border transition-all duration-300 text-left ${
      isActive 
        ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg bg-black/30 border border-white/5">
        {theme.icon}
      </div>
      <div className="flex flex-col min-w-0">
        <span className={`text-xs font-bold truncate ${isActive ? 'text-blue-400' : 'text-slate-300'}`}>
          {theme.name}
        </span>
        <div className="flex gap-1 mt-1">
          <div className="w-3 h-1 rounded-full" style={{ backgroundColor: theme.colors.bgMain }} />
          <div className="w-3 h-1 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
          <div className="w-3 h-1 rounded-full" style={{ backgroundColor: theme.colors.termFg }} />
        </div>
      </div>
    </div>
    {isActive && <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />}
  </button>
);

const App: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<AppTheme>(THEME_PRESETS[0]);
  const [history, setHistory] = useState<AppTheme[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!userInput.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const generated = await generateThemeFromAI(userInput);
      const newTheme: AppTheme = {
        id: `gen-${Date.now()}`,
        name: generated.name || `Skin: ${userInput.slice(0, 15)}...`,
        icon: generated.icon || '✨',
        colors: { ...currentTheme.colors, ...generated.colors } as AppTheme['colors'],
      };
      setCurrentTheme(newTheme);
      setHistory(prev => [newTheme, ...prev].slice(0, 10));
      setUserInput('');
    } catch (err) {
      console.error(err);
      setError('Generation failed. Check API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToKosmos = () => {
    const cssVars = Object.entries(currentTheme.colors)
      .map(([key, value]) => {
        // Convert camelCase to css-variable-format
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `    --${cssKey}: ${value};`;
      })
      .join('\n');

    const cssBlock = `/* ${currentTheme.name} Theme */\n[data-theme="${currentTheme.id}"] {\n${cssVars}\n}`;
    const jsBlock = `{ id: '${currentTheme.id}', name: '${currentTheme.icon} ${currentTheme.name}', icon: '${currentTheme.icon}' }`;

    const fullCode = `/* themes.css */\n${cssBlock}\n\n/* theme-manager.js Registration */\n${jsBlock}`;
    
    navigator.clipboard.writeText(fullCode);
    alert('Kosmos Code (CSS + JS) copied to clipboard!');
  };

  return (
    <div className="flex h-screen w-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
      {/* Sidebar - Control Hub */}
      <aside className="w-80 h-full border-r border-white/5 bg-slate-950/80 backdrop-blur-2xl flex flex-col overflow-y-auto">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white text-lg">K</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase">Kosmos <span className="text-indigo-400">Skin</span></h1>
          </div>
          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em]">Theming Engine</p>
        </div>

        <div className="p-6 space-y-8 flex-1">
          {/* AI Prompter */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Architect with AI</label>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="e.g. Vintage Matrix green, or Deep Space with neon violet accents..."
              className="w-full h-24 p-3 bg-black/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 transition-all resize-none placeholder:text-slate-700"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !userInput.trim()}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-xs font-bold rounded-xl transition-all shadow-xl shadow-indigo-950/20 flex items-center justify-center gap-2"
            >
              {isGenerating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Construct New Architecture'}
            </button>
          </div>

          {/* Presets Grid */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Core Library</label>
            <div className="grid grid-cols-1 gap-2">
              {THEME_PRESETS.map(p => (
                <ThemeCard key={p.id} theme={p} isActive={currentTheme.id === p.id} onClick={() => setCurrentTheme(p)} />
              ))}
            </div>
          </div>

          {/* Recent Creations */}
          {history.length > 0 && (
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recent Generations</label>
              <div className="grid grid-cols-1 gap-2">
                {history.map(p => (
                  <ThemeCard key={p.id} theme={p} isActive={currentTheme.id === p.id} onClick={() => setCurrentTheme(p)} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-900/30 border-t border-white/5">
           <button 
            onClick={copyToKosmos}
            className="w-full py-3 bg-white text-black text-xs font-black rounded-xl uppercase tracking-widest hover:bg-indigo-50 transition-colors"
           >
             Get Kosmos Code
           </button>
        </div>
      </aside>

      {/* Main Preview Area */}
      <main className="flex-1 flex flex-col p-8 relative overflow-hidden bg-slate-950">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/5 blur-[150px] rounded-full -mr-96 -mt-96 pointer-events-none" />
        
        <div className="flex items-center justify-between mb-8 z-10">
          <div>
            <h2 className="text-white text-2xl font-bold tracking-tight">Interface Simulator</h2>
            <p className="text-slate-500 text-sm mt-1">Real-time simulation of Kosmos Panel using the <span className="text-indigo-400 font-mono">active skin variables</span>.</p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
             <div className="flex flex-col text-right">
               <span className="text-[10px] text-slate-500 font-bold uppercase">Active Identity</span>
               <span className="text-white text-sm font-bold">{currentTheme.name} {currentTheme.icon}</span>
             </div>
          </div>
        </div>

        <div className="flex-1 rounded-3xl overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] border border-white/10 z-10 ring-1 ring-white/10">
          <DashboardPreview theme={currentTheme} />
        </div>
      </main>
    </div>
  );
};

export default App;
