import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import XLSX from 'xlsx';
import { EventContent, Participant, RegistrationPayload } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// Path to JSON DB file
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default initial state
const defaultContent: EventContent = {
  logoUrl: '',
  logoText: 'PEGADAIAN',
  logoSubtext: 'Mini Gathering Eksklusif',
  logoBadge: 'EMAS',
  title: 'Mini Gathering Emas Pegadaian 2026',
  subtitle: 'Edukasi & Investasi Cerdas Cuan Bersama Tabungan Emas & Cicil Emas Pegadaian',
  badgeText: 'Eksklusif • Gratis & Kuota Terbatas',
  eventDate: 'Sabtu, 22 Agustus 2026',
  eventTime: '08:30 - 12:00 WIB',
  eventTimestamp: '2026-08-22T08:30:00',
  venueName: 'Grand Ballroom Pegadaian Head Office',
  venueAddress: 'Jl. Kramat Raya No. 162, Senen, Jakarta Pusat',
  venueMapUrl: 'https://maps.google.com/?q=Pegadaian+Kramat+Raya',
  totalQuota: 100,
  isRegistrationOpen: true,
  contactWhatsapp: '6281234567890',
  benefits: [
    {
      id: 'b1',
      title: 'Edukasi Portofolio Emas',
      description: 'Pahami strategi perlindungan nilai aset dari inflasi melalui Emas Fisik & Tabungan Emas Pegadaian.',
      iconName: 'TrendingUp'
    },
    {
      id: 'b2',
      title: 'Promo & CashBack Khusus',
      description: 'Diskon biaya admin, gratis saldo awal Tabungan Emas, dan cashback khusus transaksi di tempat.',
      iconName: 'Tag'
    },
    {
      id: 'b3',
      title: 'Konsultasi Finansial Gratis',
      description: 'Sesi konsultasi privat bersama Financial Planner terlisensi untuk perencanaan dana pensiun & pendidikan.',
      iconName: 'Users'
    },
    {
      id: 'b4',
      title: 'Doorprise & Souvenir Emas',
      description: 'Kesempatan memenangkan Doorprise Emas Batangan Galeri 24, Goodie Bag eksklusif, & Snack Box.',
      iconName: 'Gift'
    }
  ],
  speakers: [
    {
      id: 's1',
      name: 'Budi Santoso, S.E., M.M.',
      title: 'Senior Manager Gold Investment',
      company: 'PT Pegadaian (Persero)',
      photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 's2',
      name: 'Ratna Kartika, CFP®',
      title: 'Independent Financial Planner',
      company: 'Certified Financial Consultant',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
    }
  ],
  agenda: [
    { id: 'a1', time: '08:30 - 09:00', title: 'Registrasi Ulang & Welcome Drink', description: 'Check-in peserta, penyerahan name tag, & menikmati hidangan selamat datang.' },
    { id: 'a2', time: '09:00 - 09:15', title: 'Pembukaan & Sambutan Official', description: 'Menyanyikan lagu Indonesia Raya & sambutan Pimpinan Pegadaian.' },
    { id: 'a3', time: '09:15 - 10:30', title: 'Talkshow Interaktif: Emas Sebagai Aset Aman', description: 'Pemaparan strategi investasi emas, tren harga emas dunia, & tips cicil emas.' },
    { id: 'a4', time: '10:30 - 11:15', title: 'Live Demo & Penawaran Promo Eksklusif', description: 'Panduan aplikasi Aplikasi Pegadaian Digital & promo cashback di lokasi.' },
    { id: 'a5', time: '11:15 - 12:00', title: 'Tanya Jawab, Doorprise Emas & Penutupan', description: 'Diskusi interaktif, pengundian doorprise Emas Batangan, & foto bersama.' }
  ],
  faq: [
    { question: 'Apakah acara ini dipungut biaya?', answer: 'Tidak, acara ini 100% GRATIS dan peserta akan mendapatkan snack box, souvenir, serta sertifikat keikutsertaan.' },
    { question: 'Siapa saja yang boleh mendaftar?', answer: 'Acara ini terbuka untuk umum, nasabah Pegadaian, maupun masyarakat yang ingin mulai berinvestasi emas secara aman.' },
    { question: 'Bagaimana cara konfirmasi kehadiran saya?', answer: 'Setelah mendaftar, Anda akan mendapatkan kode tiket pendaftaran dan tombol WhatsApp otomatis untuk konfirmasi tim panitia.' },
    { question: 'Apakah bisa melakukan pembukaan rekening Tabungan Emas di lokasi?', answer: 'Bisa! Tim Pegadaian siap membantu pembukaan rekening Tabungan Emas dan transaksi Cicil Emas langsung di tempat dengan promo khusus.' }
  ],
  gallery: [
    {
      id: 'g1',
      url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
      title: 'Antusiasme Peserta Gathering Emas',
      caption: 'Sesi talkshow interaktif di Mini Gathering Pegadaian sebelumnya bersama 100+ nasabah.'
    },
    {
      id: 'g2',
      url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
      title: 'Sesi Diskusi & Konsultasi Finansial',
      caption: 'Peserta berkonsultasi langsung mengenai portofolio investasi emas dengan pakar keuangan.'
    },
    {
      id: 'g3',
      url: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?w=800&auto=format&fit=crop&q=80',
      title: 'Display Emas Batangan Galeri 24',
      caption: 'Pameran fisik emas batangan Galeri 24 dan emas perhiasan Pegadaian saat acara.'
    },
    {
      id: 'g4',
      url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop&q=80',
      title: 'Penyerahan Doorprise Emas Batangan',
      caption: 'Momen kebahagiaan para pemenang doorprise emas batangan pada gathering periode lalu.'
    },
    {
      id: 'g5',
      url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
      title: 'Panduan Transaksi Pegadaian Digital',
      caption: 'Tim Pegadaian mendampingi peserta membuka rekening Tabungan Emas secara instan.'
    },
    {
      id: 'g6',
      url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80',
      title: 'Foto Bersama Peserta & Panitia',
      caption: 'Kebersamaan seluruh peserta dan jajaran manajemen Pegadaian di akhir sesi event.'
    }
  ],
  upcEvents: [
    {
      id: 'cp-ciledug',
      upcName: 'CP Ciledug',
      code: 'CP-CLDG',
      title: 'Grand Gathering & Edukasi Emas Pegadaian CP Ciledug',
      eventDate: 'Rabu, 19 Agustus 2026',
      eventTime: '08:30 - 11:30 WIB',
      venueName: 'Gedung Utama Pegadaian CP Ciledug',
      address: 'Jl. Merdeka No. 45, Ciledug, Kabupaten Cirebon',
      mapUrl: 'https://maps.google.com/?q=Pegadaian+Ciledug+Cirebon',
      quota: 75,
      registered: 52,
      contactPerson: 'Bapak Rahmat (Pemimpin Cabang CP Ciledug)',
      contactPhone: '6281234567800',
      status: 'OPEN',
      description: 'Acara puncak edukasi investasi Emas & layanan Pembiayaan Usaha bagi seluruh nasabah dan warga Ciledug dan sekitarnya. Bertabur doorprize menarik!',
      specialBenefits: ['Bebas Biaya Administrasi', 'Voucher Top Up Tabungan Emas', 'Goodie Bag Eksklusif CP Ciledug']
    },
    {
      id: 'upc-pabuaran',
      upcName: 'UPC Pabuaran',
      code: 'UPC-PBRN',
      title: 'Gathering Kemitraan & Solusi Finansial UPC Pabuaran',
      eventDate: 'Kamis, 20 Agustus 2026',
      eventTime: '13:30 - 16:00 WIB',
      venueName: 'Kantor Pegadaian UPC Pabuaran',
      address: 'Jl. Raya Pabuaran No. 18, Pabuaran, Kabupaten Cirebon',
      mapUrl: 'https://maps.google.com/?q=Pegadaian+Pabuaran+Cirebon',
      quota: 45,
      registered: 28,
      contactPerson: 'Ibu Ningsih (Pengelola UPC Pabuaran)',
      contactPhone: '6281234567804',
      status: 'OPEN',
      description: 'Program sosialisasi Cicil Emas Batangan Galeri 24 & Tabungan Emas untuk warga Pabuaran. Konsultasi langsung dengan petugas resmi.',
      specialBenefits: ['Gratis Pembukaan Tabungan Emas', 'Diskon Uang Muka Cicil Emas', 'Snack & Souvenir']
    },
    {
      id: 'upc-sindanglaut',
      upcName: 'UPC Sindanglaut',
      code: 'UPC-SNDL',
      title: 'Mini Gathering & Edukasi Investasi Emas UPC Sindanglaut',
      eventDate: 'Jumat, 21 Agustus 2026',
      eventTime: '09:00 - 12:00 WIB',
      venueName: 'Gedung Pertemuan UPC Sindanglaut',
      address: 'Jl. Raya Lemahabang - Sindanglaut No. 88, Lemahabang, Cirebon',
      mapUrl: 'https://maps.google.com/?q=Pegadaian+Sindanglaut',
      quota: 50,
      registered: 38,
      contactPerson: 'Bapak Agus (Kepala UPC Sindanglaut)',
      contactPhone: '6281234567801',
      status: 'OPEN',
      description: 'Sesi spesial edukasi cara aman investasi Tabungan Emas & Cicil Emas Galeri 24 khusus warga Sindanglaut dan sekitarnya. Gratis doorprise souvenir emas!',
      specialBenefits: ['Gratis Saldo Awal Tabungan Emas', 'Konsultasi Privat Portofolio', 'Snack Box & Souvenir Cantik']
    },
    {
      id: 'upc-sedong',
      upcName: 'UPC Sedong',
      code: 'UPC-SDNG',
      title: 'Gathering Cerdas Finansial & Panen Emas UPC Sedong',
      eventDate: 'Sabtu, 22 Agustus 2026',
      eventTime: '13:30 - 16:30 WIB',
      venueName: 'Aula Kemitraan Pegadaian UPC Sedong',
      address: 'Jl. Raya Sedong No. 12, Sedong Lor, Kec. Sedong, Cirebon',
      mapUrl: 'https://maps.google.com/?q=Pegadaian+Sedong',
      quota: 40,
      registered: 31,
      contactPerson: 'Ibu Maya (Customer Relationship UPC Sedong)',
      contactPhone: '6281234567802',
      status: 'OPEN',
      description: 'Panduan praktis perlindungan nilai aset dari inflasi melalui program Cicil Emas & Gadai Emas dengan cashback eksklusif transaksi di tempat.',
      specialBenefits: ['Diskon DP Cicil Emas Batangan', 'Doorprize Emas 0.5 Gram', 'Layanan Pembukaan Rekening On-Site']
    },
    {
      id: 'upc-karangsembung',
      upcName: 'UPC Karangsembung',
      code: 'UPC-KRSM',
      title: 'Seminar Wirausaha & Investasi Emas UPC Karangsembung',
      eventDate: 'Minggu, 23 Agustus 2026',
      eventTime: '08:30 - 11:30 WIB',
      venueName: 'Kantor Pegadaian UPC Karangsembung',
      address: 'Jl. Raya Karangsuhung No. 54, Karangsembung, Cirebon',
      mapUrl: 'https://maps.google.com/?q=Pegadaian+Karangsembung',
      quota: 60,
      registered: 49,
      contactPerson: 'Bapak Hendra (Penanggung Jawab UPC Karangsembung)',
      contactPhone: '6281234567803',
      status: 'LIMITED',
      description: 'Pertemuan eksklusif nasabah & pelaku usaha se-Karangsembung untuk strategi pengembangan modal bisnis dan ketahanan finansial berbasis Emas.',
      specialBenefits: ['Cashback Biaya Admin', 'Goodie Bag Eksklusif Pegadaian', 'Konsultasi Pembiayaan Usaha']
    }
  ],
  footerDescription: 'PT Pegadaian merupakan BUMN keuangan non-bank terpercaya di Indonesia yang melayani Tabungan Emas, Cicil Emas, Gadai Emas, dan Pembiayaan Usaha sejak 1901.',
  footerOfficeAddress: 'Jl. Kramat Raya No. 162, Senen, Jakarta Pusat',
  footerCallCenter: '1500569',
  footerEmail: 'humas@pegadaian.co.id',
  footerWebsite: 'www.pegadaian.co.id',
  footerCopyright: '© 2026 PT Pegadaian. Hak Cipta Dilindungi Undang-Undang.',
  footerOjkText: 'Terdaftar & Diawasi oleh Otoritas Jasa Keuangan (OJK)',
  footerServices: [
    'Tabungan Emas Pegadaian',
    'Cicil Emas Batangan Galeri 24',
    'Gadai Emas & Pembiayaan Hajj',
    'Aplikasi Pegadaian Digital'
  ]
};

