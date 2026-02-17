
import React from 'react';
import { AppTheme } from '../types';

interface DashboardPreviewProps {
  theme: AppTheme;
}

const DashboardPreview: React.FC<DashboardPreviewProps> = ({ theme }) => {
  const { colors } = theme;

  const cssVariables = {
    '--bg-main': colors.bgMain,
    '--bg-secondary': colors.bgSecondary,
    '--bg-card': colors.bgCard,
    '--bg-panel': colors.bgPanel,
    '--bg-header': colors.bgHeader,
    '--bg-input': colors.bgInput,
    '--bg-term': colors.bgTerm,
    '--bg-hover': colors.bgHover,
    '--bg-active': colors.bgActive,
    '--bg-tooltip': colors.bgTooltip,
    '--bg-overlay': colors.bgOverlay,
    '--bg-modal': colors.bgModal,
    '--term-bg': colors.termBg,
    '--term-fg': colors.termFg,
    '--border-main': colors.borderMain,
    '--border-light': colors.borderLight,
    '--border-focus': colors.borderFocus,
    '--text-main': colors.textMain,
    '--text-muted': colors.textMuted,
    '--text-dim': colors.textDim,
    '--text-inverted': colors.textInverted,
    '--primary': colors.primary,
    '--primary-hover': colors.primaryHover,
    '--primary-dim': colors.primaryDim,
    '--success': colors.success,
    '--warning': colors.warning,
    '--error': colors.error,
    '--info': colors.info,
    '--log-ai': colors.logAi,
    '--log-stdin': colors.logStdin,
    '--log-stdout': colors.logStdout,
    '--log-stderr': colors.logStderr,
    '--scrollbar-thumb': colors.scrollbarThumb,
    '--tab-active-border': colors.tabActiveBorder,
  } as React.CSSProperties;

  return (
    <div 
      className="w-full h-full flex flex-col overflow-hidden transition-colors duration-300"
      style={{ ...cssVariables, backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}
    >
      {/* HUD Scanline Effect (subtle) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(transparent 50%, black 50%)', backgroundSize: '100% 4px' }} />

      {/* Navbar / Header */}
      <div 
        className="h-14 px-6 flex items-center justify-between border-b relative z-10"
        style={{ backgroundColor: 'var(--bg-header)', borderBottomColor: 'var(--border-main)' }}
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl drop-shadow-[0_0_8px_var(--primary)]">{theme.icon}</span>
            <span className="font-bold text-lg tracking-tight">KOSMOS <span style={{ color: 'var(--primary)', textShadow: '0 0 10px var(--primary)' }}>PANEL</span></span>
          </div>
          <div className="flex gap-4 text-xs font-medium">
             <span style={{ borderBottom: '2px solid var(--tab-active-border)', color: 'var(--text-main)', textShadow: '0 0 5px var(--primary)' }} className="pb-1 cursor-pointer">Dashboard</span>
             <span style={{ color: 'var(--text-muted)' }} className="hover:text-main transition-colors cursor-pointer">Terminal</span>
             <span style={{ color: 'var(--text-muted)' }} className="hover:text-main transition-colors cursor-pointer">Logs</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="px-3 py-1 rounded border shadow-inner" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-light)', color: 'var(--text-muted)' }}>
             Search node...
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-[0_0_15px_var(--primary-dim)]" style={{ backgroundColor: 'var(--primary)', color: 'var(--text-inverted)' }}>R</div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Sidebar */}
        <div 
          className="w-56 flex flex-col p-4 border-r gap-2"
          style={{ backgroundColor: 'var(--bg-panel)', borderRightColor: 'var(--border-main)' }}
        >
           <div className="px-2 py-1 text-[10px] uppercase font-bold tracking-widest" style={{ color: 'var(--text-dim)' }}>Nodes</div>
           {['Master-01', 'Worker-USA', 'Worker-EU'].map((node, i) => (
             <div 
              key={i} 
              className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-[var(--border-light)]"
              style={{ 
                backgroundColor: i === 0 ? 'var(--primary-dim)' : 'transparent',
                color: i === 0 ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: i === 0 ? 'inset 0 0 10px var(--primary-dim)' : 'none'
              }}
             >
               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: i === 0 ? 'var(--success)' : 'var(--text-dim)', boxShadow: i === 0 ? '0 0 8px var(--success)' : 'none' }} />
               <span className="text-sm font-medium">{node}</span>
             </div>
           ))}
        </div>

        {/* Workspace */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'CPU Usage', val: '24%', color: 'var(--info)' },
              { label: 'RAM Free', val: '8.2 GB', color: 'var(--success)' },
              { label: 'Latency', val: '12ms', color: 'var(--primary)' },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-xl border relative overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-main)' }}>
                 <div className="absolute top-0 right-0 w-8 h-8 opacity-10" style={{ borderTop: '2px solid var(--primary)', borderRight: '2px solid var(--primary)' }} />
                 <div className="text-[10px] uppercase font-bold mb-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                 <div className="text-2xl font-bold" style={{ color: stat.color, textShadow: `0 0 10px ${stat.color}` }}>{stat.val}</div>
              </div>
            ))}
          </div>

          {/* Terminal Component */}
          <div 
            className="flex flex-col border overflow-hidden font-mono shadow-[0_0_30px_rgba(0,0,0,0.5)]"
            style={{ backgroundColor: 'var(--term-bg)', borderColor: 'var(--border-main)', borderRadius: '12px' }}
          >
            <div className="px-4 py-2 flex items-center justify-between border-b" style={{ borderBottomColor: 'var(--border-main)', backgroundColor: 'var(--bg-secondary)' }}>
              <div className="flex gap-4 text-[10px] uppercase font-bold">
                <span style={{ color: 'var(--primary)', textShadow: '0 0 5px var(--primary)' }}>Console Output</span>
                <span style={{ color: 'var(--text-dim)' }}>127.0.0.1:22</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--error)', boxShadow: '0 0 5px var(--error)' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--warning)', boxShadow: '0 0 5px var(--warning)' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--success)', boxShadow: '0 0 5px var(--success)' }} />
              </div>
            </div>
            <div className="p-4 text-sm min-h-[220px]" style={{ color: 'var(--term-fg)', textShadow: '0 0 5px var(--term-fg)' }}>
              <div className="opacity-80">[system] initializing secure tunnel... <span style={{ color: 'var(--success)' }}>DONE</span></div>
              <div className="mt-1">[ai] <span style={{ color: 'var(--log-ai)' }}>Analyzing HUD architecture...</span></div>
              <div className="mt-2 flex gap-2">
                <span style={{ color: 'var(--primary)' }}>root@kosmos:~#</span>
                <span className="animate-pulse w-2 h-4 bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
              </div>
              <div className="mt-6 border-t pt-4 border-dashed border-[var(--border-light)] space-y-1 opacity-70 text-xs">
                <div className="flex justify-between">
                   <span style={{ color: 'var(--log-stdin)' }}>> GET /api/v1/skins/cyber-hud</span>
                   <span className="text-[10px]">200 OK</span>
                </div>
                <div style={{ color: 'var(--log-stdout)' }}>Loading holographic assets...</div>
                <div style={{ color: 'var(--log-stdout)' }}>Calibrating cyan emitters... 100%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
