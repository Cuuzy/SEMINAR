import React from 'react';
import { Award, UserCheck, Star } from 'lucide-react';
import { Speaker } from '../types';

interface SpeakersSectionProps {
  speakers: Speaker[];
}

export const SpeakersSection: React.FC<SpeakersSectionProps> = ({ speakers }) => {
  return (
    <section id="pembicara" className="py-16 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            Narasumber & Pakar Investasi
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
            Belajar Langsung dari Pakar Emas & Perencana Keuangan
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Sesi talkshow eksklusif yang dibawakan langsung oleh profesional berpengalaman.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {speakers.map((speaker) => (
            <div
              key={speaker.id}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-center sm:items-start gap-6 group"
            >
              <div className="relative shrink-0">
                <img
                  src={speaker.photoUrl}
                  alt={speaker.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 border-emerald-600 shadow-md group-hover:scale-105 transition-transform"
                />
                <span className="absolute -bottom-2 -right-2 bg-amber-400 text-emerald-950 p-1.5 rounded-lg shadow-xs">
                  <Star className="w-4 h-4 fill-emerald-950" />
                </span>
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1">
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-md">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Keynote Speaker
                </div>

                <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">
                  {speaker.name}
                </h3>

                <p className="text-emerald-800 font-semibold text-xs sm:text-sm">
                  {speaker.title}
                </p>

                <p className="text-slate-500 text-xs">
                  {speaker.company}
                </p>

                <div className="pt-2 flex items-center justify-center sm:justify-start gap-2 text-slate-600 text-xs font-medium">
                  <Award className="w-4 h-4 text-amber-500" />
                  Pakar Investasi Emas & Perencanaan Finansial
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
