'use client';

import React from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Drama {
  bookId: string;
  bookName: string;
  coverWap: string;
  introduction: string;
  chapterCount: number;
}

export default function HomePage() {
  const { data: latest = [], isLoading: loadingLatest } = useQuery({
    queryKey: ['latest'],
    queryFn: api.getLatest,
    select: (data) => data.slice(0, 12)
  });

  const { data: trending = [], isLoading: loadingTrending } = useQuery({
    queryKey: ['trending'],
    queryFn: api.getTrending,
    select: (data) => data.slice(0, 10)
  });

  const { data: dubIndo = [], isLoading: loadingDub } = useQuery({
    queryKey: ['dubIndo'],
    queryFn: () => api.getDubIndo('terbaru'),
    select: (data) => data.slice(0, 10)
  });

  const isLoading = loadingLatest || loadingTrending || loadingDub;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  // Hero Drama
  const heroDrama = trending[0];

  return (
    <div className="bg-black min-h-screen pb-32">
      {/* Hero Section */}
      {heroDrama && (
        <section className="relative w-full h-[90vh]">
          {/* Logo Image Embedded in Carousel - ULTRA EXTREME CORNER */}
          <div className="absolute top-0 left-0 z-30">
             <Link href="/">
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="h-40 md:h-64 w-auto object-contain drop-shadow-2xl hover:opacity-90 transition-opacity -mt-8 -ml-8 md:-mt-16 md:-ml-16 lg:-mt-20 lg:-ml-20" 
                />
             </Link>
          </div>

          <div className="absolute inset-0">
             <img 
              src={heroDrama.coverWap} 
              alt={heroDrama.bookName}
              className="w-full h-full object-cover opacity-85"
            />
            {/* Cinematic Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent"></div>
          </div>

          <div className="absolute bottom-0 left-0 w-full z-10 px-6 md:px-12 pb-12">
            <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                <span className="text-white/80 text-xs font-bold uppercase tracking-widest bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  #1 Trending
                </span>

                <h1 className="text-4xl md:text-7xl font-semibold tracking-tight text-white leading-[1.1]">
                  {heroDrama.bookName}
                </h1>

                <p className="text-white/80 text-base md:text-lg line-clamp-3 max-w-xl font-light leading-relaxed drop-shadow-md">
                  {heroDrama.introduction}
                </p>
                
                <div className="flex items-center gap-4 pt-4">
                  <Link href={`/watch/${heroDrama.bookId}`} 
                    className="bg-white text-black px-8 py-4 rounded-full font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2"
                  >
                    <Play fill="black" size={18} /> Play Now
                  </Link>
                  <Link href={`/watch/${heroDrama.bookId}`} 
                    className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-white/20 transition-colors"
                  >
                    Details
                  </Link>
                </div>
            </div>
          </div>
        </section>
      )}

      <div className="px-6 md:px-12 space-y-16 -mt-6 relative z-20">
        <ContentSection title="Trending Now" link="/trending">
           {trending.slice(1).map((drama: any) => <DramaCard key={drama.bookId} drama={drama} />)}
        </ContentSection>

        <ContentSection title="Indonesian Dubbed" link="/dub-indo">
           {dubIndo.map((drama: any) => <DramaCard key={drama.bookId} drama={drama} />)}
        </ContentSection>

        <ContentSection title="New Releases" link="/latest">
           {latest.map((drama: any) => <DramaCard key={drama.bookId} drama={drama} />)}
        </ContentSection>
      </div>
    </div>
  );
}

function ContentSection({ title, link, children }: { title: string, link: string, children: React.ReactNode }) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-white">{title}</h2>
        <Link href={link} className="text-xs font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest">
          View All
        </Link>
      </div>
      <div className="flex overflow-x-auto gap-5 pb-8 no-scrollbar snap-x">
        {children}
      </div>
    </section>
  )
}

function DramaCard({ drama }: { drama: any }) {
  return (
    <Link href={`/watch/${drama.bookId}`} className="group block space-y-3 min-w-[160px] md:min-w-[220px] snap-start">
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#1c1c1e] shadow-lg">
        <img 
          src={drama.coverWap} 
          alt={drama.bookName}
          className="w-full h-full object-cover transition duration-700 group-hover:scale-110 group-hover:opacity-90"
          loading="lazy"
        />
        {/* Subtle Gradient on hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
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