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
  const [ticketType, setTicketType] = useState('');

  const [copied, setCopied] = useState(false);
  const [paymentProofName, setPaymentProofName] = useState('');
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);

  const [studentCardName, setStudentCardName] = useState('');
  const [studentCardPreview, setStudentCardPreview] = useState<string | null>(null);

  const BANK_NAME = 'BCA';
  const ACCOUNT_NUMBER = '3801204145';
  const ACCOUNT_NAME = 'Siti Rahmah';

  const TICKET_PRICE =
    ticketType === 'Umum'
      ? 'Rp90.000'
      : ticketType === 'Group 5 Orang'
      ? 'Rp350.000'
      : ticketType === 'Siswa SMA/SMK & Mahasiswa'
      ? 'Rp50.000'
      : '-';

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

  const handleStudentCardChange = (
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
      alert('Kartu pelajar/mahasiswa harus berupa JPG, JPEG, atau PNG.');

      e.target.value = '';
      setStudentCardName('');
      setStudentCardPreview(null);

      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert('Ukuran kartu pelajar/mahasiswa maksimal 5 MB.');

      e.target.value = '';
      setStudentCardName('');
      setStudentCardPreview(null);

      return;
    }

    if (studentCardPreview) {
      URL.revokeObjectURL(studentCardPreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setStudentCardName(file.name);
    setStudentCardPreview(previewUrl);
  };

  const handleRemoveStudentCard = () => {
    if (studentCardPreview) {
      URL.revokeObjectURL(studentCardPreview);
    }

    setStudentCardName('');
    setStudentCardPreview(null);

    const input = document.getElementById(
      'studentCard'
    ) as HTMLInputElement | null;

    if (input) {
      input.value = '';
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const fullName = formData.get('fullName');
    const tiktokUsername = formData.get('tiktokUsername');
    const tiktokLink = formData.get('tiktokLink');
    const followers = formData.get('followers');
    const kategori = formData.get('kategori');
    const isCommunity = formData.get('isCommunity');
    const email = formData.get('email');
    const whatsapp = formData.get('whatsapp');
    const selectedTicket = formData.get('ticketType');

    if (
      !fullName ||
      !tiktokUsername ||
      !tiktokLink ||
      !followers ||
      !kategori ||
      !isCommunity ||
      !email ||
      !whatsapp ||
      !selectedTicket
    ) {
      alert('Mohon lengkapi semua data yang wajib diisi.');
      return;
    }

    if (
      isCommunity === 'Ya' &&
      !formData.get('communityName')
    ) {
      alert('Mohon isi nama komunitas, institusi, atau organisasi.');
      return;
    }

    if (selectedTicket === 'Group 5 Orang') {
      if (
        !formData.get('groupMember1') ||
        !formData.get('groupMember2') ||
        !formData.get('groupMember3') ||
        !formData.get('groupMember4') ||
        !formData.get('groupMember5')
      ) {
        alert('Mohon lengkapi nama 5 anggota group.');
        return;
      }
    }

    if (selectedTicket === 'Siswa SMA/SMK & Mahasiswa') {
      if (!formData.get('schoolUniversity')) {
        alert('Mohon isi asal sekolah atau universitas.');
        return;
      }

      const studentCardFile = formData.get('studentCard') as File;

      if (!studentCardFile || studentCardFile.size === 0) {
        alert('Mohon upload kartu pelajar atau kartu mahasiswa.');
        return;
      }
    }

    const paymentProofFile = formData.get('paymentProof') as File;

    if (!paymentProofFile || paymentProofFile.size === 0) {
      alert('Mohon upload bukti pembayaran.');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');

    try {
      const paymentProof = formData.get('paymentProof') as File;

      let paymentProofBase64 = '';

      if (paymentProof && paymentProof.size > 0) {
        paymentProofBase64 = await fileToBase64(paymentProof);
      }

      const studentCard = formData.get('studentCard') as File | null;

      let studentCardBase64 = '';

      if (
        studentCard &&
        studentCard instanceof File &&
        studentCard.size > 0
      ) {
        studentCardBase64 = await fileToBase64(studentCard);
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

          ticketType: formData.get('ticketType'),
          groupMember1: formData.get('groupMember1') || '-',
          groupMember2: formData.get('groupMember2') || '-',
          groupMember3: formData.get('groupMember3') || '-',
          groupMember4: formData.get('groupMember4') || '-',
          groupMember5: formData.get('groupMember5') || '-',
          schoolUniversity: formData.get('schoolUniversity') || '-',
          studentCard: studentCardBase64,
          studentCardName: studentCard?.name || '',

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
        console.error('Registration failed, server response:', result);
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

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut"
            }}
            className="lg:col-span-5 flex flex-col justify-center pt-2 sm:pt-0"
          >

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

            <div className="inline-flex">

              <span className="bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 font-bold px-4 py-1.5 rounded-full text-xs sm:text-sm tracking-[0.2em] uppercase mb-6 shadow-[0_0_15px_rgba(34,197,94,0.4)]">

                <ShinyText
                  text="EXCLUSIVE EVENT"
                  className="text-green-600 dark:text-green-400"
                />

              </span>

            </div>

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

            <div className="mb-6">

              <img
                src="/KEPULAUAN-RIAU.png"
                alt="Poster Event Kepulauan Riau"
                className="w-full rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl object-cover"
              />

            </div>

            <div className="bg-white/80 dark:bg-[#0C0C14]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-xl rounded-3xl p-6 md:p-8 space-y-6 mb-10">

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
                      Aula Lantai 3 Poltekkes Tanjung Pinang
                    </strong>

                    <br />

                    Jl. Arif Rahman Hakim No.01, Sei Jang,
                    Kec. Bukit Bestari, Kota Tanjung Pinang

                  </p>

                </div>

              </div>

            </div>

          </motion.div>

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
                      noValidate
                      className="space-y-5"
                    >

                      <div className="space-y-5">

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

                        <div className="pt-4 mt-4 border-t border-slate-200 dark:border-white/10"></div>

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

                        <div className="pt-7 mt-7 border-t border-slate-200 dark:border-white/10">

                          <div className="space-y-2.5">

                            <div>

                              <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1 block">

                                Pilihan Tiket Keikutsertaan

                                <span className="text-red-500">
                                  *
                                </span>

                              </label>

                              <p className="text-xs text-slate-500 ml-1 mt-1">

                                Silakan pilih kategori tiket yang sesuai.

                              </p>

                            </div>

                            <CustomSelect
                              name="ticketType"
                              required={true}
                              placeholder="-- Pilih Tiket --"
                              onChange={(val) =>
                                setTicketType(val)
                              }
                              options={[
                                {
                                  value: 'Umum',
                                  label: 'Umum — Rp90.000'
                                },
                                {
                                  value: 'Group 5 Orang',
                                  label: 'Group 5 Orang — Rp350.000'
                                },
                                {
                                  value: 'Siswa SMA/SMK & Mahasiswa',
                                  label: 'Siswa SMA/SMK & Mahasiswa — Rp50.000'
                                }
                              ]}
                            />

                          </div>

                        </div>

                        {ticketType === 'Group 5 Orang' && (

                          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 p-5 sm:p-6 space-y-5">

                            <div>

                              <h3 className="font-bold text-slate-900 dark:text-white">

                                Nama Anggota Group

                              </h3>

                              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">

                                Masukkan nama lengkap 5 anggota group di bawah ini.

                              </p>

                            </div>

                            <div className="space-y-2.5">

                              <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1 block">

                                Nama Anggota 1

                                <span className="text-red-500">*</span>

                              </label>

                              <input
                                type="text"
                                name="groupMember1"
                                required
                                className="w-full glass-input px-4 py-3.5 border border-slate-200 dark:border-white/10 rounded-xl bg-white/50 dark:bg-black/50"
                                placeholder="Masukkan nama anggota 1"
                              />

                            </div>

                            <div className="space-y-2.5">

                              <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1 block">

                                Nama Anggota 2

                                <span className="text-red-500">*</span>

                              </label>

                              <input
                                type="text"
                                name="groupMember2"
                                required
                                className="w-full glass-input px-4 py-3.5 border border-slate-200 dark:border-white/10 rounded-xl bg-white/50 dark:bg-black/50"
                                placeholder="Masukkan nama anggota 2"
                              />

                            </div>

                            <div className="space-y-2.5">

                              <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1 block">

                                Nama Anggota 3

                                <span className="text-red-500">*</span>

                              </label>

                              <input
                                type="text"
                                name="groupMember3"
                                required
                                className="w-full glass-input px-4 py-3.5 border border-slate-200 dark:border-white/10 rounded-xl bg-white/50 dark:bg-black/50"
                                placeholder="Masukkan nama anggota 3"
                              />

                            </div>

                            <div className="space-y-2.5">

                              <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1 block">

                                Nama Anggota 4

                                <span className="text-red-500">*</span>

                              </label>

                              <input
                                type="text"
                                name="groupMember4"
                                required
                                className="w-full glass-input px-4 py-3.5 border border-slate-200 dark:border-white/10 rounded-xl bg-white/50 dark:bg-black/50"
                                placeholder="Masukkan nama anggota 4"
                              />

                            </div>

                            <div className="space-y-2.5">

                              <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1 block">

                                Nama Anggota 5

                                <span className="text-red-500">*</span>

                              </label>

                              <input
                                type="text"
                                name="groupMember5"
                                required
                                className="w-full glass-input px-4 py-3.5 border border-slate-200 dark:border-white/10 rounded-xl bg-white/50 dark:bg-black/50"
                                placeholder="Masukkan nama anggota 5"
                              />

                            </div>

                          </div>

                        )}

                        {ticketType === 'Siswa SMA/SMK & Mahasiswa' && (

                          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 p-5 sm:p-6 space-y-5">

                            <div>

                              <h3 className="font-bold text-slate-900 dark:text-white">

                                Data Siswa / Mahasiswa

                              </h3>

                              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">

                                Lengkapi data berikut untuk menggunakan tiket khusus siswa/mahasiswa.

                              </p>

                            </div>

                            <div className="space-y-2.5">

                              <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1 block">

                                Asal Sekolah / Universitas

                                <span className="text-red-500">*</span>

                              </label>

                              <input
                                type="text"
                                name="schoolUniversity"
                                required
                                className="w-full glass-input px-4 py-3.5 border border-slate-200 dark:border-white/10 rounded-xl bg-white/50 dark:bg-black/50"
                                placeholder="Masukkan nama sekolah atau universitas"
                              />

                            </div>

                            <div className="space-y-2.5">

                              <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1 block">

                                Upload Kartu Pelajar / Kartu Mahasiswa

                                <span className="text-red-500">*</span>

                              </label>

                              <div className="relative">

                                {!studentCardPreview ? (

                                  <label
                                    htmlFor="studentCard"
                                    className="relative flex flex-col items-center justify-center w-full min-h-[150px] border-2 border-dashed border-slate-300 dark:border-white/20 rounded-2xl cursor-pointer bg-white/50 dark:bg-black/20 hover:bg-slate-100/80 dark:hover:bg-white/10 hover:border-green-400 dark:hover:border-green-500/50 transition-all"
                                  >

                                    <div className="flex flex-col items-center justify-center px-5 py-6 text-center">

                                      <div className="w-11 h-11 rounded-full bg-green-500/10 flex items-center justify-center mb-3">

                                        <Upload className="w-5 h-5 text-green-600 dark:text-green-400" />

                                      </div>

                                      <p className="text-sm font-semibold text-slate-700 dark:text-zinc-200">

                                        Upload kartu pelajar / mahasiswa

                                      </p>

                                      <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">

                                        JPG atau PNG, maksimal 5 MB

                                      </p>

                                    </div>

                                  </label>

                                ) : (

                                  <div className="relative rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 p-3">

                                    <button
                                      type="button"
                                      onClick={handleRemoveStudentCard}
                                      className="absolute top-5 right-5 z-30 w-9 h-9 rounded-full bg-black/75 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-all hover:scale-105"
                                      aria-label="Hapus kartu pelajar"
                                      title="Hapus foto"
                                    >

                                      <X className="w-5 h-5" />

                                    </button>

                                    <label
                                      htmlFor="studentCard"
                                      className="block cursor-pointer group"
                                    >

                                      <div className="relative overflow-hidden rounded-xl bg-slate-100 dark:bg-black/30 min-h-[200px] flex items-center justify-center">

                                        <img
                                          src={studentCardPreview}
                                          alt="Preview Kartu Pelajar / Mahasiswa"
                                          className="w-full max-h-[400px] object-contain"
                                        />

                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-all flex items-center justify-center">

                                          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg">

                                            <RefreshCw className="w-4 h-4" />

                                            Ganti Foto

                                          </div>

                                        </div>

                                      </div>

                                    </label>

                                    <div className="flex items-center gap-2 mt-3 px-1">

                                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />

                                      <p className="text-sm text-slate-600 dark:text-zinc-300 truncate">

                                        {studentCardName}

                                      </p>

                                    </div>

                                  </div>

                                )}

                                <input
                                  id="studentCard"
                                  type="file"
                                  name="studentCard"
                                  required
                                  accept="image/jpeg,image/png"
                                  onChange={handleStudentCardChange}
                                  className="hidden"
                                />

                              </div>

                            </div>

                          </div>

                        )}

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

                        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 p-5 sm:p-6 space-y-5">

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

                              {ticketType === 'Group 5 Orang' && (

                                <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">

                                  Rp70.000 / orang

                                </p>

                              )}

                            </div>

                          </div>

                          <div className="border-t border-slate-200 dark:border-white/10"></div>

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

                          <div>

                            <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-zinc-500 mb-1">

                              Atas Nama

                            </p>

                            <p className="font-semibold text-slate-800 dark:text-zinc-200">

                              {ACCOUNT_NAME}

                            </p>

                          </div>

                        </div>

                        <div className="space-y-2.5">

                          <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 ml-1 block">

                            Upload Bukti Pembayaran

                            <span className="text-red-500">
                              *
                            </span>

                          </label>

                          <div className="relative">

                            {!paymentProofPreview ? (

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

                              <div className="relative rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 p-3">

                                <button
                                  type="button"
                                  onClick={handleRemovePaymentProof}
                                  className="absolute top-5 right-5 z-30 w-9 h-9 rounded-full bg-black/75 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-all hover:scale-105"
                                  aria-label="Hapus bukti pembayaran"
                                  title="Hapus foto"
                                >

                                  <X className="w-5 h-5" />

                                </button>

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

                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-all flex items-center justify-center">

                                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg">

                                        <RefreshCw className="w-4 h-4" />

                                        Ganti Foto

                                      </div>

                                    </div>

                                  </div>

                                </label>

                                <div className="flex items-center gap-2 mt-3 px-1">

                                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />

                                  <p className="text-sm text-slate-600 dark:text-zinc-300 truncate">

                                    {paymentProofName}

                                  </p>

                                </div>

                              </div>

                            )}

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

      <div className="w-full mt-20 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">

        <TactlinkSupportSection noBackground={true} />

      </div>

    </AuroraBackground>
  );
}