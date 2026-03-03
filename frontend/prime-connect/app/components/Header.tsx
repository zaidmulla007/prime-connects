"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Phone, Mail, Facebook, Instagram, Linkedin, Youtube, Globe, Download, Images, Video } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { navigationCategories } from "../data/constants";

const contactInfo = {
    emails: ["info@primeconnects.ae", "abde@primeconnects.ae"],
    phones: ["+971 58 912 6137", "+971 6 573 3816"],
};

const TikTokIcon = ({ size = 16 }: { size?: number }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
);

const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
    { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/pc_doorsandcabinets/" },
    { name: "TikTok", icon: TikTokIcon, href: "https://www.tiktok.com/@primedoorsolutions?lang=en" },
    { name: "LinkedIn", icon: Linkedin, href: "https://ae.linkedin.com/in/abde-mustafa-976a6236a" },
    { name: "YouTube", icon: Youtube, href: "https://www.youtube.com/channel/UC70t69QZ4yDKnsyrM6C89AQ" },
];

export default function Header() {
    const { language, setLanguage, t } = useLanguage();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isBrochuresOpen, setIsBrochuresOpen] = useState(false);
    const [openMobileCategory, setOpenMobileCategory] = useState<string | null>(null);
    const [openSubCategory, setOpenSubCategory] = useState<string | null>(null);

    const languages = [
        { code: "en", label: t('header.langEn') },
        { code: "ar", label: t('header.langAr') },
        { code: "zh", label: t('header.langZh') }
    ];

    const currentLangLabel = languages.find(l => l.code === language)?.label || "English";

    const brochures = [
        { name: t('br.corePanels'), file: "/brochures/core-panels.pdf" },
        { name: t('br.general'), file: "/brochures/PrimeconnectsGeneralCatalogue.pdf" },
        { name: t('br.doors'), file: "/brochures/PrimeConnectsDoorscatalogue.pdf" },
        { name: t('br.wpcDoors'), file: "/brochures/Primeconnectwpcdoorcatalogforbbdhome.pdf" },
        { name: t('br.locks'), file: "/brochures/PrimeconnectsCylinderLocks.pdf" },
        { name: t('br.hinges'), file: "/brochures/PrimeconnectsHinges.pdf" },
        { name: t('br.smartLocks'), file: "/brochures/PrimeconnectsSmartRimLocks.pdf" },
    ];

    const productCategories = navigationCategories;

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: t('header.home'), href: "/" },
        { name: t('header.products'), href: "/products", hasDropdown: true },
        { name: t('header.about'), href: "/about" },
        { name: t('header.projects'), href: "/projects", hasDropdown: true, isProjects: true },
        { name: t('header.certificates'), href: "/certificates" },
        { name: t('header.contact'), href: "/contact" },
    ];

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
            {/* Top Bar */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs py-1 hidden lg:block">
                <div className="container-custom flex justify-center items-center gap-6">
                    <div className="flex items-center gap-4">
                        <a href="mailto:info@primeconnects.ae" className="flex items-center gap-1 hover:text-gray-200">
                            <Mail size={14} /> {t('common.emailInfo')}
                        </a>
                        <a href="mailto:abde@primeconnects.ae" className="flex items-center gap-1 hover:text-gray-200">
                            <Mail size={14} /> {t('common.emailAbde')}
                        </a>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="tel:+97165733816" className="flex items-center gap-1 hover:text-gray-200">
                            <Phone size={14} /> {t('common.phoneAjman')}
                        </a>
                        <a href="tel:+971589126137" className="flex items-center gap-1 hover:text-gray-200">
                            <Phone size={14} /> {t('common.phoneSales')}
                        </a>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                        {socialLinks.map(social => (
                            <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
                                <social.icon size={16} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <motion.header
                className={`w-full transition-all duration-300 ${isScrolled ? "bg-white backdrop-blur-lg shadow-md py-3" : "bg-white/80 backdrop-blur-sm py-3"}`}
            >
                <div className="container-custom flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-1.5 group">
                        <div className="relative w-auto h-12 overflow-visible">
                            <Image src="/logo.png" alt="Prime Connect Logo" width={200} height={48} className="h-full w-auto object-contain" priority />
                        </div>
                        <div className={`flex flex-col ${language === 'ar' ? 'items-end' : 'items-start'}`}>
                            <span className="text-xs md:text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent leading-tight">
                                {t('header.taglineArabic')}
                            </span>
                            <span className="text-[10px] md:text-xs font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent leading-tight">
                                {t('header.taglineEnglish')}
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                            return (
                                <div
                                    key={link.name}
                                    className="relative group"
                                    onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.name)}
                                    onMouseLeave={() => {
                                        if (link.hasDropdown) {
                                            setActiveDropdown(null);
                                            setActiveCategory(null);
                                        }
                                    }}
                                >
                                    <Link
                                        href={link.href}
                                        className={`font-medium text-sm transition-all py-2 flex items-center gap-1 relative ${isActive
                                            ? "bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500"
                                            : "text-gray-600 hover:text-blue-600"
                                            }`}
                                    >
                                        {link.name}
                                        {link.hasDropdown && <ChevronDown className="w-4 h-4" />}
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-underline"
                                                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-500 rounded-full"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        )}
                                    </Link>

                                    {link.hasDropdown && (
                                        <AnimatePresence>
                                            {activeDropdown === link.name && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute left-0 top-full pt-4 z-50"
                                                >
                                                    {link.isProjects ? (
                                                        <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden w-56">
                                                            <Link href="/projects" className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100" onClick={() => setActiveDropdown(null)}>
                                                                <Images className="w-5 h-5 text-blue-600" />
                                                                <span className="text-sm font-medium text-gray-700">Images</span>
                                                            </Link>
                                                            <Link href="/projects?type=videos" className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors" onClick={() => setActiveDropdown(null)}>
                                                                <Video className="w-5 h-5 text-purple-600" />
                                                                <span className="text-sm font-medium text-gray-700">Videos</span>
                                                            </Link>
                                                        </div>
                                                    ) : (
                                                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex shadow-blue-900/5">
                                                            {/* Left Sidebar: Categories */}
                                                            <div className="w-64 bg-white p-2 flex flex-col gap-1">
                                                                {productCategories.map((category) => {
                                                                    const categoryName = category.name[language as keyof typeof category.name] || category.name.en;
                                                                    if (category.slug === "color-card" || category.slug === "wardrobe") {
                                                                        return (
                                                                            <Link
                                                                                key={category.slug}
                                                                                href={`/product/${category.slug}`}
                                                                                onMouseEnter={() => setActiveCategory(null)}
                                                                                className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                                                                            >
                                                                                <div className="flex items-center gap-3">
                                                                                    <span className="font-medium text-sm">{categoryName}</span>
                                                                                </div>
                                                                            </Link>
                                                                        );
                                                                    }
                                                                    return (
                                                                        <div
                                                                            key={category.slug}
                                                                            onMouseEnter={() => setActiveCategory(category.slug)}
                                                                            className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${activeCategory === category.slug ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                                                                        >
                                                                            <div className="flex items-center gap-3">
                                                                                <span className="font-medium text-sm">{categoryName}</span>
                                                                            </div>
                                                                            {activeCategory === category.slug && (
                                                                                <ChevronDown className="w-4 h-4 rotate-[-90deg] text-blue-600" />
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>

                                                            {/* Right Content */}
                                                            {activeCategory && (() => {
                                                                const activeCat = productCategories.find(c => c.slug === activeCategory);
                                                                if (!activeCat) return null;
                                                                const activeCatName = activeCat.name[language as keyof typeof activeCat.name] || activeCat.name.en;
                                                                return (
                                                                    <div className="w-64 p-4 bg-gray-50/50 border-l border-gray-100">
                                                                        <div className="h-full flex flex-col">
                                                                            <div className="mb-3 pb-2 border-b border-gray-200 flex items-baseline justify-between">
                                                                                <h3 className="text-sm font-bold text-gray-900">{activeCatName}</h3>
                                                                                <Link href={`/products?category=${activeCat.slug}`} className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                                                                    {t('header.viewAll')} <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
                                                                                </Link>
                                                                            </div>
                                                                            <div className="flex flex-col gap-1">
                                                                                {activeCat.items.map((item, idx) => {
                                                                                    const itemName = item.name[language as keyof typeof item.name] || item.name.en;
                                                                                    return (
                                                                                        <Link
                                                                                            key={idx}
                                                                                            href={`/product/${item.slug}`}
                                                                                            className="group flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-blue-50 transition-all"
                                                                                        >
                                                                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-blue-500 transition-colors" />
                                                                                            <span className="text-sm text-gray-700 group-hover:text-blue-700 font-medium transition-colors">{itemName}</span>
                                                                                        </Link>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })()}
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    {/* Right Side Actions */}
                    <div className="hidden lg:flex items-center gap-4">
                        {/* Language Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-600 hover:border-blue-500 transition-colors"
                            >
                                <Globe size={16} />
                                {currentLangLabel}
                                <ChevronDown size={14} />
                            </button>
                            <AnimatePresence>
                                {isLangOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        className="absolute top-full right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50"
                                        onMouseLeave={() => setIsLangOpen(false)}
                                    >
                                        {languages.map(lang => (
                                            <button
                                                key={lang.code}
                                                onClick={() => { setLanguage(lang.code as any); setIsLangOpen(false); }}
                                                className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 text-gray-700"
                                            >
                                                {lang.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Download Brochures */}
                        <button
                            onClick={() => setIsBrochuresOpen(true)}
                            className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                        >
                            <Download size={16} />
                            {t('header.downloadBrochures')}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="lg:hidden p-2 text-gray-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden bg-gradient-to-br from-gray-50 to-white border-t border-gray-200 shadow-inner max-h-[calc(100vh-80px)] overflow-y-auto"
                        >
                            <div className="container-custom py-6 flex flex-col gap-3">
                                {navLinks.map((link) => {
                                    const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                                    return (
                                        <div key={link.name}>
                                            {link.hasDropdown ? (
                                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                                    <button
                                                        onClick={() => setOpenMobileCategory(openMobileCategory === link.href ? null : link.href)}
                                                        className={`w-full px-4 py-3 text-left flex items-center justify-between transition-all ${isActive ? "bg-gradient-to-r from-blue-50 to-purple-50" : "hover:bg-gray-50"}`}
                                                    >
                                                        <span className={`font-semibold ${isActive ? "bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600" : "text-gray-900"}`}>
                                                            {link.name}
                                                        </span>
                                                        <ChevronDown className={`w-5 h-5 transition-all duration-300 ${openMobileCategory === link.href ? 'rotate-180 text-blue-600' : 'text-gray-400'}`} />
                                                    </button>
                                                    <AnimatePresence>
                                                        {openMobileCategory === link.href && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                                className="overflow-hidden bg-gradient-to-b from-gray-50 to-white"
                                                            >
                                                                {link.isProjects ? (
                                                                    <div className="px-4 pb-4 pt-2 space-y-2">
                                                                        <Link href="/projects" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                                                                            <Images className="w-4 h-4 text-blue-600" />
                                                                            <span className="font-medium text-gray-800 text-sm">Images</span>
                                                                        </Link>
                                                                        <Link href="/projects?type=videos" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                                                                            <Video className="w-4 h-4 text-purple-600" />
                                                                            <span className="font-medium text-gray-800 text-sm">Videos</span>
                                                                        </Link>
                                                                    </div>
                                                                ) : (
                                                                    <div className="px-4 pb-4 pt-2 space-y-3">
                                                                        {productCategories.map((category, catIndex) => {
                                                                            const categoryName = category.name[language as keyof typeof category.name] || category.name.en;
                                                                            if (category.slug === "color-card" || category.slug === "wardrobe") {
                                                                                return (
                                                                                    <Link key={catIndex} href={`/product/${category.slug}`} onClick={() => setIsMobileMenuOpen(false)}
                                                                                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group">
                                                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-125 transition-transform" />
                                                                                        <span className="font-medium text-gray-800 text-sm group-hover:text-blue-600">{categoryName}</span>
                                                                                    </Link>
                                                                                );
                                                                            }
                                                                            return (
                                                                                <div key={catIndex} className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                                                                                    <button
                                                                                        onClick={() => setOpenSubCategory(openSubCategory === category.slug ? null : category.slug)}
                                                                                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 transition-colors"
                                                                                    >
                                                                                        <div className="flex items-center gap-2">
                                                                                            <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                                                                                            <span className="font-semibold text-gray-900 text-sm">{categoryName}</span>
                                                                                        </div>
                                                                                        <ChevronDown className={`w-4 h-4 transition-all duration-300 ${openSubCategory === category.slug ? 'rotate-180 text-blue-600' : 'text-gray-400'}`} />
                                                                                    </button>
                                                                                    <AnimatePresence>
                                                                                        {openSubCategory === category.slug && (
                                                                                            <motion.div
                                                                                                initial={{ height: 0, opacity: 0 }}
                                                                                                animate={{ height: "auto", opacity: 1 }}
                                                                                                exit={{ height: 0, opacity: 0 }}
                                                                                                transition={{ duration: 0.3 }}
                                                                                                className="overflow-hidden bg-gray-50"
                                                                                            >
                                                                                                <div className="px-3 pb-3 pt-1 space-y-1">
                                                                                                    {category.items.map((item, itemIndex) => {
                                                                                                        const itemName = item.name[language as keyof typeof item.name] || item.name.en;
                                                                                                        return (
                                                                                                            <Link key={itemIndex} href={`/product/${item.slug}`} onClick={() => setIsMobileMenuOpen(false)}
                                                                                                                className="flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-600 text-xs hover:bg-white hover:text-blue-600 transition-colors">
                                                                                                                <div className="w-1 h-1 rounded-full bg-gray-400" />
                                                                                                                {itemName}
                                                                                                            </Link>
                                                                                                        );
                                                                                                    })}
                                                                                                </div>
                                                                                            </motion.div>
                                                                                        )}
                                                                                    </AnimatePresence>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            ) : (
                                                <Link href={link.href} onClick={() => setIsMobileMenuOpen(false)}
                                                    className={`block px-4 py-3 rounded-xl font-semibold transition-all shadow-sm border ${isActive ? "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-600" : "bg-white border-gray-100 text-gray-900 hover:bg-gray-50"}`}>
                                                    {link.name}
                                                </Link>
                                            )}
                                        </div>
                                    );
                                })}

                                {/* Mobile Language & Brochures */}
                                <div className="mt-4 space-y-3">
                                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                        <h4 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                                            <Globe size={16} className="text-blue-600" />
                                            Please Select a Language
                                        </h4>
                                        <div className="flex gap-2">
                                            {languages.map(lang => (
                                                <button
                                                    key={lang.code}
                                                    onClick={() => setLanguage(lang.code as any)}
                                                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${language === lang.code ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                                                >
                                                    {lang.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsBrochuresOpen(true)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
                                    >
                                        <Download size={18} />
                                        {t('header.downloadBrochures')}
                                    </button>
                                </div>

                                {/* Mobile Contact Info */}
                                <div className="mt-3 pt-4 border-t border-gray-200">
                                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm space-y-3">
                                        <h4 className="font-semibold text-gray-900 text-sm mb-3">Contact Us</h4>
                                        <a href="mailto:info@primeconnects.ae" className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><Mail size={16} className="text-blue-600" /></div>
                                            <span>{t('common.emailInfo')}</span>
                                        </a>
                                        <a href="mailto:abde@primeconnects.ae" className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                                            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center"><Mail size={16} className="text-purple-600" /></div>
                                            <span>{t('common.emailAbde')}</span>
                                        </a>
                                        <a href="tel:+97165733816" className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                                            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center"><Phone size={16} className="text-green-600" /></div>
                                            <span>{t('common.phoneAjman')}</span>
                                        </a>
                                        <a href="tel:+971589126137" className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                                            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center"><Phone size={16} className="text-green-600" /></div>
                                            <span>{t('common.phoneSales')}</span>
                                        </a>
                                    </div>

                                    {/* Social Links */}
                                    <div className="mt-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                        <h4 className="font-semibold text-gray-900 text-sm mb-3">Follow Us</h4>
                                        <div className="flex gap-3 flex-wrap">
                                            {socialLinks.map(social => (
                                                <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer"
                                                    className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center text-gray-600 hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all shadow-sm">
                                                    {social.icon && <social.icon size={18} />}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* Brochures Modal */}
            <AnimatePresence>
                {isBrochuresOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                        onClick={() => setIsBrochuresOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-xl shadow-2xl w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-start justify-between p-4 border-b border-gray-100">
                                <div>
                                    <h4 className="text-base font-semibold text-gray-900">{t('header.brochuresTitle')}</h4>
                                    <p className="text-gray-500 text-xs mt-0.5">{t('header.brochuresDesc')}</p>
                                </div>
                                <button onClick={() => setIsBrochuresOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                    <X size={18} className="text-gray-500" />
                                </button>
                            </div>
                            <div className="p-4 space-y-2">
                                {brochures.map((brochure, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-all">
                                        <span className="text-gray-800 text-sm">{brochure.name}</span>
                                        <a href={brochure.file} download className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-md text-xs font-medium transition-all shadow-sm">
                                            <Download size={14} />
                                            {t('header.download')}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