const defaultParticipants: Participant[] = [
  {
    id: 'p1',
    fullName: 'Dede Kurniawan',
    phone: '081298765432',
    email: 'dede.kurniawan@gmail.com',
    occupation: 'Wiraswasta / Pemilik UMKM',
    branch: 'UPC Sindanglaut',
    investmentGoal: 'Tabungan Masa Depan',
    attendanceCount: 1,
    notes: 'Infin tahu syarat cicil emas di UPC Sindanglaut',
    registrationCode: 'PEG-UPC-8821',
    status: 'Verified',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  },
  {
    id: 'p2',
    fullName: 'Siti Nurjanah',
    phone: '085712345678',
    email: 'siti.nurjanah@yahoo.com',
    occupation: 'Ibu Rumah Tangga',
    branch: 'UPC Sedong',
    investmentGoal: 'Dana Pendidikan Anak',
    attendanceCount: 2,
    notes: 'Mendaftar bersama tetangga untuk acara di UPC Sedong',
    registrationCode: 'PEG-UPC-9102',
    status: 'Verified',
    createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString()
  },
  {
    id: 'p3',
    fullName: 'Bambang Sugianto',
    phone: '082134567890',
    email: 'bambang.sugianto@gmail.com',
    occupation: 'PNS / ASN / BUMN',
    branch: 'UPC Karangsembung',
    investmentGoal: 'Persiapan Dana Pensiun',
    attendanceCount: 1,
    notes: 'Konsultasi investasi emas jangka panjang di UPC Karangsembung',
    registrationCode: 'PEG-UPC-7742',
    status: 'Registered',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 'p4',
    fullName: 'Dewi Lestari',
    phone: '081345678910',
    email: 'dewi.lestari@outlook.com',
    occupation: 'PNS / ASN',
    branch: 'CP Ciledug',
    investmentGoal: 'Dana Pendidikan Anak',
    attendanceCount: 1,
    registrationCode: 'PEG-UPC-3341',
    status: 'Registered',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'p5',
    fullName: 'Hendra Setiawan',
    phone: '087811223344',
    email: 'hendra.setiawan@gmail.com',
    occupation: 'Wiraswasta / UMKM',
    branch: 'UPC Pabuaran',
    investmentGoal: 'Diversifikasi Aset',
    attendanceCount: 1,
    notes: 'Tertarik Cicil Emas Batangan di UPC Pabuaran',
    registrationCode: 'PEG-UPC-7712',
    status: 'Verified',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

// Helper to read DB
function readDb(): { content: EventContent; participants: Participant[] } {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = { content: defaultContent, participants: defaultParticipants };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      content: parsed.content || defaultContent,
      participants: parsed.participants || defaultParticipants
    };
  } catch (err) {
    console.error('Error reading DB, using defaults:', err);
    return { content: defaultContent, participants: defaultParticipants };
  }
}

