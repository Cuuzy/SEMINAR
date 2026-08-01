import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { UpcEventList } from './components/UpcEventList';
import { EventDetails } from './components/EventDetails';
import { SpeakersSection } from './components/SpeakersSection';
import { GallerySection } from './components/GallerySection';
import { RegistrationForm } from './components/RegistrationForm';
import { TicketModal } from './components/TicketModal';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { EventContent, Participant } from './types';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [content, setContent] = useState<EventContent | null>(null);
  const [stats, setStats] = useState({
    totalRegisteredCount: 0,
    totalAttendeesCount: 0,
    remainingQuota: 0,
    totalQuota: 100
  });
  const [loading, setLoading] = useState(true);

  // Modals & View States
  const [selectedUpcBranch, setSelectedUpcBranch] = useState<string | undefined>(undefined);
  const [registeredParticipant, setRegisteredParticipant] = useState<Participant | null>(null);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('pegadaian_admin_token'));

  // Load Content & Stats
  const loadContent = async () => {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      if (data.success) {
        setContent(data.data);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error loading event content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAdminLoginSuccess = (token: string) => {
    localStorage.setItem('pegadaian_admin_token', token);
    setAdminToken(token);
    setShowAdminLoginModal(false);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('pegadaian_admin_token');
    setAdminToken(null);
  };

  // If Admin Token exists, render full Admin Panel
  if (adminToken) {
    return (
      <AdminDashboard
        token={adminToken}
        onLogout={handleAdminLogout}
        onContentUpdated={loadContent}
      />
    );
  }

  if (loading || !content) {
    return (
      <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center text-white p-4">
        <Loader2 className="w-10 h-10 text-amber-400 animate-spin mb-3" />
        <p className="text-sm font-semibold text-emerald-200">Memuat Mini Gathering Emas Pegadaian...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-amber-300 selection:text-emerald-950">
      
      {/* Navbar Header */}
      <Header
        title={content.title}
        logoUrl={content.logoUrl}
        logoText={content.logoText}
        logoSubtext={content.logoSubtext}
        logoBadge={content.logoBadge}
        isRegistrationOpen={content.isRegistrationOpen}
        remainingQuota={stats.remainingQuota}
        onOpenAdmin={() => setShowAdminLoginModal(true)}
        onScrollToSection={handleScrollToSection}
      />

      {/* Hero Section with Live Countdown & Quota Progress */}
      <Hero
        content={content}
        totalRegistered={stats.totalAttendeesCount}
        remainingQuota={stats.remainingQuota}
        onRegisterClick={() => handleScrollToSection('jadwal-upc')}
      />

      {/* Schedule & Event List per UPC (Sindanglaut, Sedong, Karangsembung) */}
      <UpcEventList
        upcEvents={content.upcEvents}
        onSelectUpc={(upcName) => {
          setSelectedUpcBranch(upcName);
          handleScrollToSection('pendaftaran');
        }}
      />

      {/* Event Benefits */}
      <EventDetails
        content={content}
        onRegisterClick={() => handleScrollToSection('pendaftaran')}
      />

      {/* Photo Gallery of Past Events */}
      <GallerySection gallery={content.gallery} />

      {/* Real-time Registration Form */}
      <RegistrationForm
        isRegistrationOpen={content.isRegistrationOpen}
        remainingQuota={stats.remainingQuota}
        selectedUpc={selectedUpcBranch}
        onSuccessRegistration={(p) => {
          setRegisteredParticipant(p);
          loadContent(); // Refresh stats real-time
        }}
      />

      {/* FAQ Accordion */}
      <FaqSection
        faq={content.faq}
        contactWhatsapp={content.contactWhatsapp}
      />

      {/* Footer & Admin Link */}
      <Footer content={content} onOpenAdmin={() => setShowAdminLoginModal(true)} />

      {/* Confirmation Ticket Modal */}
      {registeredParticipant && (
        <TicketModal
          participant={registeredParticipant}
          eventContent={content}
          onClose={() => setRegisteredParticipant(null)}
        />
      )}

      {/* Admin Login Modal (ito / ito31102002) */}
      {showAdminLoginModal && (
        <AdminLoginModal
          onClose={() => setShowAdminLoginModal(false)}
          onLoginSuccess={handleAdminLoginSuccess}
        />
      )}

    </div>
  );
}
