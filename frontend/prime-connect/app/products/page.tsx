"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import ProductSidebar from "../components/ProductSidebar";
import api from "../lib/axios";
import { imgUrl } from "../lib/utils";

// Static spec/detail images shown per door category (design assets, not product data)
const specImages: { [key: string]: string[] } = {
    'mdf-doors': ['/mdf-doors-details/3.png', '/mdf-doors-details/4.png', '/mdf-doors-details/5.png', '/mdf-doors-details/6.png', '/mdf-doors-details/7.png'],
    'wpc-doors': ['/wpc-door-details/9.png', '/wpc-door-details/10.png', '/wpc-door-details/11.png', '/wpc-door-details/12.png', '/wpc-door-details/13.png'],
    'iron-and-steel-doors': ['/iron-steel-doors-details/15.png', '/iron-steel-doors-details/16.png', '/iron-steel-doors-details/17.png'],
    'wooden-doors': ['/wooden-doors-details/19.png', '/wooden-doors-details/20.png', '/wooden-doors-details/21.png', '/wooden-doors-details/22.png'],
    'aluminium-doors': ['/aluminium-doors-details/24.png', '/aluminium-doors-details/25.png', '/aluminium-doors-details/26.png', '/aluminium-doors-details/27.png'],
    'emergency-exit-doors': ['/emeregency-exit-doors-details/29.png', '/emeregency-exit-doors-details/30.png', '/emeregency-exit-doors-details/31.png'],
};

// Categories whose products link to detail page instead of inquiry modal
const DETAIL_LINK_SLUGS = ['mdf-core-panel', 'mr-mdf-core-panel', 'marine-construction-plywood', 'melamine-faced-mdf-panels', 'melamine-faced-plywood', 'solid-chip-board', 'core-panels'];

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

interface Product {
    id: number;
    name: string;
    slug: string;
    sku: string;
    description: string;
    category_id: number;
    category_name: string;
    image_url: string | null;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    depth: number;
    parent_id: number | null;
}


