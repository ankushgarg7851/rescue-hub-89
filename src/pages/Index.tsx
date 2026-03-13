import { AppSidebar } from '@/components/AppSidebar';
import { TabBar } from '@/components/TabBar';
import { MapView } from '@/components/MapView';
import { SOSTriage } from '@/components/SOSTriage';
import { EmergencyGuide } from '@/components/EmergencyGuide';
import { ResourceLogistics } from '@/components/ResourceLogistics';
import { VolunteerMesh } from '@/components/VolunteerMesh';
import { TabProvider, useTabs } from '@/context/TabContext';
import { AppProvider, useApp } from '@/context/AppContext';

function WorkspaceContent() {
  const { activeView } = useApp();
  const { tabs, activeTabId } = useTabs();

  const renderView = () => {
    switch (activeView) {
      case 'map':
        return (
          <div className="flex flex-col h-full">
            <TabBar />
            <div className="flex-1 relative">
              {tabs.map(tab => (
                <div
                  key={tab.id}
                  className="absolute inset-0"
                  style={{ display: tab.id === activeTabId ? 'block' : 'none' }}
                >
                  <MapView tabId={tab.id} />
                </div>
              ))}
            </div>
          </div>
        );
      case 'sos':
        return <SOSTriage />;
      case 'guide':
        return <EmergencyGuide />;
      case 'resource':
        return <ResourceLogistics />;
      case 'volunteer':
        return <VolunteerMesh />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar />
      <main className="flex-1 h-full overflow-hidden">
        {renderView()}
      </main>
    </div>
  );
}

export default function Index() {
  return (
    <AppProvider>
      <TabProvider>
        <WorkspaceContent />
      </TabProvider>
    </AppProvider>
  );
}