// Helper to write DB
function writeDb(data: { content: EventContent; participants: Participant[] }) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

// Admin Auth Helper
const ADMIN_USERNAME = 'ito';
const ADMIN_PASSWORD = 'ito31102002';
const VALID_TOKEN = 'token-admin-ito-31102002-pegadaian-auth';

function verifyAdminToken(req: express.Request): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader) return false;
  const token = authHeader.replace('Bearer ', '');
  return token === VALID_TOKEN;
}

// --- API ROUTES ---

// Get Event Content & Stats
app.get('/api/content', (req, res) => {
  const db = readDb();
  const totalRegistered = db.participants.reduce((sum, p) => sum + (p.attendanceCount || 1), 0);
  const remainingQuota = Math.max(0, db.content.totalQuota - totalRegistered);

  res.json({
    success: true,
    data: db.content,
    stats: {
      totalRegisteredCount: db.participants.length,
      totalAttendeesCount: totalRegistered,
      remainingQuota,
      totalQuota: db.content.totalQuota
    }
  });
});

// Register new participant
app.post('/api/register', (req, res) => {
  const payload: RegistrationPayload = req.body;

  if (!payload.fullName || !payload.phone || !payload.email) {
    return res.status(400).json({ success: false, message: 'Nama, Nomor WA, dan Email wajib diisi.' });
  }

  const db = readDb();

  if (!db.content.isRegistrationOpen) {
    return res.status(400).json({ success: false, message: 'Maaf, pendaftaran saat ini sedang ditutup.' });
  }

  // Calculate quota
  const currentTotal = db.participants.reduce((sum, p) => sum + (p.attendanceCount || 1), 0);
  const requestedSeats = payload.attendanceCount || 1;

  if (currentTotal + requestedSeats > db.content.totalQuota) {
    return res.status(400).json({
      success: false,
      message: `Sisa kuota hanya tersisa ${Math.max(0, db.content.totalQuota - currentTotal)} tempat. Silakan sesuaikan jumlah kehadiran.`
    });
  }

  // Check duplicate phone or email (warn or allow)
  const existing = db.participants.find(
    p => p.phone.trim() === payload.phone.trim() || p.email.toLowerCase().trim() === payload.email.toLowerCase().trim()
  );

  if (existing) {
    return res.status(400).json({
      success: false,
      message: 'Nomor WhatsApp atau Email ini sudah terdaftar sebelumnya. Silakan gunakan kontak lain atau hubungi panitia.'
    });
  }

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newParticipant: Participant = {
    id: 'p_' + Date.now(),
    fullName: payload.fullName.trim(),
    phone: payload.phone.trim(),
    email: payload.email.trim(),
    occupation: payload.occupation || 'Umum',
    branch: payload.branch || 'Pegadaian Terdekat',
    investmentGoal: payload.investmentGoal || 'Tabungan Emas',
    attendanceCount: requestedSeats,
    notes: payload.notes || '',
    registrationCode: `PEG-GOLD-${randomNum}`,
    status: 'Registered',
    createdAt: new Date().toISOString()
  };

  db.participants.unshift(newParticipant);
  writeDb(db);

  return res.json({
    success: true,
    message: 'Pendaftaran berhasil!',
    participant: newParticipant
  });
});

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.json({
      success: true,
      message: 'Login Admin Berhasil',
      token: VALID_TOKEN,
      user: { username: ADMIN_USERNAME, role: 'Super Admin' }
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Username atau Password salah!'
  });
});

