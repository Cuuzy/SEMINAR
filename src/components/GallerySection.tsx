import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, X, ChevronLeft, ChevronRight, Maximize2, Sparkles, ShieldCheck } from 'lucide-react';
import { GalleryItem } from '../types';

interface GallerySectionProps {
  gallery?: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!gallery || gallery.length === 0) {
    return null;
  }

  const activeItem = selectedIndex !== null ? gallery[selectedIndex] : null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev === 0 ? gallery.length - 1 : (prev as number) - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev === gallery.length - 1 ? 0 : (prev as number) + 1));
  };

  return (
    <section id="galeri" className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide">
            <Camera className="w-3.5 h-3.5" />
            <span>DOKUMENTASI KETEMUAN SEBELUMNYA</span>
          </div>
          
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Dokumentasi <span className="text-amber-400">Mini Gathering Emas</span>
          </h2>
          
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Lihat suasana seru, kehangatan edukasi, serta kegembiraan para peserta dan nasabah Pegadaian saat membawa pulang doorprise emas pada sesi acara sebelumnya.
          </p>

          <div className="pt-2 flex items-center justify-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Acara Resmi Pegadaian</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>100% Suasana Nyata</span>
            </div>
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              onClick={() => setSelectedIndex(index)}
              className="group relative bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-700/80 shadow-lg hover:border-emerald-500/60 transition-all duration-300 cursor-pointer hover:-translate-y-1"
            >
              <div className="aspect-4/3 overflow-hidden bg-slate-950 relative">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Zoom Icon Overlay */}
                <div className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/80 backdrop-blur-md text-amber-400 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              {/* Card Footer Info */}
              <div className="p-4 space-y-1.5 relative z-10 -mt-12 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent pt-6">
                <h3 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                  {item.title}
                </h3>
                {item.caption && (
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {item.caption}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeItem && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 rounded-full bg-slate-800/80 text-slate-200 hover:text-white hover:bg-slate-700 transition-all z-50 cursor-pointer"
            title="Tutup (Esc)"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Controls */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-800/80 text-white hover:bg-emerald-600 transition-all z-50 cursor-pointer shadow-lg"
            title="Foto Sebelumnya"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-800/80 text-white hover:bg-emerald-600 transition-all z-50 cursor-pointer shadow-lg"
            title="Foto Selanjutnya"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Main Content Box */}
          <div
            className="max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[70vh] rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-black">
              <img
                src={activeItem.url}
                alt={activeItem.title}
                className="max-h-[70vh] w-auto max-w-full object-contain mx-auto"
              />
            </div>

            <div className="text-center max-w-2xl px-4 space-y-1">
              <div className="text-xs text-amber-400 font-semibold tracking-wider">
                FOTO {selectedIndex + 1} DARI {gallery.length}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {activeItem.title}
              </h3>
              {activeItem.caption && (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {activeItem.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
