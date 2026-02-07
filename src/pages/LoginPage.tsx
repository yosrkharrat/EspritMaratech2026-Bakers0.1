import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import rctLogo from '@/assets/rct-logo.svg';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginAsVisitor } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
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

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Hero - compact */}
      <div className="relative h-40 rct-gradient-hero flex items-end shrink-0">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="relative p-4 pb-8 w-full flex items-center gap-3">
          <img src={rctLogo} alt="RCT Logo" className="h-14 w-14 drop-shadow-2xl" />
          <div>
            <h1 className="font-display font-extrabold text-2xl text-white drop-shadow-lg">RCT</h1>
            <p className="text-white/80 font-body text-xs">Running Club Tunis</p>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 px-5 -mt-4 flex flex-col justify-center">
        <div className="bg-card rounded-2xl rct-shadow-elevated p-5">
          <h2 className="font-display font-bold text-lg mb-0.5">Connexion</h2>
          <p className="text-xs text-muted-foreground mb-4">Identifiez-vous pour accéder à votre espace</p>

          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="text-xs font-medium mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full h-11 px-4 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="text-xs font-medium mb-1 block">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-4 pr-12 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSubmitting}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && <p className="text-destructive text-xs font-medium">{error}</p>}

            <button type="submit" disabled={isSubmitting} className="w-full h-11 rct-gradient-hero text-white font-display font-bold rounded-xl rct-glow-blue transition-transform active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 mt-4">
              {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Connexion...</> : 'Se connecter'}
            </button>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">ou</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <button type="button" onClick={() => { loginAsVisitor(); navigate('/calendar'); }} className="w-full h-11 bg-muted text-foreground font-display font-semibold rounded-xl transition-colors hover:bg-muted/80">
              Continuer en visiteur
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-muted-foreground py-3">
          RCT Connect © 2026
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
