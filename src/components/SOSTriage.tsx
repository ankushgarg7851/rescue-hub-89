import { useState } from 'react';
import { AlertTriangle, MapPin, Camera, Check, Upload, ToggleLeft, ToggleRight } from 'lucide-react';

type Step = 1 | 2 | 3;
type SOSType = 'medical' | 'fire' | 'flood' | 'rescue' | 'other';

export function SOSTriage() {
  const [step, setStep] = useState<Step>(1);
  const [sosType, setSosType] = useState<SOSType | null>(null);
  const [priority, setPriority] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [gpsLocked, setGpsLocked] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const types: { id: SOSType; label: string; icon: string }[] = [
    { id: 'medical', label: 'Medical', icon: '🏥' },
    { id: 'fire', label: 'Fire', icon: '🔥' },
    { id: 'flood', label: 'Flood', icon: '🌊' },
    { id: 'rescue', label: 'Rescue', icon: '🆘' },
    { id: 'other', label: 'Other', icon: '⚠️' },
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const lockGPS = () => {
    setTimeout(() => setGpsLocked(true), 800);
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-success" />
          </div>
          <h2 className="font-mono text-lg font-bold text-foreground">SOS TRANSMITTED</h2>
          <p className="font-mono text-xs text-muted-foreground">
            {priority ? 'PRIORITY ALERT' : 'Standard alert'} sent to all nearby responders
          </p>
          <button
            onClick={() => { setSubmitted(false); setStep(1); setSosType(null); setPhoto(null); setGpsLocked(false); }}
            className="font-mono text-xs px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity duration-75"
          >
            NEW REPORT
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-mono text-lg font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-urgent" />
            SOS TRIAGE
          </h2>
          <p className="font-mono text-xs text-muted-foreground mt-0.5">Step {step} of 3</p>
        </div>
        <button
          onClick={() => setPriority(p => !p)}
          className={`flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded border border-subtle transition-colors duration-75 ${
            priority ? 'bg-urgent text-urgent-foreground border-urgent' : 'bg-card text-muted-foreground border-border'
          }`}
        >
          {priority ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
          PRIORITY SOS
        </button>
      </div>

      {/* Progress */}
      <div className="flex gap-1 mb-6">
        {[1, 2, 3].map(s => (
          <div key={s} className={`h-1 flex-1 rounded-full transition-colors duration-75 ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
        ))}
      </div>

      {/* Step 1: Type */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="font-mono text-sm font-semibold text-foreground">Select Emergency Type</h3>
          <div className="grid grid-cols-2 gap-3">
            {types.map(t => (
              <button
                key={t.id}
                onClick={() => { setSosType(t.id); }}
                className={`flex items-center gap-3 p-4 rounded border border-subtle text-left transition-colors duration-75 min-h-[48px] ${
                  sosType === t.id ? 'bg-primary/10 border-primary text-foreground' : 'bg-card border-border text-muted-foreground hover:bg-secondary'
                }`}
              >
                <span className="text-2xl">{t.icon}</span>
                <span className="font-mono text-sm">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Photo upload */}
          <div className="space-y-2">
            <h3 className="font-mono text-sm font-semibold text-foreground flex items-center gap-2">
              <Camera className="w-4 h-4" /> Photo Evidence (optional)
            </h3>
            <label className="flex flex-col items-center justify-center p-6 border border-dashed border-border rounded bg-card cursor-pointer hover:bg-secondary transition-colors duration-75">
              {photo ? (
                <div className="relative">
                  <img src={photo} alt="Evidence" className="max-h-40 rounded" />
                  <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-warning text-warning-foreground rounded text-[9px] font-mono">
                    AI: Analyzing...
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                  <span className="font-mono text-xs text-muted-foreground">Upload photo</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
          </div>

          <button
            onClick={() => { if (sosType) setStep(2); }}
            disabled={!sosType}
            className="w-full py-3 font-mono text-sm bg-primary text-primary-foreground rounded min-h-[48px] hover:opacity-90 disabled:opacity-40 transition-opacity duration-75"
          >
            NEXT: GPS LOCK →
          </button>
        </div>
      )}

      {/* Step 2: GPS */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="font-mono text-sm font-semibold text-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4" /> GPS Location Lock
          </h3>
          <div className="p-6 border border-subtle border-border rounded bg-card text-center space-y-3">
            {gpsLocked ? (
              <>
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 text-success" />
                </div>
                <p className="font-mono text-xs text-success">GPS LOCKED</p>
                <p className="font-mono text-xs text-muted-foreground">34.0522° N, 118.2437° W</p>
                <p className="font-mono text-[10px] text-muted-foreground">Accuracy: ±5m</p>
              </>
            ) : (
              <>
                <MapPin className="w-8 h-8 text-muted-foreground mx-auto" />
                <p className="font-mono text-xs text-muted-foreground">Tap to acquire GPS position</p>
                <button
                  onClick={lockGPS}
                  className="px-6 py-3 font-mono text-sm bg-primary text-primary-foreground rounded min-h-[48px] hover:opacity-90 transition-opacity duration-75"
                >
                  LOCK GPS
                </button>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 font-mono text-sm bg-secondary text-secondary-foreground rounded min-h-[48px] hover:opacity-90 transition-opacity duration-75"
            >
              ← BACK
            </button>
            <button
              onClick={() => { if (gpsLocked) setStep(3); }}
              disabled={!gpsLocked}
              className="flex-1 py-3 font-mono text-sm bg-primary text-primary-foreground rounded min-h-[48px] hover:opacity-90 disabled:opacity-40 transition-opacity duration-75"
            >
              NEXT: CONFIRM →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="font-mono text-sm font-semibold text-foreground">Confirm & Transmit</h3>
          <div className="p-4 border border-subtle border-border rounded bg-card space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted-foreground">Type</span>
              <span className="text-foreground uppercase">{sosType}</span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted-foreground">Priority</span>
              <span className={priority ? 'text-urgent' : 'text-foreground'}>{priority ? 'CRITICAL' : 'STANDARD'}</span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted-foreground">GPS</span>
              <span className="text-success">34.0522°N, 118.2437°W</span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted-foreground">Photo</span>
              <span className="text-foreground">{photo ? 'Attached' : 'None'}</span>
            </div>
          </div>
          {priority && (
            <div className="p-3 border border-urgent rounded bg-urgent/10 text-xs font-mono text-urgent">
              ⚠ PRIORITY SOS will pulse on all dispatcher maps and move to top of volunteer queue.
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-3 font-mono text-sm bg-secondary text-secondary-foreground rounded min-h-[48px]"
            >
              ← BACK
            </button>
            <button
              onClick={() => setSubmitted(true)}
              className={`flex-1 py-3 font-mono text-sm rounded min-h-[48px] transition-opacity duration-75 hover:opacity-90 ${
                priority ? 'bg-urgent text-urgent-foreground' : 'bg-primary text-primary-foreground'
              }`}
            >
              TRANSMIT SOS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
