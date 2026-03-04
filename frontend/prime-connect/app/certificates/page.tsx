"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, X } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";
import api from "../lib/axios";
import { imgUrl } from "../lib/utils";

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

interface ApiCertificate {
    id: number;
    title: string;
    description: string | null;
    image_url: string | null;
    sort_order: number;
}

export default function CertificatesPage() {
    const { t } = useLanguage();
    const [certificates, setCertificates] = useState<ApiCertificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [showZoom, setShowZoom] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        let mounted = true;
        api.get('/public/certificates').then(res => {
            if (mounted) setCertificates(res.data?.data ?? []);
        }).catch(() => {}).finally(() => { if (mounted) setLoading(false); });
        return () => { mounted = false; };
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setZoomPosition({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
    };

    const selectedCert = selectedIndex !== null ? certificates[selectedIndex] : null;

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
                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i}>
                                    <div className="aspect-[1/1.4] bg-gray-200 rounded-2xl animate-pulse mb-6" />
                                    <div className="h-4 w-32 bg-gray-200 rounded mx-auto animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {certificates.map((cert, index) => (
                                <motion.div key={cert.id} variants={fadeInUp} className="group cursor-pointer" onClick={() => setSelectedIndex(index)}>
                                    <div className="relative aspect-[1/1.4] rounded-2xl overflow-hidden shadow-lg bg-white mb-6 transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2"
                                        style={{ border: '4px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, rgb(59, 130, 246), rgb(168, 85, 247))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' }}>
                                        <Image src={imgUrl(cert.image_url || '')} alt={cert.title} fill className="object-contain p-6 transition-transform duration-500 group-hover:scale-105" />
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
                    )}
                </div>
            </section>

            {/* Certificate Modal */}
            <AnimatePresence>
                {selectedIndex !== null && selectedCert && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedIndex(null)}>
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-4xl max-h-[90vh] grid md:grid-cols-2">
                            <div className="relative">
                                <div className="relative h-64 md:h-[90vh] bg-white flex items-center justify-center p-4 cursor-zoom-in"
                                    onMouseMove={handleMouseMove} onMouseEnter={() => setShowZoom(true)} onMouseLeave={() => setShowZoom(false)}>
                                    <Image src={imgUrl(selectedCert.image_url || '')} alt={selectedCert.title} fill className="object-contain p-4" />
                                </div>
                                {showZoom && (
                                    <div className="hidden md:block absolute left-full top-0 ml-4 w-[400px] h-[400px] bg-white border-2 border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50">
                                        <div className="relative w-full h-full" style={{
                                            backgroundImage: `url(${imgUrl(selectedCert.image_url || '')})`,
                                            backgroundSize: '200%', backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`, backgroundRepeat: 'no-repeat',
                                        }} />
                                    </div>
                                )}
                            </div>
                            <div className="p-8 flex flex-col overflow-y-auto">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">{selectedCert.title}</h3>
                                        {selectedCert.description && (
                                            <p className="text-sm text-gray-500 mt-1">{selectedCert.description}</p>
                                        )}
                                    </div>
                                    <button onClick={() => setSelectedIndex(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                                    </button>
                                </div>
                                <div className="mt-auto">
                                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                                <Award className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">Verified Certificate</h4>
                                                <p className="text-sm text-gray-600">Prime Connect</p>
                                            </div>
                                        </div>
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
