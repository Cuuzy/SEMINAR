import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UpcEvent } from '../types';
import { MapPin, Calendar, Clock, Users, ArrowRight, Phone, Sparkles, Building2, CheckCircle2, ShieldCheck, Navigation, Flame, AlertTriangle, AlertCircle } from 'lucide-react';

interface UpcEventListProps {
  upcEvents?: UpcEvent[];
  onSelectUpc: (upcName: string) => void;
}

export const UpcEventList: React.FC<UpcEventListProps> = ({
  upcEvents = [],
  onSelectUpc
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const filteredEvents = upcEvents.filter((evt) => {
    if (selectedFilter === 'ALL') return true;
    return evt.upcName.toLowerCase().includes(selectedFilter.toLowerCase());
  });

  return (
    <section id="jadwal-upc" className="py-16 bg-slate-50 relative overflow-hidden">
      {/* Decorative Gradient Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-3 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-emerald-600" />
            Cabang & Unit Pelayanan Cabang (UPC) Resmi
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Daftar Acara Gathering per Cabang & UPC Pegadaian
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Pilih lokasi <strong>CP Ciledug</strong>, <strong>UPC Pabuaran</strong>, <strong>UPC Sindanglaut</strong>, <strong>UPC Sedong</strong>, atau <strong>UPC Karangsembung</strong> terdekat dari kediaman Anda untuk mengikuti edukasi emas & promo khusus secara tatap muka.
          </p>
        </motion.div>

        {/* UPC Navigation Tabs / Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto p-1.5 bg-slate-200/80 rounded-2xl border border-slate-300/80 shadow-xs"
        >
          <button
            type="button"
            onClick={() => setSelectedFilter('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'ALL'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-300/60'
            }`}
          >
            Semua Lokasi
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('Ciledug')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'Ciledug'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-300/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            CP Ciledug
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('Pabuaran')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'Pabuaran'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-300/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            UPC Pabuaran
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('Sindanglaut')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'Sindanglaut'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-300/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            UPC Sindanglaut
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('Sedong')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'Sedong'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-300/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            UPC Sedong
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('Karangsembung')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'Karangsembung'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-300/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            UPC Karangsembung
          </button>
        </motion.div>

        {/* UPC Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((evt, idx) => {
            const quotaPercent = Math.min(100, Math.round((evt.registered / evt.quota) * 100));
            const remaining = Math.max(0, evt.quota - evt.registered);

            // Capacity indicator configuration
            let capStatus = {
              badgeText: 'KUOTA TERSEDIA',
              badgeStyle: 'bg-emerald-800/80 text-emerald-200 border-emerald-400/40',
              pillStyle: 'bg-emerald-100 text-emerald-800 border-emerald-300',
              icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
              barGradient: 'from-emerald-600 to-emerald-500',
            };

            if (remaining === 0) {
              capStatus = {
                badgeText: 'KUOTA PENUH',
                badgeStyle: 'bg-rose-600 text-white border-rose-400 shadow-sm',
                pillStyle: 'bg-rose-100 text-rose-800 border-rose-300 font-extrabold',
                icon: <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />,
                barGradient: 'from-rose-600 to-rose-700',
              };
            } else if (remaining <= 10 || quotaPercent >= 80) {
              capStatus = {
                badgeText: 'HAMPIR PENUH',
                badgeStyle: 'bg-amber-400 text-emerald-950 font-black border-amber-300 animate-pulse shadow-md',
                pillStyle: 'bg-amber-100 text-amber-950 border-amber-400 font-extrabold animate-pulse',
                icon: <Flame className="w-3.5 h-3.5 text-rose-600 shrink-0 fill-rose-500" />,
                barGradient: 'from-amber-500 via-orange-500 to-rose-500',
              };
            } else if (quotaPercent >= 50) {
              capStatus = {
                badgeText: 'CEPAT TERISI',
                badgeStyle: 'bg-amber-500/30 text-amber-300 border-amber-400/60',
                pillStyle: 'bg-amber-50 text-amber-900 border-amber-300 font-bold',
                icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
                barGradient: 'from-emerald-600 to-amber-500',
              };
            }

            return (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, scale: 1.02 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: idx * 0.08, ease: 'easeOut' }}
                className="bg-white rounded-3xl border border-slate-200/90 hover:border-emerald-400/60 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer"
              >
                <div>
                  {/* Top Header Box */}
                  <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 p-5 text-white space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-amber-400 text-emerald-950 font-extrabold text-[11px] tracking-wide uppercase shadow-xs">
                        {evt.upcName}
                      </span>
                      {/* Visually Distinct Scheduled Date Badge */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-300 text-emerald-950 font-black text-xs shadow-md border border-amber-400 animate-pulse">
                        <Calendar className="w-3.5 h-3.5 text-emerald-950 shrink-0" />
                        <span>{evt.eventDate}</span>
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base sm:text-lg text-white leading-snug group-hover:text-amber-300 transition-colors">
                      {evt.title}
                    </h3>

                    <div className="flex items-center justify-between text-xs text-emerald-200 pt-1">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Sesi Kemitraan & Edukasi Resmi</span>
                      </div>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border shadow-xs ${capStatus.badgeStyle}`}>
                        {capStatus.badgeText}
                      </span>
                    </div>
                  </div>

                  {/* Body Info Details */}
                  <div className="p-5 sm:p-6 space-y-5">
                    
                    {/* Highlighted Schedule Date & Time Box */}
                    <div className="bg-gradient-to-r from-amber-50 to-emerald-50/70 p-3.5 rounded-2xl border border-amber-200 shadow-xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-amber-400 text-emerald-950 rounded-lg shadow-xs">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] text-amber-900 font-extrabold uppercase tracking-wider block">Tanggal Pelaksanaan</span>
                            <span className="text-slate-900 font-black text-sm">{evt.eventDate}</span>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-800 text-white rounded-lg font-bold text-xs shadow-xs">
                          {evt.eventTime}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-amber-200/80 flex items-start gap-2 text-xs text-slate-700">
                        <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-900">{evt.venueName}</p>
                          <p className="text-[11px] text-slate-600 leading-tight">{evt.address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {evt.description}
                    </p>

                    {/* Benefits Tags */}
                    {evt.specialBenefits && evt.specialBenefits.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Facility & Promo UPC:
                        </p>
                        <div className="space-y-1">
                          {evt.specialBenefits.map((bnf, bIdx) => (
                            <div key={bIdx} className="flex items-center gap-2 text-xs text-emerald-900 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{bnf}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contact Person Box */}
                    <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 flex items-center justify-between gap-2 text-xs">
                      <div>
                        <p className="text-[10px] text-amber-800 font-semibold uppercase">Penanggung Jawab UPC</p>
                        <p className="font-bold text-slate-900">{evt.contactPerson}</p>
                      </div>
                      <a
                        href={`https://wa.me/${evt.contactPhone}?text=${encodeURIComponent(`Halo ${evt.contactPerson}, saya ingin mendaftar Mini Gathering di ${evt.upcName}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg flex items-center gap-1 font-bold text-[11px] transition-colors cursor-pointer shrink-0"
                        title="Hubungi Panitia UPC"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Chat WA</span>
                      </a>
                    </div>

                    {/* Quota Progress with Capacity Status Indicator */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-700 flex items-center gap-1 font-bold">
                          <Users className="w-3.5 h-3.5 text-emerald-700" /> Kuota Peserta:
                        </span>
                        
                        {/* Status Capacity Indicator Pill */}
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] border shadow-2xs ${capStatus.pillStyle}`}>
                          {capStatus.icon}
                          <span>{capStatus.badgeText} ({remaining} Sisa)</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                        <span>Terisi: <strong className="text-slate-900 font-black">{evt.registered}</strong> / {evt.quota} orang</span>
                        <span className="font-mono font-bold text-slate-700">{quotaPercent}%</span>
                      </div>

                      <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden p-0.5 border border-slate-300/60 shadow-inner">
                        <div
                          className={`h-full bg-gradient-to-r ${capStatus.barGradient} rounded-full transition-all duration-500`}
                          style={{ width: `${quotaPercent}%` }}
                        />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="p-5 pt-0 space-y-2">
                  <button
                    type="button"
                    onClick={() => onSelectUpc(evt.upcName)}
                    className="w-full py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer group-hover:bg-emerald-900"
                  >
                    <span>Daftar Acara di {evt.upcName}</span>
                    <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <a
                    href={evt.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-slate-500" />
                    <span>Petunjuk Lokasi Maps</span>
                  </a>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Informational Banner Footer */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.6 }}
          className="p-6 bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-900 rounded-3xl text-white border border-amber-400/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl"
        >
          <div className="space-y-1.5 text-center md:text-left">
            <h4 className="font-extrabold text-lg text-white flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Ingin Menyelenggarakan Gathering di UPC Lainnya?
            </h4>
            <p className="text-xs sm:text-sm text-emerald-200 max-w-2xl">
              Kami siap memfasilitasi kelompok wirausaha, instansi, atau komunitas lokal di wilayah Cirebon dan sekitarnya untuk sesi edukasi investasi emas khusus.
            </p>
          </div>

          <a
            href="https://wa.me/6281234567890?text=Halo%20Pegadaian,%20saya%20ingin%20mengajukan%20gathering%20edukasi%20emas%20di%20UPC%20kami"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs rounded-xl shadow-md transition-all shrink-0 cursor-pointer text-center"
          >
            Hubungi Tim Kemitraan Pegadaian
          </a>
        </motion.div>

      </div>
    </section>
  );
};
