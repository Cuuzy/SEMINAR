import React from 'react';
import { ShieldCheck, Sparkles, Building, Phone, Mail, Globe } from 'lucide-react';
import { EventContent } from '../types';

interface FooterProps {
  content?: EventContent;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ content, onOpenAdmin }) => {
  const logoText = content?.logoText || 'PEGADAIAN';
  const logoUrl = content?.logoUrl;
  const description = content?.footerDescription || 'PT Pegadaian merupakan BUMN keuangan non-bank terpercaya di Indonesia yang melayani Tabungan Emas, Cicil Emas, Gadai Emas, dan Pembiayaan Usaha sejak 1901.';
  const ojkText = content?.footerOjkText || 'Terdaftar & Diawasi oleh Otoritas Jasa Keuangan (OJK)';
  const address = content?.footerOfficeAddress || 'Jl. Kramat Raya No. 162, Senen, Jakarta Pusat';
  const callCenter = content?.footerCallCenter || '1500569';
  const email = content?.footerEmail || 'humas@pegadaian.co.id';
  const website = content?.footerWebsite || 'www.pegadaian.co.id';
  const copyright = content?.footerCopyright || '© 2026 PT Pegadaian. Hak Cipta Dilindungi Undang-Undang.';
  const services = content?.footerServices || [
    'Tabungan Emas Pegadaian',
    'Cicil Emas Batangan Galeri 24',
    'Gadai Emas & Pembiayaan Hajj',
    'Aplikasi Pegadaian Digital'
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-emerald-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={logoText}
                  className="h-10 w-auto max-w-[140px] object-contain rounded-lg border border-slate-800"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-emerald-700 p-0.5 shrink-0">
                  <div className="w-full h-full bg-emerald-900 rounded-lg flex items-center justify-center border border-amber-400/50">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                </div>
              )}
              <span className="font-extrabold text-xl text-white tracking-tight">{logoText}</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              {description}
            </p>

            {ojkText && (
              <div className="flex items-center gap-2 pt-1 text-xs text-amber-300 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{ojkText}</span>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Layanan Utama</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {services.map((svc, idx) => (
                <li key={idx}>• {svc}</li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Kantor Pusat & Contact Center</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {address && (
                <li className="flex items-start gap-2">
                  <Building className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{address}</span>
                </li>
              )}
              {callCenter && (
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Call Center: {callCenter}</span>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-amber-300 transition-colors">{email}</a>
                </li>
              )}
              {website && (
                <li className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition-colors">
                    {website}
                  </a>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{copyright}</p>
        </div>

      </div>
    </footer>
  );
};

