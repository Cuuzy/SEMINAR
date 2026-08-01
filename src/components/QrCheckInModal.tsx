import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { QrCode, X, CheckCircle2, AlertTriangle, UserCheck, Camera, Search, Volume2, VolumeX, Sparkles, RefreshCw, Phone, Building2, Users } from 'lucide-react';
import { Participant } from '../types';

interface QrCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
  onUpdateStatus: (id: string, newStatus: Participant['status']) => void;
}

export const QrCheckInModal: React.FC<QrCheckInModalProps> = ({
  isOpen,
  onClose,
  participants,
  onUpdateStatus,
}) => {
  const [manualCode, setManualCode] = useState('');
  const [scannedResult, setScannedResult] = useState<{
    status: 'success' | 'already' | 'not_found';
    participant?: Participant;
    message: string;
    scannedCode: string;
  } | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [availableCameras, setAvailableCameras] = useState<{ id: string; label: string }[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');

  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);
  const isTransitioningRef = useRef<boolean>(false);
  const isMountedRef = useRef<boolean>(true);
  const qrContainerId = 'qr-reader-viewport';

  // Web Audio synth for success / alert sound
  const playBeep = (type: 'success' | 'error' | 'already') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'success') {
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.35);
      } else if (type === 'already') {
        osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.25);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, audioCtx.currentTime); // A3
        osc.frequency.setValueAtTime(164.81, audioCtx.currentTime + 0.15); // E3
        gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.4);
      }
    } catch {
      // AudioContext not allowed or muted
    }
  };

  // Check-In Logic
  const handleProcessCode = (codeToTest: string) => {
    const cleanCode = codeToTest.trim().toUpperCase();
    if (!cleanCode) return;

    // Search by registrationCode or ID
    const found = participants.find(
      (p) =>
        p.registrationCode.toUpperCase() === cleanCode ||
        p.id.toUpperCase() === cleanCode ||
        p.phone.replaceAll(/[^0-9]/g, '') === cleanCode.replaceAll(/[^0-9]/g, '')
    );

    if (!found) {
      playBeep('error');
      setScannedResult({
        status: 'not_found',
        message: `Tiket dengan kode "${cleanCode}" tidak ditemukan di database.`,
        scannedCode: cleanCode,
      });
      return;
    }

    if (found.status === 'Attended') {
      playBeep('already');
      setScannedResult({
        status: 'already',
        participant: found,
        message: `Peserta "${found.fullName}" SUDAH check-in sebelumnya.`,
        scannedCode: cleanCode,
      });
      return;
    }

    // Process status update to Attended
    onUpdateStatus(found.id, 'Attended');
    playBeep('success');
    setScannedResult({
      status: 'success',
      participant: { ...found, status: 'Attended' },
      message: `BERHASIL CHECK-IN! Selamat Datang ${found.fullName}`,
      scannedCode: cleanCode,
    });
  };

  // Stop Camera Scanner
  const stopScanner = async () => {
    const scanner = html5QrcodeRef.current;
    if (!scanner) {
      setIsScanning(false);
      return;
    }

    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }
    } catch {
      // Catch and silence state transition errors during shutdown
    } finally {
      try {
        scanner.clear();
      } catch {
        // silence clear error
      }
      html5QrcodeRef.current = null;
      if (isMountedRef.current) {
        setIsScanning(false);
      }
    }
  };

  // Start Camera QR Scanner
  const startScanner = async (cameraId?: string) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setCameraError(null);

    try {
      await stopScanner();

      const container = document.getElementById(qrContainerId);
      if (!container || !isMountedRef.current) {
        isTransitioningRef.current = false;
        return;
      }

      const html5Qrcode = new Html5Qrcode(qrContainerId);
      html5QrcodeRef.current = html5Qrcode;

      const devices = await Html5Qrcode.getCameras();
      if (!isMountedRef.current) {
        await stopScanner();
        isTransitioningRef.current = false;
        return;
      }

      if (devices && devices.length > 0) {
        setAvailableCameras(devices.map((d) => ({ id: d.id, label: d.label || `Kamera ${d.id}` })));
        const targetCamId = cameraId || selectedCameraId || devices[devices.length - 1].id; // default back camera
        setSelectedCameraId(targetCamId);

        await html5Qrcode.start(
          targetCamId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            handleProcessCode(decodedText);
          },
          () => {
            // frame scan callback
          }
        );

        if (isMountedRef.current) {
          setIsScanning(true);
        } else {
          await stopScanner();
        }
      } else {
        setCameraError('Tidak ada perangkat kamera yang terdeteksi.');
      }
    } catch (err: unknown) {
      if (isMountedRef.current) {
        const errMsg = err instanceof Error ? err.message : String(err);
        setCameraError(`Gagal mengakses kamera: ${errMsg || 'Izin kamera ditolak atau tidak tersedia.'}`);
        setIsScanning(false);
      }
    } finally {
      isTransitioningRef.current = false;
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    if (isOpen) {
      // Delay start slightly to let DOM element mount
      const timer = setTimeout(() => {
        if (isMountedRef.current) {
          startScanner();
        }
      }, 300);
      return () => {
        isMountedRef.current = false;
        clearTimeout(timer);
        stopScanner();
      };
    } else {
      stopScanner();
      setScannedResult(null);
      setManualCode('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const attendedCount = participants.filter((p) => p.status === 'Attended').length;
  const verifiedCount = participants.filter((p) => p.status === 'Verified' || p.status === 'Attended').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-emerald-800/20 overflow-hidden my-6">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white p-5 flex items-center justify-between border-b border-emerald-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-400 text-emerald-950 font-black shadow-md">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-white">Scanner QR Check-In Tiket</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-700 text-amber-300 text-[10px] font-bold border border-amber-300/40">
                  REAL-TIME GATE
                </span>
              </div>
              <p className="text-xs text-emerald-200">Arahkan QR tiket ke kamera atau masukkan kode tiket peserta.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                soundEnabled ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-emerald-950/60 text-slate-400'
              }`}
              title={soundEnabled ? 'Suara Check-in Aktif' : 'Suara Di-Mute'}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-emerald-950/60 text-emerald-200 hover:text-white hover:bg-rose-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Attendance Counter Ticker */}
        <div className="bg-emerald-950 text-white px-6 py-2.5 flex items-center justify-between text-xs border-b border-emerald-800/80">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span className="text-emerald-200">Progres Kehadiran Hari Ini:</span>
          </div>
          <div className="flex items-center gap-4 font-bold">
            <span className="text-amber-300">
              {attendedCount} <span className="text-emerald-400 font-normal">Hadir</span>
            </span>
            <span className="text-emerald-600">|</span>
            <span className="text-emerald-200">
              {verifiedCount} <span className="text-emerald-400 font-normal font-sans">Terverifikasi</span>
            </span>
            <span className="text-emerald-600">|</span>
            <span className="text-white">
              {participants.length} <span className="text-emerald-400 font-normal">Total Pendaftar</span>
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* CAMERA SCANNER AREA */}
          <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 text-white space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2 font-bold">
                <Camera className="w-4 h-4 text-amber-400" />
                <span>Kamera Lensa Check-In</span>
              </div>

              {availableCameras.length > 1 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400">Pilih Kamera:</span>
                  <select
                    value={selectedCameraId}
                    onChange={(e) => {
                      setSelectedCameraId(e.target.value);
                      startScanner(e.target.value);
                    }}
                    className="bg-slate-800 text-white text-xs py-1 px-2 rounded-lg border border-slate-700 focus:outline-none cursor-pointer"
                  >
                    {availableCameras.map((cam) => (
                      <option key={cam.id} value={cam.id}>
                        {cam.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Viewport element for html5-qrcode */}
            <div className="relative rounded-xl overflow-hidden bg-black min-h-[260px] flex items-center justify-center border border-slate-800">
              <div id={qrContainerId} className="w-full h-full max-w-sm mx-auto" />

              {!isScanning && !cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-950/80 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
                  <p className="text-xs text-slate-300 font-semibold">Memuat perangkat kamera...</p>
                </div>
              )}

              {cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-950 text-center space-y-3">
                  <AlertTriangle className="w-10 h-10 text-rose-500" />
                  <p className="text-xs text-rose-300 font-semibold">{cameraError}</p>
                  <button
                    type="button"
                    onClick={() => startScanner()}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    Coba Hubungkan Ulang Kamera
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* MANUAL CODE ENTRY FIELD */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 space-y-2">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Search className="w-4 h-4 text-emerald-700" />
              Atau Masukkan Kode Tiket / No. HP Manual:
            </label>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleProcessCode(manualCode);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Contoh: REG-102938 atau 08123456789"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="flex-1 bg-white border border-slate-300 font-mono font-bold text-slate-900 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <UserCheck className="w-4 h-4" />
                Check-In Manual
              </button>
            </form>
          </div>

          {/* RESULT CARD BANNER */}
          {scannedResult && (
            <div className="animate-fade-in space-y-3">
              {/* SUCCESS RESULT */}
              {scannedResult.status === 'success' && scannedResult.participant && (
                <div className="bg-emerald-50 border-2 border-emerald-500 p-5 rounded-2xl space-y-4 shadow-lg">
                  <div className="flex items-start justify-between gap-3 border-b border-emerald-200/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-sm">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/80 px-2.5 py-0.5 rounded-full border border-emerald-400">
                          CHECK-IN BERHASIL
                        </span>
                        <h4 className="text-lg font-black text-emerald-950 mt-0.5">
                          {scannedResult.participant.fullName}
                        </h4>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-900 bg-white px-2.5 py-1 rounded-lg border border-emerald-300">
                      {scannedResult.participant.registrationCode}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-200/60">
                      <span className="text-slate-500 block text-[10px]">No. WhatsApp:</span>
                      <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        {scannedResult.participant.phone}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-emerald-200/60">
                      <span className="text-slate-500 block text-[10px]">Cabang / UPC:</span>
                      <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                        {scannedResult.participant.branch}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-emerald-200/60">
                      <span className="text-slate-500 block text-[10px]">Kehadiran Rombongan:</span>
                      <span className="font-extrabold text-emerald-900 flex items-center gap-1 mt-0.5">
                        <Users className="w-3.5 h-3.5 text-emerald-600" />
                        {scannedResult.participant.attendanceCount} Orang
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <p className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Status telah diperbarui ke <strong className="underline">Attended</strong> di database.
                    </p>
                    <button
                      type="button"
                      onClick={() => setScannedResult(null)}
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Scan Tiket Berikutnya →
                    </button>
                  </div>
                </div>
              )}

              {/* ALREADY CHECKED IN */}
              {scannedResult.status === 'already' && scannedResult.participant && (
                <div className="bg-amber-50 border-2 border-amber-400 p-5 rounded-2xl space-y-3 shadow-md">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-6 h-6 text-amber-600" />
                      <div>
                        <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full border border-amber-300">
                          PERINGATAN: TIKET SUDAH DIGUNAKAN
                        </span>
                        <h4 className="text-base font-bold text-amber-950 mt-0.5">
                          {scannedResult.participant.fullName} ({scannedResult.participant.registrationCode})
                        </h4>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-amber-900 font-medium">
                    Peserta ini sudah berstatus <strong className="text-amber-950 font-black">Attended</strong> (Sudah Masuk Gate). Mohon pastikan tidak ada penggandaan tiket.
                  </p>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setScannedResult(null)}
                      className="px-4 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Lanjut Scan
                    </button>
                  </div>
                </div>
              )}

              {/* NOT FOUND RESULT */}
              {scannedResult.status === 'not_found' && (
                <div className="bg-rose-50 border-2 border-rose-400 p-5 rounded-2xl space-y-3 shadow-md">
                  <div className="flex items-center gap-2.5">
                    <X className="w-6 h-6 text-rose-600 p-1 bg-rose-200 rounded-full" />
                    <div>
                      <h4 className="text-sm font-black text-rose-950">Kode Tiket Tidak Ditemukan!</h4>
                      <p className="text-xs text-rose-800">{scannedResult.message}</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setScannedResult(null)}
                      className="px-4 py-1.5 bg-rose-200 hover:bg-rose-300 text-rose-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Coba Kode Lain
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Gate Scanner Check-In Mini Gathering Pegadaian</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Tutup Scanner
          </button>
        </div>

      </div>
    </div>
  );
};
