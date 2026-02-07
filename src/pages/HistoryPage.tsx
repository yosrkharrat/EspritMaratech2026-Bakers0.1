import { Trophy, Users, Calendar, Heart, Star, MapPin } from 'lucide-react';

const milestones = [
  { year: '2016', title: 'Fondation du RCT', desc: 'Le Running Club Tunis est fondé le 21 avril 2016 par un groupe de passionnés de course à pied.', icon: Star },
  { year: '2017', title: 'Premier événement officiel', desc: 'Organisation du premier 10km chronométré au Lac de Tunis avec 30 participants.', icon: Calendar },
  { year: '2018', title: '50 membres', desc: 'Le club atteint 50 membres actifs et lance les sorties hebdomadaires.', icon: Users },
  { year: '2019', title: 'Premier semi-marathon', desc: 'Participation collective au semi-marathon de Carthage. 15 coureurs RCT sur la ligne de départ.', icon: MapPin },
  { year: '2020', title: 'Adaptation COVID', desc: 'Le club maintient la cohésion avec des challenges virtuels et des entraînements en petit groupe.', icon: Heart },
  { year: '2022', title: '100 membres', desc: 'Cap symbolique: le RCT dépasse les 100 adhérents! Création des groupes par niveau.', icon: Users },
  { year: '2024', title: 'Records et victoires', desc: 'Multiples podiums sur les courses nationales. Le RCT s\'impose comme le premier club de Tunis.', icon: Trophy },
  { year: '2026', title: '10 ans & 125 membres', desc: 'Le RCT fête ses 10 ans avec 125 coureurs passionnés et lance son application mobile!', icon: Star },
];

const values = [
  { title: 'Solidarité', desc: 'Courir ensemble, progresser ensemble. Aucun coureur n\'est laissé derrière.', emoji: '🤝' },
  { title: 'Dépassement', desc: 'Chaque sortie est une opportunité de repousser ses limites.', emoji: '💪' },
  { title: 'Respect', desc: 'Respect des allures, des niveaux et de chaque membre du club.', emoji: '🙏' },
  { title: 'Partage', desc: 'Partager la passion du running et transmettre aux nouveaux.', emoji: '❤️' },
];

const HistoryPage = () => (
  <div className="pb-20 pt-6">
    <div className="px-4 mb-6">
      <h1 className="font-display font-extrabold text-2xl">Notre Histoire</h1>
      <p className="text-sm text-muted-foreground">Running Club Tunis depuis 2016 🇹🇳</p>
    </div>

    {/* Hero stats */}
    <div className="mx-4 rct-gradient-hero rounded-2xl p-6 mb-6 rct-shadow-elevated">
      <div className="text-center mb-4">
        <h2 className="font-display font-extrabold text-3xl text-white">10 ans</h2>
        <p className="text-white/70 text-sm">de passion et de kilomètres</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { v: '125', l: 'Membres' },
          { v: '21/04', l: 'Fondé en 2016' },
          { v: '50K+', l: 'Km parcourus' },
        ].map(s => (
          <div key={s.l} className="text-center">
            <p className="font-display font-bold text-xl text-white">{s.v}</p>
            <p className="text-[10px] text-white/60">{s.l}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Timeline */}
    <div className="px-4 mb-6">
      <h3 className="font-display font-bold text-lg mb-4">Chronologie</h3>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
        {milestones.map((m, i) => (
          <div key={m.year} className="relative pl-12 pb-6 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="absolute left-0 w-9 h-9 rounded-full rct-gradient-hero flex items-center justify-center rct-glow-blue">
              <m.icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-bold text-primary">{m.year}</span>
            <h4 className="font-display font-bold text-sm mt-0.5">{m.title}</h4>
            <p className="text-xs text-muted-foreground mt-1">{m.desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Values */}
    <div className="px-4 mb-6">
      <h3 className="font-display font-bold text-lg mb-3">Nos Valeurs</h3>
      <div className="grid grid-cols-2 gap-3">
        {values.map(v => (
          <div key={v.title} className="bg-card rounded-2xl rct-shadow-card p-4">
            <span className="text-2xl">{v.emoji}</span>
            <h4 className="font-display font-bold text-sm mt-2">{v.title}</h4>
            <p className="text-[11px] text-muted-foreground mt-1">{v.desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Charte */}
    <div className="mx-4 bg-card rounded-2xl rct-shadow-card p-6">
      <h3 className="font-display font-bold text-lg mb-3">📜 Charte du Club</h3>
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>1. Être ponctuel aux rendez-vous de groupe</p>
        <p>2. Respecter les allures définies par le coach</p>
        <p>3. Porter les couleurs du club lors des compétitions</p>
        <p>4. Encourager et aider les coureurs moins expérimentés</p>
        <p>5. Signaler toute absence prévue à l'admin du groupe</p>
        <p>6. Maintenir un esprit sportif et fair-play en toute circonstance</p>
        <p>7. Partager la passion du running avec bienveillance</p>
      </div>
    </div>
  </div>
);

export default HistoryPage;
