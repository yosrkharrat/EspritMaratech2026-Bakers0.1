import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Users, Shield, Dumbbell, UserCheck, Loader2 } from 'lucide-react';
import rctLogo from '@/assets/rct-logo.svg';

const roleInfo = [
  { role: 'Admin', icon: Shield, desc: 'Gestion complète', color: 'text-red-500' },
  { role: 'Coach', icon: Dumbbell, desc: 'Programmes entraînement', color: 'text-blue-500' },
  { role: 'Admin Groupe', icon: UserCheck, desc: 'Gestion groupe', color: 'text-green-500' },
  { role: 'Membre', icon: Users, desc: 'Accès complet', color: 'text-orange-500' },
];

const demoAccounts = [
  { email: 'admin@rct.tn', password: 'password123', role: 'Admin' },
  { email: 'coach@rct.tn', password: 'password123', role: 'Coach' },
  { email: 'mohamed@rct.tn', password: 'password123', role: 'Membre' },
];

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginAsVisitor } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showDemo, setShowDemo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Entrez votre email'); return; }
    if (!password) { setError('Entrez votre mot de passe'); return; }
    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);
    if (result.success) { navigate('/'); return; }
    setError(result.error || 'Erreur');
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setError('');
    setIsSubmitting(true);
    const result = await login(demoEmail, demoPassword);
    setIsSubmitting(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Erreur de connexion au compte démo');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero */}
      <div className="relative h-72 rct-gradient-hero flex items-end">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="relative p-6 pb-10 w-full flex items-end gap-4">
          <img src={rctLogo} alt="RCT Logo" className="h-20 w-20 drop-shadow-2xl" />
          <div>
            <h1 className="font-display font-extrabold text-4xl text-white drop-shadow-lg">RCT</h1>
            <p className="text-white/80 font-body text-sm mt-1">Running Club Tunis</p>
            <p className="text-white/60 text-xs mt-1">Depuis 2016 · 125 coureurs · 🇹🇳</p>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 px-6 -mt-6">
        <div className="bg-card rounded-2xl rct-shadow-elevated p-6">
          <h2 className="font-display font-bold text-xl mb-1">Connexion</h2>
          <p className="text-sm text-muted-foreground mb-6">Identifiez-vous pour accéder à votre espace</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full h-12 px-4 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 px-4 pr-12 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSubmitting}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && <p className="text-destructive text-sm font-medium">{error}</p>}

            <button type="submit" disabled={isSubmitting} className="w-full h-12 rct-gradient-hero text-white font-display font-bold rounded-xl rct-glow-blue transition-transform active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2">
              {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Connexion...</> : 'Se connecter'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">ou</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <button onClick={() => { loginAsVisitor(); navigate('/'); }} className="w-full h-12 bg-muted text-foreground font-display font-semibold rounded-xl transition-colors hover:bg-muted/80">
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
              <button key={d.email} onClick={() => handleDemoLogin(d.email, d.password)} disabled={isSubmitting}
                className="w-full bg-card rounded-xl p-3 rct-shadow-card flex items-center justify-between text-left disabled:opacity-70">
                <div>
                  <p className="text-sm font-semibold">{d.email}</p>
                  <p className="text-xs text-muted-foreground">{d.role}</p>
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
