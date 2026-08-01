export interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  photoUrl: string;
}

export interface AgendaItem {
  id: string;
  time: string;
  title: string;
  description: string;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  caption?: string;
}

export interface UpcEvent {
  id: string;
  upcName: string; // e.g. "UPC Sindanglaut", "UPC Sedong", "UPC Karangsembung"
  code: string;
  title: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  address: string;
  mapUrl: string;
  quota: number;
  registered: number;
  contactPerson: string;
  contactPhone: string;
  status: 'OPEN' | 'LIMITED' | 'FULL';
  description: string;
  specialBenefits?: string[];
}

export interface EventContent {
  logoUrl?: string;
  logoText?: string;
  logoSubtext?: string;
  logoBadge?: string;
  title: string;
  subtitle: string;
  badgeText: string;
  eventDate: string; // e.g. "Sabtu, 15 Agustus 2026"
  eventTime: string; // e.g. "09:00 - 12:00 WIB"
  eventTimestamp: string; // ISO string e.g. "2026-08-15T09:00:00" for Countdown
  venueName: string;
  venueAddress: string;
  venueMapUrl: string;
  totalQuota: number;
  isRegistrationOpen: boolean;
  contactWhatsapp: string;
  benefits: Benefit[];
  speakers: Speaker[];
  agenda: AgendaItem[];
  faq: { question: string; answer: string }[];
  gallery?: GalleryItem[];
  upcEvents?: UpcEvent[];
  footerDescription?: string;
  footerOfficeAddress?: string;
  footerCallCenter?: string;
  footerEmail?: string;
  footerWebsite?: string;
  footerCopyright?: string;
  footerOjkText?: string;
  footerServices?: string[];
}

export interface Participant {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  occupation: string;
  branch: string; // Cabang Pegadaian Terdekat
  investmentGoal: string; // e.g., "Tabungan Masa Depan", "Dana Pendidikan", "Proteksi Inflasi"
  attendanceCount: number;
  notes?: string;
  registrationCode: string;
  status: 'Registered' | 'Verified' | 'Attended' | 'Cancelled';
  createdAt: string;
}

export interface AdminUser {
  username: string;
  isAuthenticated: boolean;
  token?: string;
}

export interface RegistrationPayload {
  fullName: string;
  phone: string;
  email: string;
  occupation: string;
  branch: string;
  investmentGoal: string;
  attendanceCount: number;
  notes?: string;
}
