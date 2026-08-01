import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Tag, Users, Gift, Sparkles, CheckCircle, Share2, Copy, Check, MessageCircle, Send, Globe, HeartHandshake } from 'lucide-react';
import { EventContent } from '../types';

interface EventDetailsProps {
  content: EventContent;
  onRegisterClick: () => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ content, onRegisterClick }) => {
  const [copied, setCopied] = useState(false);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp': return <TrendingUp className="w-6 h-6 text-emerald-700" />;
      case 'Tag': return <Tag className="w-6 h-6 text-emerald-700" />;
      case 'Users': return <Users className="w-6 h-6 text-emerald-700" />;
      case 'Gift': return <Gift className="w-6 h-6 text-emerald-700" />;
      default: return <Sparkles className="w-6 h-6 text-emerald-700" />;
    }
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://pegadaian-mini-gathering.id';
  const shareTitle = `${content.title || 'Mini Gathering Emas Pegadaian'}`;
  const shareText = `Halo! Yuk gabung di *${shareTitle}*! Acara edukasi & investasi emas resmi dari PT Pegadaian. Kuota terbatas! Daftar sekarang di:`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${shareText} ${currentUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: currentUrl,
        });
      } catch (e) {
        console.log('Share canceled or not supported', e);
      }
    } else {
      handleCopyLink();
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${currentUrl}`)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;

  return (
    <div className="py-16 bg-slate-50 space-y-16">
      
      {/* SECTION 1: Key Benefits */}
      <section id="benefit" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3.5 py-1 rounded-full">
            Fasilitas & Keuntungan Peserta
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
            Apa Yang Akan Anda Dapatkan di Mini Gathering Ini?
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Dirancang khusus untuk membantu Anda memahami kemudahan & keamanan investasi emas bersama PT Pegadaian.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.benefits.map((benefit, idx) => (
            <motion.div
              key={benefit.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all group relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {getIcon(benefit.iconName)}
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                {benefit.title}
              </h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                {benefit.description}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-amber-500" /> Included for All Participants
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 2: Social Media Share / Invite Friends Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-emerald-800/80 shadow-xl relative overflow-hidden"
        >
          {/* Decorative background glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left Column: Heading & Description */}
            <div className="space-y-3 text-center lg:text-left max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 border border-amber-400/40 rounded-full text-amber-300 text-xs font-bold">
                <HeartHandshake className="w-4 h-4 text-amber-400" />
                <span>Ajak Rekan & Keluarga</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                Bagikan Undangan Acara Ini!
              </h3>
              <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed">
                Bantu kerabat dan teman Anda mendapatkan ilmu investasi emas gratis & merchandise eksklusif dari PT Pegadaian dengan membagikan info acara ini.
              </p>
            </div>

            {/* Right Column: Social Share Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 w-full lg:w-auto">
              {/* WhatsApp Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer border border-emerald-400/40"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp</span>
              </a>

              {/* Telegram Button */}
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer border border-sky-400/40"
              >
                <Send className="w-4 h-4" />
                <span>Telegram</span>
              </a>

              {/* Facebook Button */}
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer border border-blue-400/40"
              >
                <Globe className="w-4 h-4" />
                <span>Facebook</span>
              </a>

              {/* Twitter / X Button */}
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer border border-slate-600"
              >
                <Share2 className="w-4 h-4 text-amber-300" />
                <span>Twitter / X</span>
              </a>

              {/* Copy Link Button / Native Share */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer border border-amber-300"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-900" />
                    <span>Link Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-emerald-950" />
                    <span>Salin Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

