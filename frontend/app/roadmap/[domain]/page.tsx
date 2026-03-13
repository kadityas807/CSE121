'use client';

import { useParams, useRouter } from 'next/navigation';
import { domains } from '@/lib/domains';
import DomainDetail from '@/components/DomainDetail';
import { useAuth } from '@/components/AuthProvider';
import { useState } from 'react';
import ResumeBuilder from '@/components/ResumeBuilder';
import { AnimatePresence } from 'motion/react';

export default function RoadmapPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [showResumeBuilder, setShowResumeBuilder] = useState(false);

  const domainId = params.domain as string;
  const domain = domains.find(d => d.id === domainId);

  if (!domain) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold mb-4">Domain Not Found</h1>
        <button 
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <>
      <DomainDetail 
        domain={domain} 
        onBack={() => router.push('/')} 
        onOpenResume={() => setShowResumeBuilder(true)}
        user={user}
      />
      
      <AnimatePresence>
        {showResumeBuilder && (
          <ResumeBuilder 
            domain={domain} 
            user={user} 
            onClose={() => setShowResumeBuilder(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