// Admin Check Me
app.get('/api/admin/me', (req, res) => {
  if (verifyAdminToken(req)) {
    return res.json({ success: true, user: { username: ADMIN_USERNAME, role: 'Super Admin' } });
  }
  return res.status(401).json({ success: false, message: 'Unauthorized' });
});

// Admin Get Participants
app.get('/api/participants', (req, res) => {
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ success: false, message: 'Akses Ditolak. Silakan login sebagai admin.' });
  }

  const db = readDb();
  res.json({
    success: true,
    participants: db.participants
  });
});

// Admin Update Content / Settings
app.put('/api/content', (req, res) => {
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ success: false, message: 'Akses Ditolak. Token tidak valid.' });
  }

  const newContent: EventContent = req.body;
  const db = readDb();
  db.content = { ...db.content, ...newContent };
  writeDb(db);

  res.json({
    success: true,
    message: 'Pengaturan Landing Page berhasil diperbarui!',
    data: db.content
  });
});

// Admin Update Participant Status
app.put('/api/participants/:id/status', (req, res) => {
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ success: false, message: 'Akses Ditolak.' });
  }

  const { id } = req.params;
  const { status } = req.body;

  const db = readDb();
  const participant = db.participants.find(p => p.id === id);
  if (!participant) {
    return res.status(404).json({ success: false, message: 'Peserta tidak ditemukan.' });
  }

  participant.status = status;
  writeDb(db);

  res.json({ success: true, message: 'Status peserta diperbarui.', participant });
});

