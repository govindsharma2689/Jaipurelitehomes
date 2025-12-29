import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { MapPin, Camera, Phone, Mail, Share2, Heart, ChevronLeft, ChevronRight, X, Home, Maximize, Calendar, Check } from 'lucide-react';
import { properties, contactInfo } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    const foundProperty = properties.find(p => p.id === parseInt(id));
    setProperty(foundProperty);
    window.scrollTo(0, 0);
  }, [id]);

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Property Not Found</h2>
            <Link to="/properties" className="text-[#1e88e5] hover:underline">Browse all properties</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const similarProperties = properties.filter(p => p.type === property.type && p.id !== property.id).slice(0, 3);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your inquiry! We will contact you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const features = [
    'Premium Location',
    'Modern Architecture',
    'Vastu Compliant',
    'Gated Community',
    '24/7 Security',
    'Power Backup',
    'Water Supply',
    'Wide Roads'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-[#1e88e5] transition-colors">Home</Link>
            <span>/</span>
            <Link to="/properties" className="hover:text-[#1e88e5] transition-colors">Properties</Link>
            <span>/</span>
            <span className="text-gray-800 font-medium truncate max-w-xs">{property.title}</span>
          </div>
        </div>
      </div>

      {/* Hero Image Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
        {/* Image Counter & Gallery Button */}
        <div className="absolute bottom-6 right-6 flex gap-3">
          <button 
            onClick={() => setIsGalleryOpen(true)}
            className="glass-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-black/70 transition-colors"
          >
            <Camera size={18} />
            <span>{property.images} Photos</span>
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-6 left-6 flex gap-3">
          {property.featured && (
            <span className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg animate-fade-in">
              Featured
            </span>
          )}
          <span className="bg-[#1e88e5] text-white px-4 py-2 rounded-lg font-medium shadow-lg animate-fade-in stagger-1">
            {property.status}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex gap-3">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`glass-dark p-3 rounded-full transition-all ${isLiked ? 'text-red-500' : 'text-white'} hover:scale-110`}
          >
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
          <button className="glass-dark text-white p-3 rounded-full hover:scale-110 transition-all">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Price */}
            <div className="bg-white rounded-2xl shadow-premium p-8 animate-fade-in-up">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-3">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={18} className="text-[#1e88e5]" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl md:text-4xl font-bold text-[#1e88e5]">{property.price}</p>
                  <p className="text-gray-500 text-sm">Asking Price</p>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Home className="mx-auto mb-2 text-[#1e88e5]" size={24} />
                  <p className="font-semibold text-gray-800">{property.type}</p>
                  <p className="text-sm text-gray-500">Property Type</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Maximize className="mx-auto mb-2 text-[#1e88e5]" size={24} />
                  <p className="font-semibold text-gray-800">Premium</p>
                  <p className="text-sm text-gray-500">Category</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Camera className="mx-auto mb-2 text-[#1e88e5]" size={24} />
                  <p className="font-semibold text-gray-800">{property.images}</p>
                  <p className="text-sm text-gray-500">Photos</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Calendar className="mx-auto mb-2 text-[#1e88e5]" size={24} />
                  <p className="font-semibold text-gray-800">Ready</p>
                  <p className="text-sm text-gray-500">Possession</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-premium p-8 animate-fade-in-up stagger-1">
              <h2 className="text-2xl font-display font-bold text-gray-800 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
              <p className="text-gray-600 leading-relaxed mt-4">
                This exceptional property offers an unparalleled living experience in one of Jaipur's most sought-after locations. 
                With meticulous attention to detail and premium finishes throughout, this property represents the perfect blend 
                of luxury, comfort, and investment potential. The strategic location ensures excellent connectivity to major 
                landmarks, educational institutions, healthcare facilities, and commercial centers.
              </p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl shadow-premium p-8 animate-fade-in-up stagger-2">
              <h2 className="text-2xl font-display font-bold text-gray-800 mb-6">Features & Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-[#1e88e5]/10 rounded-full flex items-center justify-center">
                      <Check size={16} className="text-[#1e88e5]" />
                    </div>
                    <span className="text-gray-700 text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl shadow-premium p-8 animate-fade-in-up stagger-3">
              <h2 className="text-2xl font-display font-bold text-gray-800 mb-4">Location</h2>
              <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin size={48} className="mx-auto mb-2 text-[#1e88e5]" />
                  <p>{property.location}</p>
                  <p className="text-sm">Jaipur, Rajasthan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-premium p-6 sticky top-24 animate-fade-in-up">
              <h3 className="text-xl font-display font-bold text-gray-800 mb-6">Interested in this property?</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-premium"
                  required
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="input-premium"
                  required
                />
                <Input
                  type="tel"
                  placeholder="Your Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="input-premium"
                />
                <Textarea
                  placeholder="I'm interested in this property..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={4}
                  className="input-premium"
                />
                <Button type="submit" className="w-full bg-[#1e88e5] hover:bg-[#1565c0] btn-premium py-6">
                  Send Inquiry
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t space-y-3">
                <a 
                  href={`tel:${contactInfo.phone}`}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-[#1e88e5]/10 rounded-full flex items-center justify-center">
                    <Phone size={18} className="text-[#1e88e5]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{contactInfo.phone}</p>
                    <p className="text-sm text-gray-500">Call us</p>
                  </div>
                </a>
                <a 
                  href={contactInfo.social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-green-600" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">WhatsApp</p>
                    <p className="text-sm text-gray-500">Chat with us</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-display font-bold text-gray-800 mb-8">Similar Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProperties.map((prop, index) => (
                <Link
                  key={prop.id}
                  to={`/property/${prop.id}`}
                  className={`bg-white rounded-2xl overflow-hidden shadow-premium card-premium animate-fade-in-up stagger-${index + 1}`}
                >
                  <div className="relative h-48 img-zoom">
                    <img src={prop.image} alt={prop.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 gradient-overlay"></div>
                    <div className="absolute top-3 right-3">
                      <span className="bg-[#1e88e5] text-white text-xs px-3 py-1 rounded-full">{prop.status}</span>
                    </div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="text-sm flex items-center gap-1">
                        <MapPin size={14} />
                        {prop.area}
                      </p>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-800 mb-2 truncate hover:text-[#1e88e5] transition-colors">
                      {prop.title}
                    </h3>
                    <p className="text-[#1e88e5] font-bold text-lg">{prop.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center animate-fade-in">
          <button 
            onClick={() => setIsGalleryOpen(false)}
            className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={28} />
          </button>
          <div className="max-w-5xl w-full px-4">
            <img 
              src={property.image} 
              alt={property.title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <p className="text-white text-center mt-4">Image 1 of {property.images}</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PropertyDetailPage;
