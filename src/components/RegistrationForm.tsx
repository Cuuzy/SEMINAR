import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Phone, Mail, Briefcase, MapPin, Target, Users, MessageSquare, Send, CheckCircle2, AlertCircle, Loader2, Sparkles, Building2 } from 'lucide-react';
import { Participant, RegistrationPayload } from '../types';

interface RegistrationFormProps {
  isRegistrationOpen: boolean;
  remainingQuota: number;
  selectedUpc?: string;
  onSuccessRegistration: (participant: Participant) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  isRegistrationOpen,
  remainingQuota,
  selectedUpc,
  onSuccessRegistration
}) => {
  const [formData, setFormData] = useState<RegistrationPayload>({
    fullName: '',
    phone: '',
    email: '',
    occupation: 'Karyawan Swasta',
    branch: selectedUpc || 'UPC Sindanglaut',
    investmentGoal: 'Tabungan Masa Depan',
    attendanceCount: 1,
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (selectedUpc) {
      setFormData(prev => ({
        ...prev,
        branch: selectedUpc
      }));
    }
  }, [selectedUpc]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'attendanceCount' ? Number(value) : value
    }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setErrorMessage('Silakan lengkapi Nama, Nomor WhatsApp, dan Email Anda.');
      return;
    }

    if (formData.phone.length < 9) {
      setErrorMessage('Nomor WhatsApp / HP tidak valid. Masukkan nomor telepon aktif.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Gagal mengirimkan pendaftaran.');
      }

      // Success
      onSuccessRegistration(data.participant);
      // Reset form
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        occupation: 'Karyawan Swasta',
        branch: 'Pegadaian CP Senen',
        investmentGoal: 'Tabungan Masa Depan',
        attendanceCount: 1,
        notes: ''
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="pendaftaran" className="py-16 bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 text-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-3 mb-10"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            Formulir Pendaftaran Resmi
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Amankan Kursi Mini Gathering Emas Anda
          </h2>
          <p className="text-emerald-200/90 text-sm sm:text-base max-w-xl mx-auto">
            Isi data diri di bawah ini secara lengkap. Tiket dan konfirmasi QR Code akan langsung diterbitkan secara real-time.
          </p>
        </motion.div>

        {/* Form Container Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-emerald-950/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-amber-400/30 shadow-2xl relative"
        >
          
          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/90 border border-rose-500/50 text-rose-200 text-xs sm:text-sm flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-100">Gagal Memproses Pendaftaran:</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-emerald-200 uppercase tracking-wide">
                  Nama Lengkap Peserta *
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-emerald-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Contoh: Budi Santoso"
                    required
                    disabled={!isRegistrationOpen || loading}
                    className="w-full bg-emerald-900/60 border border-emerald-700/80 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-emerald-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                  />
                </div>
              </div>

              {/* WhatsApp Phone */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-emerald-200 uppercase tracking-wide">
                  Nomor WhatsApp / HP *
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-emerald-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Contoh: 081234567890"
                    required
                    disabled={!isRegistrationOpen || loading}
                    className="w-full bg-emerald-900/60 border border-emerald-700/80 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-emerald-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                  />
                </div>
                <p className="text-[11px] text-emerald-400">Kode tiket & reminder acara akan dikirimkan via WhatsApp.</p>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-emerald-200 uppercase tracking-wide">
                  Alamat Email Aktif *
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-emerald-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nama@email.com"
                    required
                    disabled={!isRegistrationOpen || loading}
                    className="w-full bg-emerald-900/60 border border-emerald-700/80 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-emerald-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                  />
                </div>
              </div>

              {/* Occupation */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-emerald-200 uppercase tracking-wide">
                  Pekerjaan / Profesi Saat Ini
                </label>
                <div className="relative">
                  <Briefcase className="w-5 h-5 text-emerald-400 absolute left-3.5 top-3.5" />
                  <select
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    disabled={!isRegistrationOpen || loading}
                    className="w-full bg-emerald-900/60 border border-emerald-700/80 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                  >
                    <option value="Karyawan Swasta" className="bg-emerald-950 text-white">Karyawan Swasta</option>
                    <option value="Wiraswasta / Pemilik UMKM" className="bg-emerald-950 text-white">Wiraswasta / Pemilik UMKM</option>
                    <option value="PNS / ASN / BUMN" className="bg-emerald-950 text-white">PNS / ASN / BUMN</option>
                    <option value="Ibu Rumah Tangga" className="bg-emerald-950 text-white">Ibu Rumah Tangga</option>
                    <option value="Professional / Dokter / Pengacara" className="bg-emerald-950 text-white">Professional / Dokter / Pengacara</option>
                    <option value="Mahasiswa / Pelajar" className="bg-emerald-950 text-white">Mahasiswa / Pelajar</option>
                    <option value="Lainnya" className="bg-emerald-950 text-white">Lainnya</option>
                  </select>
                </div>
              </div>

              {/* Preferred Branch / UPC */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-emerald-200 uppercase tracking-wide flex items-center justify-between">
                  <span>Lokasi Acara / Cabang & UPC Pegadaian *</span>
                  {(formData.branch.startsWith('UPC') || formData.branch.startsWith('CP')) && (
                    <span className="text-[10px] text-amber-300 font-bold bg-emerald-900/90 px-2 py-0.5 rounded border border-amber-400/30">
                      Terpilih: {formData.branch}
                    </span>
                  )}
                </label>
                <div className="relative">
                  <Building2 className="w-5 h-5 text-emerald-400 absolute left-3.5 top-3.5" />
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    disabled={!isRegistrationOpen || loading}
                    className="w-full bg-emerald-900/60 border border-emerald-700/80 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-bold"
                  >
                    <optgroup label="--- Kantor Cabang ---" className="bg-emerald-950 font-bold text-amber-300">
                      <option value="CP Ciledug" className="bg-emerald-950 text-white font-semibold">CP Ciledug</option>
                    </optgroup>
                    <optgroup label="--- Unit Pelayanan Cabang (UPC) ---" className="bg-emerald-950 font-bold text-emerald-300">
                      <option value="UPC Pabuaran" className="bg-emerald-950 text-white font-semibold">UPC Pabuaran</option>
                      <option value="UPC Sindanglaut" className="bg-emerald-950 text-white font-semibold">UPC Sindanglaut</option>
                      <option value="UPC Sedong" className="bg-emerald-950 text-white font-semibold">UPC Sedong</option>
                      <option value="UPC Karangsembung" className="bg-emerald-950 text-white font-semibold">UPC Karangsembung</option>
                    </optgroup>
                  </select>
                </div>
                <p className="text-[11px] text-emerald-400">Pilih lokasi Cabang atau UPC yang paling dekat dengan domisili Anda.</p>
              </div>

              {/* Investment Goal */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-emerald-200 uppercase tracking-wide">
                  Tujuan Utama Investasi Emas
                </label>
                <div className="relative">
                  <Target className="w-5 h-5 text-emerald-400 absolute left-3.5 top-3.5" />
                  <select
                    name="investmentGoal"
                    value={formData.investmentGoal}
                    onChange={handleChange}
                    disabled={!isRegistrationOpen || loading}
                    className="w-full bg-emerald-900/60 border border-emerald-700/80 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                  >
                    <option value="Tabungan Masa Depan" className="bg-emerald-950 text-white">Tabungan Masa Depan</option>
                    <option value="Dana Pendidikan Anak" className="bg-emerald-950 text-white">Dana Pendidikan Anak</option>
                    <option value="Proteksi Inflasi & Nilai Mata Uang" className="bg-emerald-950 text-white">Proteksi Inflasi & Nilai Mata Uang</option>
                    <option value="Persiapan Dana Pensiun" className="bg-emerald-950 text-white">Persiapan Dana Pensiun</option>
                    <option value="Pengembangan Modal Bisnis" className="bg-emerald-950 text-white">Pengembangan Modal Bisnis</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Attendance Count */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-emerald-200 uppercase tracking-wide">
                Jumlah Kehadiran Peserta
              </label>
              <div className="flex items-center gap-4">
                <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.attendanceCount === 1 
                    ? 'bg-amber-400 text-emerald-950 font-bold border-amber-300' 
                    : 'bg-emerald-900/50 text-white border-emerald-700'
                }`}>
                  <input
                    type="radio"
                    name="attendanceCount"
                    value={1}
                    checked={formData.attendanceCount === 1}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span>1 Orang (Hanya Saya)</span>
                </label>

                <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.attendanceCount === 2 
                    ? 'bg-amber-400 text-emerald-950 font-bold border-amber-300' 
                    : 'bg-emerald-900/50 text-white border-emerald-700'
                }`}>
                  <input
                    type="radio"
                    name="attendanceCount"
                    value={2}
                    checked={formData.attendanceCount === 2}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span>2 Orang (Membawa Pendamping)</span>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-emerald-200 uppercase tracking-wide">
                Catatan Khusus / Pertanyaan Untuk Narasumber (Opsional)
              </label>
              <div className="relative">
                <MessageSquare className="w-5 h-5 text-emerald-400 absolute left-3.5 top-3.5" />
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Tuliskan pertanyaan investasi emas yang ingin dijawab saat sesi acara..."
                  rows={2}
                  disabled={!isRegistrationOpen || loading}
                  className="w-full bg-emerald-900/60 border border-emerald-700/80 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-emerald-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isRegistrationOpen || loading || remainingQuota <= 0}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-extrabold text-base shadow-xl hover:shadow-amber-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Memproses Pendaftaran...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Kirim Pendaftaran & Dapatkan Tiket Digital
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-emerald-300/80">
              Dengan mendaftar, data Anda dijamin kerahasiaannya sesuai regulasi perlindungan data nasabah PT Pegadaian.
            </p>

          </form>
        </motion.div>

      </div>
    </section>
  );
};
