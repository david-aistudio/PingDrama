'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Flame, Languages, Clock, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function FloatingNav() {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 p-1.5 bg-[#1c1c1e]/80 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl ring-1 ring-black/20">
        <NavItem href="/" icon={<Home size={20} />} label="Home" />
        <NavItem href="/latest" icon={<Clock size={20} />} label="New" />
        <NavItem href="/trending" icon={<Flame size={20} />} label="Hot" />
        <NavItem href="/dub-indo" icon={<Languages size={20} />} label="Dub" />
        <div className="w-px h-6 bg-white/10 mx-1"></div>
        <NavItem href="/search" icon={<Search size={20} />} label="Search" />
      </div>
    </nav>
  );
}

function NavItem({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link 
      href={href} 
      className={`relative group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
        isActive 
        ? 'bg-white text-black shadow-lg scale-110' 
        : 'text-white/50 hover:text-white hover:bg-white/10'
      }`}
    >
      {icon}
      <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#1c1c1e] text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 pointer-events-none whitespace-nowrap">
        {label}
      </span>
    </Link>
  );
}
