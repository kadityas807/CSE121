'use client';

import { Domain, domains } from '@/lib/domains';
import DomainCard from './DomainCard';

export default function DomainGrid({ searchQuery }: { searchQuery: string }) {
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

  return (
    <section id="domains" className="mb-24 scroll-mt-24">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-white text-3xl font-display font-bold leading-tight tracking-[-0.015em]">Explore Career Domains</h2>
          <p className="text-slate-400 text-sm mt-1">
            {searchQuery ? `Found ${filteredDomains.length} results for "${searchQuery}"` : 'Choose a path to view detailed roadmaps and skills'}
          </p>
        </div>
      </div>

      {filteredDomains.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-3xl border border-white/10 shadow-sm">
          <div className="w-16 h-16 bg-white/5 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No domains found</h3>
          <p className="text-slate-400">Try adjusting your search terms or browse all domains.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDomains.map((domain, index) => (
            <DomainCard key={domain.id} domain={domain} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
