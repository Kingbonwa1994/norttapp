import { Suspense } from 'react';
import ReelsFeed from '@/components/ReelsFeed';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Artist Reels</h1>
        <Suspense fallback={<LoadingSpinner />}>
          <ReelsFeed />
        </Suspense>
      </main>
    </div>
  );
}