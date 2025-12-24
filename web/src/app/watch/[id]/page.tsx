'use client';

import React, { useEffect, useRef, use } from 'react';
import { api } from '@/lib/api';
import { ChevronLeft, SkipBack, SkipForward } from 'lucide-react';
import Link from 'next/link';
import Hls from 'hls.js';
import { useQuery } from '@tanstack/react-query';

interface Episode {
  chapterIndex: number;
  chapterName: string;
  cdnList: any[];
}

export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [currentEpisode, setCurrentEpisode] = React.useState<number>(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const episodeListRef = useRef<HTMLDivElement>(null); // Ref buat scroll otomatis

  const { data: episodes = [], isLoading: loadingEp } = useQuery({
    queryKey: ['episodes', id],
    queryFn: async () => {
      const epData = await api.getAllEpisodes(id);
      if (Array.isArray(epData)) return epData;
      if (epData?.data && Array.isArray(epData.data)) return epData.data;
      if (epData?.chapterList) return epData.chapterList;
      return [];
    },
  });

  const { data: detail, isLoading: loadingDetail } = useQuery({
    queryKey: ['detail', id],
    queryFn: () => api.getDetail(id)
  });

  const realDetail = detail?.data?.book || detail?.book || detail;
  const isLoading = loadingEp || loadingDetail;

  const activeEp = episodes[currentEpisode];
  let currentVideoUrl = "";

  if (activeEp?.cdnList?.[0]) {
      const cdnData = activeEp.cdnList[0];
      currentVideoUrl = cdnData.videoPathList?.[0]?.videoPath || cdnData.url || "";
  }

  // Auto-scroll ke episode aktif di list
  useEffect(() => {
    if (episodeListRef.current) {
        const activeBtn = episodeListRef.current.children[currentEpisode] as HTMLElement;
        if (activeBtn) {
            activeBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
  }, [currentEpisode, episodes]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (currentVideoUrl) {
      const isM3U8 = currentVideoUrl.includes('.m3u8');
      if (isM3U8 && Hls.isSupported()) {
        if (hlsRef.current) hlsRef.current.destroy();
        const hls = new Hls({ debug: false });
        hls.loadSource(currentVideoUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
        });
        hlsRef.current = hls;
      } else {
        video.src = currentVideoUrl;
      }
    }
    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, [currentVideoUrl]);

  // Handle Video Ended -> Next Episode
  useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const handleEnded = () => {
          if (currentEpisode < episodes.length - 1) {
              setCurrentEpisode(prev => prev + 1);
          }
      };

      video.addEventListener('ended', handleEnded);
      return () => video.removeEventListener('ended', handleEnded);
  }, [episodes.length, currentEpisode]); // Re-bind kalau length/current berubah

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] pb-32">
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-bold bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 shadow-lg">
            <ChevronLeft size={18} /> Back
        </Link>
      </div>

      <div className="max-w-[1200px] mx-auto pt-24 px-6">
        <div className="flex flex-col lg:flex-row gap-12 relative">
            
          {/* Left Side: Video Player (STICKY) */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
             <div className="lg:sticky lg:top-24 space-y-6">
                
                {/* Player Wrapper */}
                <div className="relative w-full aspect-[9/16] bg-[#0a0a0a] rounded-[2rem] overflow-hidden shadow-[0_0_60px_rgba(255,255,255,0.05)] border border-white/10" style={{ aspectRatio: '9/16' }}>
                    {currentVideoUrl ? (
                    <video 
                        ref={videoRef}
                        controls 
                        autoPlay
                        className="absolute top-0 left-0 w-full h-full object-cover" 
                        poster={realDetail?.coverWap}
                    />
                    ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs">
                        Video unavailable.
                    </div>
                    )}
                </div>

                {/* Quick Navigation Controls */}
                <div className="flex justify-center items-center gap-6 bg-[#1c1c1e] p-3 rounded-full border border-white/5 w-fit mx-auto">
                    <button 
                        onClick={() => setCurrentEpisode(p => Math.max(0, p - 1))}
                        disabled={currentEpisode === 0}
                        className="p-3 hover:bg-white/10 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <SkipBack size={20} fill="currentColor" />
                    </button>
                    <span className="text-sm font-bold w-20 text-center">EP {currentEpisode + 1}</span>
                    <button 
                        onClick={() => setCurrentEpisode(p => Math.min(episodes.length - 1, p + 1))}
                        disabled={currentEpisode === episodes.length - 1}
                        className="p-3 hover:bg-white/10 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <SkipForward size={20} fill="currentColor" />
                    </button>
                </div>

             </div>
          </div>

          {/* Right Side: Info & Episodes */}
          <div className="flex-1 space-y-12 pb-20">
            {/* Info Section */}
            <div className="space-y-6">
                <div className="space-y-3">
                    <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
                        {realDetail?.bookName}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-[12px] font-bold text-white/50 uppercase tracking-[0.1em]">
                        <span className="text-white bg-white/10 px-2 py-0.5 rounded">Running</span>
                        <span>{episodes.length} Episodes</span>
                    </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                    {realDetail?.typeTwoNames?.slice(0, 4).map((tag: string) => (
                        <span key={tag} className="text-white/60 bg-[#1c1c1e] border border-white/5 px-3 py-1.5 rounded-lg text-[13px] font-medium cursor-default">
                            {tag}
                        </span>
                    ))}
                </div>

                <p className="text-white/70 text-base leading-relaxed max-w-xl font-light">
                    {realDetail?.introduction || 'No synopsis available.'}
                </p>
            </div>

            {/* Episode Selector Section */}
            <div className="space-y-6 pt-10 border-t border-white/10">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-xl tracking-tight">Episodes</h3>
                    <span className="text-sm text-white/40 font-medium">{episodes.length} Total</span>
                </div>
                
                {/* Grid Layout */}
                <div ref={episodeListRef} className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 gap-3">
                    {episodes.map((ep: Episode, idx: number) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentEpisode(idx)}
                        className={`h-14 rounded-2xl flex items-center justify-center text-[16px] font-semibold transition-all duration-200 border ${
                        currentEpisode === idx 
                            ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105 z-10 scroll-mt-20' 
                            : 'bg-[#151517] text-white/40 border-white/5 hover:bg-[#252528] hover:text-white hover:border-white/20'
                        }`}
                    >
                        {idx + 1}
                    </button>
                    ))}
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
