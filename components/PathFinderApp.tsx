'use client';

import { motion, AnimatePresence, useScroll, useSpring, useInView } from 'motion/react';
import { 
  Globe, 
  Brain, 
  Shield, 
  Cloud, 
  Infinity as InfinityIcon, 
  BarChart,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Terminal,
  Briefcase,
  TrendingUp,
  Code2,
  Wrench,
  Lightbulb,
  Award,
  ExternalLink,
  Compass,
  Bell,
  UserCircle,
  Users,
  Map as MapIcon,
  ShieldCheck,
  Search,
  FileText,
  Menu,
  X,
  Github,
  Linkedin,
  Mail,
  Settings,
  LogOut,
  Target,
  Star,
  Play,
  Lock,
  Plus
} from 'lucide-react';
import { Domain, domains } from '@/lib/domains';
import DomainDetail from './DomainDetail';
import { useState, useRef, useEffect, Component, ReactNode } from 'react';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  onSnapshot, 
  query, 
  orderBy,
  handleFirestoreError,
  OperationType,
  User
} from '@/lib/firebase';

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <X size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-slate-500 mb-6">
              {this.state.error?.message ? 
                (this.state.error.message.startsWith('{') ? 'A database error occurred. Please try again later.' : this.state.error.message) 
                : 'An unexpected error occurred.'}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-[#1e3b8a] text-white font-bold rounded-xl hover:bg-[#1e3b8a]/90 transition-all"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const IconMap: Record<string, any> = {
  Globe,
  Brain,
  Shield,
  Cloud,
  Infinity: InfinityIcon,
  BarChart
};

export default function PathFinderApp() {
  return (
    <ErrorBoundary>
      <PathFinderContent />
    </ErrorBoundary>
  );
}

