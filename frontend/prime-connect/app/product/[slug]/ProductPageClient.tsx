"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle, Package, Share2, Printer, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import ProductSidebar from "../../components/ProductSidebar";
import api from "../../lib/axios";
import { imgUrl } from "../../lib/utils";

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

interface ProductImage {
    id: number;
    url: string;
    alt: string;
    sort_order: number;
}

interface ProductSpec {
    id: number;
    label: string;
    value: string;
    unit: string | null;
    sort_order: number;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    sku: string | null;
    description: string | null;
    category_id: number;
    category_name: string | null;
}

interface ApplicationsData {
    en?: string[];
    ar?: string[];
    zh?: string[];
}


export default function ProductPageClient() {
    const { t, language } = useLanguage();
    const params = useParams();
    const slug = params.slug as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [images, setImages] = useState<ProductImage[]>([]);
    const [specs, setSpecs] = useState<ProductSpec[]>([]);
    const [applications, setApplications] = useState<ApplicationsData>({});
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const [currentImage, setCurrentImage] = useState(0);
    const [showZoom, setShowZoom] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

    // Inquiry form
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', phone: '', message: '' });

    useEffect(() => {
        if (!slug) return;
        let mounted = true;
        setLoading(true);
        api.get(`/public/products/slug/${slug}`)
            .then(res => {
                if (!mounted) return;
                const data = res.data?.data;
                if (data && data.id) {
                    setProduct({
                        id: data.id,
                        name: data.name,
                        slug: data.slug,
                        sku: data.sku ?? null,
                        description: data.description ?? null,
                        category_id: data.category_id,
                        category_name: data.category?.name ?? null,
                    });
                    setImages(data.images ?? []);
                    setSpecs(data.specs ?? []);
                    try {
                        const meta = data.meta ? JSON.parse(data.meta) : {};
                        setApplications(meta.applications ?? {});
                    } catch { setApplications({}); }
                } else {
                    setNotFound(true);
                }
            })
            .catch(() => { if (mounted) setNotFound(true); })
            .finally(() => { if (mounted) setLoading(false); });
        return () => { mounted = false; };
    }, [slug]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setZoomPosition({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
    };

    const handleInquirySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting || !product) return;
        setIsSubmitting(true);
        try {
            await api.post('/public/inquiries', {
                ...inquiryForm,
                subject: `Product Inquiry: ${product.name}`,
                product_name: product.name,
                form_type: 'inquiry',
            });
            setInquiryForm({ name: '', email: '', phone: '', message: '' });
            alert(t('productDetail.successMessage') || 'Thank you! We will get back to you shortly.');
        } catch {
            alert(t('productDetail.errorMessage') || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentImageSrc = images.length > 0 ? imgUrl(images[currentImage]?.url) : '/placeholder.jpg';
    const applicationsForLang: string[] = (applications as Record<string, string[]>)[language] ?? applications.en ?? [];

    if (loading) {
        return (
            <section className="pt-32 pb-20 bg-gray-50 min-h-screen">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-1">
                            <div className="w-full h-96 bg-gray-100 animate-pulse rounded-2xl" />
                        </div>
                        <div className="lg:col-span-3 space-y-6">
                            <div className="h-8 w-48 bg-gray-100 animate-pulse rounded" />
                            <div className="bg-white rounded-3xl p-12 animate-pulse">
                                <div className="grid lg:grid-cols-2 gap-8">
                                    <div className="aspect-[4/3] bg-gray-100 rounded-2xl" />
                                    <div className="space-y-4">
                                        <div className="h-8 bg-gray-100 rounded w-3/4" />
                                        <div className="h-4 bg-gray-100 rounded" />
                                        <div className="h-4 bg-gray-100 rounded w-2/3" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (notFound || !product) {
        return (
            <section className="pt-32 pb-20 bg-gray-50 min-h-screen">
                <div className="container-custom text-center py-20">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('productDetail.notFound') || 'Product Not Found'}</h1>
                    <Link href="/products" className="btn-primary inline-flex">{t('productDetail.backToProducts')}</Link>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="pt-32 pb-20 bg-gray-50 min-h-screen">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-32">
                                <ProductSidebar activeSlug={slug} />
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            {/* Breadcrumb */}
                            <div className="mb-8">
                                <Link href="/products" className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    {t('productDetail.backToProducts')}
                                </Link>
                            </div>

                            <div className="flex flex-col gap-8">
                                {/* Images & Info */}
                                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="grid lg:grid-cols-2 gap-0">
                                        {/* Images */}
                                        <div className="p-8 lg:p-12 bg-gray-50 border-r border-gray-100">
                                            <div className="flex items-center gap-2 mb-6">
                                                <Package className="w-5 h-5 text-gray-700" />
                                                <h3 className="font-semibold text-gray-900">{t('productDetail.productImages')}</h3>
                                            </div>
                                            {images.length > 0 ? (
                                                <div className="space-y-4">
                                                    {/* Main Image */}
                                                    <div className="relative aspect-[4/3] bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group"
                                                        onMouseMove={handleMouseMove} onMouseEnter={() => setShowZoom(true)} onMouseLeave={() => setShowZoom(false)}>
                                                        <Image src={currentImageSrc} alt={`${product.name} ${currentImage + 1}`} fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                                        {images.length > 1 && (
                                                            <>
                                                                <button onClick={() => setCurrentImage(p => p === 0 ? images.length - 1 : p - 1)}
                                                                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-800 hover:bg-white transition-all border border-gray-200 shadow-md">
                                                                    <ChevronLeft size={20} />
                                                                </button>
                                                                <button onClick={() => setCurrentImage(p => p === images.length - 1 ? 0 : p + 1)}
                                                                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-800 hover:bg-white transition-all border border-gray-200 shadow-md">
                                                                    <ChevronRight size={20} />
                                                                </button>
                                                            </>
                                                        )}
                                                        {/* Zoom panel */}
                                                        {showZoom && images.length > 0 && (
                                                            <div className="hidden lg:block absolute left-full top-0 ml-4 w-[300px] h-[300px] bg-white border-2 border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50">
                                                                <div className="relative w-full h-full" style={{
                                                                    backgroundImage: `url(${currentImageSrc})`,
                                                                    backgroundSize: '200%', backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`, backgroundRepeat: 'no-repeat',
                                                                }} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    {/* Thumbnails */}
                                                    {images.length > 1 && (
                                                        <div className="overflow-x-auto pb-2">
                                                            <div className="flex gap-2 min-w-max">
                                                                {images.map((img, idx) => (
                                                                    <button key={idx} onClick={() => setCurrentImage(idx)}
                                                                        className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${idx === currentImage ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-blue-300'}`}>
                                                                        <Image src={imgUrl(img.url)} alt={img.alt || `${product.name} ${idx + 1}`} fill className="object-cover" />
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="relative aspect-[4/3] bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex items-center justify-center">
                                                    <div className="text-gray-400">{t('productDetail.noImage')}</div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                                            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                                                {product.category_name && (
                                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 block">{product.category_name}</span>
                                                )}
                                                <h4 className="text-xl font-bold text-gray-900 mb-6">{product.name}</h4>
                                                {product.description && (
                                                    <p className="text-gray-600 leading-relaxed mb-8 text-lg">{product.description}</p>
                                                )}
                                                {product.sku && (
                                                    <p className="text-sm text-gray-400 mb-6">SKU: {product.sku}</p>
                                                )}
                                                <div className="flex items-center gap-4">
                                                    <button onClick={() => document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary">
                                                        {t('productDetail.inquire')}
                                                    </button>
                                                    <button className="p-3 rounded-full border border-gray-200 hover:bg-gray-50 transition">
                                                        <Share2 className="w-5 h-5 text-gray-600" />
                                                    </button>
                                                    <button className="p-3 rounded-full border border-gray-200 hover:bg-gray-50 transition">
                                                        <Printer className="w-5 h-5 text-gray-600" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>

                                {/* Specs Table */}
                                {specs.length > 0 && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                        className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 lg:p-12">
                                        <h4 className="text-lg font-bold text-gray-900 mb-8">{t('productDetail.specifications')}</h4>
                                        <div className="overflow-hidden rounded-xl border border-gray-200">
                                            <table className="w-full text-left border-collapse">
                                                <tbody>
                                                    {specs.map((spec, index) => (
                                                        <tr key={index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                                            <th className="py-4 px-6 bg-gray-50/50 font-medium text-gray-900 w-1/3 border-r border-gray-100 capitalize">
                                                                {spec.label}
                                                            </th>
                                                            <td className="py-4 px-6 text-gray-600">
                                                                {spec.value}{spec.unit ? ` ${spec.unit}` : ''}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Applications Section */}
                                {applicationsForLang.length > 0 && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                        className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 lg:p-12">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('productDetail.applications')}</h2>
                                        <ul className="space-y-4">
                                            {applicationsForLang.map((app: string, index: number) => (
                                                <li key={index} className="flex items-start gap-4 text-gray-600">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2.5 flex-shrink-0" />
                                                    <span className="text-lg leading-relaxed">{app}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}

                                {/* Inquiry Form */}
                                <motion.div id="inquiry-form" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                    className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 lg:p-12 mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('productDetail.interestedModel')}</h2>
                                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                        <p className="text-sm text-blue-700 mb-6 leading-relaxed">
                                            {t('productDetail.fillForm')} <span className="font-bold">{product.name}</span> {t('productDetail.option')}.
                                        </p>
                                        <form className="space-y-4" onSubmit={handleInquirySubmit}>
                                            <input type="text" value={inquiryForm.name} onChange={e => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                                                placeholder={t('productDetail.yourName')} required
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white" />
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <input type="email" value={inquiryForm.email} onChange={e => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                                                    placeholder={t('productDetail.emailAddress')} required
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white" />
                                                <input type="tel" value={inquiryForm.phone} onChange={e => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                                                    placeholder={t('productDetail.phoneNumber')}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white" />
                                            </div>
                                            <textarea rows={4} value={inquiryForm.message} onChange={e => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                                                placeholder={t('productDetail.messageRequirements')} required
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white resize-none" />
                                            <button type="submit" disabled={isSubmitting}
                                                className={`w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg shadow-blue-200 uppercase tracking-widest text-xs flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
                                                {isSubmitting ? (
                                                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending...</>
                                                ) : t('productDetail.sendInquiry')}
                                            </button>
                                        </form>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
