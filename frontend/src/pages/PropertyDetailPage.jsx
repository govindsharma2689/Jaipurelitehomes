import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  MapPin, Camera, Phone, Mail, Share2, Heart, X, Home, 
  Calendar, Check, ChevronLeft, ChevronRight, MessageCircle, 
  Building, Ruler, Compass, ArrowRight, Sparkles, ZoomIn
} from 'lucide-react';
import { contactInfo } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { loadProperties, getPropertyById } from '../utils/dataLoader';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [allProperties, setAllProperties] = useState([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Get property images array
  const getPropertyImages = (property) => {
    if (!property) return [];
    // Now images is already an array in the data
    return property.images || [];
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        // Fetch all properties for similar listings
        const data = await loadProperties();
        setAllProperties(data);
        
        // Find current property
        const foundProperty = await getPropertyById(id);
        if (foundProperty) {
          setProperty(foundProperty);
        }
      } catch (error) {
        console.error('Error fetching property:', error);
      }
    };
    fetchProperty();
    window.scrollTo(0, 0);
  }, [id]);

  const propertyImages = property ? getPropertyImages(property) : [];

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % propertyImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center animate-fade-in-up">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Home size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Property Not Found</h2>
            <p className="text-gray-500 mb-6">The property you are looking for does not exist.</p>
            <Link 
              to="/properties" 
              className="inline-flex items-center gap-2 bg-[#1e88e5] text-white px-6 py-3 rounded-full font-medium hover:bg-[#1565c0] transition-all"
            >
              Browse Properties <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const similarProperties = allProperties.filter(p => p.type === property.type && p.id !== property.id).slice(0, 3);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 3000);
  };

  const features = [
    { icon: Sparkles, label: 'Premium Location' },
    { icon: Building, label: 'Modern Design' },
    { icon: Compass, label: 'Vastu Compliant' },
    { icon: Home, label: 'Gated Community' },
    { icon: Check, label: '24/7 Security' },
    { icon: Check, label: 'Power Backup' },
    { icon: Check, label: 'Water Supply' },
    { icon: Ruler, label: 'Wide Roads' },
  ];

  const propertySpecs = [
    { label: 'Property Type', value: property.type, icon: Home },
    { label: 'Category', value: 'Premium', icon: Sparkles },
    { label: 'Photos', value: property.images?.length || 0, icon: Camera },
    { label: 'Status', value: 'Ready', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-[#1e88e5] transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/properties" className="hover:text-[#1e88e5] transition-colors">Properties</Link>
            <ChevronRight size={14} />
            <span className="text-gray-800 font-medium truncate max-w-[200px]">{property.type}</span>
          </div>
        </div>
      </div>

      {/* Image Gallery Section - Contained */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Main Image */}
          <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[4/3] group">
            <img 
              src={propertyImages[activeImageIndex]} 
              alt={property.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            {/* Navigation Arrows */}
            {propertyImages.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft size={24} className="text-gray-800" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight size={24} className="text-gray-800" />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
              {activeImageIndex + 1} / {propertyImages.length}
            </div>

            {/* Fullscreen Button */}
            <button 
              onClick={() => setIsGalleryOpen(true)}
              className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-white transition-all shadow-lg"
            >
              <ZoomIn size={16} />
              View All Photos
            </button>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {property.featured && (
                <span className="bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm px-4 py-2 rounded-full font-medium shadow-lg">
                  Featured
                </span>
              )}
              <span className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] text-white text-sm px-4 py-2 rounded-full font-medium shadow-lg">
                For {property.status}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
              >
                <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
              </button>
              <button className="w-10 h-10 bg-white/90 backdrop-blur-sm text-gray-600 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all">
                <Share2 size={18} />
              </button>
            </div>
          </div>

          {/* Thumbnail Grid */}
          <div className="grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((index) => (
              <div 
                key={index}
                onClick={() => {
                  if (index < propertyImages.length) {
                    setActiveImageIndex(index);
                  } else if (index === 3 && propertyImages.length > 4) {
                    setIsGalleryOpen(true);
                  }
                }}
                className={`relative rounded-xl overflow-hidden bg-gray-100 aspect-[4/3] cursor-pointer group ${
                  activeImageIndex === index ? 'ring-4 ring-[#1e88e5]' : ''
                }`}
              >
                <img 
                  src={propertyImages[index] || property.image} 
                  alt={`${property.title} - ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Show remaining count on last thumbnail */}
                {index === 3 && propertyImages.length > 4 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-xl font-bold">+{propertyImages.length - 4}</span>
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Property Info Header */}
        <div className="mt-8 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-[#1e88e5] mb-2">
              <MapPin size={18} />
              <span className="font-medium">{property.location}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-4">
              {property.title}
            </h1>
          </div>
          <div className="lg:text-right">
            <p className="text-gray-500 text-sm mb-1">Price</p>
            <p className="text-3xl md:text-4xl font-bold text-[#1e88e5]">{property.price}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up">
              {propertySpecs.map((spec, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl hover:border-[#1e88e5]/20 transition-all group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#1e88e5]/10 to-[#1e88e5]/5 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <spec.icon size={22} className="text-[#1e88e5]" />
                  </div>
                  <p className="text-gray-500 text-sm">{spec.label}</p>
                  <p className="font-bold text-gray-800 text-lg">{spec.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#1e88e5] to-[#1565c0] rounded-xl flex items-center justify-center">
                  <Home size={20} className="text-white" />
                </div>
                <h2 className="text-2xl font-display font-bold text-gray-800">About This Property</h2>
              </div>
              {/* Full Description - properly formatted */}
              {property.full_description ? (
                <div className="text-gray-600 leading-relaxed space-y-4">
                  {property.full_description.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className={paragraph.includes(':') && paragraph.length < 80 ? 'font-semibold text-gray-800' : ''}>
                        {paragraph}
                      </p>
                    )
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 leading-relaxed text-lg">{property.description}</p>
              )}
            </div>

            {/* Features Grid */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Check size={20} className="text-white" />
                </div>
                <h2 className="text-2xl font-display font-bold text-gray-800">Features & Amenities</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-[#1e88e5]/30 hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 bg-[#1e88e5]/10 rounded-xl flex items-center justify-center group-hover:bg-[#1e88e5] transition-colors">
                      <feature.icon size={18} className="text-[#1e88e5] group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-gray-700 font-medium text-sm">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <MapPin size={20} className="text-white" />
                </div>
                <h2 className="text-2xl font-display font-bold text-gray-800">Location</h2>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-[#1e88e5]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={28} className="text-[#1e88e5]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">{property.location}</p>
                    <p className="text-gray-500">{property.area}, Jaipur</p>
                    <p className="text-gray-400 text-sm mt-1">Rajasthan, India</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 sticky top-32 animate-fade-in-up">
              {formSubmitted ? (
                <div className="text-center py-8 animate-scale-in">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={36} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Thank You!</h3>
                  <p className="text-gray-500">We will contact you shortly.</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#1e88e5] to-[#1565c0] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Mail size={28} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Interested?</h3>
                    <p className="text-gray-500 text-sm">Get in touch with us</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      type="text"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:border-[#1e88e5] focus:ring-[#1e88e5]/20"
                      required
                    />
                    <Input
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:border-[#1e88e5] focus:ring-[#1e88e5]/20"
                      required
                    />
                    <Input
                      type="tel"
                      placeholder="Your Phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:border-[#1e88e5] focus:ring-[#1e88e5]/20"
                    />
                    <Textarea
                      placeholder="I am interested in this property..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows={3}
                      className="rounded-xl bg-gray-50 border-gray-200 focus:border-[#1e88e5] focus:ring-[#1e88e5]/20"
                    />
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-[#1e88e5] to-[#1565c0] hover:from-[#1976d2] hover:to-[#1565c0] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      Send Inquiry
                    </Button>
                  </form>
                </>
              )}

              {/* Quick Contact */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <a 
                  href={`tel:${contactInfo.phone}`}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-[#1e88e5]/30 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 bg-[#1e88e5]/10 rounded-xl flex items-center justify-center group-hover:bg-[#1e88e5] transition-colors">
                    <Phone size={20} className="text-[#1e88e5] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{contactInfo.phone}</p>
                    <p className="text-sm text-gray-500">Call Now</p>
                  </div>
                </a>
                <a 
                  href={contactInfo.social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 hover:border-green-300 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center group-hover:bg-green-500 transition-colors">
                    <MessageCircle size={20} className="text-green-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">WhatsApp</p>
                    <p className="text-sm text-gray-500">Chat with us</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[#1e88e5] font-semibold text-sm tracking-wider uppercase">Explore More</span>
                <h2 className="text-3xl font-display font-bold text-gray-800 mt-1">Similar Properties</h2>
              </div>
              <Link 
                to="/properties"
                className="hidden md:flex items-center gap-2 text-[#1e88e5] font-medium hover:gap-3 transition-all"
              >
                View All <ArrowRight size={18} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProperties.map((prop, index) => (
                <Link
                  key={prop.id}
                  to={`/property/${prop.id}`}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl hover:border-[#1e88e5]/20 transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={prop.images?.[0] || '/images/properties/default-plot.jpg'} 
                      alt={prop.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 backdrop-blur-sm text-[#1e88e5] text-xs px-3 py-1.5 rounded-full font-medium">
                        {prop.status}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 text-white text-sm">
                        <MapPin size={14} />
                        <span>{prop.area}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-800 mb-2 truncate group-hover:text-[#1e88e5] transition-colors">
                      {prop.title}
                    </h3>
                    <p className="text-[#1e88e5] font-bold text-xl">{prop.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="text-white">
              <p className="font-medium">{property.title}</p>
              <p className="text-white/60 text-sm">{activeImageIndex + 1} of {propertyImages.length} photos</p>
            </div>
            <button 
              onClick={() => setIsGalleryOpen(false)}
              className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Main Image */}
          <div className="flex-1 flex items-center justify-center relative px-4">
            {/* Previous Button */}
            <button 
              onClick={prevImage}
              className="absolute left-4 md:left-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Image */}
            <img 
              src={propertyImages[activeImageIndex]} 
              alt={`${property.title} - ${activeImageIndex + 1}`}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />

            {/* Next Button */}
            <button 
              onClick={nextImage}
              className="absolute right-4 md:right-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight size={28} />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2 overflow-x-auto justify-center">
              {propertyImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImageIndex === index ? 'border-white' : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PropertyDetailPage;
