"use client";

import { useState } from 'react';
import { Calendar, MapPin, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuroraBackground } from '@/components/AuroraBackground';
import { ShinyText } from '@/components/ShinyText';
import TactlinkSupportSection from '@/components/TactlinkSupportSection';
import { CustomSelect } from '@/components/CustomSelect';

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showCommunityInput, setShowCommunityInput] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');

    try {
      const formData = new FormData(e.currentTarget);
      const fileInput = formData.get('tiktokQrImage') as File;
      let base64Image = '';
      
      if (fileInput && fileInput.size > 0) {
        base64Image = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(fileInput);
          reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 800;
              const MAX_HEIGHT = 800;
              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
                }
              }
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(img, 0, 0, width, height);
              
              // Compress to JPEG with 0.7 quality to keep payload small
              const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
              resolve(dataUrl.split(',')[1]);
            };
            img.onerror = error => reject(error);
          };
          reader.onerror = error => reject(error);
        });
      }

      const participantsData = [{
        fullName: formData.get('fullName'),
        tiktokQrImage: base64Image,
        tiktokLink: formData.get('tiktokLink'),
        followers: formData.get('followers'),
        kategori: formData.get('kategori'),
        isCommunity: formData.get('isCommunity'),
        communityName: formData.get('communityName') || '-',
        email: formData.get('email'),
        whatsapp: formData.get('whatsapp'),
      }];

      const payload = {
        participants: participantsData
      };

      // Ganti URL ini dengan URL Web App Anda
      const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzZ9Ok4VZvBjKGooJcIsYcnFFU8E22L40jcbkWsSeciQ2xcw6w4VCYpzZFn0XpqI5g/exec";
      
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        // Send email via Resend API
        if (result.tickets && result.tickets.length > 0) {
          const ticket = result.tickets[0];
          try {
            await fetch('/api/send-email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: ticket.email,
                fullName: ticket.fullName,
                ticketId: ticket.ticketId,
              }),
            });
          } catch (emailError) {
            console.error('Failed to send email:', emailError);
          }
        }
        
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuroraBackground className="pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Section: Event Info */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-5 flex flex-col justify-center pt-2 sm:pt-0"
          >
            {/* Sponsors Section on Pill */}
            <div className="relative w-full overflow-hidden bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 backdrop-blur-xl py-5 sm:py-6 rounded-[3rem] shadow-[0_8px_40px_rgba(34,197,94,0.15)] mb-10 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/50 dark:via-white/5 to-white/0 group-hover:via-white/80 dark:group-hover:via-white/10 transition-colors duration-700"></div>
              
              <div className="flex flex-col w-full relative">
                {/* Marquee Row */}
                <motion.div 
                  className="flex gap-4 sm:gap-6 min-w-max items-center pr-4 sm:pr-6"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ ease: "linear", duration: 15, repeat: Infinity }}
                >
                  {[
                    { src: '/logo/unama.jpg', alt: 'UNAMA' },
                    { src: '/logo/tactlink.png', alt: 'Tactlink' },
                    { src: '/logo/iwapi.png', alt: 'IWAPI' },
                    { src: '/logo/folago.png', alt: 'Folago' },
                    // Duplicate for seamless infinite scrolling
                    { src: '/logo/unama.jpg', alt: 'UNAMA' },
                    { src: '/logo/tactlink.png', alt: 'Tactlink' },
                    { src: '/logo/iwapi.png', alt: 'IWAPI' },
                    { src: '/logo/folago.png', alt: 'Folago' },
                    { src: '/logo/unama.jpg', alt: 'UNAMA' },
                    { src: '/logo/tactlink.png', alt: 'Tactlink' },
                    { src: '/logo/iwapi.png', alt: 'IWAPI' },
                    { src: '/logo/folago.png', alt: 'Folago' }
                  ].map((logo, idx) => (
                    <div key={`r1-${idx}`} className="bg-white/90 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 shrink-0 flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-[1.15] hover:z-10 hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] cursor-pointer h-16 w-28 sm:h-20 sm:w-36 border border-slate-200/50 dark:border-white/20">
                      <img src={logo.src} alt={logo.alt} className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal dark:brightness-[100] dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>

            <div className="inline-flex">
              <span className="bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 font-bold px-4 py-1.5 rounded-full text-xs sm:text-sm tracking-[0.2em] uppercase mb-6 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                <ShinyText text="EXCLUSIVE EVENT" className="text-green-600 dark:text-green-400" />
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading leading-tight mb-8 font-bold text-slate-900 dark:text-white">
              Dari Konten <br/>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-2">
                <ShinyText text="Jadi Cuan" className="text-5xl lg:text-6xl text-green-500" />
              </div>
              <span className="text-3xl sm:text-4xl mt-2 block text-slate-700 dark:text-slate-300">Bersama Folago Academy</span>
            </h1>

            <div className="bg-white/80 dark:bg-[#0C0C14]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-xl rounded-3xl p-6 md:p-8 space-y-6 mb-10">
              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl group-hover:bg-green-500/10 transition-colors border border-slate-100 dark:border-white/10 shadow-sm">
                  <Calendar className="text-green-500 w-6 h-6 flex-shrink-0" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Tanggal & Waktu</h3>
                  <p className="text-slate-500 dark:text-zinc-400 mt-1">8 Agustus 2026 <br/> 10.00 WIB - Selesai</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl group-hover:bg-blue-500/10 transition-colors border border-slate-100 dark:border-white/10 shadow-sm">
                  <MapPin className="text-blue-500 w-6 h-6 flex-shrink-0" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Tempat</h3>
                  <p className="text-slate-500 dark:text-zinc-400 mt-1 text-sm leading-relaxed">
                    <a href="https://maps.app.goo.gl/SotW3qBamCELuKhM6" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors hover:underline">
                      <strong>Aula Kampus Universitas Dinamika Bangsa Jambi (Kampus Kotabaru)</strong>
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Section: Form */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <div className="bg-white/90 dark:bg-[#0C0C14]/80 backdrop-blur-2xl border border-slate-200/60 dark:border-white/10 shadow-2xl rounded-[2rem] p-6 sm:p-8 md:p-12 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-10 sm:py-16"
                  >
                    <div className="mb-6">
                      <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4 text-slate-900 dark:text-white">Pendaftaran Berhasil!</h2>
                    <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 max-w-md mb-8 leading-relaxed">
                      Terima kasih telah mendaftar. Tiket / Bukti Registrasi Anda telah kami catat di sistem. Sampai jumpa di acara!
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    exit={{ opacity: 0, filter: "blur(10px)" }}
                  >
                    <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-3 text-slate-900 dark:text-white">Amankan Kursimu</h2>
                    <p className="text-slate-500 dark:text-zinc-400 mb-8 text-base">Isi detail di bawah untuk mengonfirmasi kehadiran Anda.</p>

                    {status === "error" && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        Terjadi kesalahan saat mengirim data. Silakan coba lagi.
                      </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-5">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1">Nama Lengkap <span className="text-red-500">*</span></label>
                          <input type="text" name="fullName" required className="w-full glass-input px-4 py-3.5 border border-slate-200 dark:border-white/10 rounded-xl bg-white/50 dark:bg-black/50" placeholder="Masukkan nama lengkap Anda" />
                        </div>
                        
                        <div className="mb-2 mt-4">
                          <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1 mb-2 block">Panduan Mendapatkan QR & Link Akun TikTok:</label>
                          <img 
                            src="/logo/tutorial-qr.png" 
                            alt="Tutorial Cari Link Akun TikTok" 
                            className="w-full rounded-2xl shadow-sm border border-slate-200 dark:border-white/10"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1">Upload QR Akun Tiktok <span className="text-red-500">*</span></label>
                            <input type="file" accept="image/*" name="tiktokQrImage" required className="w-full glass-input px-4 py-3 border border-slate-200 dark:border-white/10 rounded-xl bg-white/50 dark:bg-black/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1">Jumlah Followers <span className="text-red-500">*</span></label>
                            <input type="number" name="followers" required className="w-full glass-input px-4 py-3.5 border border-slate-200 dark:border-white/10 rounded-xl bg-white/50 dark:bg-black/50" placeholder="Contoh: 1500" />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1">Link Username Tiktok <span className="text-red-500">*</span></label>
                          <input type="url" name="tiktokLink" required className="w-full glass-input px-4 py-3.5 border border-slate-200 dark:border-white/10 rounded-xl bg-white/50 dark:bg-black/50" placeholder="https://tiktok.com/@faizngraha" />
                        </div>
                        
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1">Kategori Konten Anda <span className="text-red-500">*</span></label>
                          <p className="text-xs text-slate-500 ml-1 mb-2">Pilih salah satu kategori di bawah ini yang paling sesuai dengan kategori konten kamu</p>
                          <CustomSelect 
                            name="kategori"
                            required={true}
                            placeholder="-- Pilih Kategori --"
                            options={[
                              { value: 'Beauty & Personal Care', label: 'Beauty & Personal Care' },
                              { value: 'Health & Wellness', label: 'Health & Wellness' },
                              { value: 'Home Living', label: 'Home Living' },
                              { value: 'Electronic', label: 'Electronic' },
                              { value: 'Food & Beverage', label: 'Food & Beverage' },
                              { value: 'Fashion', label: 'Fashion' }
                            ]}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1">Apakah Kamu Datang dari Anggota Komunitas/Mahasiswa/Institusi/Organisasi? <span className="text-red-500">*</span></label>
                          <CustomSelect 
                            name="isCommunity"
                            required={true}
                            placeholder="-- Pilih Jawaban --"
                            onChange={(val) => setShowCommunityInput(val === 'Ya')}
                            options={[
                              { value: 'Ya', label: 'Ya' },
                              { value: 'Tidak', label: 'Tidak' }
                            ]}
                          />
                        </div>

                        {showCommunityInput && (
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1">Kalau iya, sebutkan <span className="text-red-500">*</span></label>
                            <input type="text" name="communityName" required={showCommunityInput} className="w-full glass-input px-4 py-3.5 border border-slate-200 dark:border-white/10 rounded-xl bg-white/50 dark:bg-black/50" placeholder="Contoh: Universitas Dinamika Bangsa" />
                          </div>
                        )}

                        <div className="pt-4 mt-4 border-t border-slate-200 dark:border-white/10"></div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1">Alamat Email <span className="text-red-500">*</span></label>
                            <input type="email" name="email" required className="w-full glass-input px-4 py-3.5 border border-slate-200 dark:border-white/10 rounded-xl bg-white/50 dark:bg-black/50" placeholder="Untuk pengiriman tiket" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1">No. WhatsApp <span className="text-red-500">*</span></label>
                            <input type="tel" name="whatsapp" required className="w-full glass-input px-4 py-3.5 border border-slate-200 dark:border-white/10 rounded-xl bg-white/50 dark:bg-black/50" placeholder="08..." />
                          </div>
                        </div>

                      </div>

                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full mt-8 bg-green-600 dark:bg-green-500 text-white hover:bg-green-700 dark:hover:bg-green-600 font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 group relative overflow-hidden shadow-lg"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin text-white" />
                            Memproses Data...
                          </>
                        ) : (
                          'Daftar Sekarang'
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          
        </div>
      </div>
      
      {/* Tactlink Support Section at the bottom */}
      <div className="w-full mt-20 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <TactlinkSupportSection noBackground={true} />
      </div>
    </AuroraBackground>
  );
}
