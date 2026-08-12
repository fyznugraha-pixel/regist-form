"use client";

import { useState } from 'react';
import {
  Calendar,
  MapPin,
  CheckCircle,
  Loader2,
  Copy,
  Check,
  Upload,
  CreditCard,
  X,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuroraBackground } from '@/components/AuroraBackground';
import { ShinyText } from '@/components/ShinyText';
import TactlinkSupportSection from '@/components/TactlinkSupportSection';
import { CustomSelect } from '@/components/CustomSelect';

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showCommunityInput, setShowCommunityInput] = useState(false);

  // PAYMENT
  const [copied, setCopied] = useState(false);
  const [paymentProofName, setPaymentProofName] = useState('');
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);

  // =========================================
  // GANTI INFORMASI PEMBAYARAN DI SINI
  // =========================================
  const BANK_NAME = 'BCA';
  const ACCOUNT_NUMBER = '1234567890';
  const ACCOUNT_NAME = 'Folago Academy';
  const TICKET_PRICE = 'Rp100.000';

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(ACCOUNT_NUMBER);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Gagal menyalin nomor rekening:', error);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handlePaymentProofChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Bukti pembayaran harus berupa JPG, JPEG, atau PNG.');

      e.target.value = '';
      setPaymentProofName('');
      setPaymentProofPreview(null);

      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert('Ukuran bukti pembayaran maksimal 5 MB.');

      e.target.value = '';
      setPaymentProofName('');
      setPaymentProofPreview(null);

      return;
    }

    if (paymentProofPreview) {
      URL.revokeObjectURL(paymentProofPreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setPaymentProofName(file.name);
    setPaymentProofPreview(previewUrl);
  };

  const handleRemovePaymentProof = () => {
    if (paymentProofPreview) {
      URL.revokeObjectURL(paymentProofPreview);
    }

    setPaymentProofName('');
    setPaymentProofPreview(null);

    const input = document.getElementById(
      'paymentProof'
    ) as HTMLInputElement | null;

    if (input) {
      input.value = '';
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setIsSubmitting(true);
    setStatus('idle');

    try {
      const formData = new FormData(e.currentTarget);

      const paymentProof = formData.get('paymentProof') as File;

      let paymentProofBase64 = '';

      if (paymentProof && paymentProof.size > 0) {
        paymentProofBase64 = await fileToBase64(paymentProof);
      }

      const participantsData = [
        {
          fullName: formData.get('fullName'),
          tiktokUsername: formData.get('tiktokUsername'),
          tiktokLink: formData.get('tiktokLink'),
          followers: formData.get('followers'),
          kategori: formData.get('kategori'),
          isCommunity: formData.get('isCommunity'),
          communityName: formData.get('communityName') || '-',
          email: formData.get('email'),
          whatsapp: formData.get('whatsapp'),

          // PAYMENT DATA
          paymentBank: BANK_NAME,
          paymentAccount: ACCOUNT_NUMBER,
          paymentAccountName: ACCOUNT_NAME,
          paymentAmount: TICKET_PRICE,
          paymentProof: paymentProofBase64,
          paymentProofName: paymentProof?.name || ''
        }
      ];

      const payload = {
        participants: participantsData
      };

      const SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycbxhlhs2GY6D2ciDtVWxKhqJ8WpjJ-e1qPS1ddBaHS6HhvNIRrm2Cibq5rFY65A_FeUQUA/exec";

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.status === 'success') {

        // SEND EMAIL
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


          {/* ========================================= */}
          {/* LEFT SECTION */}
          {/* ========================================= */}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut"
            }}
            className="lg:col-span-5 flex flex-col justify-center pt-2 sm:pt-0"
          >

            {/* SPONSORS */}
            <div className="relative w-full overflow-hidden bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 backdrop-blur-xl py-5 sm:py-6 rounded-[3rem] shadow-[0_8px_40px_rgba(34,197,94,0.15)] mb-10 group">

              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/50 dark:via-white/5 to-white/0 group-hover:via-white/80 dark:group-hover:via-white/10 transition-colors duration-700"></div>

              <div className="flex flex-col w-full relative">

                <motion.div
                  className="flex gap-4 sm:gap-6 min-w-max items-center pr-4 sm:pr-6"
                  animate={{
                    x: ["0%", "-50%"]
                  }}
                  transition={{
                    ease: "linear",
                    duration: 15,
                    repeat: Infinity
                  }}
                >

                  {[
                    {
                      src: '/logo/tactlink.png',
                      alt: 'Tactlink'
                    },
                    {
                      src: '/logo/iwapi.png',
                      alt: 'IWAPI'
                    },
                    {
                      src: '/logo/folago-neww.png',
                      alt: 'Folago'
                    },

                    // Duplicate
                    {
                      src: '/logo/tactlink.png',
                      alt: 'Tactlink'
                    },
                    {
                      src: '/logo/iwapi.png',
                      alt: 'IWAPI'
                    },
                    {
                      src: '/logo/folago-neww.png',
                      alt: 'Folago'
                    },

                    {
                      src: '/logo/tactlink.png',
                      alt: 'Tactlink'
                    },
                    {
                      src: '/logo/iwapi.png',
                      alt: 'IWAPI'
                    },
                    {
                      src: '/logo/folago-neww.png',
                      alt: 'Folago'
                    }
                  ].map((logo, idx) => (

                    <div
                      key={`r1-${idx}`}
                      className={`backdrop-blur-sm rounded-2xl p-3 sm:p-4 shrink-0 flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-[1.15] hover:z-10 hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] cursor-pointer h-16 w-28 sm:h-20 sm:w-36 border border-slate-200/50 dark:border-white/20 ${
                        logo.alt === 'Folago'
                          ? 'bg-slate-900 dark:bg-slate-900'
                          : 'bg-white/90 dark:bg-white/10'
                      }`}
                    >

                      <img
                        src={logo.src}
                        alt={logo.alt}
                        className={`h-full w-full object-contain ${
                          logo.alt === 'Folago'
                            ? ''
                            : 'mix-blend-multiply dark:mix-blend-normal dark:brightness-[100] dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]'
                        }`}
                      />

                    </div>

                  ))}

                </motion.div>

              </div>

            </div>


            {/* EVENT TAG */}
            <div className="inline-flex">

              <span className="bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 font-bold px-4 py-1.5 rounded-full text-xs sm:text-sm tracking-[0.2em] uppercase mb-6 shadow-[0_0_15px_rgba(34,197,94,0.4)]">

                <ShinyText
                  text="EXCLUSIVE EVENT"
                  className="text-green-600 dark:text-green-400"
                />

              </span>

            </div>


            {/* TITLE */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading leading-tight mb-8 font-bold text-slate-900 dark:text-white">

              Dari Konten <br />

              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-2">

                <ShinyText
                  text="Jadi Cuan"
                  className="text-5xl lg:text-6xl text-green-500"
                />

              </div>

              <span className="text-3xl sm:text-4xl mt-2 block text-slate-700 dark:text-slate-300">

                Bersama Folago Academy

              </span>

            </h1>


            {/* EVENT INFORMATION */}
            <div className="bg-white/80 dark:bg-[#0C0C14]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-xl rounded-3xl p-6 md:p-8 space-y-6 mb-10">


              {/* DATE */}
              <div className="flex items-start gap-4 group">

                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl group-hover:bg-green-500/10 transition-colors border border-slate-100 dark:border-white/10 shadow-sm">

                  <Calendar className="text-green-500 w-6 h-6 flex-shrink-0" />

                </div>

                <div>

                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white">

                    Tanggal & Waktu

                  </h3>

                  <p className="text-slate-500 dark:text-zinc-400 mt-1">

                    7 September 2026 <br />
                    9.00 WIB - Selesai

                  </p>

                </div>

              </div>


              {/* LOCATION */}
              <div className="flex items-start gap-4 group">

                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl group-hover:bg-blue-500/10 transition-colors border border-slate-100 dark:border-white/10 shadow-sm">

                  <MapPin className="text-blue-500 w-6 h-6 flex-shrink-0" />

                </div>

                <div>

                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white">

                    Tempat

                  </h3>

                  <p className="text-slate-500 dark:text-zinc-400 mt-1 text-sm leading-relaxed">

                    

                      <strong>

                        Kepulauan Riau (Vanue Menyusul) <br />

                      </strong>

                 

                  </p>

                </div>

              </div>

            </div>

          </motion.div>



          {/* ========================================= */}
          {/* RIGHT SECTION */}
          {/* ========================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 50
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: "easeOut"
            }}
            className="lg:col-span-7"
          >

            <div className="bg-white/90 dark:bg-[#0C0C14]/80 backdrop-blur-2xl border border-slate-200/60 dark:border-white/10 shadow-2xl rounded-[2rem] p-6 sm:p-8 md:p-12 relative overflow-hidden">

              <AnimatePresence mode="wait">

                {status === "success" ? (

                  <motion.div
                    key="success"
                    initial={{
                      opacity: 0,
                      scale: 0.95
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1
                    }}
                    className="flex flex-col items-center justify-center text-center py-10 sm:py-16"
                  >

                    <div className="mb-6">

                      <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />

                    </div>

                    <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4 text-slate-900 dark:text-white">

                      Pendaftaran Berhasil!

                    </h2>

                    <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 max-w-md mb-8 leading-relaxed">

                      Terima kasih telah mendaftar.
                      Tiket / Bukti Registrasi Anda telah kami catat
                      di sistem. Sampai jumpa di acara!

                    </p>

                  </motion.div>

                ) : (

                  <motion.div
                    key="form"
                    exit={{
                      opacity: 0,
                      filter: "blur(10px)"
                    }}
                  >

                    <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-3 text-slate-900 dark:text-white">

                      Amankan Kursimu

                    </h2>

                    <p className="text-slate-500 dark:text-zinc-400 mb-8 text-base">

                      Isi detail di bawah untuk mengonfirmasi kehadiran Anda.

                    </p>


                    {status === "error" && (

                      <motion.div
                        initial={{
                          opacity: 0,
                          y: -10
                        }}
                        animate={{
                          opacity: 1,
                          y: 0
                        }}
                        className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center gap-2"
                      >

                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>

                        Terjadi kesalahan saat mengirim data.
                        Silakan coba lagi.

                      </motion.div>

                    )}


                    <form
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >

                      <div className="space-y-5">


                        {/* FULL NAME */}
                        <div className="space-y-2.5">

                          <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1 block">

                            Nama Lengkap

                            <span className="text-red-500">
                              *
                            </span>

                          </label>

                          <input
                            type="text"
                            name="fullName"
                            required
                            className="w-full glass-input px-4 py-3.5 border border-slate-200 dark:border-white/10 rounded-xl bg-white/50 dark:bg-black/50"
                            placeholder="Masukkan nama lengkap Anda"
                          />

                        </div>



                        {/* TIKTOK GUIDE */}
                        <div className="mb-2 mt-4">

                          <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1 mb-2.5 block">

                            Panduan Mendapatkan Link Akun TikTok:

                          </label>

                          <img
                            src="/logo/tutorial-qr.png"
                            alt="Tutorial Cari Link Akun TikTok"
                            className="w-full rounded-2xl shadow-sm border border-slate-200 dark:border-white/10"
                          />

                        </div>



                        {/* USERNAME & FOLLOWERS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">


                          <div className="space-y-2.5">

                            <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1 block">

                              Username Tiktok

                              <span className="text-red-500">
                                *
                              </span>

                            </label>

                            <input
                              type="text"
                              name="tiktokUsername"
                              required
                              className="w-full glass-input px-4 py-3.5 border border-slate-200 dark:border-white/10 rounded-xl bg-white/50 dark:bg-black/50"
                              placeholder="@username"
                            />

                          </div>



                          <div className="space-y-2.5">

                            <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1 block">

                              Jumlah Followers

                              <span className="text-red-500">
                                *
                              </span>

                            </label>

                            <input
                              type="number"
                              name="followers"
                              required
                              className="w-full glass-input px-4 py-3.5 border border-slate-200 dark:border-white/10 rounded-xl bg-white/50 dark:bg-black/50"
                              placeholder="Contoh: 1500"
                            />

                          </div>

                        </div>



                        {/* TIKTOK LINK */}
                        <div className="space-y-2.5">

                          <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1 block">

                            Link Username Tiktok

                            <span className="text-red-500">
                              *
                            </span>

                          </label>

                          <input
                            type="url"
                            name="tiktokLink"
                            required
                            className="w-full glass-input px-4 py-3.5 border border-slate-200 dark:border-white/10 rounded-xl bg-white/50 dark:bg-black/50"
                            placeholder="https://tiktok.com/@faizngraha"
                          />

                        </div>



                        {/* CATEGORY */}
                        <div className="space-y-2.5">

                          <div>

                            <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1 block">

                              Kategori Konten Anda

                              <span className="text-red-500">
                                *
                              </span>

                            </label>

                            <p className="text-xs text-slate-500 ml-1 mt-1">

                              Pilih salah satu kategori di bawah ini
                              yang paling sesuai dengan kategori konten kamu

                            </p>

                          </div>

                          <CustomSelect
                            name="kategori"
                            required={true}
                            placeholder="-- Pilih Kategori --"
                            options={[
                              {
                                value: 'Beauty & Personal Care',
                                label: 'Beauty & Personal Care'
                              },
                              {
                                value: 'Health & Wellness',
                                label: 'Health & Wellness'
                              },
                              {
                                value: 'Home Living',
                                label: 'Home Living'
                              },
                              {
                                value: 'Electronic',
                                label: 'Electronic'
                              },
                              {
                                value: 'Food & Beverage',
                                label: 'Food & Beverage'
                              },
                              {
                                value: 'Fashion',
                                label: 'Fashion'
                              }
                            ]}
                          />

                        </div>



                        {/* COMMUNITY */}
                        <div className="space-y-2.5">

                          <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1 block">

                            Apakah Kamu Datang dari Anggota
                            Komunitas/Mahasiswa/Institusi/Organisasi?

                            <span className="text-red-500">
                              *
                            </span>

                          </label>

                          <CustomSelect
                            name="isCommunity"
                            required={true}
                            placeholder="-- Pilih Jawaban --"
                            onChange={(val) =>
                              setShowCommunityInput(val === 'Ya')
                            }
                            options={[
                              {
                                value: 'Ya',
                                label: 'Ya'
                              },
                              {
                                value: 'Tidak',
                                label: 'Tidak'
                              }
                            ]}
                          />

                        </div>



                        {/* COMMUNITY NAME */}
                        {showCommunityInput && (

                          <div className="space-y-2.5">

                            <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1 block">

                              Kalau iya, sebutkan

                              <span className="text-red-500">
                                *
                              </span>

                            </label>

                            <input
                              type="text"
                              name="communityName"
                              required={showCommunityInput}
                              className="w-full glass-input px-4 py-3.5 border border-slate-200 dark:border-white/10 rounded-xl bg-white/50 dark:bg-black/50"
                              placeholder="Contoh: Universitas Dinamika Bangsa"
                            />

                          </div>

                        )}



                        {/* EMAIL / WHATSAPP SEPARATOR */}
                        <div className="pt-4 mt-4 border-t border-slate-200 dark:border-white/10"></div>



                        {/* EMAIL & WHATSAPP */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                          <div className="space-y-2.5">

                            <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1 block">

                              Alamat Email

                              <span className="text-red-500">
                                *
                              </span>

                            </label>

                            <input
                              type="email"
                              name="email"
                              required
                              className="w-full glass-input px-4 py-3.5 border border-slate-200 dark:border-white/10 rounded-xl bg-white/50 dark:bg-black/50"
                              placeholder="example@gmail.com"
                            />

                          </div>



                          <div className="space-y-2.5">

                            <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1 block">

                              No. WhatsApp

                              <span className="text-red-500">
                                *
                              </span>

                            </label>

                            <input
                              type="tel"
                              name="whatsapp"
                              required
                              className="w-full glass-input px-4 py-3.5 border border-slate-200 dark:border-white/10 rounded-xl bg-white/50 dark:bg-black/50"
                              placeholder="08..."
                            />

                          </div>

                        </div>



                        {/* ========================================= */}
                        {/* PAYMENT SECTION */}
                        {/* ========================================= */}

                        <div className="pt-7 mt-7 border-t border-slate-200 dark:border-white/10">

                          <div className="flex items-center gap-3">

                            <div className="p-2.5 bg-green-500/10 rounded-xl">

                              <CreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />

                            </div>

                            <div>

                              <h3 className="text-xl font-bold text-slate-900 dark:text-white">

                                Pembayaran Event

                              </h3>

                              <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">

                                Lakukan pembayaran sebelum mengirim formulir.

                              </p>

                            </div>

                          </div>

                        </div>



                        {/* PAYMENT CARD */}
                        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 p-5 sm:p-6 space-y-5">


                          {/* BANK & AMOUNT */}
                          <div className="flex items-start justify-between gap-4">

                            <div>

                              <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-zinc-500 mb-1">

                                Bank

                              </p>

                              <p className="font-bold text-lg text-slate-900 dark:text-white">

                                {BANK_NAME}

                              </p>

                            </div>


                            <div className="text-right">

                              <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-zinc-500 mb-1">

                                Total Pembayaran

                              </p>

                              <p className="font-bold text-lg text-green-600 dark:text-green-400">

                                {TICKET_PRICE}

                              </p>

                            </div>

                          </div>



                          <div className="border-t border-slate-200 dark:border-white/10"></div>



                          {/* ACCOUNT NUMBER */}
                          <div>

                            <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-zinc-500 mb-2">

                              Nomor Rekening

                            </p>

                            <div className="flex items-center gap-3">


                              <div className="flex-1 bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3">

                                <p className="text-lg sm:text-xl font-bold tracking-wider text-slate-900 dark:text-white">

                                  {ACCOUNT_NUMBER}

                                </p>

                              </div>



                              {/* COPY BUTTON */}
                              <button
                                type="button"
                                onClick={handleCopyAccount}
                                className="h-[50px] px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-2 transition-colors"
                              >

                                {copied ? (

                                  <>
                                    <Check className="w-4 h-4" />

                                    <span className="hidden sm:inline">

                                      Tersalin

                                    </span>
                                  </>

                                ) : (

                                  <>
                                    <Copy className="w-4 h-4" />

                                    <span className="hidden sm:inline">

                                      Salin

                                    </span>
                                  </>

                                )}

                              </button>

                            </div>

                          </div>



                          {/* ACCOUNT NAME */}
                          <div>

                            <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-zinc-500 mb-1">

                              Atas Nama

                            </p>

                            <p className="font-semibold text-slate-800 dark:text-zinc-200">

                              {ACCOUNT_NAME}

                            </p>

                          </div>

                        </div>



                        {/* ========================================= */}
                        {/* PAYMENT PROOF */}
                        {/* ========================================= */}

                        <div className="space-y-2.5">

                          <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1 block">

                            Upload Bukti Pembayaran

                            <span className="text-red-500">
                              *
                            </span>

                          </label>


                          <div className="relative">

                            {!paymentProofPreview ? (

                              /* BELUM UPLOAD */
                              <label
                                htmlFor="paymentProof"
                                className="relative flex flex-col items-center justify-center w-full min-h-[170px] border-2 border-dashed border-slate-300 dark:border-white/20 rounded-2xl cursor-pointer bg-slate-50/50 dark:bg-white/5 hover:bg-slate-100/80 dark:hover:bg-white/10 hover:border-green-400 dark:hover:border-green-500/50 transition-all"
                              >

                                <div className="flex flex-col items-center justify-center px-5 py-8 text-center">

                                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-3">

                                    <Upload className="w-6 h-6 text-green-600 dark:text-green-400" />

                                  </div>

                                  <p className="text-sm font-semibold text-slate-700 dark:text-zinc-200">

                                    Klik untuk upload bukti pembayaran

                                  </p>

                                  <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">

                                    JPG atau PNG, maksimal 5 MB

                                  </p>

                                </div>

                              </label>

                            ) : (

                              /* SUDAH UPLOAD */
                              <div className="relative rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 p-3">


                                {/* DELETE BUTTON */}
                                <button
                                  type="button"
                                  onClick={handleRemovePaymentProof}
                                  className="absolute top-5 right-5 z-30 w-9 h-9 rounded-full bg-black/75 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-all hover:scale-105"
                                  aria-label="Hapus bukti pembayaran"
                                  title="Hapus foto"
                                >

                                  <X className="w-5 h-5" />

                                </button>



                                {/* CLICK PREVIEW TO REPLACE */}
                                <label
                                  htmlFor="paymentProof"
                                  className="block cursor-pointer group"
                                >

                                  <div className="relative overflow-hidden rounded-xl bg-slate-100 dark:bg-black/30 min-h-[200px] flex items-center justify-center">

                                    <img
                                      src={paymentProofPreview}
                                      alt="Preview Bukti Pembayaran"
                                      className="w-full max-h-[450px] object-contain"
                                    />


                                    {/* HOVER OVERLAY */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-all flex items-center justify-center">

                                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg">

                                        <RefreshCw className="w-4 h-4" />

                                        Ganti Foto

                                      </div>

                                    </div>

                                  </div>

                                </label>



                                {/* FILE INFO */}
                                <div className="flex items-center gap-2 mt-3 px-1">

                                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />

                                  <p className="text-sm text-slate-600 dark:text-zinc-300 truncate">

                                    {paymentProofName}

                                  </p>

                                </div>

                              </div>

                            )}

                            {/* INPUT TUNGGAL - tetap sama walau tampilan berganti,
                                supaya file yang sudah dipilih tidak hilang */}
                            <input
                              id="paymentProof"
                              type="file"
                              name="paymentProof"
                              required
                              accept="image/jpeg,image/png"
                              onChange={handlePaymentProofChange}
                              className="hidden"
                            />

                          </div>


                          <p className="text-xs text-slate-500 dark:text-zinc-500 ml-1 leading-relaxed">

                            Pastikan bukti pembayaran terlihat jelas dan sudah benar
                            sebelum menekan tombol Daftar Sekarang.

                          </p>

                        </div>

                      </div>



                      {/* ========================================= */}
                      {/* SUBMIT BUTTON */}
                      {/* ========================================= */}

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



      {/* TACTLINK SUPPORT */}
      <div className="w-full mt-20 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">

        <TactlinkSupportSection noBackground={true} />

      </div>

    </AuroraBackground>
  );
}