'use client';

import { User } from '@/lib/firebase';
import { 
  ArrowLeft, Settings, Bell, LogOut, UserCircle, BarChart, MapIcon, FileText, 
  CheckCircle2, Play, Lock, Lightbulb, Plus, ChevronRight, Target, Star, Award, Code2 
} from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';

const IconMap: Record<string, any> = {
  Award,
  Code2,
  Target,
  Star
};

export default function ProfileDashboard({ 
  user, 
  profile, 
  milestones, 
  projects, 
  notes, 
  badges, 
  activities, 
  onLogout 
}: { 
  user: User; 
  profile: any; 
  milestones: any[]; 
  projects: any[]; 
  notes: any[]; 
  badges: any[]; 
  activities: any[]; 
  onLogout: () => void; 
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a1628] text-white font-sans relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[120px]"></div>
      </div>

      <header className="flex items-center justify-between border-b border-white/10 bg-[#0a1628]/80 backdrop-blur-xl px-6 py-4 md:px-10 sticky top-0 z-50">
        <div className="flex items-center gap-4 text-white">
          <button onClick={() => router.push('/')} className="size-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-white text-xl font-display font-bold leading-tight tracking-tight">CSE Career Compass</h2>
        </div>
        <div className="flex flex-1 justify-end gap-4">
          <div className="flex gap-2">
            <button className="flex items-center justify-center rounded-xl h-10 w-10 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 transition-colors">
              <Settings size={20} />
            </button>
            <button className="flex items-center justify-center rounded-xl h-10 w-10 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 transition-colors">
              <Bell size={20} />
            </button>
            <button 
              onClick={onLogout}
              className="flex items-center justify-center rounded-xl h-10 w-10 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
          <div className="aspect-square rounded-full size-10 border-2 border-cyan-500/30 overflow-hidden">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                <UserCircle size={24} />
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row max-w-[1400px] mx-auto px-4 md:px-10 py-8 gap-8">
        <aside className="flex flex-col gap-4 w-full md:w-64 shrink-0">
          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border border-cyan-500/30 rounded-xl text-cyan-400 text-left transition-colors">
              <BarChart size={18} />
              <p className="text-sm font-bold">Dashboard</p>
            </button>
            <button onClick={() => router.push(profile?.currentPath ? `/roadmap/${profile.currentPath}` : '/#domains')} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl cursor-pointer text-left text-slate-300 transition-colors">
              <MapIcon size={18} />
              <p className="text-sm font-medium">My Roadmap</p>
            </button>
            <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl cursor-pointer text-left text-slate-300 transition-colors">
              <FileText size={18} />
              <p className="text-sm font-medium">Resources</p>
            </button>
            <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl cursor-pointer text-left text-slate-300 transition-colors">
              <UserCircle size={18} />
              <p className="text-sm font-medium">Profile Settings</p>
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col gap-8">
          <section className="glass-card p-8 rounded-3xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-400/10 rounded-bl-full -z-10"></div>
            <div className="flex gap-6 items-center z-10">
              <div className="aspect-square rounded-2xl size-24 border border-white/20 overflow-hidden shadow-xl">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <UserCircle size={48} />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-white text-3xl font-display font-bold leading-tight tracking-tight mb-1">{profile?.displayName || user.displayName}</h1>
                <p className="text-cyan-400 text-base font-medium">Computer Science Student • {profile?.year || '3rd Year'}</p>
                <p className="text-slate-400 text-sm mt-2">Joined {profile?.joinedDate || 'Sept 2023'} • Focused on {profile?.focus || 'Full-Stack Systems'}</p>
              </div>
            </div>
            <div className="flex gap-2 z-10">
              <button className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all">Edit Profile</button>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2 flex flex-col gap-8">
              <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-xl">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white">Current Learning Path</h2>
                    <p className="text-cyan-400 font-medium text-sm mt-1">{profile?.currentPath || 'Web Development Specialist'}</p>
                  </div>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 text-3xl font-black">{profile?.progress || 65}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-4 mb-8 border border-white/10 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${profile?.progress || 65}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full relative"
                  >
                    <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                  </motion.div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Recent Milestones</h3>
                  {milestones.length > 0 ? milestones.map((m, i) => (
                    <div key={m.id || i} className={`flex items-center gap-4 p-4 rounded-2xl border ${m.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/10'}`}>
                      <div className={`size-10 rounded-xl flex items-center justify-center ${m.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : m.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-slate-500 border border-white/10'}`}>
                        {m.status === 'completed' ? <CheckCircle2 size={20} /> : m.status === 'in-progress' ? <Play size={20} /> : <Lock size={20} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">{m.title}</p>
                        <p className="text-xs text-slate-400 mt-1">{m.status === 'completed' ? `Completed on ${m.date}` : m.status === 'in-progress' ? m.date : 'Upcoming Milestone'}</p>
                      </div>
                    </div>
                  )) : (
                    <>
                      <div className="flex items-center gap-4 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                        <div className="size-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                          <CheckCircle2 size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-white">Advanced CSS Layouts & Flexbox</p>
                          <p className="text-xs text-slate-400 mt-1">Completed on Jan 15, 2024</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                        <div className="size-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                          <CheckCircle2 size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-white">JavaScript ES6+ Deep Dive</p>
                          <p className="text-xs text-slate-400 mt-1">Completed on Feb 2, 2024</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                        <div className="size-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                          <Play size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-white">React.js Fundamental Architecture</p>
                          <p className="text-xs text-slate-400 mt-1">In Progress • 4 of 12 lessons finished</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-6 rounded-3xl border border-white/10 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg">
                      <Lightbulb size={20} />
                    </div>
                    <h3 className="font-bold text-white">Project Ideas</h3>
                  </div>
                  <ul className="space-y-3">
                    {projects.length > 0 ? projects.map((p, i) => (
                      <li key={p.id || i} className="p-4 bg-white/5 rounded-xl border-l-4 border-yellow-500/50">
                        <p className="font-bold text-white text-sm">{p.title}</p>
                        <p className="text-slate-400 text-xs mt-1">{p.description}</p>
                      </li>
                    )) : (
                      <>
                        <li className="p-4 bg-white/5 rounded-xl border-l-4 border-yellow-500/50">
                          <p className="font-bold text-white text-sm">AI Study Planner</p>
                          <p className="text-slate-400 text-xs mt-1">Using OpenAI API and React</p>
                        </li>
                        <li className="p-4 bg-white/5 rounded-xl border-l-4 border-blue-500/50">
                          <p className="font-bold text-white text-sm">Portfolio Site v2.0</p>
                          <p className="text-slate-400 text-xs mt-1">Framer Motion + Tailwind CSS</p>
                        </li>
                      </>
                    )}
                    <button className="w-full py-3 mt-4 border border-dashed border-white/20 rounded-xl text-slate-400 text-sm font-bold hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-cyan-500/5 transition-all flex items-center justify-center gap-2">
                      <Plus size={16} /> Add New Idea
                    </button>
                  </ul>
                </div>
                
                <div className="glass-card p-6 rounded-3xl border border-white/10 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-violet-500/20 text-violet-400 rounded-lg">
                      <FileText size={20} />
                    </div>
                    <h3 className="font-bold text-white">Interview Prep Notes</h3>
                  </div>
                  <ul className="space-y-3">
                    {notes.length > 0 ? notes.map((n, i) => (
                      <li key={n.id || i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 group cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <FileText size={16} className="text-violet-400" />
                          <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{n.title}</span>
                        </div>
                        <ChevronRight size={16} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
                      </li>
                    )) : (
                      <>
                        <li className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 group cursor-pointer transition-colors">
                          <div className="flex items-center gap-3">
                            <FileText size={16} className="text-violet-400" />
                            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Big O Notation Cheatsheet</span>
                          </div>
                          <ChevronRight size={16} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
                        </li>
                        <li className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 group cursor-pointer transition-colors">
                          <div className="flex items-center gap-3">
                            <FileText size={16} className="text-violet-400" />
                            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">System Design Patterns</span>
                          </div>
                          <ChevronRight size={16} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
                        </li>
                      </>
                    )}
                    <button className="w-full mt-4 text-cyan-400 text-sm font-bold text-left hover:text-cyan-300 transition-colors px-3">View All Notes →</button>
                  </ul>
                </div>
              </div>
            </section>

            <aside className="flex flex-col gap-8">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden border border-white/10">
                <div className="relative z-10">
                  <h3 className="text-xl font-display font-bold mb-2">Career Goal</h3>
                  <p className="text-blue-100 text-sm mb-6 leading-relaxed">{profile?.careerGoal || 'Full-Stack Engineer at a Tier-1 Tech Company'}</p>
                  <div className="flex flex-col gap-3">
                    <div className="bg-black/20 backdrop-blur-md p-4 rounded-2xl flex items-center gap-4 border border-white/10">
                      <div className="p-2 bg-white/10 rounded-xl">
                        <Target size={20} className="text-cyan-300" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">Target Date</p>
                        <p className="font-bold">{profile?.targetDate || 'June 2026'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-8 -bottom-8 opacity-20 transform rotate-12">
                  <Star size={160} />
                </div>
              </div>

              <div className="glass-card p-6 rounded-3xl border border-white/10 shadow-xl">
                <h3 className="font-bold text-white mb-6">Badges Earned</h3>
                <div className="grid grid-cols-3 gap-4">
                  {badges.length > 0 ? badges.map((b, i) => {
                    const BadgeIcon = IconMap[b.icon] || Award;
                    return (
                      <div key={b.id || i} className="flex flex-col items-center gap-2">
                        <div className={`size-14 rounded-2xl flex items-center justify-center border ${b.earned ? 'bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-white/5 text-slate-500 border-white/10 border-dashed'}`}>
                          {b.earned ? <BadgeIcon size={28} /> : <Lock size={28} />}
                        </div>
                        <p className={`text-[10px] text-center font-bold uppercase tracking-wider ${b.earned ? 'text-slate-300' : 'text-slate-500'}`}>{b.title}</p>
                      </div>
                    );
                  }) : (
                    <>
                      <div className="flex flex-col items-center gap-2">
                        <div className="size-14 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                          <Award size={28} />
                        </div>
                        <p className="text-[10px] text-center font-bold uppercase tracking-wider text-slate-300">Fast Learner</p>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="size-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                          <Code2 size={28} />
                        </div>
                        <p className="text-[10px] text-center font-bold uppercase tracking-wider text-slate-300">CSS Master</p>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 border border-white/10 border-dashed">
                          <Lock size={28} />
                        </div>
                        <p className="text-[10px] text-center font-bold uppercase tracking-wider text-slate-500">Locked</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="glass-card p-6 rounded-3xl border border-white/10 shadow-xl">
                <h3 className="font-bold text-white mb-6">Recent Activity</h3>
                <div className="space-y-6">
                  {activities.length > 0 ? activities.map((a, i) => (
                    <div key={a.id || i} className="flex gap-4 relative">
                      <div className="w-3 h-3 rounded-full bg-cyan-400 mt-1 shrink-0 shadow-[0_0_10px_rgba(34,211,238,0.5)] z-10"></div>
                      {i < activities.length - 1 && (
                        <div className="absolute top-4 left-1.5 w-px h-full bg-white/10 -z-0"></div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-slate-200">{a.description}</p>
                        <p className="text-xs text-slate-500 mt-1">{a.timestamp}</p>
                      </div>
                    </div>
                  )) : (
                    <>
                      <div className="flex gap-4 relative">
                        <div className="w-3 h-3 rounded-full bg-cyan-400 mt-1 shrink-0 shadow-[0_0_10px_rgba(34,211,238,0.5)] z-10"></div>
                        <div className="absolute top-4 left-1.5 w-px h-full bg-white/10 -z-0"></div>
                        <div>
                          <p className="text-sm font-bold text-slate-200">Solved "Merge Two Sorted Lists"</p>
                          <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex gap-4 relative">
                        <div className="w-3 h-3 rounded-full bg-blue-500/50 mt-1 shrink-0 z-10 border border-blue-400/50"></div>
                        <div>
                          <p className="text-sm font-bold text-slate-200">Updated Interview Prep Notes</p>
                          <p className="text-xs text-slate-500 mt-1">Yesterday</p>
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
    </div>
  );
}
