import React, { useState, useEffect } from 'react';
import { useSupabase } from '../../context/SupabaseContext';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  created_at: string;
}

const SkillsManager: React.FC = () => {
  const { supabase } = useSupabase();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Partial<Skill> | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Skill categories
  const categories = [
    'لغات البرمجة',
    'تطوير الواجهة الأمامية',
    'تطوير الخلفية',
    'قواعد البيانات',
    'تطوير تطبيقات الجوال',
    'أدوات وتقنيات',
    'مهارات أخرى'
  ];

  // Fetch skills
  const fetchSkills = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true })
        .order('level', { ascending: false });
      
      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setError('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Open modal for creating a new skill
  const handleAddNew = () => {
    setCurrentSkill({
      name: '',
      level: 75,
      category: categories[0],
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // Open modal for editing a skill
  const handleEdit = (skill: Skill) => {
    setCurrentSkill(skill);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentSkill(prev => prev ? { 
      ...prev, 
      [name]: name === 'level' ? parseInt(value) : value 
    } : null);
  };

  // Handle saving a skill (create or update)
  const handleSave = async () => {
    if (!currentSkill) return;
    
    try {
      if (isEditing && currentSkill.id) {
        // Update existing skill
        const { error } = await supabase
          .from('skills')
          .update({
            name: currentSkill.name,
            level: currentSkill.level,
            category: currentSkill.category,
          })
          .eq('id', currentSkill.id);
        
        if (error) throw error;
      } else {
        // Create new skill
        const { error } = await supabase
          .from('skills')
          .insert([{
            name: currentSkill.name,
            level: currentSkill.level,
            category: currentSkill.category,
          }]);
        
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchSkills();
    } catch (error) {
      console.error('Error saving skill:', error);
      setError('Failed to save skill');
    }
  };

  // Handle deleting a skill
  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المهارة؟')) return;
    
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
      setError('Failed to delete skill');
    }
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentSkill(null);
  };

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

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
        <h2 className="text-2xl font-bold text-gray-800">إدارة المهارات</h2>
        <button
          onClick={handleAddNew}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={18} className="ml-1" />
          مهارة جديدة
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {skills.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">لا توجد مهارات حتى الآن</p>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            إضافة أول مهارة
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedSkills).map(([category, skills]) => (
            <div key={category} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">{category}</h3>
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-800">{skill.name}</span>
                        <span className="text-blue-600 font-medium">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex space-x-2 space-x-reverse mr-4">
                      <button
                        onClick={() => handleEdit(skill)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for add/edit */}
      {isModalOpen && currentSkill && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center bg-gray-100 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">
                {isEditing ? 'تعديل المهارة' : 'إضافة مهارة جديدة'}
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
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    اسم المهارة
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={currentSkill.name || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="أدخل اسم المهارة"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    الفئة
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={currentSkill.category || categories[0]}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                    المستوى: {currentSkill.level}%
                  </label>
                  <input
                    type="range"
                    id="level"
                    name="level"
                    min="0"
                    max="100"
                    step="5"
                    value={currentSkill.level || 75}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
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

export default SkillsManager;