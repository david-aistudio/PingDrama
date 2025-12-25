'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Play, Info } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Drama {
  bookId: string;
  bookName: string;
  coverWap: string;
  introduction: string;
  chapterCount: number;
}

export default function HomePage() {
  // State untuk Carousel
  const [heroIndex, setHeroIndex] = useState(0);

  const { data: latest = [], isLoading: loadingLatest } = useQuery({
    queryKey: ['latest'],
    queryFn: () => api.getLatest(),
    select: (data) => data.slice(0, 12)
  });

  const { data: trending = [], isLoading: loadingTrending } = useQuery({
    queryKey: ['trending'],
    queryFn: () => api.getTrending(),
    select: (data) => data.slice(0, 10)
  });

  const { data: dubIndo = [], isLoading: loadingDub } = useQuery({
    queryKey: ['dubIndo'],
    queryFn: () => api.getDubIndo('terbaru'),
    select: (data) => data.slice(0, 12)
  });

  // Autoplay Carousel Logic
  useEffect(() => {
    if (trending.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % Math.min(trending.length, 5)); // Putar 5 item teratas
    }, 5000); // Ganti tiap 5 detik
    return () => clearInterval(interval);
  }, [trending]);

  const isLoading = loadingLatest || loadingTrending || loadingDub;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  // Hero Items (Top 5 Trending)
  const heroItems = trending.slice(0, 5);
  const currentHero = heroItems[heroIndex] || trending[0];

  return (
    <div className="bg-black min-h-screen pb-32">
      {/* Immersive Hero Carousel - Shortened Height */}
      <section className="relative w-full h-[75vh] overflow-hidden">
        
        {/* Logo - Fixed Position */}
        <div className="absolute top-0 left-0 z-40">
             <Link href="/">
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="h-40 md:h-64 w-auto object-contain drop-shadow-2xl hover:opacity-90 transition-opacity -mt-8 -ml-8 md:-mt-16 md:-ml-16 lg:-mt-20 lg:-ml-20" 
                />
             </Link>
        </div>

        {/* Background Images with Crossfade */}
        {heroItems.map((item: Drama, index: number) => (
          <div 
            key={item.bookId}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === heroIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img 
              src={item.coverWap} 
              alt={item.bookName}
              className="w-full h-full object-cover object-center opacity-80"
            />
            {/* Cinematic Gradient / Apple Blur Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent"></div>
          </div>
        ))}

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 w-full z-30 px-6 md:px-12 pb-16 md:pb-20">
          <div className="max-w-3xl space-y-6">
              {/* Animated Text */}
              <div key={currentHero?.bookId} className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
                <span className="text-white/90 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
                  #{heroIndex + 1} Trending Today
                </span>

                <h1 className="text-4xl md:text-7xl font-semibold tracking-tight text-white leading-[1.1] drop-shadow-lg">
                  {currentHero?.bookName}
                </h1>

                <p className="text-white/70 text-sm md:text-lg line-clamp-3 md:line-clamp-2 max-w-xl font-light leading-relaxed drop-shadow-md">
                  {currentHero?.introduction}
                </p>
                
                <div className="flex items-center gap-4 pt-2">
                  <Link href={`/watch/${currentHero?.bookId}`} 
                    className="bg-white text-black px-8 py-4 rounded-full font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  >
                    <Play fill="black" size={18} /> Play Now
                  </Link>
                  <Link href={`/watch/${currentHero?.bookId}`} 
                    className="bg-white/10 backdrop-blur-xl text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-white/20 transition-colors border border-white/10 flex items-center gap-2"
                  >
                    <Info size={18} /> Details
                  </Link>
                </div>
              </div>

              {/* Carousel Indicators */}
              <div className="flex gap-2 pt-4">
                {heroItems.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setHeroIndex(idx)}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      idx === heroIndex ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
          </div>
        </div>
      </section>

      {/* Content Sections - Vertical Flow (Abundant Look) */}
      <div className="px-6 md:px-12 space-y-24 -mt-10 relative z-30">
        
        <ContentSection title="Trending Now" link="/trending">
           {trending.map((drama: any) => <DramaCard key={drama.bookId} drama={drama} />)}
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

// Vertical Grid Section
function ContentSection({ title, link, children }: { title: string, link: string, children: React.ReactNode }) {
  return (
    <section className="space-y-8">
      <div className="flex items-end justify-between border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">{title}</h2>
          <p className="text-white/40 text-sm mt-1">Recommended for you</p>
        </div>
        <Link href={link} className="text-xs font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest mb-1">
          View All
        </Link>
      </div>
      {/* Grid Layout - Vertical Flow */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10">
        {children}
      </div>
    </section>
  )
}

function DramaCard({ drama }: { drama: any }) {
  return (
    <Link href={`/watch/${drama.bookId}`} className="group block space-y-3">
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#1c1c1e] shadow-lg ring-1 ring-white/5">
        <img 
          src={drama.coverWap} 
          alt={drama.bookName}
          className="w-full h-full object-cover transition duration-700 group-hover:scale-110 group-hover:opacity-80"
          loading="lazy"
        />
        {/* Play Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/20 backdrop-blur-[2px]">
            <div className="bg-white/20 backdrop-blur-md border border-white/30 p-3 rounded-full shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                <Play fill="white" size={20} className="ml-1 text-white" />
            </div>
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
           <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white border border-white/10 shadow-sm">
             {drama.chapterCount || 'ON'} EPS
           </span>
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="font-medium text-[14px] leading-snug text-white/90 line-clamp-2 group-hover:text-white transition-colors">
            {drama.bookName}
        </h3>
        <p className="text-[11px] text-white/40 font-medium">Drama</p>
      </div>
    </Link>
  );
}
