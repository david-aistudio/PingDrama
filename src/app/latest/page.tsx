'use client';

import React from 'react';
import { api } from '@/lib/api';
import { useInfiniteQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Play, Loader2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

export default function LatestPage() {
  const { ref, inView } = useInView();
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['latest-infinite'],
    queryFn: ({ pageParam = 1 }) => api.getLatest(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
  });

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return (
    <div className="container mx-auto px-6 md:px-12 py-12 space-y-12">
      <div className="border-b border-white/5 pb-10">
           <h1 className="text-4xl font-semibold text-white tracking-tight">New Releases</h1>
           <p className="text-white/40 text-sm mt-2 font-medium">Freshly updated dramas.</p>
      </div>

      {status === 'pending' ? (
        <div className="flex justify-center py-20">
           <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-10">
            {data?.pages.map((page, i) => (
                <React.Fragment key={i}>
                {page.map((drama: any) => (
                    <DramaCard key={drama.bookId} drama={drama} />
                ))}
                </React.Fragment>
            ))}
            </div>
            
            <div ref={ref} className="flex justify-center py-12">
                {isFetchingNextPage && (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                )}
            </div>
        </div>
      )}
    </div>
  );
}

function DramaCard({ drama }: { drama: any }) {
  return (
    <Link href={`/watch/${drama.bookId}`} className="group block space-y-3 snap-start">
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#1c1c1e] shadow-lg">
        <img 
          src={drama.coverWap} 
          alt={drama.bookName}
          className="w-full h-full object-cover transition duration-700 group-hover:scale-110 group-hover:opacity-90"
          loading="lazy"
        />
      </div>
      
      <div className="space-y-1">
        <h3 className="font-medium text-[14px] leading-snug text-white/90 line-clamp-1 group-hover:text-white transition-colors">
            {drama.bookName}
        </h3>
        <p className="text-[12px] text-white/40 font-medium">Drama</p>
      </div>
    </Link>
  );
}