function ProductsContent() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const activeCategory = searchParams.get('category');

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    // Spec images carousel
    const [currentSpecImage, setCurrentSpecImage] = useState(0);
    const currentSpecImages = activeCategory && specImages[activeCategory] ? specImages[activeCategory] : [];

    // Inquiry modal state
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showZoom, setShowZoom] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', phone: '', message: '' });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setZoomPosition({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
    };

    // Fetch categories once
    useEffect(() => {
        let mounted = true;
        api.get('/public/categories?flat=1').then(res => {
            if (mounted) setCategories(res.data?.data ?? []);
        }).catch(() => {});
        return () => { mounted = false; };
    }, []);

    // Fetch products when category filter changes
    const fetchProducts = useCallback(() => {
        let mounted = true;
        setLoading(true);

        const buildQuery = async () => {
            let categoryId: number | null = null;
            if (activeCategory && categories.length > 0) {
                const found = categories.find((c: Category) => c.slug === activeCategory);
                if (found) categoryId = found.id;
            }

            const params: Record<string, string | number> = { per_page: 200 };
            if (categoryId) params.category_id = categoryId;

            try {
                const res = await api.get('/public/products', { params });
                if (mounted) setProducts(res.data?.data ?? []);
            } catch {
                if (mounted) setProducts([]);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        buildQuery();
        return () => { mounted = false; };
    }, [activeCategory, categories]);

    useEffect(() => {
        if (!activeCategory || categories.length > 0) {
            fetchProducts();
        }
    }, [fetchProducts, activeCategory, categories]);

    const handleInquirySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting || !selectedProduct) return;
        setIsSubmitting(true);
        try {
            await api.post('/public/inquiries', {
                ...inquiryForm,
                subject: `Product Inquiry: ${selectedProduct.name}`,
                product_name: selectedProduct.name,
                form_type: 'inquiry',
            });
            setInquiryForm({ name: '', email: '', phone: '', message: '' });
            setSelectedProduct(null);
            alert(t('productDetail.successMessage') || 'Thank you! We will get back to you shortly.');
        } catch {
            alert(t('productDetail.errorMessage') || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const activeFilterName = activeCategory
        ? categories.find((c: Category) => c.slug === activeCategory)?.name || activeCategory
        : null;

    return (
        <div className="flex flex-col lg:flex-row gap-10">
            {/* Mobile Filter Toggle */}
            <button
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                className="lg:hidden w-full mb-6 flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm transition-all hover:border-blue-200"
            >
                <div className="flex items-center gap-3">
                    <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">
                        {t('sidebar.productCenter')}
                    </span>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isMobileSidebarOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Sidebar - Mobile */}
            <AnimatePresence>
                {isMobileSidebarOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden mb-10 overflow-hidden">
                        <ProductSidebar activeCategory={activeCategory || undefined} filterMode={true} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
                <div className="sticky top-32">
                    <ProductSidebar activeCategory={activeCategory || undefined} filterMode={true} />
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
                {/* Active Filter Display */}
                {activeFilterName && (
                    <div className="mb-8 flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3">
                            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-500 font-medium">{t('productsPage.showing')}</span>
                            <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm shadow-blue-200">
                                {activeFilterName}
                            </span>
                        </div>
                        <Link href="/products" className="text-[10px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-1">
                            <span>✕</span> {t('productsPage.clearFilters')}
                        </Link>
                    </div>
                )}

                {/* Spec Images Carousel — shown only for door categories */}
                {currentSpecImages.length > 0 && (
                    <div className="mb-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="relative h-64 md:h-80">
                            <Image src={currentSpecImages[currentSpecImage]} alt="Door specification" fill className="object-contain p-4" />
                            {currentSpecImages.length > 1 && (
                                <>
                                    <button onClick={() => setCurrentSpecImage(i => (i - 1 + currentSpecImages.length) % currentSpecImages.length)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full shadow flex items-center justify-center hover:bg-white transition-colors">
                                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <button onClick={() => setCurrentSpecImage(i => (i + 1) % currentSpecImages.length)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full shadow flex items-center justify-center hover:bg-white transition-colors">
                                        <ChevronRight className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                        {currentSpecImages.map((_, i) => (
                                            <button key={i} onClick={() => setCurrentSpecImage(i)}
                                                className={`w-2 h-2 rounded-full transition-colors ${i === currentSpecImage ? 'bg-blue-600' : 'bg-gray-300'}`} />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
                                <div className="aspect-square bg-gray-100" />
                                <div className="p-4 space-y-2">
                                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                                    <div className="h-4 bg-gray-100 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => {
                            const isDetailLink = DETAIL_LINK_SLUGS.includes(activeCategory || '');
                            const cardContent = (
                                <>
                                    <div className="relative bg-white aspect-square overflow-hidden border-b border-gray-100">
                                        <Image
                                            src={product.image_url ? imgUrl(product.image_url) : '/placeholder.jpg'}
                                            alt={product.name} fill
                                            className="object-contain p-2 group-hover:scale-125 transition-transform duration-700 ease-out"
                                        />
                                    </div>
                                    <div className="p-3 md:p-4">
                                        {product.category_name && (
                                            <span className="text-[8px] md:text-[9px] font-bold text-blue-600 uppercase tracking-widest opacity-70 block mb-1">
                                                {product.category_name}
                                            </span>
                                        )}
                                        <h4 className="text-xs md:text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-3">
                                            {product.name}
                                        </h4>
                                        <div className="flex items-center gap-1 text-blue-600 text-[10px] font-bold">
                                            <span>{t('productsPage.viewDetails')}</span>
                                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </>
                            );
                            return isDetailLink ? (
                                <Link key={product.id} href={`/product/${product.slug}`}>
                                    <motion.div initial="hidden" animate="visible" variants={fadeInUp} whileHover={{ y: -5 }}
                                        className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group cursor-pointer">
                                        {cardContent}
                                    </motion.div>
                                </Link>
                            ) : (
                                <motion.div key={product.id} initial="hidden" animate="visible" variants={fadeInUp} whileHover={{ y: -5 }}
                                    className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group cursor-pointer"
                                    onClick={() => setSelectedProduct(product)}>
                                    {cardContent}
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{t('productsPage.noResultsTitle')}</h3>
                        <p className="text-gray-500 mb-8">{t('productsPage.noResultsDesc')}</p>
                        <Link href="/products" className="btn-primary inline-flex">{t('productsPage.viewAllProducts')}</Link>
                    </div>
                )}
            </div>

            {/* Inquiry Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedProduct(null)}>
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden custom-scrollbar md:grid md:grid-cols-2 md:overflow-hidden">
                            {/* Image with Zoom */}
                            <div className="relative h-64 md:h-full">
                                <div className="relative w-full h-full bg-white flex items-center justify-center p-4 cursor-zoom-in min-h-[16rem]"
                                    onMouseMove={handleMouseMove} onMouseEnter={() => setShowZoom(true)} onMouseLeave={() => setShowZoom(false)}>
                                    <Image src={selectedProduct.image_url ? imgUrl(selectedProduct.image_url) : '/placeholder.jpg'}
                                        alt={selectedProduct.name} fill className="object-contain p-4" />
                                </div>
                                {showZoom && (
                                    <div className="hidden md:block absolute left-full top-0 ml-4 w-[400px] h-[400px] bg-white border-2 border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50">
                                        <div className="relative w-full h-full" style={{
                                            backgroundImage: `url(${selectedProduct.image_url ? imgUrl(selectedProduct.image_url) : '/placeholder.jpg'})`,
                                            backgroundSize: '200%', backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`, backgroundRepeat: 'no-repeat',
                                        }} />
                                    </div>
                                )}
                            </div>

                            {/* Info & Inquiry */}
                            <div className="p-6 md:p-8 flex flex-col md:overflow-y-scroll custom-scrollbar" style={{ maxHeight: 'calc(90vh - 2rem)', WebkitOverflowScrolling: 'touch' }}>
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        {selectedProduct.category_name && (
                                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-1 block">
                                                {selectedProduct.category_name}
                                            </span>
                                        )}
                                        <h3 className="text-2xl font-extrabold text-gray-900">{selectedProduct.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{t('productDetail.modelDetail')}</p>
                                    </div>
                                    <button onClick={() => setSelectedProduct(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                                    </button>
                                </div>

                                {selectedProduct.description && (
                                    <div className="mb-6">
                                        <p className="text-gray-600 text-sm leading-relaxed">{selectedProduct.description}</p>
                                    </div>
                                )}

                                <div className="space-y-4 pb-8 md:pb-4">
                                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                        <h4 className="font-bold text-blue-900 mb-2">{t('productDetail.interestedModel')}</h4>
                                        <p className="text-sm text-blue-700/80 mb-4 leading-relaxed">
                                            {t('productDetail.fillForm')} <span className="font-extrabold">{selectedProduct.name}</span> {t('productDetail.option')}.
                                        </p>
                                        <form className="space-y-3" onSubmit={handleInquirySubmit}>
                                            <input type="text" value={inquiryForm.name} onChange={e => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                                                placeholder={t('productDetail.yourName')} required
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white" />
                                            <div className="grid grid-cols-2 gap-3">
                                                <input type="email" value={inquiryForm.email} onChange={e => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                                                    placeholder={t('productDetail.emailAddress')} required
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white" />
                                                <input type="tel" value={inquiryForm.phone} onChange={e => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                                                    placeholder={t('productDetail.phoneNumber')}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white" />
                                            </div>
                                            <textarea rows={2} value={inquiryForm.message} onChange={e => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                                                placeholder={t('productDetail.messageRequirements')}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white resize-none" />
                                            <button type="submit" disabled={isSubmitting}
                                                className={`w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg shadow-blue-200 uppercase tracking-widest text-xs flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
                                                {isSubmitting ? (
                                                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending...</>
                                                ) : t('productDetail.sendInquiry')}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function ProductsPage() {
    const { t } = useLanguage();

    return (
        <main className="bg-gray-50 min-h-screen">
            <section className="bg-white pt-28 lg:pt-32 pb-12 border-b border-gray-100">
                <div className="container-custom">
                    <div className="max-w-3xl">
                        <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
                            <Link href="/" className="hover:text-blue-600 transition-colors">{t('header.home')}</Link>
                            <span className="text-gray-300">/</span>
                            <span className="text-blue-600">{t('header.products')}</span>
                        </nav>
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
                            {t('productsPage.title')}
                        </h1>
                        <p className="text-lg text-black leading-relaxed">
                            {t('productsPage.subtitle')}
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="container-custom">
                    <Suspense fallback={
                        <div className="flex gap-10">
                            <div className="hidden lg:block w-80 h-[600px] bg-gray-100 animate-pulse rounded-2xl" />
                            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="bg-white h-[300px] animate-pulse rounded-2xl border border-gray-100" />
                                ))}
                            </div>
                        </div>
                    }>
                        <ProductsContent />
                    </Suspense>
                </div>
            </section>
        </main>
    );
}
