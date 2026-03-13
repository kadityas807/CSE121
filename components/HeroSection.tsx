'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Star, Compass, CheckCircle2, ChevronRight } from 'lucide-react';
import { Domain, domains } from '@/lib/domains';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [skillMatches, setSkillMatches] = useState<{ skill: string, domain: Domain }[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
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
            matches.push({ skill, domain });
          }
        });
      });

      const uniqueResultsMap = new Map<string, any>();
      results.forEach(item => {
        uniqueResultsMap.set(item.title + item.type + item.domain.id, item);
      });
      
      setSuggestions(Array.from(uniqueResultsMap.values()).slice(0, 8));
      
      const uniqueMatchesMap = new Map<string, any>();
      matches.forEach(m => uniqueMatchesMap.set(m.skill + m.domain.id, m));
      setSkillMatches(Array.from(uniqueMatchesMap.values()).slice(0, 4));
    } else {
      setSuggestions([]);
      setSkillMatches([]);
    }
  };

  const headingWords = "Navigate Your Tech Career with Confidence".split(" ");

  return (
    <>
      <section className="mb-24 relative">
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
                      router.push(`/roadmap/${item.domain.id}`);
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
                          router.push(`/roadmap/${item.domain.id}`);
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
                  router.push(`/roadmap/${match.domain.id}`);
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
    </>
  );
}
