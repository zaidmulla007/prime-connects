"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import api from "../lib/axios";

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

interface Category { id: number; name: string; slug: string; description?: string; depth: number; parent_id?: number }

export default function CategoriesPage() {
    const { t } = useLanguage();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await api.get('/public/categories?flat=1');
                if (mounted) setCategories((res.data?.data ?? []).filter((c: Category) => c.depth === 0));
            } catch {}
            if (mounted) setLoading(false);
        })();
        return () => { mounted = false; };
    }, []);

    return (
        <>
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
                <div className="absolute inset-0" style={{ background: "var(--gradient-radial)" }} />
                <div className="container-custom relative">
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl">
                        <motion.span variants={fadeInUp} className="text-blue-600 font-semibold mb-4 block">{t('categoriesPage.badge')}</motion.span>
                        <motion.h1 variants={fadeInUp} className="text-gray-900 mb-6">
                            {t('categoriesPage.title')} <span className="gradient-text">{t('categoriesPage.titleHighlight')}</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-xl text-gray-600 mb-8">{t('categoriesPage.subtitle')}</motion.p>
                    </motion.div>
                </div>
            </section>

            <section className="section-padding bg-white">
                <div className="container-custom">
                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />)}
                        </div>
                    ) : (
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {categories.map((category) => (
                                <motion.div
                                    key={category.id}
                                    variants={fadeInUp}
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    className="group relative rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative p-8 h-full flex flex-col">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-6 group-hover:from-blue-500 group-hover:to-purple-500 transition-all">
                                            <Package className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                                        <p className="text-gray-600 mb-6 flex-grow">{category.description || t('categoriesPage.subtitle')}</p>
                                        <div className="flex items-center justify-between mt-auto">
                                            <Link href={`/products?category=${encodeURIComponent(category.slug)}`} className="inline-flex items-center text-blue-600 font-medium gap-1 group-hover:gap-2 transition-all">
                                                {t('categoriesPage.exploreProducts')}
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/20 transition-colors pointer-events-none" />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>
        </>
    );
}
