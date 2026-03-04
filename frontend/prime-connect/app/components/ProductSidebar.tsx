"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/axios";
import { useLanguage } from "../context/LanguageContext";

interface NavCategory {
    id: number;
    name: string;
    slug: string;
    meta: string | null;
    depth: number;
    parent_id: number | null;
    children: NavCategory[];
}

interface ProductSidebarProps {
    activeSlug?: string;
    activeCategory?: string;
    filterMode?: boolean;
}

export default function ProductSidebar({ activeSlug, activeCategory, filterMode = false }: ProductSidebarProps) {
    const { t, language } = useLanguage();
    const [categories, setCategories] = useState<NavCategory[]>([]);
    const [openCategories, setOpenCategories] = useState<string[]>([]);

    const getCatName = (cat: NavCategory): string => {
        if (language === 'en') return cat.name;
        try {
            const meta = cat.meta ? JSON.parse(cat.meta) : {};
            if (language === 'ar') return meta.name_ar || cat.name;
            if (language === 'zh') return meta.name_zh || cat.name;
        } catch { /* empty */ }
        return cat.name;
    };

    useEffect(() => {
        let mounted = true;
        api.get('/public/categories').then(res => {
            if (!mounted) return;
            const tree: NavCategory[] = res.data?.data ?? [];
            setCategories(tree);
            // Auto-open the parent that contains the active item
            const active = tree.find(cat =>
                cat.slug === activeCategory || cat.children.some(item => item.slug === activeSlug)
            );
            setOpenCategories(active ? [active.slug] : (tree[0] ? [tree[0].slug] : []));
        }).catch(() => {});
        return () => { mounted = false; };
    }, [activeSlug, activeCategory]);

    const toggleCategory = (categorySlug: string) => {
        setOpenCategories(prev =>
            prev.includes(categorySlug)
                ? prev.filter(c => c !== categorySlug)
                : [...prev, categorySlug]
        );
    };

    return (
        <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                    {t('sidebar.productCenter')}
                </h4>
            </div>

            <div className="divide-y divide-gray-100">
                {categories.map((category) => {
                    const isOpen = openCategories.includes(category.slug);
                    const isActiveParent = category.slug === activeCategory || category.children.some(item => item.slug === activeSlug);
                    const categoryName = getCatName(category);

                    if (category.children.length === 0) {
                        return (
                            <div key={category.slug} className="bg-white">
                                <Link
                                    href={`/products?category=${category.slug}`}
                                    className={`block w-full px-6 py-4 transition-colors hover:bg-gray-50 font-semibold text-base ${activeSlug === category.slug ? 'text-blue-600 bg-blue-50/50' : 'text-gray-800'}`}
                                >
                                    {categoryName}
                                </Link>
                            </div>
                        );
                    }

                    return (
                        <div key={category.slug} className="bg-white">
                            <div className={`w-full flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50 ${isActiveParent ? 'text-blue-600 bg-blue-50/50' : 'text-gray-800'}`}>
                                {filterMode ? (
                                    <Link href={`/products?category=${category.slug}`} className="flex-1 font-semibold text-base hover:text-blue-600 transition-colors">
                                        {categoryName}
                                    </Link>
                                ) : (
                                    <span className="flex-1 font-semibold text-base cursor-pointer" onClick={() => toggleCategory(category.slug)}>{categoryName}</span>
                                )}
                                <button onClick={() => toggleCategory(category.slug)} className="p-1 hover:bg-gray-200 rounded-md transition-colors">
                                    {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                                </button>
                            </div>

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden bg-gray-50/50"
                                    >
                                        <div className="flex flex-col">
                                            {category.children.map((item) => {
                                                const isActive = item.slug === activeSlug;
                                                const itemName = getCatName(item);
                                                return (
                                                    <Link
                                                        key={item.slug}
                                                        href={`/products?category=${item.slug}`}
                                                        className={`px-8 py-3 text-sm transition-all border-l-4 ${isActive ? 'border-blue-600 bg-white text-blue-600 font-medium shadow-sm' : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-100'}`}
                                                    >
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
        </div>
    );
}
