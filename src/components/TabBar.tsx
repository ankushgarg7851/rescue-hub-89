import { X, Plus, Map, AlertTriangle, BookOpen, Package, Users } from 'lucide-react';
import { useTabs } from '@/context/TabContext';

const typeIcons: Record<string, React.ElementType> = {
  map: Map,
  sos: AlertTriangle,
  guide: BookOpen,
  resource: Package,
  volunteer: Users,
};

export function TabBar() {
  const { tabs, activeTabId, setActiveTab, closeTab, openTab } = useTabs();

  return (
    <div className="flex items-center bg-secondary/50 border-b border-subtle border-border overflow-x-auto">
      {tabs.map(tab => {
        const Icon = typeIcons[tab.type] || Map;
        const isActive = tab.id === activeTabId;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono border-r border-subtle border-border min-w-0 transition-colors duration-75 ${
              isActive ? 'tab-active text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <Icon className="w-3 h-3 flex-shrink-0" />
            <span className="truncate max-w-[120px]">{tab.title}</span>
            {tabs.length > 1 && (
              <span
                onClick={e => { e.stopPropagation(); closeTab(tab.id); }}
                className="ml-1 p-0.5 rounded hover:bg-muted"
              >
                <X className="w-2.5 h-2.5" />
              </span>
            )}
          </button>
        );
      })}
      <button
        onClick={() => openTab({ type: 'map', title: `Map ${tabs.length + 1}` })}
        className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-75"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
