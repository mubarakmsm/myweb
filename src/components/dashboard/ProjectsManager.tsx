import React, { useState, useEffect } from 'react';
import { useSupabase } from '../../context/SupabaseContext';
import { Plus, Edit, Trash2, X, Save, Image } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  created_at: string;
}

const ProjectsManager: React.FC = () => {
  const { supabase } = useSupabase();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project> | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Open modal for creating a new project
  const handleAddNew = () => {
    setCurrentProject({
      title: '',
      description: '',
      image_url: '',
      category: '',
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // Open modal for editing a project
  const handleEdit = (project: Project) => {
    setCurrentProject(project);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentProject(prev => prev ? { ...prev, [name]: value } : null);
  };

  // Handle saving a project (create or update)
  const handleSave = async () => {
    if (!currentProject) return;

    try {
      if (isEditing && currentProject.id) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update({
            title: currentProject.title,
            description: currentProject.description,
            image_url: currentProject.image_url,
            category: currentProject.category,
          })
          .eq('id', currentProject.id);

        if (error) throw error;
      } else {
        // Create new project
        const { error } = await supabase
          .from('projects')
          .insert([{
            title: currentProject.title,
            description: currentProject.description,
            image_url: currentProject.image_url,
            category: currentProject.category,
          }]);

        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      setError('Failed to save project');
    }
  };

  // Handle deleting a project
  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المشروع؟')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      setError('حدث خطأ أثناء حذف المشروع. يرجى المحاولة مرة أخرى.');
    }
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProject(null);
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
        <h2 className="text-2xl font-bold text-gray-800">إدارة المشاريع</h2>
        <button
          onClick={handleAddNew}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={18} className="ml-1" />
          مشروع جديد
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">لا توجد مشاريع حتى الآن</p>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            إضافة أول مشروع
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العنوان
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التصنيف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاريخ الإنشاء
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-200 mr-3">
                        {project.image_url ? (
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full text-gray-400">
                            <Image size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{project.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {project.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(project.created_at).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2 space-x-reverse">
                      <button
                        onClick={() => handleEdit(project)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for add/edit */}
      {isModalOpen && currentProject && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center bg-gray-100 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">
                {isEditing ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
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
                    العنوان
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={currentProject.title || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="أدخل عنوان المشروع"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    التصنيف
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={currentProject.category || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="أدخل تصنيف المشروع"
                  />
                </div>
                <div>
                  <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
                    رابط الصورة
                  </label>
                  <input
                    type="text"
                    id="image_url"
                    name="image_url"
                    value={currentProject.image_url || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="أدخل رابط صورة المشروع"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    الوصف
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={currentProject.description || ''}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="أدخل وصف المشروع"
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

export default ProjectsManager;