function PathFinderContent() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'profile'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [skillMatches, setSkillMatches] = useState<{ skill: string, domain: Domain }[]>([]);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const headerSearchRef = useRef<HTMLDivElement>(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      if (!currentUser) {
        setUserProfile(null);
        setMilestones([]);
        setProjects([]);
        setNotes([]);
        setBadges([]);
        setActivities([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Data Listeners
  useEffect(() => {
    if (!user || !isAuthReady) return;

    const userDocRef = doc(db, 'users', user.uid);
    const unsubProfile = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserProfile(docSnap.data());
      } else {
        // Initialize profile if it doesn't exist
        const initialProfile = {
          uid: user.uid,
          displayName: user.displayName || 'New User',
          photoURL: user.photoURL || '',
          year: '1st Year',
          focus: 'Exploring',
          joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          careerGoal: 'Software Engineer',
          targetDate: '2026',
          currentPath: 'General Tech',
          progress: 0
        };
        setDoc(userDocRef, initialProfile).catch(e => handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}`));
      }
    }, (e) => handleFirestoreError(e, OperationType.GET, `users/${user.uid}`));

    const milestonesRef = collection(db, 'users', user.uid, 'milestones');
    const unsubMilestones = onSnapshot(query(milestonesRef, orderBy('order', 'asc')), (snap) => {
      setMilestones(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (e) => handleFirestoreError(e, OperationType.GET, `users/${user.uid}/milestones`));

    const projectsRef = collection(db, 'users', user.uid, 'projects');
    const unsubProjects = onSnapshot(projectsRef, (snap) => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (e) => handleFirestoreError(e, OperationType.GET, `users/${user.uid}/projects`));

    const notesRef = collection(db, 'users', user.uid, 'notes');
    const unsubNotes = onSnapshot(notesRef, (snap) => {
      setNotes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (e) => handleFirestoreError(e, OperationType.GET, `users/${user.uid}/notes`));

    const badgesRef = collection(db, 'users', user.uid, 'badges');
    const unsubBadges = onSnapshot(badgesRef, (snap) => {
      setBadges(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (e) => handleFirestoreError(e, OperationType.GET, `users/${user.uid}/badges`));

    const activitiesRef = collection(db, 'users', user.uid, 'activities');
    const unsubActivities = onSnapshot(query(activitiesRef, orderBy('timestamp', 'desc')), (snap) => {
      setActivities(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (e) => handleFirestoreError(e, OperationType.GET, `users/${user.uid}/activities`));

    return () => {
      unsubProfile();
      unsubMilestones();
      unsubProjects();
      unsubNotes();
      unsubBadges();
      unsubActivities();
    };
  }, [user, isAuthReady]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentView('home');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const filteredDomains = domains.filter(domain => {
    const searchLower = searchQuery.toLowerCase();
    const titleMatch = domain.title.toLowerCase().includes(searchLower);
    const descMatch = domain.description.toLowerCase().includes(searchLower);
    const skillMatch = domain.topSkills.some(skill => skill.toLowerCase().includes(searchLower));
    const keywordMatch = domain.keywords?.some(keyword => 
      keyword.toLowerCase().includes(searchLower) || searchLower.includes(keyword.toLowerCase())
    );
    
    return titleMatch || descMatch || skillMatch || keywordMatch;
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node) &&
          headerSearchRef.current && !headerSearchRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedIndex(-1);
    if (query.trim().length > 1) {
      const results: any[] = [];
      const matches: { skill: string, domain: Domain }[] = [];
      const searchLower = query.toLowerCase();

      domains.forEach(domain => {
        // Match domain title or keywords
        const titleMatch = domain.title.toLowerCase().includes(searchLower);
        const keywordMatch = domain.keywords?.some(keyword => 
          keyword.toLowerCase().includes(searchLower) || searchLower.includes(keyword.toLowerCase())
        );

        if (titleMatch || keywordMatch) {
          results.push({ type: 'domain', title: domain.title, domain });
        }

        // Match all skill categories
        const allSkills = [
          ...domain.topSkills,
          ...domain.technicalSkills,
          ...domain.languages,
          ...domain.tools
        ];

        const uniqueSkills = Array.from(new Set(allSkills));

        uniqueSkills.forEach(skill => {
          if (skill.toLowerCase().includes(searchLower)) {
            results.push({ type: 'skill', title: skill, domain });
            matches.push({ skill, domain });
          }
        });
      });

      const uniqueResultsMap = new Map<string, any>();
      results.forEach(item => {
        uniqueResultsMap.set(item.title + item.type + item.domain.id, item);
      });
      
      setSuggestions(Array.from(uniqueResultsMap.values()).slice(0, 8));
      
      // Filter unique skill matches for the prominent display
      const uniqueMatchesMap = new Map<string, any>();
      matches.forEach(m => uniqueMatchesMap.set(m.skill + m.domain.id, m));
      setSkillMatches(Array.from(uniqueMatchesMap.values()).slice(0, 4));
    } else {
      setSuggestions([]);
      setSkillMatches([]);
    }
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  if (currentView === 'profile' && user) {
    return (
      <ProfileView 
        user={user}
        profile={userProfile}
        milestones={milestones}
        projects={projects}
        notes={notes}
        badges={badges}
        activities={activities}
        onBack={() => setCurrentView('home')}
        onLogout={handleLogout}
      />
    );
  }

  if (selectedDomain) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="domain-detail"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <DomainDetail 
            domain={selectedDomain} 
            onBack={() => setSelectedDomain(null)} 
            onOpenResume={() => setShowResumeModal(true)}
          />
          {showResumeModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0a1628]/80 backdrop-blur-md">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-card rounded-2xl p-8 max-w-md w-full shadow-2xl text-center border border-white/10"
              >
                <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FileText size={32} />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-2">Resume Builder</h3>
                <p className="text-slate-400 mb-8">
                  Our AI-powered Resume Builder is currently under development. Soon you&apos;ll be able to generate professional resumes tailored to your chosen roadmap!
                </p>
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowResumeModal(false)}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl hover:opacity-90 transition-all"
                >
                  Got it, thanks!
                </motion.button>
              </motion.div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

  const headingWords = "Navigate Your Tech Career with Confidence".split(" ");

  return (
    <div className="min-h-screen bg-[#0a1628] text-white scroll-smooth selection:bg-cyan-500/30">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 transform origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0a1628]/80 backdrop-blur-xl border-b border-white/10 py-3' : 'bg-transparent py-5'} px-6 md:px-10`}>
        <div className="max-w-[1200px] mx-auto flex items-center justify-between whitespace-nowrap">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setCurrentView('home')}>
            <div className="size-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
              <Compass size={24} className="group-hover:rotate-45 transition-transform duration-500" />
            </div>
            <h2 className="text-white text-xl font-display font-bold tracking-tight">Career Compass</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8 items-center">
            <div className="hidden lg:flex items-center flex-1 max-w-md relative group" ref={headerSearchRef}>
              <Search className="absolute left-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
                  } else if (e.key === 'ArrowUp') {
                    setSelectedIndex(prev => Math.max(prev - 1, -1));
                  } else if (e.key === 'Enter' && selectedIndex >= 0) {
                    const item = suggestions[selectedIndex];
                    setSelectedDomain(item.domain);
                    setSearchQuery('');
                    setSuggestions([]);
                    setSkillMatches([]);
                  }
                }}
                placeholder="Search domains or skills..." 
                className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:bg-white/10 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all"
              />
              {suggestions.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl shadow-2xl z-50 overflow-hidden border border-white/10"
                >
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedDomain(item.domain);
                        setSearchQuery('');
                        setSuggestions([]);
                        setSkillMatches([]);
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full px-4 py-3 text-left flex items-center justify-between group transition-colors border-b border-white/5 last:border-0 ${selectedIndex === idx ? 'bg-white/10' : 'hover:bg-white/5'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.type === 'domain' ? 'bg-blue-500/20 text-blue-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                          {item.type === 'domain' ? <Compass size={16} /> : <CheckCircle2 size={16} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{item.title}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                            {item.type === 'domain' ? 'Career Domain' : `Found in ${item.domain.title}`}
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
            <nav className="hidden md:flex items-center gap-8">
              {['Home', 'Domains', 'About', 'Contact'].map((item) => (
                <a 
                  key={item}
                  href={item === 'Home' ? '#' : `#${item.toLowerCase()}`}
                  onClick={(e) => {
                    if (item === 'Home') {
                      e.preventDefault();
                      setCurrentView('home');
                      window.scrollTo(0, 0);
                    }
                  }}
                  className="text-slate-300 text-sm font-medium hover:text-white transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
              {user ? (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView('profile')}
                  className="flex items-center gap-2 text-white text-sm font-medium bg-white/10 px-4 py-2 rounded-full border border-white/10 hover:bg-white/20 transition-all"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle size={24} />
                    )}
                  </div>
                  <span>Profile</span>
                </motion.button>
              ) : (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogin}
                  className="relative group overflow-hidden bg-blue-600/20 text-blue-400 px-6 py-2 rounded-full text-sm font-bold border border-blue-500/30 hover:bg-blue-600/30 hover:text-white transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)]"
                >
                  <span className="relative z-10">Sign In</span>
                  <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer z-0"></div>
                </motion.button>
              )}
            </nav>
            
            <button 
              className="md:hidden p-2 text-slate-300 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-full left-0 right-0 glass-card border-b border-white/10 flex flex-col md:hidden shadow-2xl z-40 overflow-hidden"
            >
              <div className="p-6 flex flex-col gap-4">
                <a className="text-white text-lg font-medium" href="#" onClick={() => { setIsMenuOpen(false); setCurrentView('home'); }}>Home</a>
                <a className="text-slate-300 hover:text-white text-lg font-medium" href="#domains" onClick={() => setIsMenuOpen(false)}>Domains</a>
                <a className="text-slate-300 hover:text-white text-lg font-medium" href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
                <a className="text-slate-300 hover:text-white text-lg font-medium" href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
                {user ? (
                  <>
                    <button 
                      onClick={() => { setIsMenuOpen(false); setCurrentView('profile'); }}
                      className="text-cyan-400 text-lg font-medium text-left"
                    >
                      My Profile
                    </button>
                    <button 
                      onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                      className="text-red-400 text-lg font-medium text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => { setIsMenuOpen(false); handleLogin(); }}
                    className="text-blue-400 text-lg font-medium text-left"
                  >
                    Sign In
                  </button>
                )}
                <div className="pt-4 border-t border-white/10">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search..." 
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 pt-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-8">
          {/* Hero Section */}
          <section className="mb-24 relative">
            {/* Animated Background Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-float-1"></div>
              <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-[120px] animate-float-2"></div>
              <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-violet-600/20 rounded-full blur-[120px] animate-float-3"></div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 items-center min-h-[70vh]">
              <div className="flex flex-col gap-8 lg:w-3/5 z-10">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider w-fit shadow-[0_0_15px_rgba(59,130,246,0.15)] animate-pulse-glow"
                >
                  <Star size={14} className="text-blue-400" />
                  Expert Career Guidance
                </motion.div>
                
                <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.1] tracking-tight">
                  {headingWords.map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }}
                      className="inline-block mr-3"
                    >
                      {word === 'Tech' || word === 'Career' ? (
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{word}</span>
                      ) : word}
                    </motion.span>
                  ))}
                </h1>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed"
                >
                  Professional roadmaps and career guidance for computer science students. Master the most in-demand domains with curated paths.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="relative max-w-xl group" 
                  ref={searchRef}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
                  <div className="relative flex items-center bg-[#0a1628] border border-white/10 rounded-2xl p-2 shadow-2xl">
                    <Search className="absolute left-6 text-slate-400 group-focus-within:text-cyan-400 transition-colors" size={24} />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowDown') {
                          setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
                        } else if (e.key === 'ArrowUp') {
                          setSelectedIndex(prev => Math.max(prev - 1, -1));
                        } else if (e.key === 'Enter' && selectedIndex >= 0) {
                          const item = suggestions[selectedIndex];
                          setSelectedDomain(item.domain);
                          setSearchQuery('');
                          setSuggestions([]);
                        }
                      }}
                      placeholder="What do you want to learn today?" 
                      className="w-full pl-14 pr-4 py-4 bg-transparent border-none text-white placeholder:text-slate-500 focus:outline-none text-lg"
                    />
                    <button className="hidden sm:flex items-center justify-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors border border-white/5">
                      Search
                    </button>
                  </div>
                  
                  <AnimatePresence>
                    {suggestions.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        className="absolute top-full left-0 right-0 mt-4 glass-card rounded-2xl shadow-2xl z-50 overflow-hidden border border-white/10"
                      >
                        {suggestions.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedDomain(item.domain);
                              setSearchQuery('');
                              setSuggestions([]);
                              setSkillMatches([]);
                            }}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={`w-full px-6 py-4 text-left flex items-center justify-between group transition-colors border-b border-white/5 last:border-0 ${selectedIndex === idx ? 'bg-white/10' : 'hover:bg-white/5'}`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.type === 'domain' ? 'bg-blue-500/20 text-blue-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                                {item.type === 'domain' ? <Compass size={20} /> : <CheckCircle2 size={20} />}
                              </div>
                              <div>
                                <p className="text-base font-bold text-white">{item.title}</p>
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mt-1">
                                  {item.type === 'domain' ? 'Career Domain' : `Found in ${item.domain.title}`}
                                </p>
                              </div>
                            </div>
                            <ChevronRight size={20} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="flex flex-wrap gap-4"
                >
                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="#domains" 
                    className="flex items-center justify-center rounded-xl h-14 px-8 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                  >
                    Start My Journey
                  </motion.a>
                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="#domains" 
                    className="flex items-center justify-center rounded-xl h-14 px-8 bg-white/5 text-white font-bold border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    View Roadmaps
                  </motion.a>
                </motion.div>
              </div>
              
              <div className="hidden lg:flex lg:w-2/5 justify-center relative">
                {/* Animated Code Terminal / 3D Grid representation */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 0.5, duration: 1, type: "spring" }}
                  className="w-full aspect-square max-w-md relative perspective-1000"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-cyan-400/20 rounded-3xl transform rotate-3 blur-xl"></div>
                  <div className="w-full h-full glass-card rounded-3xl border border-white/20 p-6 flex flex-col shadow-2xl relative z-10 overflow-hidden">
                    <div className="flex gap-2 mb-6">
                      <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="flex-1 font-mono text-sm text-slate-300 space-y-2">
                      <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }}><span className="text-cyan-400">const</span> <span className="text-blue-300">career</span> = <span className="text-yellow-300">new</span> <span className="text-emerald-400">Journey</span>();</motion.p>
                      <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.8 }}><span className="text-blue-300">career</span>.<span className="text-yellow-200">setGoal</span>(<span className="text-orange-300">'Software Engineer'</span>);</motion.p>
                      <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.1 }}><span className="text-cyan-400">await</span> <span className="text-blue-300">career</span>.<span className="text-yellow-200">learn</span>([</motion.p>
                      <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.4 }} className="pl-4"><span className="text-orange-300">'React'</span>,</motion.p>
                      <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.5 }} className="pl-4"><span className="text-orange-300">'Node.js'</span>,</motion.p>
                      <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.6 }} className="pl-4"><span className="text-orange-300">'System Design'</span></motion.p>
                      <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.7 }}>]);</motion.p>
                      <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 3.0 }}><span className="text-blue-300">console</span>.<span className="text-yellow-200">log</span>(<span className="text-orange-300">'Ready for impact 🚀'</span>);</motion.p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a1628]/80 to-transparent"></div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Skill Matches Section */}
          {searchQuery && skillMatches.length > 0 && (
            <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-1 bg-emerald-500 rounded-full"></div>
                <h3 className="text-slate-900 text-xl font-bold">Skill Matches</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {skillMatches.map((match, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedDomain(match.domain);
                      setSearchQuery('');
                      setSkillMatches([]);
                    }}
                    className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex items-center gap-4"
                  >
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-bold text-sm">{match.skill}</h4>
                      <p className="text-slate-500 text-[10px] uppercase tracking-wider font-bold">In {match.domain.title}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Domain Grid */}
          <section id="domains" className="mb-24 scroll-mt-24">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-slate-900 text-3xl font-bold leading-tight tracking-[-0.015em]">Explore Career Domains</h2>
                <p className="text-slate-500 text-sm mt-1">
                  {searchQuery ? `Found ${filteredDomains.length} results for "${searchQuery}"` : 'Choose a path to view detailed roadmaps and skills'}
                </p>
              </div>
              {searchQuery && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSkillMatches([]);
                  }}
                  className="text-sm font-bold text-[#1e3b8a] hover:underline"
                >
                  Clear Search
                </button>
              )}
            </div>
            
            {filteredDomains.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDomains.map((domain, index) => (
                  <motion.div
                    key={domain.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedDomain(domain)}
                    className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-[#1e3b8a]/50 transition-all cursor-pointer"
                  >
                    <div 
                      className="aspect-[16/9] bg-cover bg-center transition-transform duration-500 group-hover:scale-110" 
                      style={{ backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%), url("${domain.image}")` }}
                    ></div>
                    <div className="absolute bottom-0 left-0 p-5 w-full">
                      <h3 className="text-white text-xl font-bold mb-1">{domain.title}</h3>
                      <p className="text-slate-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity line-clamp-1">
                        {domain.technicalSkills.slice(0, 3).join(', ')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Search size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No results found</h3>
                <p className="text-slate-500 max-w-xs mx-auto">
                  We couldn&apos;t find any domains or skills matching &quot;{searchQuery}&quot;. Try a different keyword.
                </p>
              </div>
            )}
          </section>

          {/* About Section */}
          <section id="about" className="mb-24 scroll-mt-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2 text-[#1e3b8a]">
                  <div className="w-8 h-1 bg-[#1e3b8a] rounded-full"></div>
                  <span className="font-bold text-sm uppercase tracking-wider">About the Platform</span>
                </div>
                <h2 className="text-slate-900 text-4xl font-black leading-tight">
                  Empowering the Next Generation of Tech Leaders
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  CSE Career Compass is a comprehensive guidance platform designed specifically for Computer Science students. We bridge the gap between academic learning and industry requirements by providing expert-curated roadmaps.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <h4 className="text-[#1e3b8a] text-3xl font-black">6+</h4>
                    <p className="text-slate-500 text-sm font-medium">Specialized Domains</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="text-[#1e3b8a] text-3xl font-black">Expert</h4>
                    <p className="text-slate-500 text-sm font-medium">Curated Roadmaps</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-[#1e3b8a] rounded-xl flex items-center justify-center">
                    <TrendingUp size={24} />
                  </div>
                  <h4 className="font-bold text-slate-900">Industry Insights</h4>
                  <p className="text-slate-500 text-sm">Stay updated with the latest trends and market demands in real-time.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 mt-0 sm:mt-8">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <ShieldCheck size={24} />
                  </div>
                  <h4 className="font-bold text-slate-900">Verified Skills</h4>
                  <p className="text-slate-500 text-sm">Focus on the skills that actually matter to top-tier tech companies.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="mb-24 scroll-mt-24">
            <div className="bg-gradient-to-br from-[#1e3b8a] to-[#3b82f6] rounded-3xl p-8 md:p-16 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              </div>
              <div className="relative z-10 max-w-2xl mx-auto flex flex-col gap-8">
                <h2 className="text-3xl md:text-5xl font-black leading-tight">
                  Ready to Accelerate Your Career?
                </h2>
                <p className="text-indigo-100 text-lg opacity-90">
                  Have questions or need personalized guidance? Our team is here to help you navigate your professional journey.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a 
                    href="mailto:contact@csecareercompass.com" 
                    className="bg-white text-[#1e3b8a] px-8 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-xl"
                  >
                    <Mail size={20} />
                    Get in Touch
                  </a>
                  <div className="flex gap-2">
                    <a href="#" className="w-14 h-14 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all">
                      <Github size={24} />
                    </a>
                    <a href="#" className="w-14 h-14 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all">
                      <Linkedin size={24} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section>
            <div className="flex flex-wrap gap-4">
              <div className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 text-[#1e3b8a] mb-1">
                  <Users size={20} />
                  <p className="text-slate-500 text-sm font-medium leading-normal">Active Students</p>
                </div>
                <p className="text-slate-900 tracking-tight text-3xl font-black leading-tight">100+</p>
              </div>
              <div className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 text-[#1e3b8a] mb-1">
                  <MapIcon size={20} />
                  <p className="text-slate-500 text-sm font-medium leading-normal">Roadmaps Available</p>
                </div>
                <p className="text-slate-900 tracking-tight text-3xl font-black leading-tight">6</p>
              </div>
              <div className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 text-[#1e3b8a] mb-1">
                  <ShieldCheck size={20} />
                  <p className="text-slate-500 text-sm font-medium leading-normal">Career Paths</p>
                </div>
                <p className="text-slate-900 tracking-tight text-3xl font-black leading-tight">Verified</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-[1200px] mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 text-[#1e3b8a]">
                <Compass size={24} />
                <span className="font-bold text-xl">CSE Career Compass</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Empowering Computer Science students with professional roadmaps and career guidance to navigate the tech industry with confidence.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-slate-400 hover:text-[#1e3b8a] transition-colors"><Github size={20} /></a>
                <a href="#" className="text-slate-400 hover:text-[#1e3b8a] transition-colors"><Linkedin size={20} /></a>
              </div>
            </div>
            
            <div className="flex flex-col gap-6">
              <h4 className="font-bold text-slate-900">Quick Links</h4>
              <nav className="flex flex-col gap-3">
                <a href="#" className="text-slate-500 text-sm hover:text-[#1e3b8a] transition-colors">Home</a>
                <a href="#domains" className="text-slate-500 text-sm hover:text-[#1e3b8a] transition-colors">Domains</a>
                <a href="#about" className="text-slate-500 text-sm hover:text-[#1e3b8a] transition-colors">About Us</a>
                <a href="#contact" className="text-slate-500 text-sm hover:text-[#1e3b8a] transition-colors">Contact</a>
              </nav>
            </div>

            <div className="flex flex-col gap-6">
              <h4 className="font-bold text-slate-900">Top Domains</h4>
              <nav className="flex flex-col gap-3">
                {domains.slice(0, 4).map(d => (
                  <button 
                    key={d.id} 
                    onClick={() => setSelectedDomain(d)}
                    className="text-slate-500 text-sm hover:text-[#1e3b8a] transition-colors text-left"
                  >
                    {d.title}
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-6">
              <h4 className="font-bold text-slate-900">Newsletter</h4>
              <p className="text-slate-500 text-sm">Get the latest career tips and roadmap updates.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="flex-1 px-4 py-2 bg-slate-100 border-none rounded-lg text-sm outline-none"
                />
                <button className="bg-[#1e3b8a] text-white px-4 py-2 rounded-lg text-sm font-bold">Join</button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-xs text-center md:text-left">© 2024 CSE Career Compass. All rights reserved.</p>
            <div className="flex gap-6 text-slate-400 text-xs">
              <a className="hover:text-[#1e3b8a]" href="#">Privacy Policy</a>
              <a className="hover:text-[#1e3b8a]" href="#">Terms of Service</a>
              <a className="hover:text-[#1e3b8a]" href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProfileView({ 
  user, 
  profile, 
  milestones, 
  projects, 
  notes, 
  badges, 
  activities, 
  onBack, 
  onLogout 
}: { 
  user: User; 
  profile: any; 
  milestones: any[]; 
  projects: any[]; 
  notes: any[]; 
  badges: any[]; 
  activities: any[]; 
  onBack: () => void; 
  onLogout: () => void; 
}) {
  return (
    <div className="min-h-screen bg-[#f6f6f8] text-slate-900 font-sans">
      <header className="flex items-center justify-between border-b border-[#1e3b8a]/10 bg-white px-6 py-3 md:px-20 lg:px-40 sticky top-0 z-50">
        <div className="flex items-center gap-4 text-[#1e3b8a]">
          <button onClick={onBack} className="size-8 flex items-center justify-center bg-[#1e3b8a]/10 rounded-lg hover:bg-[#1e3b8a]/20 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-tight">CSE Career Compass</h2>
        </div>
        <div className="flex flex-1 justify-end gap-4">
          <div className="flex gap-2">
            <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-[#1e3b8a]/5 hover:bg-[#1e3b8a]/10 text-slate-700">
              <Settings size={20} />
            </button>
            <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-[#1e3b8a]/5 hover:bg-[#1e3b8a]/10 text-slate-700">
              <Bell size={20} />
            </button>
            <button 
              onClick={onLogout}
              className="flex items-center justify-center rounded-lg h-10 w-10 bg-red-50 hover:bg-red-100 text-red-600"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
          <div className="aspect-square rounded-full size-10 border-2 border-[#1e3b8a]/20 overflow-hidden">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-[#1e3b8a]">
                <UserCircle size={24} />
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row px-6 md:px-20 lg:px-40 py-8 gap-8">
        <aside className="flex flex-col gap-4 w-full md:w-64 shrink-0">
          <div className="flex flex-col gap-2">
            <button onClick={onBack} className="flex items-center gap-3 px-3 py-2 hover:bg-[#1e3b8a]/5 rounded-lg cursor-pointer text-left">
              <BarChart size={18} className="text-slate-600" />
              <p className="text-sm font-medium">Dashboard</p>
            </button>
            <button onClick={onBack} className="flex items-center gap-3 px-3 py-2 hover:bg-[#1e3b8a]/5 rounded-lg cursor-pointer text-left">
              <MapIcon size={18} className="text-slate-600" />
              <p className="text-sm font-medium">Roadmap</p>
            </button>
            <button onClick={onBack} className="flex items-center gap-3 px-3 py-2 hover:bg-[#1e3b8a]/5 rounded-lg cursor-pointer text-left">
              <FileText size={18} className="text-slate-600" />
              <p className="text-sm font-medium">Resources</p>
            </button>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#1e3b8a] text-white">
              <UserCircle size={18} />
              <p className="text-sm font-medium">Profile</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col gap-8">
          <section className="bg-white p-6 rounded-xl border border-[#1e3b8a]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
            <div className="flex gap-6 items-center">
              <div className="aspect-square rounded-full size-24 border-4 border-[#1e3b8a]/10 overflow-hidden">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-[#1e3b8a]">
                    <UserCircle size={48} />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-slate-900 text-3xl font-bold leading-tight tracking-tight">{profile?.displayName || user.displayName}</h1>
                <p className="text-slate-500 text-base">Computer Science Student • {profile?.year || '3rd Year'}</p>
                <p className="text-slate-500 text-sm mt-1">Joined {profile?.joinedDate || 'Sept 2023'} • Focused on {profile?.focus || 'Full-Stack Systems'}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="bg-[#1e3b8a] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:opacity-90 transition-opacity">Edit Profile</button>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2 flex flex-col gap-6">
              <div className="bg-white p-6 rounded-xl border border-[#1e3b8a]/10 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Current Learning Path</h2>
                    <p className="text-[#1e3b8a] font-medium text-sm">{profile?.currentPath || 'Web Development Specialist'}</p>
                  </div>
                  <span className="text-[#1e3b8a] text-2xl font-black">{profile?.progress || 65}%</span>
                </div>
                <div className="w-full bg-[#1e3b8a]/10 rounded-full h-3 mb-8">
                  <div className="bg-[#1e3b8a] h-3 rounded-full transition-all duration-500" style={{ width: `${profile?.progress || 65}%` }}></div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Milestones</h3>
                  {milestones.length > 0 ? milestones.map((m, i) => (
                    <div key={m.id || i} className={`flex items-center gap-4 p-3 rounded-lg border ${m.status === 'completed' ? 'bg-[#1e3b8a]/5 border-[#1e3b8a]/10' : 'bg-white border-slate-200'}`}>
                      <div className={`size-8 rounded-full flex items-center justify-center ${m.status === 'completed' ? 'bg-green-500 text-white' : m.status === 'in-progress' ? 'border-2 border-[#1e3b8a] text-[#1e3b8a]' : 'border-2 border-slate-300 text-slate-400'}`}>
                        {m.status === 'completed' ? <CheckCircle2 size={16} /> : m.status === 'in-progress' ? <Play size={16} /> : <Lock size={16} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold">{m.title}</p>
                        <p className="text-xs text-slate-500">{m.status === 'completed' ? `Completed on ${m.date}` : m.status === 'in-progress' ? m.date : 'Upcoming Milestone'}</p>
                      </div>
                    </div>
                  )) : (
                    <>
                      <div className="flex items-center gap-4 p-3 bg-[#1e3b8a]/5 rounded-lg border border-[#1e3b8a]/10">
                        <div className="size-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                          <CheckCircle2 size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold">Advanced CSS Layouts & Flexbox</p>
                          <p className="text-xs text-slate-500">Completed on Jan 15, 2024</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-3 bg-[#1e3b8a]/5 rounded-lg border border-[#1e3b8a]/10">
                        <div className="size-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                          <CheckCircle2 size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold">JavaScript ES6+ Deep Dive</p>
                          <p className="text-xs text-slate-500">Completed on Feb 2, 2024</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-slate-200">
                        <div className="size-8 rounded-full border-2 border-[#1e3b8a] text-[#1e3b8a] flex items-center justify-center">
                          <Play size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold">React.js Fundamental Architecture</p>
                          <p className="text-xs text-slate-500">In Progress • 4 of 12 lessons finished</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-[#1e3b8a]/10 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb size={20} className="text-[#1e3b8a]" />
                    <h3 className="font-bold">Project Ideas</h3>
                  </div>
                  <ul className="space-y-3">
                    {projects.length > 0 ? projects.map((p, i) => (
                      <li key={p.id || i} className="p-3 bg-slate-50 rounded text-sm border-l-4 border-[#1e3b8a]">
                        <p className="font-semibold">{p.title}</p>
                        <p className="text-slate-500 text-xs">{p.description}</p>
                      </li>
                    )) : (
                      <>
                        <li className="p-3 bg-slate-50 rounded text-sm border-l-4 border-[#1e3b8a]">
                          <p className="font-semibold">AI Study Planner</p>
                          <p className="text-slate-500 text-xs">Using OpenAI API and React</p>
                        </li>
                        <li className="p-3 bg-slate-50 rounded text-sm border-l-4 border-[#1e3b8a]/40">
                          <p className="font-semibold">Portfolio Site v2.0</p>
                          <p className="text-slate-500 text-xs">Framer Motion + Tailwind CSS</p>
                        </li>
                      </>
                    )}
                    <button className="w-full py-2 border-2 border-dashed border-slate-200 rounded text-slate-400 text-xs font-medium hover:border-[#1e3b8a]/50 hover:text-[#1e3b8a] transition-all flex items-center justify-center gap-2">
                      <Plus size={14} /> Add New Idea
                    </button>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-xl border border-[#1e3b8a]/10 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText size={20} className="text-[#1e3b8a]" />
                    <h3 className="font-bold">Interview Prep Notes</h3>
                  </div>
                  <ul className="space-y-3">
                    {notes.length > 0 ? notes.map((n, i) => (
                      <li key={n.id || i} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3">
                          <FileText size={16} className="text-slate-400" />
                          <span className="text-sm font-medium">{n.title}</span>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-[#1e3b8a]" />
                      </li>
                    )) : (
                      <>
                        <li className="flex items-center justify-between group cursor-pointer">
                          <div className="flex items-center gap-3">
                            <FileText size={16} className="text-slate-400" />
                            <span className="text-sm font-medium">Big O Notation Cheatsheet</span>
                          </div>
                          <ChevronRight size={16} className="text-slate-300 group-hover:text-[#1e3b8a]" />
                        </li>
                        <li className="flex items-center justify-between group cursor-pointer">
                          <div className="flex items-center gap-3">
                            <FileText size={16} className="text-slate-400" />
                            <span className="text-sm font-medium">System Design Patterns</span>
                          </div>
                          <ChevronRight size={16} className="text-slate-300 group-hover:text-[#1e3b8a]" />
                        </li>
                      </>
                    )}
                    <button className="w-full mt-2 text-[#1e3b8a] text-xs font-bold text-left hover:underline">View All Notes</button>
                  </ul>
                </div>
              </div>
            </section>

            <aside className="flex flex-col gap-6">
              <div className="bg-[#1e3b8a] text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-1">Career Goal</h3>
                  <p className="text-indigo-100 text-sm mb-4 opacity-90">{profile?.careerGoal || 'Full-Stack Engineer at a Tier-1 Tech Company'}</p>
                  <div className="flex flex-col gap-3">
                    <div className="bg-white/10 p-3 rounded-lg flex items-center gap-3">
                      <Target size={20} />
                      <div className="text-xs">
                        <p className="font-bold">Target Date</p>
                        <p className="opacity-80">{profile?.targetDate || 'June 2025'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <Star size={120} />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-[#1e3b8a]/10 shadow-sm">
                <h3 className="font-bold mb-4">Badges Earned</h3>
                <div className="grid grid-cols-3 gap-4">
                  {badges.length > 0 ? badges.map((b, i) => (
                    <div key={b.id || i} className="flex flex-col items-center gap-1">
                      <div className={`size-12 rounded-full flex items-center justify-center border-2 ${b.earned ? 'bg-amber-100 text-amber-600 border-amber-200' : 'bg-slate-100 text-slate-300 border-slate-200 border-dashed'}`}>
                        {b.earned ? <Award size={24} /> : <Lock size={24} />}
                      </div>
                      <p className={`text-[10px] text-center font-bold ${b.earned ? 'text-slate-900' : 'text-slate-400'}`}>{b.title}</p>
                    </div>
                  )) : (
                    <>
                      <div className="flex flex-col items-center gap-1">
                        <div className="size-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 border-2 border-amber-200">
                          <Award size={24} />
                        </div>
                        <p className="text-[10px] text-center font-bold">Fast Learner</p>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border-2 border-blue-200">
                          <Code2 size={24} />
                        </div>
                        <p className="text-[10px] text-center font-bold">CSS Master</p>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 border-2 border-slate-200 border-dashed">
                          <Lock size={24} />
                        </div>
                        <p className="text-[10px] text-center font-bold text-slate-400">Locked</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-[#1e3b8a]/10 shadow-sm">
                <h3 className="font-bold mb-4">Activity</h3>
                <div className="space-y-4">
                  {activities.length > 0 ? activities.map((a, i) => (
                    <div key={a.id || i} className="flex gap-3 relative">
                      <div className="w-2 h-2 rounded-full bg-[#1e3b8a] mt-1.5 shrink-0"></div>
                      <div className={`pb-4 pl-4 -ml-[1.25rem] ${i < activities.length - 1 ? 'border-l border-slate-200' : ''}`}>
                        <p className="text-xs font-bold">{a.description}</p>
                        <p className="text-[10px] text-slate-400">{a.timestamp}</p>
                      </div>
                    </div>
                  )) : (
                    <>
                      <div className="flex gap-3 relative">
                        <div className="w-2 h-2 rounded-full bg-[#1e3b8a] mt-1.5 shrink-0"></div>
                        <div className="pb-4 border-l border-slate-200 pl-4 -ml-[1.25rem]">
                          <p className="text-xs font-bold">Solved &quot;Merge Two Sorted Lists&quot;</p>
                          <p className="text-[10px] text-slate-400">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex gap-3 relative">
                        <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5 shrink-0"></div>
                        <div className="pb-4 border-l border-slate-200 pl-4 -ml-[1.25rem]">
                          <p className="text-xs font-bold">Updated Interview Prep Notes</p>
                          <p className="text-[10px] text-slate-400">Yesterday</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
      <footer className="mt-auto px-6 md:px-20 lg:px-40 py-8 border-t border-[#1e3b8a]/10 text-center">
        <p className="text-slate-400 text-sm">© 2024 CSE Career Compass • Empowering future engineers</p>
      </footer>
    </div>
  );
}



