import { Package, Truck, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const resources = [
  { id: 1, name: 'Water Supplies', status: 'deployed', qty: '5,000L', location: 'Central Shelter', eta: null },
  { id: 2, name: 'Medical Kits', status: 'in-transit', qty: '200 units', location: 'East Medical', eta: '45 min' },
  { id: 3, name: 'Blankets', status: 'deployed', qty: '800 units', location: 'West Relief Camp', eta: null },
  { id: 4, name: 'Food Rations', status: 'requested', qty: '1,200 packs', location: 'Staging Area B', eta: '2 hrs' },
  { id: 5, name: 'Generator', status: 'in-transit', qty: '3 units', location: 'South Hospital', eta: '30 min' },
  { id: 6, name: 'Rescue Equipment', status: 'deployed', qty: '15 sets', location: 'Fire Station 7', eta: null },
  { id: 7, name: 'Tents', status: 'requested', qty: '50 units', location: 'North Staging', eta: '3 hrs' },
  { id: 8, name: 'First Aid Supplies', status: 'in-transit', qty: '500 kits', location: 'Central Hub', eta: '1 hr' },
];

const statusConfig = {
  deployed: { label: 'DEPLOYED', color: 'text-success', bg: 'bg-success/10', icon: CheckCircle2 },
  'in-transit': { label: 'IN TRANSIT', color: 'text-warning', bg: 'bg-warning/10', icon: Truck },
  requested: { label: 'REQUESTED', color: 'text-urgent', bg: 'bg-urgent/10', icon: AlertCircle },
};

export function ResourceLogistics() {
  const deployed = resources.filter(r => r.status === 'deployed').length;
  const inTransit = resources.filter(r => r.status === 'in-transit').length;
  const requested = resources.filter(r => r.status === 'requested').length;

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h2 className="font-mono text-lg font-bold text-foreground flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          RESOURCE LOGISTICS
        </h2>
        <p className="font-mono text-xs text-muted-foreground mt-0.5">Supply chain status overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Deployed', count: deployed, color: 'text-success' },
          { label: 'In Transit', count: inTransit, color: 'text-warning' },
          { label: 'Requested', count: requested, color: 'text-urgent' },
        ].map(s => (
          <div key={s.label} className="p-3 bg-card border border-subtle border-border rounded text-center">
            <p className={`font-mono text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="font-mono text-[10px] text-muted-foreground uppercase">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="border border-subtle border-border rounded overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-px bg-border">
          {['Resource', 'Status', 'Qty', 'ETA'].map(h => (
            <div key={h} className="bg-secondary px-3 py-2 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              {h}
            </div>
          ))}
          {resources.map(r => {
            const s = statusConfig[r.status as keyof typeof statusConfig];
            const Icon = s.icon;
            return [
              <div key={`${r.id}-name`} className="bg-card px-3 py-2.5">
                <span className="font-mono text-xs text-foreground">{r.name}</span>
                <span className="block font-mono text-[10px] text-muted-foreground">{r.location}</span>
              </div>,
              <div key={`${r.id}-status`} className="bg-card px-3 py-2.5 flex items-center">
                <span className={`flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded ${s.bg} ${s.color}`}>
                  <Icon className="w-2.5 h-2.5" />{s.label}
                </span>
              </div>,
              <div key={`${r.id}-qty`} className="bg-card px-3 py-2.5">
                <span className="font-mono text-xs text-foreground">{r.qty}</span>
              </div>,
              <div key={`${r.id}-eta`} className="bg-card px-3 py-2.5">
                {r.eta ? (
                  <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                    <Clock className="w-2.5 h-2.5" />{r.eta}
                  </span>
                ) : (
                  <span className="font-mono text-[10px] text-muted-foreground">—</span>
                )}
              </div>,
            ];
          })}
        </div>
      </div>
    </div>
  );
}
