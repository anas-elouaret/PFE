import { motion } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";

const MessageCircle = ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 0 2 2z"/></svg>;
const Mail      = ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const MapPin    = ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const Clock     = ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const Send      = ({ size = 20, className }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>;
const InstagramIcon = ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>;
const INSTAGRAM_URL = "https://www.instagram.com/ste_2m/";

export default function ContactSection() {
  const { t } = useLanguage();

  const infoCards = [
    { labelKey: "contactPhone",    value: "+212 631-711680",  icon: <MessageCircle size={20} /> },
    { labelKey: "contactEmail",    value: "elouaretanas480@gmail.com", icon: <Mail size={20} /> },
    { labelKey: "contactLocation", value: "Casablanca, Morocco", icon: <MapPin size={20} /> },
    { labelKey: "contactHours",    value: "24/7",  icon: <Clock size={20} /> },
  ];

  return (
    <section id="contact" className="relative mx-auto w-full max-w-7xl px-4 py-32 sm:px-6 lg:px-8 bg-white overflow-hidden">
      <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-[#d1ff00]/10 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />

      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-24">
        <h1 className="flex flex-col md:flex-row items-center justify-center gap-4 text-7xl font-black text-black tracking-tighter">
          {t.contactTitle1} <span className="bg-[#d1ff00] px-8 py-3 rounded-[2rem] shadow-xl shadow-[#d1ff00]/20 inline-block rotate-2">{t.contactTitle2}</span>
        </h1>
        <p className="mt-8 text-gray-400 font-medium max-w-2xl mx-auto text-xl leading-relaxed">{t.contactSub}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-20 items-start">
        <div className="space-y-6">
          {infoCards.map((item, i) => (
            <motion.div key={item.labelKey}
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }} whileHover={{ x: 10 }}
              className="contact-info-card border-2 border-gray-50 hover:border-[#d1ff00] group shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="contact-info-icon bg-gray-50 text-black group-hover:bg-[#d1ff00] transition-colors duration-500">{item.icon}</div>
              <div>
                <div className="contact-info-label font-black opacity-40">{t[item.labelKey]}</div>
                <div className="contact-info-value text-lg tracking-tight">{item.value}</div>
              </div>
            </motion.div>
          ))}

          <motion.a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ x: 10 }}
            className="contact-info-card border-2 border-gray-50 hover:border-[#E1306C] group shadow-sm hover:shadow-xl transition-all duration-500"
          >
            <div className="contact-info-icon bg-gray-50 text-black group-hover:bg-[#E1306C] group-hover:text-white transition-colors duration-500">
              <InstagramIcon size={20} />
            </div>
            <div>
              <div className="contact-info-label font-black opacity-40">Instagram</div>
              <div className="contact-info-value text-lg tracking-tight">@ste_2m</div>
            </div>
          </motion.a>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
            className="contact-info-card bg-black text-white border-black mt-12 p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d1ff00]/10 blur-[40px] rounded-full translate-x-10 -translate-y-10"></div>
            <div className="contact-info-icon bg-[#d1ff00] text-black"><MessageCircle size={20} /></div>
            <div className="relative z-10">
              <div className="text-xl font-black text-[#d1ff00] mb-1">{t.contactLive}</div>
              <div className="text-sm text-gray-400 font-medium">{t.contactLiveSub}</div>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="bg-white border-2 border-gray-50 rounded-[3rem] p-12 shadow-2xl shadow-black/5 relative">
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#d1ff00] rounded-full flex items-center justify-center rotate-12 shadow-xl">
            <Send size={30} className="text-black" />
          </div>
          <h2 className="text-3xl font-black text-black mb-10 tracking-tight">{t.contactFormTitle}</h2>
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="contact-form-label font-black text-black">{t.contactName}</label>
                <input type="text" placeholder={t.contactNamePh} className="contact-form-input bg-gray-50/50 border-2 border-transparent focus:bg-white transition-all py-5" />
              </div>
              <div className="space-y-3">
                <label className="contact-form-label font-black text-black">{t.contactEmailLabel}</label>
                <input type="email" placeholder={t.contactEmailPh} className="contact-form-input bg-gray-50/50 border-2 border-transparent focus:bg-white transition-all py-5" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="contact-form-label font-black text-black">{t.contactSubject}</label>
              <input type="text" placeholder={t.contactSubjectPh} className="contact-form-input bg-gray-50/50 border-2 border-transparent focus:bg-white transition-all py-5" />
            </div>
            <div className="space-y-3">
              <label className="contact-form-label font-black text-black">{t.contactMessage}</label>
              <textarea placeholder={t.contactMsgPh} rows={6} className="contact-form-input bg-gray-50/50 border-2 border-transparent focus:bg-white transition-all resize-none py-5"></textarea>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
              className="w-full bg-black text-white font-black py-6 rounded-[2rem] flex items-center justify-center gap-4 shadow-xl shadow-black/20">
              <span className="text-lg tracking-widest uppercase">{t.contactBtn}</span>
              <Send size={20} className="text-[#d1ff00]" />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
