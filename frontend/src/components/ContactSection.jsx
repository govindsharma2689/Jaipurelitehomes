import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    city: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', mobile: '', email: '', city: '', message: '' });
    }, 3000);
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
            <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the perfect property that matches your lifestyle. From luxurious villas to prime plots.
          </p>
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-premium-lg p-8 md:p-10 animate-fade-in-up">
          {isSubmitted ? (
            <div className="text-center py-12 animate-scale-in">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h3>
              <p className="text-gray-600">We'll get back to you within 24 hours.</p>
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
                className="w-full bg-[#1e88e5] hover:bg-[#1565c0] text-white h-14 text-lg font-semibold btn-premium rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Send className="mr-2" size={20} />
                Send Message
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
