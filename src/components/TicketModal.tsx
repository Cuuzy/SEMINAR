import React from 'react';
import { CheckCircle, QrCode, Calendar, MapPin, Download, X, MessageCircle, ShieldCheck, Sparkles, User, Users } from 'lucide-react';
import { Participant, EventContent } from '../types';

interface TicketModalProps {
  participant: Participant | null;
  eventContent: EventContent;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  participant,
  eventContent,
  onClose
}) => {
  if (!participant) return null;

  const waMessage = `Halo Panitia Pegadaian, saya *${participant.fullName}* telah mendaftar Mini Gathering Emas dengan Kode Tiket: *${participant.registrationCode}*. Mohon konfirmasi kehadiran.`;
  const waUrl = `https://wa.me/${eventContent.contactWhatsapp}?text=${encodeURIComponent(waMessage)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-amber-400/40 overflow-hidden my-8">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-emerald-950/50 text-emerald-200 hover:text-white hover:bg-emerald-950 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300">
              <CheckCircle className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Pendaftaran Berhasil Terverifikasi!
            </span>
          </div>

          <h3 className="text-2xl font-extrabold text-white tracking-tight">
            Tiket Digital Pendaftaran
          </h3>
          <p className="text-xs text-emerald-200 mt-1">
            Simpan screenshot atau kode tiket di bawah ini untuk ditunjukkan saat check-in di lokasi.
          </p>
        </div>

        {/* Ticket Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Ticket ID Box */}
          <div className="bg-gradient-to-r from-emerald-50 via-amber-50 to-emerald-50 p-4 rounded-2xl border-2 border-dashed border-emerald-300 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest">
                Kode Tiket Resmi
              </p>
              <p className="text-2xl font-black text-emerald-950 font-mono tracking-wider mt-0.5">
                {participant.registrationCode}
              </p>
            </div>
            
            {/* QR Code Image */}
            <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col items-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(participant.registrationCode)}`}
                alt={`QR Code ${participant.registrationCode}`}
                className="w-16 h-16 object-contain rounded"
              />
              <span className="text-[9px] font-extrabold text-emerald-800 mt-1">QR Valid Check-In</span>
            </div>
          </div>

          {/* Participant Details */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs text-slate-700">
            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 flex items-center gap-1"><User className="w-3.5 h-3.5" /> Nama Lengkap:</span>
              <span className="font-bold text-slate-900">{participant.fullName}</span>
            </div>

            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Jumlah Kehadiran:</span>
              <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">{participant.attendanceCount} Orang</span>
            </div>

            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">Cabang Pegadaian:</span>
              <span className="font-medium text-slate-900">{participant.branch}</span>
            </div>

            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">Tujuan Investasi:</span>
              <span className="font-medium text-slate-900">{participant.investmentGoal}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Tanggal Waktu Acara:</span>
              <span className="font-semibold text-slate-900 text-right">{eventContent.eventDate}<br/>{eventContent.eventTime}</span>
            </div>
          </div>

          {/* Location Info */}
          <div className="p-3.5 rounded-xl bg-emerald-900/5 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-950">{eventContent.venueName}</p>
              <p className="text-slate-600 text-[11px]">{eventContent.venueAddress}</p>
            </div>
          </div>

          {/* Actions CTA */}
          <div className="space-y-3 pt-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm text-center flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              Konfirmasi Kehadiran via WhatsApp Panitia
            </a>

            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" /> Cetak / Simpan Tiket
              </button>
              <button
                onClick={onClose}
                className="py-2.5 px-6 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>

        </div>

        {/* Footer Disclaimer */}
        <div className="bg-slate-100 px-6 py-3 text-center border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          PT Pegadaian • Terdaftar & Diawasi oleh Otoritas Jasa Keuangan (OJK)
        </div>

      </div>
    </div>
  );
};
