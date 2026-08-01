import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, HelpCircle, PhoneCall, MessageCircle } from 'lucide-react';

interface FaqSectionProps {
  faq: { question: string; answer: string }[];
  contactWhatsapp: string;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ faq, contactWhatsapp }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-3 mb-12"
        >
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            Tanya Jawab
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pertanyaan Yang Sering Diajukan (FAQ)
          </h2>
          <p className="text-slate-600 text-sm">
            Informasi lengkap seputar pendaftaran & pelaksanaan Mini Gathering Emas Pegadaian.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faq.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200 bg-slate-50/50"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left font-bold text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-100/80 transition-colors cursor-pointer"
              >
                <span className="text-sm sm:text-base flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-500 transition-transform duration-300 shrink-0 ${
                    openIndex === idx ? 'rotate-180 text-emerald-700' : ''
                  }`}
                />
              </button>

              {openIndex === idx && (
                <div className="px-5 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100 bg-white">
                  {item.answer}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Contact Assistance Box */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 p-6 rounded-3xl bg-emerald-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg border border-amber-400/30"
        >
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-extrabold text-lg text-white">Masih Memiliki Pertanyaan Lain?</h3>
            <p className="text-xs text-emerald-200">Tim Customer Service & Panitia Pegadaian siap membantu Anda.</p>
          </div>

          <a
            href={`https://wa.me/${contactWhatsapp}?text=${encodeURIComponent('Halo Panitia Pegadaian, saya ingin bertanya seputar Mini Gathering Emas')}`}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-sm flex items-center gap-2 shadow-md shrink-0 transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-950" />
            Hubungi Panitia via WhatsApp
          </a>
        </motion.div>

      </div>
    </section>
  );
};
