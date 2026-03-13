'use client';

import { useAuth } from '@/components/AuthProvider';
import ProfileDashboard from '@/components/ProfileDashboard';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { signOut, auth } from '@/lib/firebase';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [profile, setProfile] = useState<any>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [profileData, milestonesData, projectsData, notesData, badgesData, activitiesData] = await Promise.all([
          api.getUserProfile(user.uid),
          api.getUserCollection(user.uid, 'milestones'),
          api.getUserCollection(user.uid, 'projects'),
          api.getUserCollection(user.uid, 'notes'),
          api.getUserCollection(user.uid, 'badges'),
          api.getUserCollection(user.uid, 'activities')
        ]);

        setProfile(profileData);
        setMilestones(milestonesData);
        setProjects(projectsData);
        setNotes(notesData);
        setBadges(badgesData);
        setActivities(activitiesData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading || !user) {
    return <div className="min-h-screen bg-[#0a1628] flex items-center justify-center"><div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <ProfileDashboard 
      user={user}
      profile={profile}
      milestones={milestones}
      projects={projects}
      notes={notes}
      badges={badges}
      activities={activities}
      onLogout={handleLogout}
    />
  );
}
