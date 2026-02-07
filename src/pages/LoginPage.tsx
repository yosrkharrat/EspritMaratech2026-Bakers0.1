import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Users, Shield, Dumbbell, UserCheck } from 'lucide-react';

const roleInfo = [
  { role: 'Admin', icon: Shield, desc: 'Gestion complète', color: 'text-red-500' },
  { role: 'Coach', icon: Dumbbell, desc: 'Programmes entraînement', color: 'text-blue-500' },
  { role: 'Admin Groupe', icon: UserCheck, desc: 'Gestion groupe', color: 'text-green-500' },
  { role: 'Membre', icon: Users, desc: 'Accès complet', color: 'text-orange-500' },
];

const demoAccounts = [
  { name: 'Yosri Kharrat', cin: '123', role: 'Admin' },
  { name: 'Ahmed Ben Ali', cin: '456', role: 'Coach' },
  { name: 'Salma Gharbi', cin: '789', role: 'Admin Groupe' },
  { name: 'Youssef Trabelsi', cin: '321', role: 'Membre' },
];

const LoginPage = () => {
  const { login, loginAsVisitor } = useAuth();
  const [name, setName] = useState('');
  const [cin, setCin] = useState('');
  const [showCin, setShowCin] = useState(false);
  const [error, setError] = useState('');
  const [showDemo, setShowDemo] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Entrez votre nom'); return; }
    if (!cin || cin.length !== 3) { setError('Code CIN: 3 chiffres'); return; }
    const result = login(name, cin);
    if (!result.success) setError(result.error || 'Erreur');
  };

  const handleDemoLogin = (n: string, c: string) => {
    setName(n);
    setCin(c);
    login(n, c);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero */}
      <div className="relative h-72 rct-gradient-hero flex items-end">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="relative p-6 pb-10 w-full">
          <h1 className="font-display font-extrabold text-4xl text-white drop-shadow-lg">RCT</h1>
          <p className="text-white/80 font-body text-sm mt-1">Running Club Tunis</p>
          <p className="text-white/60 text-xs mt-1">Depuis 2016 · 125 coureurs · 🇹🇳</p>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 px-6 -mt-6">
        <div className="bg-card rounded-2xl rct-shadow-elevated p-6">
          <h2 className="font-display font-bold text-xl mb-1">Connexion</h2>
          <p className="text-sm text-muted-foreground mb-6">Identifiez-vous pour accéder à votre espace</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Nom complet</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Votre nom et prénom"
                className="w-full h-12 px-4 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Code CIN (3 chiffres)</label>
              <div className="relative">
                <input
                  type={showCin ? 'text' : 'password'}
                  value={cin}
                  onChange={e => { if (/^\d{0,3}$/.test(e.target.value)) setCin(e.target.value); }}
                  placeholder="•••"
                  maxLength={3}
                  className="w-full h-12 px-4 pr-12 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary tracking-widest"
                />
                <button type="button" onClick={() => setShowCin(!showCin)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showCin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && <p className="text-destructive text-sm font-medium">{error}</p>}

            <button type="submit" className="w-full h-12 rct-gradient-hero text-white font-display font-bold rounded-xl rct-glow-blue transition-transform active:scale-[0.98]">
              Se connecter
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">ou</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <button onClick={loginAsVisitor} className="w-full h-12 bg-muted text-foreground font-display font-semibold rounded-xl transition-colors hover:bg-muted/80">
            Continuer en visiteur
          </button>
        </div>

        {/* Roles */}
        <div className="mt-6 mb-4">
          <p className="text-xs text-muted-foreground font-medium mb-3">3 niveaux d'administration</p>
          <div className="grid grid-cols-2 gap-2">
            {roleInfo.map(r => (
              <div key={r.role} className="bg-card rounded-xl p-3 rct-shadow-card flex items-center gap-2.5">
                <r.icon className={`w-4 h-4 ${r.color}`} />
                <div>
                  <p className="text-xs font-semibold">{r.role}</p>
                  <p className="text-[10px] text-muted-foreground">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo accounts */}
        <button onClick={() => setShowDemo(!showDemo)} className="text-xs text-primary font-semibold mb-3">
          {showDemo ? 'Masquer' : 'Comptes démo ↓'}
        </button>
        {showDemo && (
          <div className="space-y-2 mb-6 animate-slide-up">
            {demoAccounts.map(d => (
              <button key={d.cin} onClick={() => handleDemoLogin(d.name, d.cin)}
                className="w-full bg-card rounded-xl p-3 rct-shadow-card flex items-center justify-between text-left">
                <div>
                  <p className="text-sm font-semibold">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.role} · CIN: {d.cin}</p>
                </div>
                <span className="text-xs text-primary font-semibold">Essayer →</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
