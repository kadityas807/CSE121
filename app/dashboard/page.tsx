'use client';

import { useAuth } from '@/components/AuthProvider';
import ProfileDashboard from '@/components/ProfileDashboard';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, signOut, auth } from '@/lib/firebase';

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

    const userDocRef = doc(db, 'users', user.uid);
    const unsubProfile = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data());
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
