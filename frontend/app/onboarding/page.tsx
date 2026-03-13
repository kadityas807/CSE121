'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider';
import { domains } from '@/lib/domains';
import { CheckCircle2, ChevronRight, Compass } from 'lucide-react';

const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate'];
const goals = ['Software Engineer', 'Data Scientist', 'Product Manager', 'Cybersecurity Analyst', 'Cloud Architect', 'Other'];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [year, setYear] = useState('');
  const [goal, setGoal] = useState('');
  const [domainId, setDomainId] = useState('');
  const [saving, setSaving] = useState(false);

  if (loading) return <div className="min-h-screen bg-[#0a1628] flex items-center justify-center"><div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!user) {
    router.push('/login');
    return null;
  }

  const handleComplete = async () => {
    try {
      setSaving(true);
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        displayName: user.displayName || 'New User',
        photoURL: user.photoURL || '',
        year,
        careerGoal: goal,
        currentPath: domainId,
        onboardingCompleted: true,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        progress: 0
      }, { merge: true });
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
      setSaving(false);
    }
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else handleComplete();
  };

  return (
    <div className="min-h-screen bg-[#0a1628] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-float-1"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-[120px] animate-float-2"></div>
      </div>

      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8 px-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= i ? 'bg-cyan-500 text-white' : 'bg-white/10 text-slate-500'}`}>
                {step > i ? <CheckCircle2 size={16} /> : i}
              </div>
              {i < 3 && (
                <div className={`w-24 sm:w-32 h-1 mx-2 rounded-full ${step > i ? 'bg-cyan-500' : 'bg-white/10'}`}></div>
              )}
            </div>
          ))}
        </div>

        <motion.div className="glass-card p-8 rounded-3xl border border-white/10 shadow-2xl relative z-10 min-h-[400px] flex flex-col">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
                <h2 className="text-3xl font-display font-bold text-white mb-2">What year are you in?</h2>
                <p className="text-slate-400 mb-8">Help us tailor your roadmap to your current academic stage.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {years.map((y) => (
                    <button
                      key={y}
                      onClick={() => setYear(y)}
                      className={`p-4 rounded-xl border text-left font-medium transition-all ${year === y ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
                <h2 className="text-3xl font-display font-bold text-white mb-2">What's your career goal?</h2>
                <p className="text-slate-400 mb-8">Tell us what you're aiming for so we can guide you there.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {goals.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGoal(g)}
                      className={`p-4 rounded-xl border text-left font-medium transition-all ${goal === g ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
                <h2 className="text-3xl font-display font-bold text-white mb-2">Pick your domain</h2>
                <p className="text-slate-400 mb-8">Select the primary area you want to focus on right now.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {domains.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setDomainId(d.id)}
                      className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${domainId === d.id ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${domainId === d.id ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/10 text-slate-400'}`}>
                        <Compass size={20} />
                      </div>
                      <div>
                        <p className="font-bold">{d.title}</p>
                        <p className="text-xs opacity-70 line-clamp-1">{d.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 flex justify-between items-center pt-6 border-t border-white/10">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1 || saving}
              className="px-6 py-2 rounded-xl font-medium text-slate-400 hover:text-white disabled:opacity-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={(step === 1 && !year) || (step === 2 && !goal) || (step === 3 && !domainId) || saving}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  {step === 3 ? 'Complete' : 'Next'}
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
