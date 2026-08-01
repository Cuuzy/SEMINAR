import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Users, Award, ShieldCheck, ArrowRight, Coins, CheckCircle2 } from 'lucide-react';
import { EventContent } from '../types';

interface HeroProps {
  content: EventContent;
  totalRegistered: number;
  remainingQuota: number;
  onRegisterClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  content,
  totalRegistered,
  remainingQuota,
  onRegisterClick
}) => {
  const quotaPercent = Math.min(100, Math.round((totalRegistered / content.totalQuota) * 100));

  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white pt-8 pb-16 lg:py-20">
      {/* Background Gold Accent Circles */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Text & Hero Info */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {content.title}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {content.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onRegisterClick}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-extrabold text-base shadow-lg hover:shadow-amber-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
              >
                Daftar Sekarang (100% Gratis)
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href={`https://wa.me/${content.contactWhatsapp}?text=${encodeURIComponent('Halo Panitia Pegadaian, saya ingin bertanya seputar Mini Gathering Emas')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-white font-semibold text-sm border border-emerald-700 transition-all text-center flex items-center justify-center gap-2"
              >
                Tanya Panitia via WA
              </a>
            </div>

            {/* Quick Benefits Bullet List */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-emerald-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" /> Snack & Lunch Box
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" /> Sertifikat Kepesertaan
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" /> Doorprise Emas Batangan
              </span>
            </div>
          </motion.div>

          {/* Right Column: Visual Showcase Frame */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Gold Investment Showcase Card */}
            <div className="bg-gradient-to-br from-emerald-900/90 to-emerald-950/90 border border-amber-400/30 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 border-b border-emerald-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-300">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Mengapa Harus Gabung?</h3>
                    <p className="text-[11px] text-emerald-300">Program Kemitraan Emas Pegadaian</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-800 text-amber-300 font-semibold px-2 py-0.5 rounded">
                  Galeri 24 & Pegadaian
                </span>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-emerald-100">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                  <span><strong>Konsultasi Keuangan Gratis:</strong> Dapatkan panduan menabung emas tanpa resiko penurunan nilai tunai.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                  <span><strong>Diskon DP Cicil Emas:</strong> Penawaran eksklusif cicil emas batangan kadar 999.9 khusus bagi peserta hadir.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                  <span><strong>Komunitas Investor Emas:</strong> Jejaring wirausaha dan nasabah prioritas di kota Anda.</span>
                </li>
              </ul>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
