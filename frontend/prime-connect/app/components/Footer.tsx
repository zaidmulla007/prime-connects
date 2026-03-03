"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
    const { t } = useLanguage();
    const currentYear = new Date().getFullYear();

    const sitemapLinks = [
        { name: t('header.home'), href: "/" },
        { name: t('header.products'), href: "/products" },
        { name: t('header.about'), href: "/about" },
        { name: t('header.contact'), href: "/contact" },
    ];

    return (
        <footer className="relative bg-gradient-to-br from-blue-600 to-purple-600 text-white overflow-hidden border-t border-white/10">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "var(--gradient-radial)" }} />
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="relative container-custom py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-10">
                    {/* Company Info */}
                    <div className="lg:col-span-2 flex flex-col">
                        <Link href="/" className="flex items-center gap-1.5 mb-4">
                            <Image src="/logo.png" alt="Prime Connect Logo" width={200} height={48} className="w-auto h-12 object-contain" />
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-white leading-tight whitespace-nowrap">
                                    {t('header.taglineArabic')}
                                </span>
                                <span className="text-xs font-semibold text-white leading-tight whitespace-nowrap">
                                    {t('header.taglineEnglish')}
                                </span>
                            </div>
                        </Link>
                        <p className="text-white/90 text-sm leading-relaxed mb-4 flex-1">
                            {t('hero.description')}
                        </p>
                        <Link href="/contact" className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors group font-semibold">
                            {t('footer.getInTouch')}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                        </Link>
                    </div>

                    {/* Sitemap */}
                    <div className="flex flex-col">
                        <h4 className="text-lg font-semibold mb-4 relative inline-block">
                            {t('footer.sitemap')}
                            <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-white/80" />
                        </h4>
                        <ul className="space-y-2.5 flex-1">
                            {sitemapLinks.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-white/80 hover:text-white transition-colors flex items-center gap-2 group text-sm">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-2 flex flex-col">
                        <h4 className="text-lg font-semibold mb-4 relative inline-block">
                            {t('footer.contactUs')}
                            <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-white/80" />
                        </h4>
                        <ul className="space-y-3 flex-1">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-white/90 flex-shrink-0 mt-0.5" />
                                <span className="text-white/90 text-sm leading-snug">{t('footer.address')}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-white/90 flex-shrink-0" />
                                <a href="tel:+97165733816" className="text-white/80 hover:text-white transition-colors text-sm">{t('common.phoneAjman')}</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-white/90 flex-shrink-0" />
                                <a href="tel:+971589126137" className="text-white/80 hover:text-white transition-colors text-sm">{t('common.phoneSales')}</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-white/90 flex-shrink-0" />
                                <a href="mailto:info@primeconnects.ae" className="text-white/80 hover:text-white transition-colors text-sm">{t('common.emailInfo')}</a>
                            </li>
                        </ul>
                    </div>

                    {/* Company Stats */}
                    <div className="flex flex-col">
                        <h4 className="text-lg font-semibold mb-4 relative inline-block">
                            {t('footer.ourCompany')}
                            <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-white/80" />
                        </h4>
                        <p className="text-white/90 text-sm mb-6 leading-relaxed">{t('footer.companyDesc')}</p>
                        <div className="flex gap-3 justify-start">
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-white">{t('common.stat25Plus')}</span>
                                <p className="text-xs text-white/80 mt-1 whitespace-nowrap">{t('hero.stats.years')}</p>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-white">{t('common.stat6')}</span>
                                <p className="text-xs text-white/80 mt-1 whitespace-nowrap">{t('hero.stats.factories')}</p>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-white">{t('common.stat2')}</span>
                                <p className="text-xs text-white/80 mt-1 whitespace-nowrap">{t('hero.stats.countries')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-6 border-t border-white/20 flex justify-center items-center">
                    <p className="text-white/90 text-sm text-center">
                        © {currentYear} {t('footer.rights')} | {t('footer.poweredBy')}{' '}
                        <a href="https://zetacoding.com/" target="_blank" rel="noopener noreferrer" className="text-white hover:underline transition-colors font-medium">
                            {t('common.zetacoding')}
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