// Admin Delete Participant
app.delete('/api/participants/:id', (req, res) => {
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ success: false, message: 'Akses Ditolak.' });
  }

  const { id } = req.params;
  const db = readDb();
  const initialLength = db.participants.length;
  db.participants = db.participants.filter(p => p.id !== id);

  if (db.participants.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Peserta tidak ditemukan.' });
  }

  writeDb(db);
  res.json({ success: true, message: 'Data peserta berhasil dihapus.' });
});

// Admin Batch Delete Participants
app.post('/api/participants/batch-delete', (req, res) => {
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ success: false, message: 'Akses Ditolak.' });
  }

  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: 'Daftar ID peserta tidak boleh kosong.' });
  }

  const db = readDb();
  const initialLength = db.participants.length;
  const idsSet = new Set(ids);
  db.participants = db.participants.filter(p => !idsSet.has(p.id));

  const deletedCount = initialLength - db.participants.length;
  writeDb(db);

  res.json({
    success: true,
    message: `${deletedCount} data peserta berhasil dihapus.`,
    deletedCount
  });
});

// Admin Add Manual Participant
app.post('/api/participants/manual', (req, res) => {
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ success: false, message: 'Akses Ditolak.' });
  }

  const payload = req.body;
  if (!payload.fullName || !payload.phone) {
    return res.status(400).json({ success: false, message: 'Nama & Telepon wajib diisi.' });
  }

  const db = readDb();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newP: Participant = {
    id: 'p_' + Date.now(),
    fullName: payload.fullName,
    phone: payload.phone,
    email: payload.email || '-',
    occupation: payload.occupation || 'Manual Entry',
    branch: payload.branch || 'Pegadaian Pusat',
    investmentGoal: payload.investmentGoal || 'Tabungan Emas',
    attendanceCount: Number(payload.attendanceCount) || 1,
    notes: payload.notes || 'Diinput manual oleh Admin',
    registrationCode: `PEG-MAN-${randomNum}`,
    status: payload.status || 'Verified',
    createdAt: new Date().toISOString()
  };

  db.participants.unshift(newP);
  writeDb(db);

  res.json({ success: true, message: 'Peserta manual berhasil ditambahkan!', participant: newP });
});

