"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Award, Factory, MapPin, X, MessageSquare, Palette, CheckCircle2, Headphones, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function AboutPage() {
    const { t } = useLanguage();
    const [selectedCert, setSelectedCert] = useState<{ index: number; name: string } | null>(null);
    const [showZoom, setShowZoom] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [currentPage, setCurrentPage] = useState(1);

    const processStages = [
        { title: t('aboutPage.process1Title'), description: t('aboutPage.process1Desc') },
        { title: t('aboutPage.process2Title'), description: t('aboutPage.process2Desc') },
        { title: t('aboutPage.process3Title'), description: t('aboutPage.process3Desc') },
        { title: t('aboutPage.process4Title'), description: t('aboutPage.process4Desc') },
    ];

    const certifications = [t('aboutPage.cert1'), t('aboutPage.cert2'), t('aboutPage.cert3'), t('aboutPage.cert4')];
    const certImages = ['/certificates/1.png', '/certificate-images/4.pdf/1.png', '/certificate-images/5.pdf/1.jpeg', '/certificates/4.png'];
    const certImagesBack = ['/certificates/1.png', '/certificate-images/4.pdf/2.png', '/certificate-images/5.pdf/2.jpeg', '/certificates/5.png'];

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setZoomPosition({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
    };

    const getModalImage = (index: number, page: number) => {
        if (index === 0) return certImages[0];
        return page === 2 ? certImagesBack[index] : certImages[index];
    };

    return (
        <>
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
                <div className="absolute inset-0" style={{ background: "var(--gradient-radial)" }} />
                <div className="container-custom relative">
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl">
                        <motion.span variants={fadeInUp} className="text-blue-600 font-semibold mb-4 block">{t('aboutPage.badge')}</motion.span>
                        <motion.h1 variants={fadeInUp} className="text-gray-900 mb-6">
                            {t('aboutPage.title')} <span className="gradient-text">{t('aboutPage.titleHighlight')}</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-xl text-gray-600 mb-8">{t('aboutPage.description')}</motion.p>
                        <motion.div variants={fadeInUp}>
                            <Link href="/contact" className="btn-primary">{t('aboutPage.contactUs')}<ArrowRight className="w-5 h-5" /></Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Story Section */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                            <motion.h2 variants={fadeInUp} className="text-gray-900 mb-6">
                                {t('aboutPage.storyTitle')} <span className="gradient-text">{t('aboutPage.storyHighlight')}</span>
                            </motion.h2>
                            <motion.p variants={fadeInUp} className="text-gray-600 mb-6 text-lg">{t('aboutPage.storyP1')}</motion.p>
                            <motion.p variants={fadeInUp} className="text-gray-600 mb-6">{t('aboutPage.storyP2')}</motion.p>
                            <motion.div variants={fadeInUp} className="flex flex-wrap gap-8 mt-8">
                                <div className="text-center"><span className="text-4xl font-bold gradient-text">{t('common.stat25Plus')}</span><p className="text-gray-500 text-sm">{t('aboutPage.yearsExp')}</p></div>
                                <div className="text-center"><span className="text-4xl font-bold gradient-text">{t('common.stat6')}</span><p className="text-gray-500 text-sm">{t('aboutPage.factories')}</p></div>
                                <div className="text-center"><span className="text-4xl font-bold gradient-text">{t('common.stat2')}</span><p className="text-gray-500 text-sm">{t('aboutPage.countries')}</p></div>
                            </motion.div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                            <div className="shadow-2xl rounded-2xl overflow-hidden border-4 border-white">
                                <div className="relative aspect-square">
                                    <Image src="/about/1.jpg" alt="Prime Connect" fill className="object-cover" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Work Process Section */}
            <section className="section-padding bg-gradient-to-br from-blue-500 to-purple-500 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "var(--gradient-radial)" }} />
                <div className="container-custom relative">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-16">
                        <motion.span variants={fadeInUp} className="text-white/90 font-semibold mb-2 block uppercase tracking-wider text-sm">
                            {t('aboutPage.processTitle').toUpperCase()} {t('aboutPage.processHighlight').toUpperCase()}
                        </motion.span>
                        <motion.h2 variants={fadeInUp} className="text-white mb-4">{t('aboutPage.processSubtitle')}</motion.h2>
                    </motion.div>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {processStages.map((stage, index) => {
                            const icons = [MessageSquare, Palette, CheckCircle2, Headphones];
                            const Icon = icons[index];
                            return (
                                <motion.div key={index} variants={fadeInUp} className="text-center">
                                    <div className="relative mb-6 flex justify-center">
                                        <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300">
                                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                                <Icon className="w-10 h-10 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{stage.title}</h3>
                                    <p className="text-white/90 text-sm leading-relaxed">{stage.description}</p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Certifications Section */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-16">
                        <motion.h2 variants={fadeInUp} className="text-gray-900 mb-4">
                            {t('aboutPage.certTitle')} <span className="gradient-text">{t('aboutPage.certHighlight')}</span>
                        </motion.h2>
                        <motion.p variants={fadeInUp} className="text-gray-600 max-w-2xl mx-auto">{t('aboutPage.certDesc')}</motion.p>
                    </motion.div>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {certifications.map((cert, index) => (
                            <motion.div key={index} variants={fadeInUp} className="group" onClick={() => { setSelectedCert({ index, name: cert }); setCurrentPage(1); }}>
                                <div className="relative aspect-[1/1.4] rounded-2xl overflow-hidden shadow-lg bg-white mb-6 transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2 cursor-pointer"
                                    style={{ border: '4px solid transparent', backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, rgb(59, 130, 246), rgb(168, 85, 247))', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' }}>
                                    <Image src={certImages[index]} alt={cert} fill className="object-contain p-6 transition-transform duration-500 group-hover:scale-105" />
                                </div>
                                <div className="text-center px-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-600 transition-colors">
                                        <Award className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <p className="font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{cert}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Certificate Modal */}
            <AnimatePresence>
                {selectedCert && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => { setSelectedCert(null); setCurrentPage(1); }}>
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-4xl max-h-[90vh] grid md:grid-cols-2">
                            <div className="relative">
                                <div className="relative h-64 md:h-[90vh] bg-white flex items-center justify-center p-4 cursor-zoom-in"
                                    onMouseMove={handleMouseMove} onMouseEnter={() => setShowZoom(true)} onMouseLeave={() => setShowZoom(false)}>
                                    <Image src={getModalImage(selectedCert.index, currentPage)} alt={selectedCert.name} fill className="object-contain p-4" />
                                    {selectedCert.index > 0 && (
                                        <>
                                            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/80 text-gray-800 hover:bg-white border border-gray-200 shadow-md ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}><ChevronLeft size={24} /></button>
                                            <button onClick={() => setCurrentPage(2)} disabled={currentPage === 2} className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/80 text-gray-800 hover:bg-white border border-gray-200 shadow-md ${currentPage === 2 ? 'opacity-50 cursor-not-allowed' : ''}`}><ChevronRight size={24} /></button>
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-black/70 text-white rounded-full text-sm">Page {currentPage} of 2</div>
                                        </>
                                    )}
                                </div>
                                {showZoom && <div className="hidden md:block absolute left-full top-0 ml-4 w-[400px] h-[400px] bg-white border-2 border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50"><div className="relative w-full h-full" style={{ backgroundImage: `url(${getModalImage(selectedCert.index, currentPage)})`, backgroundSize: '200%', backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`, backgroundRepeat: 'no-repeat' }} /></div>}
                            </div>
                            <div className="p-8 flex flex-col overflow-y-auto">
                                <div className="flex justify-between items-start mb-6">
                                    <div><h3 className="text-2xl font-bold text-gray-900">{selectedCert.name}</h3><p className="text-sm text-gray-500 mt-1">Certification Document</p></div>
                                    <button onClick={() => { setSelectedCert(null); setCurrentPage(1); }} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6 text-gray-400" /></button>
                                </div>
                                <div className="mt-auto">
                                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center"><Award className="w-6 h-6 text-white" /></div>
                                            <div><h4 className="font-bold text-gray-900">Verified Certificate</h4><p className="text-sm text-gray-600">{selectedCert.index > 0 ? `Page ${currentPage} of 2` : "Internationally recognized"}</p></div>
                                        </div>
                                        {selectedCert.index > 0 && (
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

            {/* Global Network */}
            <section className="section-padding bg-gradient-to-br from-blue-500 to-purple-500 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "var(--gradient-radial)" }} />
                <div className="container-custom relative">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-16">
                        <motion.h2 variants={fadeInUp} className="text-white mb-4">{t('global.sectionTitle')} <span className="text-white">{t('global.headingGradient')}</span></motion.h2>
                        <motion.p variants={fadeInUp} className="text-white/90 max-w-2xl mx-auto">{t('global.description')}</motion.p>
                    </motion.div>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {['doorUAE', 'wpc', 'woodenDoor', 'cabinet', 'steelDoor', 'fireproof'].map((key) => (
                            <motion.div key={key} variants={fadeInUp} className="bg-white/10 backdrop-blur-md p-5 rounded-xl border-4 border-white shadow-lg hover:bg-white/20 hover:shadow-xl transition-all group">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0"><Factory className="w-5 h-5 text-white" /></div>
                                    <div>
                                        <h4 className="text-base font-bold text-white mb-1">{t(`global.factories.${key}.type`)}</h4>
                                        <div className="flex items-center gap-1.5 text-white/80 text-sm"><MapPin className="w-3.5 h-3.5" /><span>{t(`global.factories.${key}.city`)}</span></div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding bg-white">
                <div className="container-custom text-center">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                        <motion.h2 variants={fadeInUp} className="text-gray-900 mb-4">{t('aboutPage.ctaTitle')}</motion.h2>
                        <motion.p variants={fadeInUp} className="text-gray-600 max-w-2xl mx-auto mb-8">{t('aboutPage.ctaDesc')}</motion.p>
                        <motion.div variants={fadeInUp}>
                            <Link href="/contact" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg">
                                {t('aboutPage.ctaButton')}<ArrowRight className="w-5 h-5 rtl:rotate-180" />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
