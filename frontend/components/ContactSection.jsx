'use client';

import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    city: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.mobile,
          city: formData.city,
          message: formData.message,
          source: 'schedule_meeting'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }
      
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', mobile: '', email: '', city: '', message: '' });
      }, 3000);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #1e88e5 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-12">
          <span className="text-[#1e88e5] font-semibold text-sm tracking-wider uppercase">Get in Touch</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mt-2 mb-4">
            Schedule a Meeting
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our real estate experts are ready to help you find your dream property. 
            Discover the perfect property that matches your lifestyle.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-premium-lg p-8 md:p-10 animate-fade-in-up">
          {isSubmitted ? (
            <div className="text-center py-12 animate-scale-in">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h3>
              <p className="text-gray-600">We will get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Name</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="h-12 bg-gray-50 border-gray-200 focus:border-[#1e88e5] input-premium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Mobile</label>
                  <Input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Your Mobile Number"
                    className="h-12 bg-gray-50 border-gray-200 focus:border-[#1e88e5] input-premium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Email*</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                    className="h-12 bg-gray-50 border-gray-200 focus:border-[#1e88e5] input-premium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">City*</label>
                  <Input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Your City"
                    required
                    className="h-12 bg-gray-50 border-gray-200 focus:border-[#1e88e5] input-premium"
                  />
                </div>
              </div>
              <div className="mb-6 space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Message</label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your requirements..."
                  rows={4}
                  className="bg-gray-50 border-gray-200 focus:border-[#1e88e5] input-premium"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#1e88e5] hover:bg-[#1565c0] text-white h-14 text-lg font-semibold btn-premium rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                <Send className="mr-2" size={20} />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
              {error && (
                <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
