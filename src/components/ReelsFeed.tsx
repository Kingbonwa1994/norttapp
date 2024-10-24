'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { supabase } from '@/lib/supabase/client';
import ReelCard from './ReelCard';

export default function ReelsFeed() {
  const [reels, setReels] = useState([]);
  const [page, setPage] = useState(1);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      loadMoreReels();
    }
  }, [inView]);

  const loadMoreReels = async () => {
    const { data } = await supabase
      .from('reels')
      .select(`
        *,
        users (
          username,
          avatarUrl
        )
      `)
      .range((page - 1) * 10, page * 10 - 1)
      .order('created_at', { ascending: false });

    setReels(prev => [...prev, ...data]);
    setPage(prev => prev + 1);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reels.map((reel) => (
        <ReelCard key={reel.id} reel={reel} />
      ))}
      <div ref={ref} />
    </div>
  );
}