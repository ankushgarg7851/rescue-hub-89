import { useState } from 'react';
import { BookOpen, AlertTriangle, Check, ChevronRight, Shield } from 'lucide-react';

interface Guide {
  id: string;
  title: string;
  icon: string;
  donts: string[];
  dos: string[];
  checklist: string[];
}

const guides: Guide[] = [
  {
    id: 'flood', title: 'Flood', icon: '🌊',
    donts: ['Do NOT walk through moving water', 'Do NOT drive into flooded roads', 'Do NOT touch electrical equipment if wet', 'Do NOT return home until authorities say safe'],
    dos: ['Move to higher ground immediately', 'Turn off utilities if safe to do so', 'Listen to emergency broadcasts', 'Avoid bridges over fast-moving water'],
    checklist: ['Clean drinking water (3L/person)', 'Waterproof bag for documents', 'Flashlight with extra batteries', 'First aid kit', 'Charged phone + power bank'],
  },
  {
    id: 'earthquake', title: 'Earthquake', icon: '🏚️',
    donts: ['Do NOT run outside during shaking', 'Do NOT stand near windows', 'Do NOT use elevators', 'Do NOT light matches (gas leaks)'],
    dos: ['DROP, COVER, HOLD ON', 'Get under sturdy furniture', 'If outdoors, move to open area', 'Be prepared for aftershocks'],
    checklist: ['Earthquake emergency kit', 'Sturdy shoes near bed', 'Know gas shutoff location', 'Family communication plan', 'Fire extinguisher'],
  },
  {
    id: 'fire', title: 'Fire', icon: '🔥',
    donts: ['Do NOT open hot doors', 'Do NOT use elevators', 'Do NOT go back for possessions', 'Do NOT hide — get out and stay out'],
    dos: ['Crawl low under smoke', 'Feel doors before opening', 'Use wet cloth over nose/mouth', 'Meet at designated assembly point'],
    checklist: ['Smoke detectors tested', 'Fire extinguisher accessible', 'Escape route planned', 'Emergency contacts listed', 'Important documents in fireproof bag'],
  },
  {
    id: 'medical', title: 'Medical Emergency', icon: '🏥',
    donts: ['Do NOT move injured person unless danger', 'Do NOT remove embedded objects', 'Do NOT give food/water to unconscious person', 'Do NOT delay calling emergency services'],
    dos: ['Call emergency services immediately', 'Apply pressure to bleeding wounds', 'Keep patient warm and still', 'Begin CPR if trained and no pulse'],
    checklist: ['First aid kit stocked', 'Know nearest hospital route', 'Emergency numbers saved', 'Basic CPR training', 'Allergy/medication info accessible'],
  },
  {
    id: 'storm', title: 'Storm', icon: '⛈️',
    donts: ['Do NOT go outside during the storm', 'Do NOT use corded phones', 'Do NOT shelter under trees', 'Do NOT touch metal objects'],
    dos: ['Stay indoors away from windows', 'Unplug electronic equipment', 'Store water and non-perishable food', 'Monitor weather updates continuously'],
    checklist: ['Battery-powered radio', 'Bottled water supply', 'Flashlights and candles', 'Board up windows', 'Secure outdoor objects'],
  },
  {
    id: 'chemical', title: 'Chemical Spill', icon: '☣️',
    donts: ['Do NOT touch or walk through spilled material', 'Do NOT eat/drink anything in affected area', 'Do NOT try to clean up chemical spills', 'Do NOT remove clothing over your head'],
    dos: ['Move upwind from the spill', 'Cover nose and mouth with wet cloth', 'Remove contaminated clothing', 'Decontaminate with soap and water'],
    checklist: ['Gas mask or N95 respirator', 'Plastic sheeting and duct tape', 'Know local chemical facilities', 'Decontamination supplies', 'Emergency evacuation route planned'],
  },
];

export function EmergencyGuide() {
  const [selected, setSelected] = useState<Guide | null>(null);

  if (selected) {
    return (
      <div className="h-full overflow-y-auto p-6 max-w-2xl mx-auto">
        <button
          onClick={() => setSelected(null)}
          className="font-mono text-xs text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1 transition-colors duration-75"
        >
          ← All Guides
        </button>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">{selected.icon}</span>
          <div>
            <h2 className="font-mono text-lg font-bold text-foreground">{selected.title}</h2>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Emergency Response Protocol</p>
          </div>
        </div>

        {/* Don'ts */}
        <div className="mb-4 p-4 border border-subtle border-urgent/30 rounded bg-urgent/5">
          <h3 className="font-mono text-xs font-semibold text-urgent uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3" /> Critical Don'ts
          </h3>
          <ul className="space-y-1.5">
            {selected.donts.map((d, i) => (
              <li key={i} className="font-body text-sm text-urgent/90 flex items-start gap-2">
                <span className="text-urgent mt-0.5">✕</span> {d}
              </li>
            ))}
          </ul>
        </div>

        {/* Do's */}
        <div className="mb-4 p-4 border border-subtle border-success/30 rounded bg-success/5">
          <h3 className="font-mono text-xs font-semibold text-success uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Check className="w-3 h-3" /> Do's — First Actions
          </h3>
          <ul className="space-y-1.5">
            {selected.dos.map((d, i) => (
              <li key={i} className="font-body text-sm text-success/90 flex items-start gap-2">
                <span className="text-success mt-0.5">✓</span> {d}
              </li>
            ))}
          </ul>
        </div>

        {/* Checklist */}
        <div className="p-4 border border-subtle border-border rounded bg-card">
          <h3 className="font-mono text-xs font-semibold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Shield className="w-3 h-3" /> Survival Checklist
          </h3>
          <ul className="space-y-1.5">
            {selected.checklist.map((c, i) => (
              <li key={i} className="font-body text-sm text-muted-foreground flex items-center gap-2">
                <input type="checkbox" className="rounded-sm" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="font-mono text-lg font-bold text-foreground flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          EMERGENCY GUIDE
        </h2>
        <p className="font-mono text-xs text-muted-foreground mt-0.5">Offline-ready first-action protocols</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {guides.map(g => (
          <button
            key={g.id}
            onClick={() => setSelected(g)}
            className="flex items-center gap-3 p-4 bg-card border border-subtle border-border rounded hover:bg-secondary text-left transition-colors duration-75"
          >
            <span className="text-2xl">{g.icon}</span>
            <div className="flex-1 min-w-0">
              <span className="font-mono text-sm font-medium text-foreground">{g.title}</span>
              <p className="font-mono text-[10px] text-muted-foreground">Response Protocol</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