// Export Participants to Excel Endpoint
app.get('/api/export/excel', (req, res) => {
  // Allow export if admin token provided
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ success: false, message: 'Akses Ditolak.' });
  }

  const db = readDb();

  // Map to clean table format for Excel
  const excelData = db.participants.map((p, index) => ({
    'No': index + 1,
    'Kode Tiket': p.registrationCode,
    'Nama Lengkap': p.fullName,
    'No WhatsApp / HP': p.phone,
    'Email': p.email,
    'Pekerjaan / Profesi': p.occupation,
    'Cabang Pegadaian': p.branch,
    'Tujuan Investasi': p.investmentGoal,
    'Jumlah Kehadiran': p.attendanceCount,
    'Status Verification': p.status,
    'Catatan / Pesan': p.notes || '-',
    'Tanggal Mendaftar': new Date(p.createdAt).toLocaleString('id-ID')
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Peserta Gathering');

  // Set column widths
  worksheet['!cols'] = [
    { wch: 5 },  // No
    { wch: 18 }, // Kode Tiket
    { wch: 25 }, // Nama Lengkap
    { wch: 16 }, // Phone
    { wch: 25 }, // Email
    { wch: 20 }, // Pekerjaan
    { wch: 25 }, // Cabang
    { wch: 22 }, // Tujuan Investasi
    { wch: 12 }, // Jumlah
    { wch: 15 }, // Status
    { wch: 30 }, // Catatan
    { wch: 22 }  // Tanggal
  ];

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="Data_Peserta_Mini_Gathering_Pegadaian_${Date.now()}.xlsx"`);
  res.send(buffer);
});

// Start Express + Vite setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
