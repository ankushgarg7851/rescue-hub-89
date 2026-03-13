import { Map, AlertTriangle, Package, Users, BookOpen, Wifi, WifiOff, Zap, ZapOff } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const navItems = [
  { id: 'map' as const, label: 'Live Map', icon: Map },
  { id: 'sos' as const, label: 'SOS Triage', icon: AlertTriangle },
  { id: 'resource' as const, label: 'Resource Logistics', icon: Package },
  { id: 'volunteer' as const, label: 'Volunteer Mesh', icon: Users },
  { id: 'guide' as const, label: 'Emergency Guide', icon: BookOpen },
];

export function AppSidebar() {
  const { activeView, setActiveView, online, highContrast, toggleHighContrast } = useApp();

  return (
    <div className="w-56 flex-shrink-0 flex flex-col bg-sidebar border-r border-subtle border-sidebar-border h-screen">
      <div className="p-4 border-b border-subtle border-sidebar-border">
        <h1 className="font-mono text-lg font-bold tracking-tight text-foreground">
          Res<span className="text-primary">Cue</span>
        </h1>
        <p className="font-mono text-[10px] text-muted-foreground mt-0.5">DISASTER RESPONSE v2.0</p>
      </div>

      <nav className="flex-1 py-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-mono transition-colors duration-75 ${
              activeView === item.id
                ? 'bg-sidebar-accent text-primary border-r-2 border-primary'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-subtle border-sidebar-border space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono">
          {online ? (
            <>
              <Wifi className="w-3 h-3 text-success" />
              <span className="text-success">ONLINE</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-urgent" />
              <span className="text-urgent">OFFLINE</span>
            </>
          )}
        </div>
        <button
          onClick={toggleHighContrast}
          className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors duration-75"
        >
          {highContrast ? <ZapOff className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
          <span>{highContrast ? 'NORMAL MODE' : 'BATTERY SAVER'}</span>
        </button>
      </div>
    </div>
  );
}
