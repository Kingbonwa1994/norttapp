'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useUser } from '@/lib/hooks/useUser';

const songSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  artist: z.string().min(1, 'Artist is required'),
  album: z.string().optional(),
  genre: z.string().min(1, 'Genre is required'),
  song: z.instanceof(File)
});

export default function SubmitPage() {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(songSchema)
  });

  const onSubmit = async (data: any) => {
    if (!user) {
      toast.error('Please sign in to submit songs');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('song', data.song);
    formData.append('title', data.title);
    formData.append('artist', data.artist);
    formData.append('album', data.album || '');
    formData.append('genre', data.genre);
    formData.append('userId', user.id);

    try {
      const response = await fetch('/api/songs', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Submission failed');
      
      toast.success('Song submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit song');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Submit Your Song</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-2">Title</label>
          <input
            {...register('title')}
            className="w-full p-2 border rounded"
            type="text"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">Artist</label>
          <input
            {...register('artist')}
            className="w-full p-2 border rounded"
            type="text"
          />
          {errors.artist && (
            <p className="text-red-500 text-sm">{errors.artist.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">Album (Optional)</label>
          <input
            {...register('album')}
            className="w-full p-2 border rounded"
            type="text"
          />
        </div>

        <div>
          <label className="block mb-2">Genre</label>
          <select
            {...register('genre')}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Genre</option>
            <option value="rock">Rock</option>
            <option value="pop">Pop</option>
            <option value="hip-hop">Hip Hop</option>
            <option value="electronic">Electronic</option>
            <option value="jazz">Jazz</option>
            <option value="classical">Classical</option>
          </select>
          {errors.genre && (
            <p className="text-red-500 text-sm">{errors.genre.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2">Song File</label>
          <input
            {...register('song')}
            type="file"
            accept="audio/*"
            className="w-full p-2 border rounded"
          />
          {errors.song && (
            <p className="text-red-500 text-sm">{errors.song.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Song'}
        </button>
      </form>
    </div>
  );
}