"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Award, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

export default function CertificatesPage() {
    const { t } = useLanguage();
    const [selectedCert, setSelectedCert] = useState<{ index: number; title: string; description: string } | null>(null);
    const [showZoom, setShowZoom] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [currentPage, setCurrentPage] = useState(1);

    const certificates = [
        { id: 5, title: t('certificatesPage.cert5Title'), frontImage: "/certificate-images/5.pdf/1.jpeg", backImage: "/certificate-images/5.pdf/2.jpeg", description: t('certificatesPage.cert5Desc') },
        { id: 6, title: t('certificatesPage.cert6Title'), frontImage: "/certificates/1.png", backImage: "/certificates/1.png", description: t('certificatesPage.cert6Desc'), singlePage: true },
        { id: 9, title: t('certificatesPage.cert9Title'), frontImage: "/certificates/4.png", backImage: "/certificates/5.png", description: t('certificatesPage.cert9Desc') },
        { id: 4, title: t('certificatesPage.cert4Title'), frontImage: "/certificate-images/4.pdf/1.png", backImage: "/certificate-images/4.pdf/2.png", description: t('certificatesPage.cert4Desc') },
        { id: 1, title: t('certificatesPage.cert1Title'), frontImage: "/certificate-images/1.pdf/1.png", backImage: "/certificate-images/1.pdf/2.png", description: t('certificatesPage.cert1Desc') },
        { id: 2, title: t('certificatesPage.cert2Title'), frontImage: "/certificate-images/2.pdf/1.png", backImage: "/certificate-images/2.pdf/2.png", description: t('certificatesPage.cert2Desc') },
        { id: 3, title: t('certificatesPage.cert3Title'), frontImage: "/certificate-images/3.pdf/1.png", backImage: "/certificate-images/3.pdf/2.png", description: t('certificatesPage.cert3Desc') },
        { id: 10, title: t('certificatesPage.cert10Title'), frontImage: "/certificates/TechnicalDatasheetforMDFDoors.pdf/1.png", backImage: "/certificates/TechnicalDatasheetforMDFDoors.pdf/2.png", description: t('certificatesPage.cert10Desc') },
        { id: 11, title: t('certificatesPage.cert11Title'), frontImage: "/certificates/-Certification-MSF.pdf/1.png", images: Array.from({ length: 12 }, (_, i) => `/certificates/-Certification-MSF.pdf/${i + 1}.png`), description: t('certificatesPage.cert11Desc') },
    ] as any[];

    const getTotalPages = (cert: any) => cert.images ? cert.images.length : cert.singlePage ? 1 : 2;
    const getCurrentImage = (cert: any, page: number) => cert.images ? cert.images[page - 1] : page === 1 ? cert.frontImage : cert.backImage;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setZoomPosition({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
    };

    return (
        <>
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
                <div className="absolute inset-0" style={{ background: "var(--gradient-radial)" }} />
                <div className="container-custom relative">
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl">
                        <motion.span variants={fadeInUp} className="text-blue-600 font-semibold mb-4 block">{t('certificatesPage.badge')}</motion.span>
                        <motion.h1 variants={fadeInUp} className="text-gray-900 mb-6">
                            {t('certificatesPage.title')} <span className="gradient-text">{t('certificatesPage.titleHighlight')}</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-xl text-gray-600 mb-8">{t('certificatesPage.description')}</motion.p>
                        <motion.div variants={fadeInUp}>
                            <a href="#certificates-list" className="btn-primary">{t('certificatesPage.viewCertificates')}<Award className="w-5 h-5" /></a>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <section id="certificates-list" className="section-padding bg-white">
                <div className="container-custom">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {certificates.map((cert, index) => (
                            <motion.div key={cert.id} variants={fadeInUp} className="group" onClick={() => { setSelectedCert({ index, title: cert.title, description: cert.description }); setCurrentPage(1); }}>
                                <div className="relative aspect-[1/1.4] rounded-2xl overflow-hidden shadow-lg bg-white mb-6 transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2 cursor-pointer"
                                    style={{ border: '4px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, rgb(59, 130, 246), rgb(168, 85, 247))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' }}>
                                    <Image src={cert.frontImage} alt={cert.title} fill className="object-contain p-6 transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="text-center px-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-600 transition-colors duration-300">
                                        <Award className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <p className="font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors duration-300">{cert.title}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Certificate Modal */}
            <AnimatePresence>
                {selectedCert !== null && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => { setSelectedCert(null); setCurrentPage(1); }}>
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-4xl max-h-[90vh] grid md:grid-cols-2">
                            <div className="relative">
                                <div className="relative h-64 md:h-[90vh] bg-white flex items-center justify-center p-4 cursor-zoom-in"
                                    onMouseMove={handleMouseMove} onMouseEnter={() => setShowZoom(true)} onMouseLeave={() => setShowZoom(false)}>
                                    <Image src={getCurrentImage(certificates[selectedCert.index], currentPage)} alt={`${selectedCert.title} - Page ${currentPage}`} fill className="object-contain p-4" />
                                    {getTotalPages(certificates[selectedCert.index]) > 1 && (
                                        <>
                                            <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}
                                                className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/80 backdrop-blur-sm text-gray-800 hover:bg-white transition-all border border-gray-200 shadow-md ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                <ChevronLeft size={24} />
                                            </button>
                                            <button onClick={() => setCurrentPage(prev => Math.min(getTotalPages(certificates[selectedCert.index]), prev + 1))} disabled={currentPage === getTotalPages(certificates[selectedCert.index])}
                                                className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/80 backdrop-blur-sm text-gray-800 hover:bg-white transition-all border border-gray-200 shadow-md ${currentPage === getTotalPages(certificates[selectedCert.index]) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                <ChevronRight size={24} />
                                            </button>
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-black/70 text-white rounded-full text-sm font-semibold">
                                                Page {currentPage} of {getTotalPages(certificates[selectedCert.index])}
                                            </div>
                                        </>
                                    )}
                                </div>
                                {showZoom && (
                                    <div className="hidden md:block absolute left-full top-0 ml-4 w-[400px] h-[400px] bg-white border-2 border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50">
                                        <div className="relative w-full h-full" style={{ backgroundImage: `url(${getCurrentImage(certificates[selectedCert.index], currentPage)})`, backgroundSize: '200%', backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`, backgroundRepeat: 'no-repeat' }} />
                                    </div>
                                )}
                            </div>
                            <div className="p-8 flex flex-col overflow-y-auto">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">{selectedCert.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{selectedCert.description}</p>
                                    </div>
                                    <button onClick={() => { setSelectedCert(null); setCurrentPage(1); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                                    </button>
                                </div>
                                <div className="mt-auto">
                                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                                <Award className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">Verified Certificate</h4>
                                                <p className="text-sm text-gray-600">Page {currentPage} of {getTotalPages(certificates[selectedCert.index])}</p>
                                            </div>
                                        </div>
                                        {!certificates[selectedCert.index].singlePage && getTotalPages(certificates[selectedCert.index]) === 2 && (
                                            <div className="flex gap-2">
                                                <button onClick={() => setCurrentPage(1)} className={`flex-1 text-center px-3 py-2 text-sm rounded-lg font-semibold transition-all ${currentPage === 1 ? 'bg-blue-600 text-white' : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'}`}>Front Page</button>
                                                <button onClick={() => setCurrentPage(2)} className={`flex-1 text-center px-3 py-2 text-sm rounded-lg font-semibold transition-all ${currentPage === 2 ? 'bg-blue-600 text-white' : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'}`}>Back Page</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <section className="section-padding bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="container-custom">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {t('certificatesPage.questionsTitle')} <span className="gradient-text">{t('certificatesPage.questionsTitleHighlight')}</span>
                        </h2>
                        <p className="text-gray-600 mb-8">{t('certificatesPage.questionsDesc')}</p>
                        <a href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl">
                            {t('certificatesPage.contactUs')}
                        </a>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
