'use client';

import { motion } from 'framer-motion';

const FloatingActions = () => {
  const handleConsultationClick = () => {
    if (typeof window !== 'undefined') {
      const openModal = (window as unknown as { openConsultationModal?: () => void }).openConsultationModal;
      if (openModal) openModal();
    }
  };

  return (
    <>
      {/* Vertical Banner - Desktop */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="hidden md:block fixed top-1/2 right-0 -translate-y-1/2 z-50 cursor-pointer"
        onClick={handleConsultationClick}
      >
        <div className="bg-gradient-to-b from-blue-600 to-purple-600 text-white py-6 px-3 shadow-lg rounded-l-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
          <div className="font-bold text-xs tracking-wider uppercase" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
            Free Consultation
          </div>
        </div>
      </motion.div>

      {/* Vertical Banner - Mobile */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="md:hidden fixed top-1/2 right-0 -translate-y-1/2 z-40 cursor-pointer"
        onClick={handleConsultationClick}
      >
        <div className="bg-gradient-to-b from-blue-600 to-purple-600 text-white py-4 px-2 shadow-lg rounded-l-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
          <div className="font-bold text-[10px] tracking-wider uppercase" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
            Free Consultation
          </div>
        </div>
      </motion.div>

      {/* Fixed Action Buttons */}
      <div className="fixed bottom-4 right-2 sm:right-4 z-50 flex flex-col gap-3 sm:gap-4">
        {/* Call Button */}
        <motion.a
          href="tel:+971589126137"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
          title="Call us" aria-label="Call us"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-6 sm:h-6 text-white">
            <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </motion.a>

        {/* WhatsApp Button */}
        <motion.a
          href="https://wa.me/971589126137?text=Hello!%20I%20want%20to%20know%20more%20about%20your%20services.%20Please%20call%20me%20back.%20Thanks"
          target="_blank" rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
          title="Chat on WhatsApp" aria-label="WhatsApp"
        >
          <svg viewBox="0 0 448 512" fill="currentColor" className="w-6 h-6 sm:w-7 sm:h-7 text-white">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
          </svg>
        </motion.a>
      </div>
    </>
  );
};

export default FloatingActions;
