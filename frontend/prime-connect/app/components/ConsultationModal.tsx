'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../lib/axios';

const ConsultationModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as unknown as { openConsultationModal?: () => void }).openConsultationModal = openModal;
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as unknown as { openConsultationModal?: () => void }).openConsultationModal;
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await api.post('/public/inquiries', {
        ...formData,
        form_type: 'consultation',
      });

      await Swal.fire({
        title: 'Thank You!',
        text: 'Thank you for submitting the form. We will get back to you shortly!',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3b82f6',
      });

      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      closeModal();
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
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-xl font-bold text-gray-900">Free Consultation</h3>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors duration-200"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-5">
              <p className="text-black text-sm mb-4">Fill out the form below and we&apos;ll get back to you shortly.</p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="modal-name" className="block text-sm font-semibold text-black mb-2">Full Name *</label>
                    <input
                      type="text" id="modal-name" name="name" value={formData.name}
                      onChange={handleChange} required
                      className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-300"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="modal-email" className="block text-sm font-semibold text-black mb-2">Email Address *</label>
                    <input
                      type="email" id="modal-email" name="email" value={formData.email}
                      onChange={handleChange} required
                      className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-300"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="modal-phone" className="block text-sm font-semibold text-black mb-2">Phone Number *</label>
                    <input
                      type="tel" id="modal-phone" name="phone" value={formData.phone}
                      onChange={handleChange} required
                      className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-300"
                      placeholder="+971 XX XXX XXXX"
                    />
                  </div>
                  <div>
                    <label htmlFor="modal-subject" className="block text-sm font-semibold text-black mb-2">Subject *</label>
                    <select
                      id="modal-subject" name="subject" value={formData.subject}
                      onChange={handleChange} required
                      className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-300"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="quote">Request a Quote</option>
                      <option value="doors">Doors & Panels</option>
                      <option value="cabinets">Cabinets</option>
                      <option value="project">New Project</option>
                      <option value="support">Support</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="modal-message" className="block text-sm font-semibold text-black mb-2">Your Message *</label>
                  <textarea
                    id="modal-message" name="message" value={formData.message}
                    onChange={handleChange} required rows={3}
                    className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-300 resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className={`w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/50 text-sm ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending...</>
                  ) : (
                    <><Send className="w-4 h-4" />Send Message</>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConsultationModal;
