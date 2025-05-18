import React, { useState, useEffect } from 'react';
import { useSupabase } from '../../context/SupabaseContext';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  created_at: string;
}

const ServicesManager: React.FC = () => {
  const { supabase } = useSupabase();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service> | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Icon options for services
  const iconOptions = [
    'Code', 'Globe', 'Database', 'PenTool', 'Server', 
    'Smartphone', 'BarChart', 'Settings', 'Search', 'ShoppingCart'
  ];

  // Fetch services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Open modal for creating a new service
  const handleAddNew = () => {
    setCurrentService({
      title: '',
      description: '',
      icon: iconOptions[0],
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // Open modal for editing a service
  const handleEdit = (service: Service) => {
    setCurrentService(service);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentService(prev => prev ? { ...prev, [name]: value } : null);
  };

  // Handle saving a service (create or update)
  const handleSave = async () => {
    if (!currentService) return;
    
    try {
      if (isEditing && currentService.id) {
        // Update existing service
        const { error } = await supabase
          .from('services')
          .update({
            title: currentService.title,
            description: currentService.description,
            icon: currentService.icon,
          })
          .eq('id', currentService.id);
        
        if (error) throw error;
      } else {
        // Create new service
        const { error } = await supabase
          .from('services')
          .insert([{
            title: currentService.title,
            description: currentService.description,
            icon: currentService.icon,
          }]);
        
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      setError('Failed to save service');
    }
  };

  // Handle deleting a service
  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return;
    
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      setError('Failed to delete service');
    }
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentService(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">إدارة الخدمات</h2>
        <button
          onClick={handleAddNew}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={18} className="ml-1" />
          خدمة جديدة
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {services.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">لا توجد خدمات حتى الآن</p>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            إضافة أول خدمة
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-md mr-4">
                    <span className="text-xl">{service.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 line-clamp-2">{service.description}</p>
                  </div>
                </div>
                <div className="flex space-x-2 space-x-reverse">
                  <button
                    onClick={() => handleEdit(service)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for add/edit */}
      {isModalOpen && currentService && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center bg-gray-100 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">
                {isEditing ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
              </h3>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    عنوان الخدمة
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={currentService.title || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="أدخل عنوان الخدمة"
                  />
                </div>
                <div>
                  <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
                    الأيقونة
                  </label>
                  <select
                    id="icon"
                    name="icon"
                    value={currentService.icon || iconOptions[0]}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {iconOptions.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    الوصف
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={currentService.description || ''}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="أدخل وصف الخدمة"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 text-left">
              <button
                onClick={handleSave}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                <Save size={18} className="ml-1" />
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManager;