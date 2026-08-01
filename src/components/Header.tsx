import React, { useState } from 'react';
import { ShieldCheck, Calendar, MapPin, Users, Lock, Menu, X, Sparkles } from 'lucide-react';

interface HeaderProps {
  title: string;
  logoUrl?: string;
  logoText?: string;
  logoSubtext?: string;
  logoBadge?: string;
  isRegistrationOpen: boolean;
  remainingQuota: number;
  onOpenAdmin: () => void;
  onScrollToSection: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  logoUrl,
  logoText = 'PEGADAIAN',
  logoSubtext = 'Mini Gathering Eksklusif',
  logoBadge = 'EMAS',
  isRegistrationOpen,
  remainingQuota,
  onOpenAdmin,
  onScrollToSection
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onScrollToSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs transition-all">
      {/* Top Banner Status Bar */}
      <div className="bg-emerald-900 text-emerald-100 px-4 py-1.5 text-xs text-center font-medium flex items-center justify-center gap-3">
        <span className="inline-flex items-center gap-1.5 bg-emerald-800/80 px-2.5 py-0.5 rounded-full text-amber-300 font-semibold border border-amber-400/30">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
          Official Pegadaian Event
        </span>
        <button
          onClick={onOpenAdmin}
          className="ml-auto text-emerald-300 hover:text-amber-300 flex items-center gap-1 text-[11px] font-semibold underline underline-offset-2 transition-colors cursor-pointer"
        >
          <Lock className="w-3 h-3" />
          Login Admin
        </button>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo & Emblem */}
        <div 
          onClick={() => handleNavClick('hero')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={logoText || 'Logo'}
              className="h-10 w-auto max-w-[140px] object-contain rounded-lg group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-0.5 shadow-md group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full bg-emerald-900 rounded-[10px] flex items-center justify-center border border-amber-400/40">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-emerald-950 tracking-tight">{logoText || 'PEGADAIAN'}</span>
              {logoBadge && (
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300">
                  {logoBadge}
                </span>
              )}
            </div>
            {logoSubtext && (
              <p className="text-xs text-emerald-700 font-medium tracking-wide">{logoSubtext}</p>
            )}
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => handleNavClick('jadwal-upc')}
            className="text-sm font-bold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer flex items-center gap-1 bg-amber-100/80 px-3 py-1.5 rounded-lg border border-amber-300"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Daftar Acara per UPC
          </button>
          <button
            onClick={() => handleNavClick('benefit')}
            className="text-sm font-medium text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
          >
            Keuntungan
          </button>
          <button
            onClick={() => handleNavClick('galeri')}
            className="text-sm font-medium text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
          >
            Galeri Foto
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className="text-sm font-medium text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </nav>

        {/* Right CTA Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('pendaftaran')}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold text-sm shadow-sm hover:shadow-emerald-200 hover:shadow-md transition-all cursor-pointer border border-emerald-500/20"
          >
            Daftar Sekarang
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <button
            onClick={() => handleNavClick('benefit')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-slate-700 hover:bg-emerald-50 rounded-lg"
          >
            Keuntungan Acara
          </button>
          <button
            onClick={() => handleNavClick('galeri')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-slate-700 hover:bg-emerald-50 rounded-lg"
          >
            Galeri Foto Event
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-slate-700 hover:bg-emerald-50 rounded-lg"
          >
            Pertanyaan Umum (FAQ)
          </button>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('pendaftaran')}
              className="w-full py-2.5 rounded-lg bg-emerald-700 text-white font-semibold text-center text-sm shadow-sm"
            >
              Daftar Sekarang (Gratis)
            </button>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 rounded-lg bg-slate-100 text-slate-700 font-medium text-center text-xs flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              Panel Login Admin
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
