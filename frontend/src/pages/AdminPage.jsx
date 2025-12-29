import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Edit2, Trash2, Home, Grid3X3, Eye, Mail, 
  BarChart3, Upload, X, Check, AlertCircle, ArrowLeft,
  Building, TrendingUp, Users, MessageSquare
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { areas } from '../data/mockData';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [stats, setStats] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    area: '',
    city: 'Jaipur',
    price: '',
    description: '',
    type: 'Plot',
    featured: false,
    status: 'Sales',
    image: '',
    images_count: 1
  });

  const fetchData = async () => {
    try {
      const [propsRes, inqRes, statsRes] = await Promise.all([
        axios.get(`${API}/properties`),
        axios.get(`${API}/inquiries`),
        axios.get(`${API}/stats`)
      ]);
      setProperties(propsRes.data);
      setInquiries(inqRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingProperty) {
        await axios.put(`${API}/properties/${editingProperty.id}`, formData);
        showNotification('Property updated successfully!');
      } else {
        await axios.post(`${API}/properties`, formData);
        showNotification('Property created successfully!');
      }
      setIsModalOpen(false);
      setEditingProperty(null);
      resetForm();
      fetchData();
    } catch (error) {
      showNotification('Error saving property', 'error');
    }
    setLoading(false);
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      location: property.location,
      area: property.area,
      city: property.city,
      price: property.price,
      description: property.description,
      type: property.type,
      featured: property.featured,
      status: property.status,
      image: property.image || '',
      images_count: property.images_count || 1
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(`${API}/properties/${id}`);
        showNotification('Property deleted successfully!');
        fetchData();
      } catch (error) {
        showNotification('Error deleting property', 'error');
      }
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (window.confirm('Are you sure you want to delete this inquiry?')) {
      try {
        await axios.delete(`${API}/inquiries/${id}`);
        showNotification('Inquiry deleted successfully!');
        fetchData();
      } catch (error) {
        showNotification('Error deleting inquiry', 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      location: '',
      area: '',
      city: 'Jaipur',
      price: '',
      description: '',
      type: 'Plot',
      featured: false,
      status: 'Sales',
      image: '',
      images_count: 1
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formDataImg = new FormData();
      formDataImg.append('file', file);
      try {
        const res = await axios.post(`${API}/upload-image`, formDataImg);
        setFormData({ ...formData, image: res.data.url });
        showNotification('Image uploaded successfully!');
      } catch (error) {
        showNotification('Error uploading image', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in ${
          notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
        } text-white`}>
          {notification.type === 'error' ? <AlertCircle size={20} /> : <Check size={20} />}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-600 hover:text-[#1e88e5] transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
              <p className="text-sm text-gray-500">Manage your properties and inquiries</p>
            </div>
          </div>
          <Button 
            onClick={() => { resetForm(); setEditingProperty(null); setIsModalOpen(true); }}
            className="bg-[#1e88e5] hover:bg-[#1565c0] btn-premium"
          >
            <Plus size={18} className="mr-2" />
            Add Property
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-premium p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Properties</p>
                <p className="text-3xl font-bold text-gray-800">{stats.total_properties || 0}</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Building className="text-[#1e88e5]" size={28} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-premium p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Villas</p>
                <p className="text-3xl font-bold text-gray-800">{stats.total_villas || 0}</p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                <Home className="text-green-600" size={28} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-premium p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Plots</p>
                <p className="text-3xl font-bold text-gray-800">{stats.total_plots || 0}</p>
              </div>
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center">
                <Grid3X3 className="text-orange-600" size={28} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-premium p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Inquiries</p>
                <p className="text-3xl font-bold text-gray-800">{stats.total_inquiries || 0}</p>
              </div>
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
                <MessageSquare className="text-purple-600" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('properties')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'properties'
                ? 'bg-[#1e88e5] text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Building size={18} className="inline mr-2" />
            Properties ({properties.length})
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'inquiries'
                ? 'bg-[#1e88e5] text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Mail size={18} className="inline mr-2" />
            Inquiries ({inquiries.length})
          </button>
        </div>

        {/* Properties Table */}
        {activeTab === 'properties' && (
          <div className="bg-white rounded-2xl shadow-premium overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Property</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Featured</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {properties.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        No properties yet. Click &quot;Add Property&quot; to create one.
                      </td>
                    </tr>
                  ) : (
                    properties.map((property) => (
                      <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-12 bg-gray-200 rounded-lg overflow-hidden">
                              {property.image && (
                                <img src={property.image.startsWith('/api') ? `${BACKEND_URL}${property.image}` : property.image} alt="" className="w-full h-full object-cover" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 truncate max-w-xs">{property.title}</p>
                              <p className="text-sm text-gray-500">{property.area}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            property.type === 'Villas' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {property.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-800">{property.price}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {property.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {property.featured ? (
                            <Check className="text-green-500" size={20} />
                          ) : (
                            <X className="text-gray-300" size={20} />
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/property/${property.id}`} className="p-2 text-gray-400 hover:text-[#1e88e5] transition-colors">
                              <Eye size={18} />
                            </Link>
                            <button onClick={() => handleEdit(property)} className="p-2 text-gray-400 hover:text-[#1e88e5] transition-colors">
                              <Edit2 size={18} />
                            </button>
                            <button onClick={() => handleDelete(property.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Inquiries Table */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-2xl shadow-premium overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Message</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inquiries.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        No inquiries yet.
                      </td>
                    </tr>
                  ) : (
                    inquiries.map((inquiry) => (
                      <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-800">{inquiry.name}</td>
                        <td className="px-6 py-4 text-gray-600">{inquiry.email}</td>
                        <td className="px-6 py-4 text-gray-600">{inquiry.phone || '-'}</td>
                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{inquiry.message}</td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {new Date(inquiry.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <a href={`mailto:${inquiry.email}`} className="p-2 text-gray-400 hover:text-[#1e88e5] transition-colors">
                              <Mail size={18} />
                            </a>
                            <button onClick={() => handleDeleteInquiry(inquiry.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Property Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editingProperty ? 'Edit Property' : 'Add New Property'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Property title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type*</label>
                <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Plot">Plot</SelectItem>
                    <SelectItem value="Villas">Villas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status*</label>
                <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Rentals">Rentals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area*</label>
                <Select value={formData.area} onValueChange={(v) => setFormData({...formData, area: v})}>
                  <SelectTrigger><SelectValue placeholder="Select area" /></SelectTrigger>
                  <SelectContent>
                    {areas.map(a => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location*</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g., Shikha Vihar, Jaipur"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
                <Input
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="e.g., ₹ 1.5 crore"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  placeholder="Jaipur"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Property description..."
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="/images/properties/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  className="w-4 h-4 text-[#1e88e5] rounded"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">Featured Property</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#1e88e5] hover:bg-[#1565c0]" disabled={loading}>
                {loading ? 'Saving...' : (editingProperty ? 'Update Property' : 'Create Property')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
