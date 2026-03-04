"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Images, Video, X, ChevronDown, Play, Pause } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";
import { useSearchParams } from "next/navigation";
import api from "../lib/axios";
import { imgUrl } from "../lib/utils";

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};
const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

interface ApiProject {
    id: number;
    title: string;
    description: string | null;
    image_url: string | null;
    location: string | null;
    year: string | null;
}

interface ApiVideo {
    id: number;
    title: string;
    video_url: string;
    thumbnail_url: string | null;
}

export default function ProjectsContent() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const typeParam = searchParams.get('type');

    const [selectedType, setSelectedType] = useState<"images" | "videos">(
        typeParam === "videos" ? "videos" : "images"
    );
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [projects, setProjects] = useState<ApiProject[]>([]);
    const [projectsLoading, setProjectsLoading] = useState(true);
    const [videos, setVideos] = useState<ApiVideo[]>([]);
    const [videosLoading, setVideosLoading] = useState(true);

    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
    const [showZoom, setShowZoom] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Sync type from URL param
    useEffect(() => {
        setSelectedType(typeParam === "videos" ? "videos" : "images");
    }, [typeParam]);

    // Fetch project images
    useEffect(() => {
        let mounted = true;
        api.get('/public/projects?per_page=48').then(res => {
            if (mounted) setProjects(res.data?.data ?? []);
        }).catch(() => {}).finally(() => { if (mounted) setProjectsLoading(false); });
        return () => { mounted = false; };
    }, []);

    // Fetch project videos
    useEffect(() => {
        let mounted = true;
        api.get('/public/project-videos').then(res => {
            if (mounted) setVideos(res.data?.data ?? []);
        }).catch(() => {}).finally(() => { if (mounted) setVideosLoading(false); });
        return () => { mounted = false; };
    }, []);

    // Auto-play video when modal opens
    useEffect(() => {
        if (selectedVideo !== null && videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    }, [selectedVideo]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setZoomPosition({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
    };

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) { videoRef.current.pause(); } else { videoRef.current.play(); }
            setIsPlaying(!isPlaying);
        }
    };

    const selectedProject = selectedImage !== null ? projects[selectedImage] : null;
    const selectedVid = selectedVideo !== null ? videos[selectedVideo] : null;

    return (
        <>
            {/* Hero */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
                <div className="absolute inset-0" style={{ background: "var(--gradient-radial)" }} />
                <div className="container-custom relative">
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl">
                        <motion.span variants={fadeInUp} className="text-blue-600 font-semibold mb-4 block">{t('projectsPage.badge')}</motion.span>
                        <motion.h1 variants={fadeInUp} className="text-gray-900 mb-6">
                            {t('projectsPage.title')} <span className="gradient-text">{t('projectsPage.titleHighlight')}</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-xl text-gray-600 mb-8">{t('projectsPage.description')}</motion.p>
                        <motion.div variants={fadeInUp}>
                            <Link href="/contact" className="btn-primary">{t('projectsPage.startProject')}<ArrowRight className="w-5 h-5" /></Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Projects Section */}
            <section className="section-padding bg-white">
                <div className="container-custom">

                    {/* Dropdown Filter */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 flex justify-center">
                        <div className="relative inline-block">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                            >
                                {selectedType === "images" ? (
                                    <><Images className="w-5 h-5" /><span>Project Images</span></>
                                ) : (
                                    <><Video className="w-5 h-5" /><span>Project Videos</span></>
                                )}
                                <ChevronDown className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                                        <button onClick={() => { setSelectedType("images"); setIsDropdownOpen(false); }}
                                            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-blue-50 transition-colors ${selectedType === "images" ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}>
                                            <Images className="w-5 h-5" /><span className="font-medium">Project Images</span>
                                        </button>
                                        <button onClick={() => { setSelectedType("videos"); setIsDropdownOpen(false); }}
                                            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-blue-50 transition-colors ${selectedType === "videos" ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}>
                                            <Video className="w-5 h-5" /><span className="font-medium">Project Videos</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Images Grid */}
                    {selectedType === "images" && (
                        projectsLoading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="flex flex-col gap-2">
                                        <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
                                        <div className="h-4 w-24 bg-gray-200 rounded mx-auto animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {projects.map((project, index) => (
                                    <motion.div key={project.id} variants={scaleIn} className="group flex flex-col gap-2 cursor-pointer" onClick={() => setSelectedImage(index)}>
                                        <div className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm group-hover:shadow-md transition-all bg-white">
                                            <Image src={imgUrl(project.image_url || '')} alt={project.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" unoptimized />
                                        </div>
                                        <p className="text-center text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors line-clamp-1 px-1">{project.title}</p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )
                    )}

                    {/* Videos Grid */}
                    {selectedType === "videos" && (
                        videosLoading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="flex flex-col gap-2">
                                        <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
                                        <div className="h-4 w-24 bg-gray-200 rounded mx-auto animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {videos.map((video, index) => (
                                    <motion.div key={video.id} variants={scaleIn} className="group flex flex-col gap-2 cursor-pointer" onClick={() => setSelectedVideo(index)}>
                                        <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm group-hover:shadow-md transition-all bg-gray-900">
                                            <video
                                                src={imgUrl(video.video_url)}
                                                className="w-full h-full object-cover"
                                                preload="metadata"
                                                muted
                                                playsInline
                                                onLoadedData={(e) => { (e.target as HTMLVideoElement).currentTime = 1; }}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-all">
                                                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                                    <Play className="w-8 h-8 text-blue-600 ml-1" />
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-center text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{video.title}</p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )
                    )}

                    {/* Image Modal with Zoom */}
                    <AnimatePresence>
                        {selectedImage !== null && selectedProject && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                                onClick={() => setSelectedImage(null)}>
                                <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-6xl grid md:grid-cols-2 max-h-[90vh]">
                                    <div className="relative">
                                        <div className="relative h-64 md:h-[90vh] bg-white flex items-center justify-center p-4 cursor-zoom-in"
                                            onMouseMove={handleMouseMove} onMouseEnter={() => setShowZoom(true)} onMouseLeave={() => setShowZoom(false)}>
                                            <Image src={imgUrl(selectedProject.image_url || '')} alt={selectedProject.title} fill className="object-contain p-4" unoptimized />
                                        </div>
                                        {showZoom && (
                                            <div className="hidden md:block absolute left-full top-0 ml-4 w-[400px] h-[400px] bg-white border-2 border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50">
                                                <div className="relative w-full h-full" style={{
                                                    backgroundImage: `url(${imgUrl(selectedProject.image_url || '')})`,
                                                    backgroundSize: '200%', backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`, backgroundRepeat: 'no-repeat',
                                                }} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-8 flex flex-col overflow-y-auto">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900">{selectedProject.title}</h3>
                                                {selectedProject.location && <p className="text-sm text-gray-500 mt-1">{selectedProject.location}</p>}
                                                {selectedProject.year && <p className="text-xs text-gray-400 mt-0.5">{selectedProject.year}</p>}
                                            </div>
                                            <button onClick={() => setSelectedImage(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                                            </button>
                                        </div>
                                        {selectedProject.description && <p className="text-gray-600 text-sm leading-relaxed mb-6">{selectedProject.description}</p>}
                                        <div className="mt-auto">
                                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-100">
                                                <h4 className="font-bold text-gray-900 mb-2">{t('projectsPage.similarProject')}</h4>
                                                <p className="text-sm text-gray-600 mb-4">{t('projectsPage.contactDesc')}</p>
                                                <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all w-full justify-center">
                                                    {t('projectsPage.contactUs')}<ArrowRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Video Player Modal */}
                    <AnimatePresence>
                        {selectedVideo !== null && selectedVid && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                                onClick={() => { setSelectedVideo(null); setIsPlaying(false); }}>
                                <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-6xl grid md:grid-cols-2 max-h-[90vh]">
                                    <div className="relative bg-black">
                                        <div className="relative h-64 md:h-[90vh] flex items-center justify-center">
                                            <video
                                                ref={videoRef}
                                                src={imgUrl(selectedVid.video_url)}
                                                className="w-full h-full object-contain"
                                                controls
                                                onPlay={() => setIsPlaying(true)}
                                                onPause={() => setIsPlaying(false)}
                                            />
                                        </div>
                                        <button onClick={togglePlayPause}
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all z-10">
                                            {isPlaying ? <Pause className="w-10 h-10 text-white" /> : <Play className="w-10 h-10 text-white ml-1" />}
                                        </button>
                                    </div>
                                    <div className="p-8 flex flex-col overflow-y-auto">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900">{selectedVid.title}</h3>
                                                <p className="text-sm text-gray-500 mt-1">Completed Project by Prime Connect</p>
                                            </div>
                                            <button onClick={() => { setSelectedVideo(null); setIsPlaying(false); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                                            </button>
                                        </div>
                                        <div className="mt-auto">
                                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-100">
                                                <h4 className="font-bold text-gray-900 mb-2">{t('projectsPage.similarProject')}</h4>
                                                <p className="text-sm text-gray-600 mb-4">{t('projectsPage.contactDesc')}</p>
                                                <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all w-full justify-center">
                                                    {t('projectsPage.contactUs')}<ArrowRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </section>
        </>
    );
}
