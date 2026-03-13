import { Users, MapPin, Clock, Radio, Star, ChevronRight } from 'lucide-react';

interface Volunteer {
  id: number;
  name: string;
  skill: string;
  status: 'active' | 'standby' | 'deployed';
  location: string;
  distance: string;
  rating: number;
  lastActive: string;
}

const volunteers: Volunteer[] = [
  { id: 1, name: 'Team Alpha', skill: 'Search & Rescue', status: 'active', location: 'Zone A', distance: '0.5 km', rating: 5, lastActive: '2 min ago' },
  { id: 2, name: 'Med Unit 3', skill: 'Medical', status: 'deployed', location: 'East Medical', distance: '1.2 km', rating: 4, lastActive: 'Active' },
  { id: 3, name: 'Team Bravo', skill: 'Logistics', status: 'active', location: 'Central Hub', distance: '0.8 km', rating: 5, lastActive: '5 min ago' },
  { id: 4, name: 'K9 Unit', skill: 'Search & Rescue', status: 'standby', location: 'Station 7', distance: '2.1 km', rating: 5, lastActive: '15 min ago' },
  { id: 5, name: 'Water Rescue', skill: 'Water Rescue', status: 'active', location: 'Zone C', distance: '1.5 km', rating: 4, lastActive: '1 min ago' },
  { id: 6, name: 'Drone Ops', skill: 'Recon', status: 'standby', location: 'HQ', distance: '3.0 km', rating: 4, lastActive: '30 min ago' },
  { id: 7, name: 'Team Charlie', skill: 'Evacuation', status: 'deployed', location: 'West Camp', distance: '1.8 km', rating: 3, lastActive: 'Active' },
  { id: 8, name: 'Comms Unit', skill: 'Communications', status: 'active', location: 'Central Hub', distance: '0.3 km', rating: 5, lastActive: '1 min ago' },
];

const statusStyles = {
  active: 'bg-success/10 text-success',
  deployed: 'bg-primary/10 text-primary',
  standby: 'bg-muted text-muted-foreground',
};

export function VolunteerMesh() {
  const active = volunteers.filter(v => v.status === 'active').length;
  const deployed = volunteers.filter(v => v.status === 'deployed').length;
  const standby = volunteers.filter(v => v.status === 'standby').length;

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h2 className="font-mono text-lg font-bold text-foreground flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          VOLUNTEER MESH
        </h2>
        <p className="font-mono text-xs text-muted-foreground mt-0.5">Real-time volunteer coordination network</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Active', count: active, color: 'text-success' },
          { label: 'Deployed', count: deployed, color: 'text-primary' },
          { label: 'Standby', count: standby, color: 'text-muted-foreground' },
        ].map(s => (
          <div key={s.label} className="p-3 bg-card border border-subtle border-border rounded text-center">
            <p className={`font-mono text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="font-mono text-[10px] text-muted-foreground uppercase">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Volunteer cards */}
      <div className="space-y-2">
        {volunteers.map(v => (
          <div key={v.id} className="p-3 bg-card border border-subtle border-border rounded flex items-center gap-3 hover:bg-secondary transition-colors duration-75 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <Radio className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-medium text-foreground">{v.name}</span>
                <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded uppercase ${statusStyles[v.status]}`}>
                  {v.status}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="font-mono text-[10px] text-muted-foreground">{v.skill}</span>
                <span className="flex items-center gap-0.5 font-mono text-[10px] text-muted-foreground">
                  <MapPin className="w-2.5 h-2.5" />{v.distance}
                </span>
                <span className="flex items-center gap-0.5 font-mono text-[10px] text-muted-foreground">
                  <Clock className="w-2.5 h-2.5" />{v.lastActive}
                </span>
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: v.rating }).map((_, i) => (
                    <Star key={i} className="w-2 h-2 fill-warning text-warning" />
                  ))}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
