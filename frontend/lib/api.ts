import { auth } from './firebase';

// Replace with your live Vercel backend URL after deployment
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getHeaders() {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');
  const token = await user.getIdToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

export const api = {
  getUserProfile: async (uid: string) => {
    const headers = await getHeaders();
    const res = await fetch(`${BASE_URL}/users/${uid}`, { headers });
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
  },

  updateUserProfile: async (uid: string, data: any) => {
    const headers = await getHeaders();
    const res = await fetch(`${BASE_URL}/users/${uid}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update user profile');
    return res.json();
  },

  getUserCollection: async (uid: string, collection: string) => {
    const headers = await getHeaders();
    const res = await fetch(`${BASE_URL}/users/${uid}/${collection}`, { headers });
    if (!res.ok) throw new Error(`Failed to fetch ${collection}`);
    return res.json();
  }
};
