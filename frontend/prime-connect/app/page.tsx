"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, Building2, Hotel, GraduationCap, Stethoscope, Factory, Home,
  FlaskConical, ShieldCheck, Settings, FileCheck, Ruler, Layers, MapPin,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { useLanguage } from "./context/LanguageContext";
import api from "./lib/axios";
import { imgUrl } from "./lib/utils";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? '100%' : '-100%', opacity: 0 }),
};

interface Banner { id: number; image_url: string; is_active: number }

interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  description: string | null;
  parent_id: number | null;
  depth: number;
}

const categoryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'core-panels': Layers, 'doors': Home, 'cabinet': Building2,
  'kitchen-cabinets': Building2, 'color-card': Layers,
  'hardware-accessories': ShieldCheck, 'wardrobe': Building2, 'wardrobes': Building2,
};

export default function HomePage() {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [heroSlides, setHeroSlides] = useState<{ image: string; alt: string }[]>([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [productCategories, setProductCategories] = useState<ApiCategory[]>([]);

  useEffect(() => {
    let mounted = true;
    api.get('/public/banners/active').then(res => {
      const banners: Banner[] = res.data?.data ?? [];
      if (mounted) {
        setHeroSlides(banners.map(b => ({ image: imgUrl(b.image_url), alt: 'Banner' })));
        setBannersLoading(false);
      }
    }).catch(() => { if (mounted) setBannersLoading(false); });
    api.get('/public/categories?flat=1').then(res => {
      const all: ApiCategory[] = res.data?.data ?? [];
      const roots = all.filter(c => Number(c.depth) === 0);
      if (mounted) setProductCategories(roots);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentSlide((prev) => {
      let next = prev + newDirection;
      if (next < 0) next = heroSlides.length - 1;
      if (next >= heroSlides.length) next = 0;
      return next;
    });
  };

  useEffect(() => {
    const timer = setInterval(() => paginate(1), 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const sectors = [
    { icon: Building2, id: "commercial" }, { icon: Hotel, id: "hospitality" },
    { icon: GraduationCap, id: "education" }, { icon: Stethoscope, id: "healthcare" },
    { icon: Factory, id: "industrial" }, { icon: Home, id: "residential" },
  ];

  const features = [
    { icon: FlaskConical, id: "rnd" }, { icon: ShieldCheck, id: "qa" },
    { icon: Settings, id: "custom" }, { icon: FileCheck, id: "compliance" },
    { icon: Ruler, id: "precision" }, { icon: Layers, id: "materials" },
  ];

  const factories = [
    { id: "doorUAE", flag: "🇦🇪" }, { id: "wpc", flag: "🇨🇳" },
    { id: "woodenDoor", flag: "🇨🇳" }, { id: "cabinet", flag: "🇨🇳" },
    { id: "steelDoor", flag: "🇨🇳" }, { id: "fireproof", flag: "🇨🇳" },
  ];


  return (
    <>
      <div className="h-[72px] lg:h-[104px]" />

      {/* Hero Section */}
      <section className="relative w-full h-screen overflow-hidden">
        {bannersLoading || heroSlides.length === 0 ? (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 via-gray-100 to-purple-100 animate-pulse" />
        ) : (
          <>
            <div className="relative w-full h-full">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentSlide}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                  className="absolute inset-0 w-full h-full"
                >
                  <div className="relative w-full h-full">
                    <Image src={heroSlides[currentSlide].image} alt={heroSlides[currentSlide].alt} fill className="object-cover" priority sizes="100vw" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button onClick={() => paginate(-1)} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 transition-all border border-white/30">
              <ChevronLeft size={28} />
            </button>
            <button onClick={() => paginate(1)} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 transition-all border border-white/30">
              <ChevronRight size={28} />
            </button>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => { setDirection(index > currentSlide ? 1 : -1); setCurrentSlide(index); }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* About Section */}
      <section className="section-padding bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50/50 to-transparent" />
        <div className="container-custom relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
              <motion.span variants={fadeInUp} className="text-blue-600 font-semibold mb-4 block">{t('about.sectionTitle')}</motion.span>
              <motion.h2 variants={fadeInUp} className="mb-6 text-gray-900">
                {t('about.headingStart')} <span className="gradient-text">{t('about.headingGradient')}</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-gray-600 mb-6 text-lg">{t('about.desc1')}</motion.p>
              <motion.p variants={fadeInUp} className="text-gray-600 mb-8">{t('about.desc2')}</motion.p>
              <motion.div variants={fadeInUp}>
                <Link href="/about" className="btn-primary">{t('about.learnMore')}<ArrowRight className="w-5 h-5 rtl:rotate-180" /></Link>
              </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/3] md:aspect-video lg:aspect-[4/3] xl:h-[500px]">
                  <iframe
                    src="https://www.youtube.com/embed/WecEaqY_9PQ?autoplay=1&mute=1&loop=1&playlist=WecEaqY_9PQ&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3"
                    title="Prime Connect Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Range Section */}
      <section className="section-padding bg-gradient-to-br from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "var(--gradient-radial)" }} />
        <div className="container-custom relative">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-16">
            <motion.span variants={fadeInUp} className="text-white font-semibold mb-4 block">{t('products.sectionTitle')}</motion.span>
            <motion.h2 variants={fadeInUp} className="text-white mb-4">{t('products.headingStart')} <span className="text-white">{t('products.headingGradient')}</span></motion.h2>
            <motion.p variants={fadeInUp} className="text-white max-w-2xl mx-auto">{t('products.description')}</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productCategories.length === 0 ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-3xl bg-white/20 h-[420px] animate-pulse" />
              ))
            ) : productCategories.map((cat) => {
              const IconComp = categoryIconMap[cat.slug] ?? Layers;
              const link = `/products?category=${cat.slug}`;
              const imageSrc = cat.image_url ? imgUrl(cat.image_url) : '/home/core-panels.jpg';
              return (
                <motion.div key={cat.id} variants={scaleIn} whileHover={{ y: -12, scale: 1.02 }} className="group relative rounded-3xl overflow-hidden bg-white shadow-2xl flex flex-col h-[420px] hover:shadow-blue-500/20 transition-all duration-500 border-4 border-white">
                  <Link href={link} className="flex flex-col h-full">
                    <div className="relative overflow-hidden" style={{ height: '85%' }}>
                      <Image src={imageSrc} alt={cat.name} fill className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/40 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-500" />
                      <div className="absolute top-6 left-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/40 shadow-lg group-hover:scale-110 transition-all duration-300">
                          <IconComp className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-xl font-bold text-white">{cat.name}</h3>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-white flex items-center justify-between" style={{ height: '15%' }}>
                      <p className="text-gray-600 text-xs line-clamp-1 flex-1">{cat.description || ''}</p>
                      <span className="inline-flex items-center text-sm font-bold text-blue-600 gap-1.5 ml-2">
                        {t('products.explore')}<ArrowRight className="w-4 h-4 rtl:rotate-180" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-12">
            <Link href="/categories" className="btn-secondary !border-white/30 !text-black hover:!bg-white/10">{t('products.viewAll')}</Link>
          </motion.div>
        </div>
      </section>

      {/* Global Presence Section */}
      <section className="section-padding bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50" />
        <div className="container-custom relative">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-16">
            <motion.span variants={fadeInUp} className="text-blue-600 font-semibold mb-4 block">{t('global.sectionTitle')}</motion.span>
            <motion.h2 variants={fadeInUp} className="text-gray-900 mb-4">
              <span className="gradient-text">{t('global.headingGradient')}</span><br />{t('global.headingEnd')}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-600 max-w-2xl mx-auto">{t('global.description')}</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {factories.map((factory, index) => (
              <motion.div key={index} variants={fadeInUp} whileHover={{ y: -5, scale: 1.02 }} className="p-1 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-md hover:shadow-xl transition-all group">
                <div className="h-full w-full p-5 rounded-[14px] bg-white">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-2xl flex-shrink-0">{factory.flag}</div>
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{t(`global.factories.${factory.id}.type`)}</h4>
                      {t(`global.factories.${factory.id}.city`) && (
                        <p className="text-gray-500 text-sm flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{t(`global.factories.${factory.id}.city`)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-12">
            <Link href="/contact" className="btn-primary">{t('global.contactSales')}<ArrowRight className="w-5 h-5 rtl:rotate-180" /></Link>
          </motion.div>
        </div>
      </section>

      {/* Sectors Section */}
      <section className="section-padding bg-gradient-to-br from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "var(--gradient-radial)" }} />
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="container-custom relative">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-16">
            <motion.span variants={fadeInUp} className="text-white font-semibold mb-4 block">{t('sectors.sectionTitle')}</motion.span>
            <motion.h2 variants={fadeInUp} className="text-white mb-4">{t('sectors.headingStart')} <span className="text-white">{t('sectors.headingGradient')}</span></motion.h2>
            <motion.p variants={fadeInUp} className="text-white max-w-2xl mx-auto">{t('sectors.description')}</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectors.map((sector, index) => (
              <motion.div key={index} variants={fadeInUp} className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border-4 border-white">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-6">
                  <sector.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t(`sectors.items.${sector.id}.title`)}</h3>
                <p className="text-white/80">{t(`sectors.items.${sector.id}.desc`)}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary !bg-white !text-blue-600 hover:!bg-white/90">{t('sectors.discussProject')}<ArrowRight className="w-5 h-5 rtl:rotate-180" /></Link>
            <Link href="/products" className="btn-secondary !border-white/30 !text-black hover:!bg-white/10">{t('sectors.viewProducts')}</Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-[350px_1fr] gap-12 items-start">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="lg:sticky lg:top-32">
              <motion.span variants={fadeInUp} className="text-blue-600 font-semibold mb-4 block">{t('features.sectionTitle')}</motion.span>
              <motion.h2 variants={fadeInUp} className="text-gray-900 mb-6">
                {t('features.headingStart')}<br /><span className="gradient-text">{t('features.headingGradient')}</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-gray-600 text-lg leading-relaxed mb-6">{t('features.description')}</motion.p>
              <motion.p variants={fadeInUp} className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 italic">
                As long as you can think of it, we can do it.
              </motion.p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div key={index} variants={fadeInUp} whileHover={{ y: -5 }} className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white hover:shadow-xl transition-all group border border-gray-200">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-4 group-hover:from-blue-500 group-hover:to-purple-500 transition-all mx-auto">
                    <feature.icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">{t(`features.items.${feature.id}.title`)}</h3>
                  <p className="text-gray-600 text-sm text-center leading-relaxed">{t(`features.items.${feature.id}.desc`)}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('features.cta.title')}</h3>
                <p className="text-gray-600">{t('features.cta.desc')}</p>
              </div>
              <div className="flex gap-4">
                <Link href="/contact" className="btn-primary">{t('features.cta.requestSpecs')}</Link>
                <Link href="/products" className="btn-secondary">{t('features.cta.viewProducts')}</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
