'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Plus, X, Check, ArrowLeft, Home, Trash2, Edit, Users, 
  BarChart3, Building, Eye, Phone, Mail, Calendar, 
  CheckCircle, Clock, XCircle, Filter, RefreshCw, LogOut, Settings, Lock, AlertCircle, ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { areas, propertyCategories, propertyTypes, projectSubCategories } from '@/data/mockData';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const AdminPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [properties, setProperties] = useState([]);
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [leadFilter, setLeadFilter] = useState('all');
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    full_description: '',
    price: '',
    location: '',
    area: '',
    city: 'Jaipur',
    type: '',
    category: 'Residential',
    sub_category: '',
    status: 'Sales',
    featured: false,
    sold: false,
    images: [],
    map_link: '',
    amenities: []
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Hero/Cover Page settings
  const [heroSettings, setHeroSettings] = useState({
    title: '', subtitle: '', description: '', images: []
  });
  const [heroLoading, setHeroLoading] = useState(false);
  const [heroSaved, setHeroSaved] = useState(false);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.replace('/admin/login');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/verify`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
        setAuthChecking(false);
        fetchData();
      } else {
        localStorage.removeItem('admin_token');
        router.replace('/admin/login');
      }
    } catch (error) {
      localStorage.removeItem('admin_token');
      router.replace('/admin/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.replace('/admin/login');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    setChangingPassword(true);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${BACKEND_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordSuccess('Password changed successfully! Please login again with your new password.');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        // Log out after 2 seconds
        setTimeout(() => {
          handleLogout();
        }, 2000);
      } else {
        setPasswordError(data.detail || 'Failed to change password');
      }
    } catch (error) {
      setPasswordError('Connection error. Please try again.');
    } finally {
      setChangingPassword(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      fetchHeroSettings();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [propsRes, leadsRes, statsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/properties`),
        fetch(`${BACKEND_URL}/api/inquiries`),
        fetch(`${BACKEND_URL}/api/stats`)
      ]);
      
      if (propsRes.ok) setProperties(await propsRes.json());
      if (leadsRes.ok) setLeads(await leadsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHeroSettings = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/site-settings/hero`);
      if (res.ok) {
        const data = await res.json();
        setHeroSettings({
          title: data.title || '',
          subtitle: data.subtitle || '',
          description: data.description || '',
          images: data.images || []
        });
      }
    } catch (e) { console.error('Error fetching hero settings'); }
  };

  const saveHeroSettings = async () => {
    setHeroLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/site-settings/hero`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroSettings)
      });
      if (res.ok) {
        setHeroSaved(true);
        setTimeout(() => setHeroSaved(false), 3000);
      }
    } catch (e) { console.error('Error saving hero settings'); }
    finally { setHeroLoading(false); }
  };

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHeroImage(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${BACKEND_URL}/api/upload-image`, { method: 'POST', body: fd });
      if (res.ok) {
        const data = await res.json();
        setHeroSettings(prev => ({ ...prev, images: [...prev.images, data.url] }));
      }
    } catch (e) { console.error('Error uploading hero image'); }
    finally { setUploadingHeroImage(false); e.target.value = ''; }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingProperty 
        ? `${BACKEND_URL}/api/properties/${editingProperty.id}`
        : `${BACKEND_URL}/api/properties`;
      const method = editingProperty ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchData();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/properties/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const handleMarkSold = async (id, currentSold) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/properties/${id}/sold?sold=${!currentSold}`, {
        method: 'PATCH'
      });
      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error updating property:', error);
    }
  };

  const handleLeadStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const handleDeleteLead = async (id) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/inquiries/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title || '',
      description: property.description || '',
      full_description: property.full_description || '',
      price: property.price || '',
      location: property.location || '',
      area: property.area || '',
      city: property.city || 'Jaipur',
      type: property.type || '',
      category: property.category || 'Residential',
      sub_category: property.sub_category || '',
      status: property.status || 'Sales',
      featured: property.featured || false,
      sold: property.sold || false,
      images: property.images || [],
      map_link: property.map_link || '',
      amenities: property.amenities || []
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProperty(null);
    setFormData({
      title: '', description: '', full_description: '', price: '', location: '',
      area: '', city: 'Jaipur', type: '', category: 'Residential', sub_category: '',
      status: 'Sales', featured: false, sold: false, images: [], map_link: '', amenities: []
    });
    setNewAmenity('');
  };

  const handleAddImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      const response = await fetch(`${BACKEND_URL}/api/upload-image`, {
        method: 'POST',
        body: formDataUpload
      });
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, images: [...prev.images, data.url] }));
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      alert('Error uploading image');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const filteredLeads = leadFilter === 'all' 
    ? leads 
    : leads.filter(l => l.status === leadFilter);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'new': return <Clock size={14} className="text-blue-500" />;
      case 'contacted': return <Phone size={14} className="text-yellow-500" />;
      case 'converted': return <CheckCircle size={14} className="text-green-500" />;
      case 'closed': return <XCircle size={14} className="text-gray-500" />;
      default: return <Clock size={14} />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'contacted': return 'bg-yellow-100 text-yellow-700';
      case 'converted': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Auth Loading State */}
      {authChecking && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[#1e88e5] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying authentication...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-[#1e88e5] transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={fetchData} variant="outline" size="sm">
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </Button>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              size="sm"
              data-testid="admin-logout-btn"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-2 shadow-sm">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'dashboard' ? 'bg-[#1e88e5] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BarChart3 size={18} />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'properties' ? 'bg-[#1e88e5] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Building size={18} />
            Properties ({properties.length})
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'leads' ? 'bg-[#1e88e5] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users size={18} />
            Leads ({leads.length})
            {stats.new_inquiries > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{stats.new_inquiries}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'settings' ? 'bg-[#1e88e5] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Settings size={18} />
            Settings
          </button>
          <button
            onClick={() => setActiveTab('coverpage')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'coverpage' ? 'bg-[#1e88e5] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ImageIcon size={18} />
            Cover Page
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Building size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Properties</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.total_properties || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-xl">
                  <Home size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Villas</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.total_villas || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <CheckCircle size={24} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Sold</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.sold_count || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <Users size={24} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Leads</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.total_inquiries || 0}</p>
                  {stats.new_inquiries > 0 && (
                    <p className="text-xs text-orange-600">{stats.new_inquiries} new</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Manage Properties</h2>
              <Button onClick={() => setShowForm(true)} className="bg-[#1e88e5] hover:bg-[#1565c0]">
                <Plus size={18} className="mr-2" />
                Add Property
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <Home size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No properties found. Add your first property!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <div key={property.id} className={`bg-white rounded-xl shadow-sm overflow-hidden ${property.sold ? 'opacity-75' : ''}`}>
                    <div className="relative h-48">
                      <img
                        src={property.images?.[0] || '/images/properties/default-plot.jpg'}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        {property.sold && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">SOLD</span>
                        )}
                        {property.featured && !property.sold && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Featured</span>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 truncate">{property.title}</h3>
                      <p className={`font-bold mt-1 ${property.sold ? 'text-gray-500 line-through' : 'text-[#1e88e5]'}`}>{property.price}</p>
                      <p className="text-gray-500 text-sm mt-1">{property.area} • {property.type}</p>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(property)} className="flex-1">
                          <Edit size={14} className="mr-1" /> Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant={property.sold ? "default" : "outline"}
                          onClick={() => handleMarkSold(property.id, property.sold)}
                          className={property.sold ? "bg-green-500 hover:bg-green-600 flex-1" : "flex-1"}
                        >
                          {property.sold ? 'Mark Available' : 'Mark Sold'}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(property.id)} className="text-red-500 hover:text-red-600">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Manage Leads</h2>
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-500" />
                <Select value={leadFilter} onValueChange={setLeadFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Leads</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <Users size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No leads found.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Contact</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Property</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Source</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-800">{lead.name}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail size={12} /> {lead.email}
                            </p>
                            {lead.phone && (
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <Phone size={12} /> {lead.phone}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {lead.property_title ? (
                            <p className="text-sm text-gray-600 truncate max-w-[200px]">{lead.property_title}</p>
                          ) : (
                            <span className="text-gray-400 text-sm">General Inquiry</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {lead.source || 'contact_form'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Select value={lead.status} onValueChange={(v) => handleLeadStatus(lead.id, v)}>
                            <SelectTrigger className={`w-32 h-8 text-xs ${getStatusColor(lead.status)}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="converted">Converted</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteLead(lead.id)} className="text-red-500 hover:text-red-600">
                            <Trash2 size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Lead Details Expansion */}
            {filteredLeads.length > 0 && (
              <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Recent Messages</h3>
                <div className="space-y-4">
                  {filteredLeads.slice(0, 5).map((lead) => (
                    <div key={lead.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-gray-800">{lead.name}</p>
                          <p className="text-xs text-gray-500">{lead.email} • {new Date(lead.created_at).toLocaleString()}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{lead.message}</p>
                      {lead.property_title && (
                        <p className="text-xs text-[#1e88e5] mt-2">Property: {lead.property_title}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-xl">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Lock size={24} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Change Password</h2>
                  <p className="text-sm text-gray-500">Update your admin password</p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    data-testid="settings-current-password"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    data-testid="settings-new-password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="Enter new password (min 6 characters)"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    data-testid="settings-confirm-password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                {passwordError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    <AlertCircle size={16} />
                    <span>{passwordError}</span>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                    <CheckCircle size={16} />
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  data-testid="settings-change-password-btn"
                  disabled={changingPassword}
                  className="w-full bg-[#1e88e5] hover:bg-[#1565c0]"
                >
                  {changingPassword ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Changing Password...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Lock size={16} />
                      Change Password
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Cover Page Tab */}
        {activeTab === 'coverpage' && (
          <div className="max-w-3xl">
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <ImageIcon size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Cover Page Settings</h2>
                    <p className="text-sm text-gray-500">Manage homepage hero section</p>
                  </div>
                </div>
                {heroSaved && (
                  <span className="text-green-600 text-sm flex items-center gap-1">
                    <CheckCircle size={16} /> Saved!
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={heroSettings.title}
                    onChange={(e) => setHeroSettings({ ...heroSettings, title: e.target.value })}
                    placeholder="Jaipur Elite Homes"
                  />
                </div>
                <div>
                  <Label>Subtitle</Label>
                  <Input
                    value={heroSettings.subtitle}
                    onChange={(e) => setHeroSettings({ ...heroSettings, subtitle: e.target.value })}
                    placeholder="Where Dreams Meet Luxury"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={heroSettings.description}
                    onChange={(e) => setHeroSettings({ ...heroSettings, description: e.target.value })}
                    rows={3}
                    placeholder="About your company..."
                  />
                </div>

                <div>
                  <Label>Background Images</Label>
                  <p className="text-xs text-gray-500 mb-2">Upload images for the hero slideshow. Recommended: 1920x1080 or larger.</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                    {heroSettings.images.map((img, idx) => (
                      <div key={idx} className="relative group aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setHeroSettings(prev => ({
                            ...prev, images: prev.images.filter((_, i) => i !== idx)
                          }))}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                        <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                          {idx + 1}
                        </span>
                      </div>
                    ))}
                    <label className={`aspect-video rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#1e88e5] hover:text-[#1e88e5] transition-colors ${uploadingHeroImage ? 'opacity-50 pointer-events-none' : 'text-gray-500'}`}>
                      {uploadingHeroImage ? (
                        <span className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Plus size={24} />
                          <span className="text-xs mt-1">Upload</span>
                        </>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={handleHeroImageUpload} disabled={uploadingHeroImage} />
                    </label>
                  </div>
                </div>
              </div>

              <Button
                onClick={saveHeroSettings}
                disabled={heroLoading}
                className="w-full bg-[#1e88e5] hover:bg-[#1565c0]"
              >
                {heroLoading ? 'Saving...' : 'Save Cover Page Settings'}
              </Button>
            </div>
          </div>
        )}

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {editingProperty ? 'Edit Property' : 'Add New Property'}
                </h2>
                <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label>Title *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Property title"
                      required
                    />
                  </div>

                  <div>
                    <Label>Category (Type) *</Label>
                    <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v, sub_category: '' })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Property Type</Label>
                    <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map(t => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.type === 'Projects' && (
                    <div>
                      <Label>Project Sub-Category</Label>
                      <Select value={formData.sub_category} onValueChange={(v) => setFormData({ ...formData, sub_category: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sub-category" />
                        </SelectTrigger>
                        <SelectContent>
                          {projectSubCategories.map(sc => (
                            <SelectItem key={sc} value={sc}>{sc}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label>Status</Label>
                    <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Rental">Rental</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Price *</Label>
                    <Input
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="₹ 50 lakh"
                      required
                    />
                  </div>

                  <div>
                    <Label>Area *</Label>
                    <Select value={formData.area} onValueChange={(v) => setFormData({ ...formData, area: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {areas.map(area => (
                          <SelectItem key={area} value={area}>{area}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label>Location</Label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Full address"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label>Short Description *</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description"
                      rows={2}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label>Full Description</Label>
                    <Textarea
                      value={formData.full_description}
                      onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                      placeholder="Detailed description with features, location details, property specs..."
                      rows={5}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label>Google Maps Link</Label>
                    <Input
                      value={formData.map_link}
                      onChange={(e) => setFormData({ ...formData, map_link: e.target.value })}
                      placeholder="https://maps.google.com/..."
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                      />
                      <Label htmlFor="featured">Featured Property</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="sold"
                        checked={formData.sold}
                        onCheckedChange={(checked) => setFormData({ ...formData, sold: checked })}
                      />
                      <Label htmlFor="sold">Mark as Sold</Label>
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div>
                  <Label>Images</Label>
                  <div className="grid grid-cols-4 gap-3 mt-2">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    <label className={`aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#1e88e5] hover:text-[#1e88e5] transition-colors ${uploadingImage ? 'opacity-50 pointer-events-none' : 'text-gray-500'}`}>
                      {uploadingImage ? (
                        <span className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Plus size={24} />
                          <span className="text-xs mt-1">Upload</span>
                        </>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={handleAddImage} disabled={uploadingImage} />
                    </label>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <Label>Amenities</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      placeholder="e.g. Swimming Pool, Gym, Parking"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newAmenity.trim()) {
                            setFormData(prev => ({ ...prev, amenities: [...prev.amenities, newAmenity.trim()] }));
                            setNewAmenity('');
                          }
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={() => {
                      if (newAmenity.trim()) {
                        setFormData(prev => ({ ...prev, amenities: [...prev.amenities, newAmenity.trim()] }));
                        setNewAmenity('');
                      }
                    }}>
                      <Plus size={16} />
                    </Button>
                  </div>
                  {formData.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.amenities.map((amenity, idx) => (
                        <span key={idx} className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full flex items-center gap-1.5">
                          {amenity}
                          <button type="button" onClick={() => setFormData(prev => ({
                            ...prev, amenities: prev.amenities.filter((_, i) => i !== idx)
                          }))} className="hover:text-red-500">
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-[#1e88e5] hover:bg-[#1565c0]">
                    <Check size={18} className="mr-2" />
                    {editingProperty ? 'Update' : 'Create'} Property
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
