'use client';

import { motion } from 'motion/react';
import { ChevronRight, Globe, Brain, Shield, Cloud, Infinity as InfinityIcon, BarChart } from 'lucide-react';
import { Domain } from '@/lib/domains';
import { useRouter } from 'next/navigation';

const IconMap: Record<string, any> = {
  Globe,
  Brain,
  Shield,
  Cloud,
  Infinity: InfinityIcon,
  BarChart
};

export default function DomainCard({ domain, index }: { domain: Domain, index: number }) {
  const router = useRouter();
  const Icon = IconMap[domain.icon] || Globe;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={() => router.push(`/roadmap/${domain.id}`)}
      className="group cursor-pointer perspective-1000 h-full"
    >
      <div className="glass-card rounded-3xl p-6 h-full border border-white/10 hover:border-cyan-500/50 transition-all duration-500 relative overflow-hidden flex flex-col">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-400/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
        
        <div className="flex items-start justify-between mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-400/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-cyan-500/20">
            <Icon size={28} />
          </div>
          <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10 text-xs font-bold text-slate-300">
            {domain.salaryRange}
          </div>
        </div>
        
        <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-300 transition-all">
          {domain.title}
        </h3>
        
        <p className="text-slate-400 text-sm mb-6 line-clamp-2 flex-1">
          {domain.description}
        </p>
        
        <div className="mt-auto">
          <div className="flex flex-wrap gap-2 mb-6">
            {domain.topSkills.slice(0, 3).map((skill, i) => (
              <span key={i} className="px-3 py-1 bg-white/5 text-slate-300 text-xs font-medium rounded-lg border border-white/10">
                {skill}
              </span>
            ))}
          </div>
          
          <div className="flex items-center text-cyan-400 font-bold text-sm group-hover:translate-x-2 transition-transform duration-300">
            Explore Roadmap <ChevronRight size={16} className="ml-1" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
