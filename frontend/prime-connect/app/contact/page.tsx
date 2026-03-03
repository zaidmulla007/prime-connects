"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, MapPin, Phone, Mail, User, Send, Clock, CheckCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import Swal from "sweetalert2";
import api from "../lib/axios";

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function ContactPage() {
    const { t } = useLanguage();
    const [formState, setFormState] = useState({ name: "", email: "", phone: "", company: "", message: "" });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            await api.post('/public/inquiries', {
                name: formState.name,
                email: formState.email,
                phone: formState.phone,
                subject: `Contact Form: ${formState.company || 'General Inquiry'}`,
                message: formState.message + (formState.company ? `\n\nCompany: ${formState.company}` : ''),
                form_type: 'contact',
            });

            await Swal.fire({
                title: 'Thank You!',
                text: 'Thank you for submitting the form. We will get back to you shortly!',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3b82f6',
            });

            setFormState({ name: "", email: "", phone: "", company: "", message: "" });
            setIsSubmitted(true);
            setTimeout(() => setIsSubmitted(false), 3000);
        } catch (error: any) {
            await Swal.fire({
                title: 'Oops!',
                text: error?.response?.data?.error || 'Something went wrong. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3b82f6',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
                <div className="absolute inset-0" style={{ background: "var(--gradient-radial)" }} />
                <div className="container-custom relative">
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl">
                        <motion.span variants={fadeInUp} className="text-blue-600 font-semibold mb-4 block">{t('contact.badge')}</motion.span>
                        <motion.h1 variants={fadeInUp} className="text-gray-900 mb-6">
                            {t('contact.title')} <span className="gradient-text">{t('contact.titleHighlight')}</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-xl text-gray-600 mb-8">{t('contact.description')}</motion.p>
                        <motion.div variants={fadeInUp}>
                            <a href="#contact-form" className="btn-primary">{t('contact.requestQuote')}<ArrowRight className="w-5 h-5" /></a>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <section id="contact-form" className="section-padding bg-white">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-16">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                            <motion.h2 variants={fadeInUp} className="text-gray-900 mb-8">
                                <span className="gradient-text">{t('contact.officeHighlight')}</span>
                            </motion.h2>

                            <motion.div variants={fadeInUp} className="space-y-6 mb-10">
                                {[
                                    { icon: MapPin, label: t('contact.addressLabel'), content: <><p className="text-gray-600">{t('contact.addressValue')}</p><a href="https://www.google.com/maps/place/25%C2%B015'12.5%22N+55%C2%B031'09.4%22E/@25.2534776,55.5166965,641m" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 font-medium mt-2">{t('contact.openMaps')}<ArrowRight className="w-4 h-4" /></a></> },
                                    { icon: Phone, label: t('contact.phoneLabel'), content: <><a href="tel:+97165733816" className="text-gray-600 hover:text-blue-600 block">{t('common.phoneAjman')}</a><a href="tel:+971589126137" className="text-gray-600 hover:text-blue-600 block">{t('common.phoneSales')}</a></> },
                                    { icon: Mail, label: t('contact.emailLabel'), content: <><a href="mailto:info@primeconnects.ae" className="text-gray-600 hover:text-blue-600 block">{t('common.emailInfo')}</a><a href="mailto:abde@primeconnects.ae" className="text-gray-600 hover:text-blue-600 block">{t('common.emailAbde')}</a></> },
                                    { icon: User, label: t('contact.contactPerson'), content: <><p className="text-gray-600">{t('common.contactPersonName')}</p><a href="mailto:abde@primeconnects.ae" className="text-blue-600 text-sm">{t('common.emailAbde')}</a></> },
                                ].map(({ icon: Icon, label, content }, i) => (
                                    <div key={i} className="rounded-2xl overflow-hidden p-1 bg-gradient-to-r from-blue-500 to-purple-500">
                                        <div className="flex items-center gap-4 p-6 rounded-xl bg-gray-50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div><h4 className="font-semibold text-gray-900 mb-1">{label}</h4>{content}</div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                            <div className="rounded-3xl overflow-hidden p-1 bg-gradient-to-r from-blue-500 to-purple-500">
                                <div className="p-8 lg:p-10 rounded-[22px] bg-gradient-to-br from-gray-50 to-white shadow-xl">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('contact.sendMessage')}</h2>
                                    <p className="text-gray-600 mb-8">{t('contact.formSubtitle')}</p>

                                    {isSubmitted ? (
                                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                                            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                                                <CheckCircle className="w-10 h-10 text-green-500" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('contact.successTitle')}</h3>
                                            <p className="text-gray-600">{t('contact.successMessage')}</p>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.fullName')}</label>
                                                    <input type="text" required value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" placeholder={t('contact.namePlaceholder')} />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.emailAddress')}</label>
                                                    <input type="email" required value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" placeholder={t('contact.emailPlaceholder')} />
                                                </div>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.phoneNumber')}</label>
                                                    <input type="tel" value={formState.phone} onChange={(e) => setFormState({ ...formState, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" placeholder={t('contact.phonePlaceholder')} />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.companyName')}</label>
                                                    <input type="text" value={formState.company} onChange={(e) => setFormState({ ...formState, company: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" placeholder={t('contact.companyPlaceholder')} />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.message')}</label>
                                                <textarea required rows={5} value={formState.message} onChange={(e) => setFormState({ ...formState, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none" placeholder={t('contact.messagePlaceholder')} />
                                            </div>
                                            <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: isSubmitting ? 1 : 1.02 }} whileTap={{ scale: isSubmitting ? 1 : 0.98 }} className={`w-full btn-primary justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
                                                {isSubmitting ? (
                                                    <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending...</>
                                                ) : (
                                                    <>{t('contact.send')}<Send className="w-5 h-5" /></>
                                                )}
                                            </motion.button>
                                            <p className="text-center text-sm text-gray-500"><Clock className="w-4 h-4 inline mr-1" />{t('contact.responseTime')}</p>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    );
}
