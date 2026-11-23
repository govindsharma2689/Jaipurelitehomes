'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001';

const ContactClient = ({ contactInfo }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          source: 'contact_form'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit');
      }
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      console.error('Error submitting form:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="bg-[#1e88e5]/10 p-4 rounded-full">
                <Phone className="text-[#1e88e5]" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Phone</h3>
                <a href={`tel:${contactInfo.phone}`} className="text-[#1e88e5] hover:underline">
                  {contactInfo.phone}
                </a>
                <br />
                <a href={`tel:${contactInfo.rentalPhone}`} className="text-gray-600 text-sm hover:text-[#1e88e5]">
                  {contactInfo.rentalPhone} (Rentals)
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="bg-[#1e88e5]/10 p-4 rounded-full">
                <Mail className="text-[#1e88e5]" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Email</h3>
                <a href={`mailto:${contactInfo.email}`} className="text-[#1e88e5] hover:underline">
                  {contactInfo.email}
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="bg-[#1e88e5]/10 p-4 rounded-full">
                <MessageCircle className="text-[#1e88e5]" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">WhatsApp</h3>
                <a 
                  href={contactInfo.social.whatsapp} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#1e88e5] hover:underline"
                >
                  {contactInfo.whatsapp}
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="bg-[#1e88e5]/10 p-4 rounded-full">
                <MapPin className="text-[#1e88e5]" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Location</h3>
                <p className="text-gray-600">Shop No. 1 & 2, Nandpuri Ist,</p>
                <p className="text-gray-600">Jagatpura, Jaipur, Rajasthan – 302033</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name*</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email*</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your Phone Number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <Input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message*</label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  rows={6}
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#1e88e5] hover:bg-[#1565c0] text-white py-6 text-lg disabled:opacity-50"
              >
                <Send className="mr-2" size={18} />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
              {submitStatus === 'success' && (
                <p className="text-green-600 text-center mt-4">Thank you! We will get back to you soon.</p>
              )}
              {submitStatus === 'error' && (
                <p className="text-red-500 text-center mt-4">Failed to submit. Please try again.</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactClient;
