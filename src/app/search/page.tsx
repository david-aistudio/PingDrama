'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { Search as SearchIcon, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

export default function SearchPage({ searchParams }: { searchParams: Promise<{ q: string }> }) {
  const params = React.use(searchParams);
  const initialQuery = params?.q || '';
  
  const [query, setQuery] = useState(initialQuery);
  
  const { data: results = [], isLoading, isFetching } = useQuery({
    queryKey: ['search', query],
    queryFn: () => api.search(query),
    enabled: query.length > 2, 
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="container mx-auto px-4 space-y-8 pt-12 pb-32">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-center">
          Search
        </h1>
        <div className="relative group">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" />
          <input 
            type="text"
            placeholder="Drama titles, genres..."
            className="w-full bg-[#1c1c1e] border border-white/5 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all text-lg text-white placeholder:text-gray-600 shadow-xl"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      {isLoading || isFetching ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {results.map((drama: any) => (
            <Link 
              key={drama.bookId} 
              href={`/watch/${drama.bookId}`}
              className="group space-y-3 block"
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[#1c1c1e]">
                <img 
                  src={drama.coverWap || drama.cover} 
                  alt={drama.bookName}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105 group-hover:opacity-80"
                  loading="lazy"
                />
              </div>
              <h3 className="font-medium text-[13px] leading-tight text-white/90 truncate group-hover:text-white transition-colors">{drama.bookName}</h3>
            </Link>
          ))}
        </div>
      ) : query.length > 2 ? (
        <div className="text-center py-20 text-gray-500 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-5">
          <AlertCircle size={32} className="opacity-20" />
          <p>No dramas found for "{query}"</p>
        </div>
      ) : (
        <div className="text-center py-20 text-gray-600 text-sm">
          Try searching for "CEO", "Marriage", or "Revenge"...
        </div>
      )}
    </div>
  );
}