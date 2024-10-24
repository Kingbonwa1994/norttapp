'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import ReelUploader from '@/components/ReelUploader';
import ProfileReels from '@/components/ProfileReels';
import CollaborationButton from '@/components/CollaborationButton';

export default function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    setProfile(profile);
    setIsOwnProfile(user?.id === id);
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center space-x-4">
              {profile.avatarUrl && (
                <img
                  src={profile.avatarUrl}
                  alt={profile.username}
                  className="h-16 w-16 rounded-full"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold">{profile.username}</h1>
                <p className="text-gray-600">{profile.bio}</p>
              </div>
              {!isOwnProfile && <CollaborationButton receiverId={id} />}
            </div>
          </div>

          {isOwnProfile && <ReelUploader />}
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Reels</h2>
            <ProfileReels userId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}