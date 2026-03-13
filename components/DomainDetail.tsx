import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Code2, Briefcase, TrendingUp, Terminal, Wrench, Lightbulb, Award, ExternalLink,
  Globe, Brain, Shield, Cloud, Infinity as InfinityIcon, BarChart, FileText, ChevronRight, CheckCircle2, Circle
} from 'lucide-react';
import { Domain } from '../lib/domains';
import { motion } from 'motion/react';
import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';

const IconMap: Record<string, any> = {
  Globe,
  Brain,
  Shield,
  Cloud,
  Infinity: InfinityIcon,
  BarChart
};

export default function DomainDetail({ 
  domain, 
  onBack, 
  onOpenResume,
  user
}: { 
  domain: Domain; 
  onBack: () => void; 
  onOpenResume: () => void;
  user?: any;
}) {
  const Icon = IconMap[domain.icon] || Code2;
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    const unsub = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.completedRoadmapSteps && data.completedRoadmapSteps[domain.id]) {
          setCompletedSteps(data.completedRoadmapSteps[domain.id]);
        }
      }
    });
    return () => unsub();
  }, [user, domain.id]);

  const awardBadge = async (title: string, icon: string) => {
    if (!user) return;
    try {
      const badgesRef = collection(db, 'users', user.uid, 'badges');
      const q = query(badgesRef, where('title', '==', title));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        await addDoc(badgesRef, {
          title,
          icon,
          earned: true,
          earnedAt: new Date().toISOString()
        });
        
        // Add activity
        await addDoc(collection(db, 'users', user.uid, 'activities'), {
          description: `Earned the "${title}" badge!`,
          timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          type: 'badge'
        });
      }
    } catch (error) {
      console.error("Error awarding badge:", error);
    }
  };

  const toggleStep = async (stepTitle: string) => {
    if (!user) {
      alert("Please sign in to save your progress.");
      return;
    }
    
    const isCompleted = completedSteps.includes(stepTitle);
    const userDocRef = doc(db, 'users', user.uid);
    
    try {
      // We use dot notation to update a nested map field
      const fieldPath = `completedRoadmapSteps.${domain.id}`;
      if (isCompleted) {
        await updateDoc(userDocRef, {
          [fieldPath]: arrayRemove(stepTitle)
        });
      } else {
        await updateDoc(userDocRef, {
          [fieldPath]: arrayUnion(stepTitle)
        });
        
        // Also update overall progress if needed
        const newCompletedCount = completedSteps.length + 1;
        const totalSteps = domain.roadmap.length;
        const newProgress = Math.round((newCompletedCount / totalSteps) * 100);
        
        await updateDoc(userDocRef, {
          progress: newProgress,
          currentPath: domain.title
        });

        // Add activity
        try {
          await addDoc(collection(db, 'users', user.uid, 'activities'), {
            description: `Completed step: "${stepTitle}" in ${domain.title}`,
            timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            type: 'progress'
          });
        } catch (e) {
          console.error("Error adding activity:", e);
        }

        // Badge Logic
        if (newCompletedCount === 1) {
          await awardBadge('First Step', 'Award');
        }
        if (newCompletedCount === Math.floor(totalSteps / 2)) {
          await awardBadge('Halfway There', 'Target');
        }
        if (newCompletedCount === totalSteps) {
          await awardBadge(`${domain.title} Master`, 'Star');
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const progressPercentage = domain.roadmap.length > 0 
    ? Math.round((completedSteps.length / domain.roadmap.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-[#0a1628] text-white font-sans relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Detail Header / Nav */}
      <div className="bg-[#0a1628]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/20 text-cyan-400 border border-blue-500/30 rounded-lg flex items-center justify-center">
                <Icon size={18} />
              </div>
              <h2 className="font-display font-bold text-lg text-white">{domain.title}</h2>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#roadmap" className="hover:text-cyan-400 transition-colors">Roadmap</a>
            <a href="#skills" className="hover:text-cyan-400 transition-colors">Skills</a>
            <a href="#certifications" className="hover:text-cyan-400 transition-colors">Certifications</a>
            <a href="#projects" className="hover:text-cyan-400 transition-colors">Projects</a>
            <a href="#salaries" className="hover:text-cyan-400 transition-colors">Salaries</a>
          </div>
        </div>
      </div>

      <main className="pb-20">
        {/* Hero Section */}
        <section className="relative py-16 px-4 overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-[#0a1628] -z-10"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
             <Icon size={400} className="absolute -right-20 -top-20 rotate-12 text-cyan-400" />
          </div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="max-w-3xl">
              <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-6 border border-cyan-500/20">
                Core Specialization 2024
              </span>
              <h1 className="text-4xl md:text-5xl font-display font-black mb-6 leading-tight text-white">
                {domain.title}
              </h1>
              <p className="text-slate-300 text-lg mb-10 leading-relaxed">
                {domain.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all">
                  Start Learning
                </button>
                <button className="px-8 py-3 bg-white/5 text-white border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all">
                  Download Roadmap
                </button>
                <button 
                  onClick={onOpenResume}
                  className="px-8 py-3 bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-xl font-bold hover:bg-violet-500/30 transition-all flex items-center gap-2"
                >
                  <FileText size={18} />
                  Resume Builder
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 mt-8 relative z-20">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Avg. Salary</p>
              <h4 className="text-2xl font-black text-white">{domain.salary.avg || domain.salary.entry}</h4>
              <p className="text-emerald-400 text-xs font-bold mt-1 flex items-center gap-1">
                <TrendingUp size={12} /> {domain.salary.growth || '+10% YoY'}
              </p>
            </div>
            <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Market Demand</p>
              <h4 className="text-2xl font-black text-white">{domain.marketDemand}</h4>
              <p className="text-slate-400 text-xs mt-1">45k+ active openings</p>
            </div>
            <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Top Skills</p>
              <h4 className="text-2xl font-black text-white">{domain.topSkills[0]}</h4>
              <p className="text-slate-400 text-xs mt-1">{domain.topSkills.slice(1).join(', ')}</p>
            </div>
            <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Duration</p>
              <h4 className="text-2xl font-black text-white">{domain.duration}</h4>
              <p className="text-slate-400 text-xs mt-1">Intensive Training</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Progress Tracker (New) */}
              <section className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">Your Progress</h3>
                  <span className="text-cyan-400 font-bold">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-3 border border-white/10 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full"
                  />
                </div>
              </section>

              {/* Introduction */}
              <section id="intro">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-6 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                  <h3 className="text-xl font-bold text-white">Introduction</h3>
                </div>
                <div className="glass-card p-8 rounded-2xl border border-white/10 shadow-xl">
                  <p className="text-slate-300 leading-relaxed">
                    {domain.intro}
                  </p>
                </div>
              </section>

              {/* Required Skills */}
              <section id="skills">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-6 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                  <h3 className="text-xl font-bold text-white">Required Skills</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {domain.skillLevels.map((skill, idx) => (
                    <div key={idx} className="glass-card p-5 rounded-xl border border-white/10 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-500/20 text-cyan-400 border border-blue-500/30 rounded-lg flex items-center justify-center font-bold text-xs">
                          {skill.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{skill.name}</h4>
                          <div className="w-32 h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" 
                              style={{ width: skill.level === 'Expert' ? '100%' : skill.level === 'Advanced' ? '75%' : skill.level === 'Intermediate' ? '50%' : '25%' }}
                            />
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">{skill.level}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Learning Roadmap */}
              <section id="roadmap">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-6 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                  <h3 className="text-xl font-bold text-white">Interactive Roadmap</h3>
                </div>
                <div className="relative pl-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                  {domain.roadmap.map((step, idx) => {
                    const isCompleted = completedSteps.includes(step.title);
                    return (
                      <div key={idx} className="mb-12 relative group">
                        <button 
                          onClick={() => toggleStep(step.title)}
                          className={`absolute -left-[38px] top-0 w-8 h-8 rounded-full z-10 flex items-center justify-center transition-all ${
                            isCompleted 
                              ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                              : 'bg-[#0a1628] border-2 border-white/20 text-slate-500 hover:border-cyan-400 hover:text-cyan-400'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                        </button>
                        <div className={`glass-card p-6 rounded-2xl border transition-all ${
                          isCompleted ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/10 hover:border-white/20'
                        }`}>
                          <div className="flex justify-between items-start mb-4">
                            <h4 className={`font-bold ${isCompleted ? 'text-emerald-400' : 'text-white'}`}>{step.title}</h4>
                            <span className="px-2 py-1 bg-blue-500/20 text-cyan-400 border border-blue-500/30 text-[10px] font-bold rounded">
                              {step.duration || `Step ${idx + 1}`}
                            </span>
                          </div>
                          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                            {step.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {step.skills.map(skill => (
                              <span key={skill} className="px-3 py-1 bg-white/5 text-slate-300 text-[10px] font-bold rounded-lg border border-white/10">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Recommended Certifications */}
              <section id="certifications">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-6 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                  <h3 className="text-xl font-bold text-white">Recommended Certifications</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {domain.certifications.map((cert, idx) => (
                    <a 
                      key={idx} 
                      href={cert.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="glass-card p-6 rounded-xl border border-white/10 shadow-sm flex items-center justify-between group hover:border-cyan-500/30 hover:bg-white/5 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg flex items-center justify-center">
                          <Award size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">{cert.name}</h4>
                          <p className="text-slate-400 text-xs mt-1">{cert.platform}</p>
                        </div>
                      </div>
                      <ExternalLink size={16} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    </a>
                  ))}
                </div>
              </section>

              {/* Portfolio Projects */}
              <section id="projects">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-6 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                  <h3 className="text-xl font-bold text-white">Portfolio Projects</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {domain.projects.map((proj, idx) => (
                    <div key={idx} className="glass-card rounded-2xl border border-white/10 shadow-sm overflow-hidden group">
                      <div className="aspect-video bg-white/5 relative overflow-hidden border-b border-white/10">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                           <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 font-bold flex items-center gap-2 hover:underline">
                             View Project <ExternalLink size={16} />
                           </a>
                        </div>
                        <div className="w-full h-full flex items-center justify-center text-slate-600 group-hover:scale-110 transition-transform duration-500">
                           <Icon size={64} />
                        </div>
                      </div>
                      <div className="p-6">
                        <h4 className="font-bold text-white mb-2">{proj.title}</h4>
                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                          {proj.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {proj.tags?.map(tag => (
                            <span key={tag} className="text-[10px] font-bold text-slate-300 bg-white/5 border border-white/10 px-2 py-1 rounded uppercase tracking-wider">{tag}</span>
                          ))}
                        </div>
                        <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-xs font-bold flex items-center gap-1 hover:text-cyan-300 transition-colors">
                          View Project <ChevronRight size={14} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column / Sidebar */}
            <div className="space-y-8">
              {/* Market Data Card */}
              <section id="salaries" className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden border border-white/10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="flex items-center gap-2 mb-8 relative z-10">
                  <BarChart size={20} className="text-cyan-200" />
                  <h3 className="font-bold">Market Data</h3>
                </div>
                <div className="space-y-8 relative z-10">
                  <div>
                    <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mb-2">Avg. Base Salary (US)</p>
                    <h4 className="text-3xl font-black">{domain.salary.avg || '$120,000'}</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mb-1">Growth</p>
                      <p className="text-xl font-bold">{domain.salary.growth || '+15% YoY'}</p>
                    </div>
                    <div>
                      <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mb-1">Open Roles</p>
                      <p className="text-xl font-bold">12,400+</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Job Roles */}
              <section className="glass-card p-8 rounded-2xl border border-white/10 shadow-sm">
                <h3 className="font-bold text-white mb-6">Common Job Roles</h3>
                <div className="space-y-3">
                  {domain.roles.map((role, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 group hover:bg-white/10 hover:border-cyan-500/30 transition-all">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
                      <span className="text-sm font-medium text-slate-300 group-hover:text-white">{role}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Top Hiring Companies */}
              <section className="glass-card p-8 rounded-2xl border border-white/10 shadow-sm">
                <h3 className="font-bold text-white mb-6">Top Hiring Companies</h3>
                <div className="grid grid-cols-2 gap-4">
                  {domain.companies.map(company => (
                    <div key={company} className="p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center justify-center text-center group hover:bg-white/10 hover:border-cyan-500/30 transition-all">
                      <div className="w-8 h-8 bg-white/5 rounded-lg mb-2 flex items-center justify-center text-slate-400 group-hover:bg-blue-500/20 group-hover:text-cyan-400">
                        <Briefcase size={16} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-300">{company}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 py-3 bg-white/5 text-slate-300 text-xs font-bold rounded-lg hover:bg-white/10 transition-all border border-white/10">
                  View All Companies
                </button>
              </section>

              {/* Interview Preparation */}
              <section className="glass-card p-8 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 mb-6">
                  <Shield size={20} className="text-cyan-400" />
                  <h3 className="font-bold text-white">Interview Preparation</h3>
                </div>
                <ul className="space-y-4 mb-8">
                  {domain.interviewTopics.map((topic, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 w-4 h-4 bg-blue-500/20 border border-blue-500/30 rounded flex items-center justify-center text-cyan-400">
                        <CheckCircle2 size={12} />
                      </div>
                      <span className="text-xs text-slate-300 font-medium leading-tight">{topic}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3 bg-white/10 border border-white/20 text-white text-xs font-bold rounded-lg hover:bg-white/20 transition-all shadow-sm">
                  Take a Mock Interview
                </button>
              </section>

              {/* Join Community */}
              <section className="p-8 rounded-2xl border-2 border-dashed border-white/20 bg-white/5">
                <h3 className="font-bold text-white mb-2">Join the Community</h3>
                <p className="text-slate-400 text-xs mb-6">Connect with 5,000+ learners and mentors worldwide.</p>
                <div className="flex -space-x-2 mb-6">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0a1628] bg-slate-600" />
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-[#0a1628] bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] flex items-center justify-center font-bold">+4k</div>
                </div>
                <button className="w-full py-3 bg-transparent border border-cyan-500/50 text-cyan-400 text-xs font-bold rounded-lg hover:bg-cyan-500/10 transition-all">
                  Access Discord
                </button>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
