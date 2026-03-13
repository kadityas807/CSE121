'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Search, UserCircle, Menu, X, CheckCircle2, ChevronRight } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { auth, signOut } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Domain, domains } from '@/lib/domains';

export default function NavBar() {
  const { user } = useAuth();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const headerSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerSearchRef.current && !headerSearchRef.current.contains(event.target as Node)) {
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
      const searchLower = query.toLowerCase();

      domains.forEach(domain => {
        const titleMatch = domain.title.toLowerCase().includes(searchLower);
        const keywordMatch = domain.keywords?.some(keyword => 
          keyword.toLowerCase().includes(searchLower) || searchLower.includes(keyword.toLowerCase())
        );

        if (titleMatch || keywordMatch) {
          results.push({ type: 'domain', title: domain.title, domain });
        }

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
          }
        });
      });

      const uniqueResultsMap = new Map<string, any>();
      results.forEach(item => {
        uniqueResultsMap.set(item.title + item.type + item.domain.id, item);
      });
      
      setSuggestions(Array.from(uniqueResultsMap.values()).slice(0, 8));
    } else {
      setSuggestions([]);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0a1628]/80 backdrop-blur-xl border-b border-white/10 py-3' : 'bg-transparent py-5'} px-6 md:px-10`}>
      <div className="max-w-[1200px] mx-auto flex items-center justify-between whitespace-nowrap">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push('/')}>
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
                  router.push(`/roadmap/${item.domain.id}`);
                  setSearchQuery('');
                  setSuggestions([]);
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
                      router.push(`/roadmap/${item.domain.id}`);
                      setSearchQuery('');
                      setSuggestions([]);
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
                href={item === 'Home' ? '/' : `/#${item.toLowerCase()}`}
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
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 text-white text-sm font-medium bg-white/10 px-4 py-2 rounded-full border border-white/10 hover:bg-white/20 transition-all"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle size={24} />
                  )}
                </div>
                <span>Dashboard</span>
              </motion.button>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/login')}
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
              <a className="text-white text-lg font-medium" href="/" onClick={() => setIsMenuOpen(false)}>Home</a>
              <a className="text-slate-300 hover:text-white text-lg font-medium" href="/#domains" onClick={() => setIsMenuOpen(false)}>Domains</a>
              <a className="text-slate-300 hover:text-white text-lg font-medium" href="/#about" onClick={() => setIsMenuOpen(false)}>About</a>
              <a className="text-slate-300 hover:text-white text-lg font-medium" href="/#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
              {user ? (
                <>
                  <button 
                    onClick={() => { setIsMenuOpen(false); router.push('/dashboard'); }}
                    className="text-cyan-400 text-lg font-medium text-left"
                  >
                    Dashboard
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
                  onClick={() => { setIsMenuOpen(false); router.push('/login'); }}
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
  );
}
