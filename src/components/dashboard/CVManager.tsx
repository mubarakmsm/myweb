import React, { useState, useEffect, useRef } from 'react';
import { useSupabase } from '../../context/SupabaseContext';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit, Trash2, X, Save, Download, Calendar, Briefcase, GraduationCap, Award } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface CVSection {
  id: string;
  type: 'education' | 'experience' | 'certification';
  title: string;
  organization: string;
  location: string;
  start_date: string;
  end_date: string | null;
  description: string;
  user_id: string;
}

interface PersonalInfo {
  id: string;
  full_name: string;
  title: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  user_id: string;
}

const CVManager: React.FC = () => {
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const [cvSections, setCVSections] = useState<CVSection[]>([]);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<Partial<CVSection> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'education' | 'experience' | 'certification'>('experience');

  const cvRef = useRef<HTMLDivElement>(null);

  // Fetch CV data
  const fetchCVData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch personal info
      const { data: infoData, error: infoError } = await supabase
        .from('personal_info')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (infoError && infoError.code !== 'PGRST116') {
        throw infoError;
      }
      
      setPersonalInfo(infoData || {
        id: '',
        full_name: 'مبارك سعيد محمد سيف',
        title: 'مطور برمجيات',
        email: 'eng.mubarakai@gmail.com',
        phone: '779032862',
        address: 'اليمن',
        summary: 'متخصص في تطوير البرمجيات وتكنولوجيا المعلومات مع خبرة واسعة في مختلف التقنيات والمنصات.',
        user_id: user.id
      });
      
      // Fetch CV sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('cv_sections')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });
      
      if (sectionsError) throw sectionsError;
      setCVSections(sectionsData || []);
    } catch (error) {
      console.error('Error fetching CV data:', error);
      setError('Failed to load CV data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCVData();
    }
  }, [user]);

  // Open modal for creating a new section
  const handleAddSection = (type: 'education' | 'experience' | 'certification') => {
    setCurrentSection({
      type,
      title: '',
      organization: '',
      location: '',
      start_date: new Date().toISOString().substring(0, 10),
      end_date: null,
      description: '',
      user_id: user?.id
    });
    setIsEditing(false);
    setIsSectionModalOpen(true);
  };

  // Open modal for editing a section
  const handleEditSection = (section: CVSection) => {
    setCurrentSection({
      ...section,
      start_date: section.start_date.substring(0, 10),
      end_date: section.end_date ? section.end_date.substring(0, 10) : null
    });
    setIsEditing(true);
    setIsSectionModalOpen(true);
  };

  // Handle section form input changes
  const handleSectionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentSection(prev => prev ? { ...prev, [name]: value } : null);
  };

  // Handle saving a section (create or update)
  const handleSaveSection = async () => {
    if (!currentSection || !user) return;
    
    try {
      if (isEditing && currentSection.id) {
        // Update existing section
        const { error } = await supabase
          .from('cv_sections')
          .update({
            title: currentSection.title,
            organization: currentSection.organization,
            location: currentSection.location,
            start_date: currentSection.start_date,
            end_date: currentSection.end_date,
            description: currentSection.description,
          })
          .eq('id', currentSection.id);
        
        if (error) throw error;
      } else {
        // Create new section
        const { error } = await supabase
          .from('cv_sections')
          .insert([{
            type: currentSection.type,
            title: currentSection.title,
            organization: currentSection.organization,
            location: currentSection.location,
            start_date: currentSection.start_date,
            end_date: currentSection.end_date,
            description: currentSection.description,
            user_id: user.id
          }]);
        
        if (error) throw error;
      }
      
      setIsSectionModalOpen(false);
      fetchCVData();
    } catch (error) {
      console.error('Error saving CV section:', error);
      setError('Failed to save CV section');
    }
  };

  // Handle deleting a section
  const handleDeleteSection = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا القسم؟')) return;
    
    try {
      const { error } = await supabase
        .from('cv_sections')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchCVData();
    } catch (error) {
      console.error('Error deleting CV section:', error);
      setError('Failed to delete CV section');
    }
  };

  // Open modal for editing personal info
  const handleEditInfo = () => {
    setIsInfoModalOpen(true);
  };

  // Handle personal info form input changes
  const handleInfoInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => prev ? { ...prev, [name]: value } : null);
  };

  // Handle saving personal info
  const handleSaveInfo = async () => {
    if (!personalInfo || !user) return;
    
    try {
      if (personalInfo.id) {
        // Update existing info
        const { error } = await supabase
          .from('personal_info')
          .update({
            full_name: personalInfo.full_name,
            title: personalInfo.title,
            email: personalInfo.email,
            phone: personalInfo.phone,
            address: personalInfo.address,
            summary: personalInfo.summary,
          })
          .eq('id', personalInfo.id);
        
        if (error) throw error;
      } else {
        // Create new info
        const { error } = await supabase
          .from('personal_info')
          .insert([{
            full_name: personalInfo.full_name,
            title: personalInfo.title,
            email: personalInfo.email,
            phone: personalInfo.phone,
            address: personalInfo.address,
            summary: personalInfo.summary,
            user_id: user.id
          }]);
        
        if (error) throw error;
      }
      
      setIsInfoModalOpen(false);
      fetchCVData();
    } catch (error) {
      console.error('Error saving personal info:', error);
      setError('Failed to save personal info');
    }
  };

  // Generate and download PDF
  const generatePDF = async () => {
    if (!cvRef.current) return;
    
    try {
      const canvas = await html2canvas(cvRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('CV-Mubarak-Saeed.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF');
    }
  };

  // Filter sections by type
  const filteredSections = cvSections.filter(section => section.type === activeTab);

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
        <h2 className="text-2xl font-bold text-gray-800">إدارة السيرة الذاتية</h2>
        <button
          onClick={generatePDF}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Download size={18} className="ml-1" />
          تحميل PDF
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="mb-8 bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">المعلومات الشخصية</h3>
              <p className="text-gray-600 text-sm">المعلومات الأساسية التي ستظهر في السيرة الذاتية</p>
            </div>
            <button
              onClick={handleEditInfo}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm transition-colors flex items-center"
            >
              <Edit size={16} className="ml-1" />
              تعديل
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">الاسم الكامل</h4>
              <p className="text-gray-800">{personalInfo?.full_name || 'غير محدد'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">المسمى الوظيفي</h4>
              <p className="text-gray-800">{personalInfo?.title || 'غير محدد'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">البريد الإلكتروني</h4>
              <p className="text-gray-800">{personalInfo?.email || 'غير محدد'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">رقم الهاتف</h4>
              <p className="text-gray-800">{personalInfo?.phone || 'غير محدد'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">العنوان</h4>
              <p className="text-gray-800">{personalInfo?.address || 'غير محدد'}</p>
            </div>
            <div className="md:col-span-2">
              <h4 className="text-sm font-medium text-gray-500 mb-1">نبذة مختصرة</h4>
              <p className="text-gray-800">{personalInfo?.summary || 'غير محدد'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                className={`px-6 py-3 font-medium text-sm ${
                  activeTab === 'experience' 
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('experience')}
              >
                الخبرات العملية
              </button>
              <button
                className={`px-6 py-3 font-medium text-sm ${
                  activeTab === 'education' 
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('education')}
              >
                التعليم
              </button>
              <button
                className={`px-6 py-3 font-medium text-sm ${
                  activeTab === 'certification' 
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('certification')}
              >
                الشهادات
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                {activeTab === 'experience' && 'الخبرات العملية'}
                {activeTab === 'education' && 'التعليم'}
                {activeTab === 'certification' && 'الشهادات والدورات'}
              </h3>
              <button
                onClick={() => handleAddSection(activeTab)}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
              >
                <Plus size={16} className="ml-1" />
                إضافة جديد
              </button>
            </div>
            
            {filteredSections.length === 0 ? (
              <div className="bg-gray-50 rounded p-8 text-center">
                <p className="text-gray-500 mb-4">
                  {activeTab === 'experience' && 'لا توجد خبرات عملية حتى الآن'}
                  {activeTab === 'education' && 'لا توجد معلومات تعليمية حتى الآن'}
                  {activeTab === 'certification' && 'لا توجد شهادات حتى الآن'}
                </p>
                <button
                  onClick={() => handleAddSection(activeTab)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                >
                  إضافة جديد
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredSections.map((section) => (
                  <div key={section.id} className="bg-gray-50 rounded-lg p-5 hover:shadow transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
                            {section.type === 'experience' && <Briefcase size={20} />}
                            {section.type === 'education' && <GraduationCap size={20} />}
                            {section.type === 'certification' && <Award size={20} />}
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">{section.title}</h4>
                            <p className="text-gray-600">{section.organization}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center text-sm text-gray-500">
                          <Calendar size={14} className="ml-1" />
                          <span>
                            {new Date(section.start_date).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' })}
                            {section.end_date 
                              ? ` - ${new Date(section.end_date).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' })}` 
                              : ' - حتى الآن'
                            }
                          </span>
                          {section.location && (
                            <>
                              <span className="mx-2">|</span>
                              <span>{section.location}</span>
                            </>
                          )}
                        </div>
                        <p className="mt-3 text-gray-700">{section.description}</p>
                      </div>
                      <div className="flex space-x-2 space-x-reverse mr-2">
                        <button
                          onClick={() => handleEditSection(section)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteSection(section.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">معاينة السيرة الذاتية</h3>
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div ref={cvRef} className="cv-preview">
            <div className="border-b-2 border-gray-200 pb-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{personalInfo?.full_name}</h1>
              <p className="text-xl text-blue-600 mb-4">{personalInfo?.title}</p>
              <p className="text-gray-600 mb-4">{personalInfo?.summary}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {personalInfo?.email && (
                  <div className="flex items-center">
                    <span className="font-medium ml-1">البريد الإلكتروني:</span>
                    <span>{personalInfo?.email}</span>
                  </div>
                )}
                {personalInfo?.phone && (
                  <div className="flex items-center">
                    <span className="font-medium ml-1">الهاتف:</span>
                    <span>{personalInfo?.phone}</span>
                  </div>
                )}
                {personalInfo?.address && (
                  <div className="flex items-center">
                    <span className="font-medium ml-1">العنوان:</span>
                    <span>{personalInfo?.address}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Education Section */}
            {cvSections.filter(s => s.type === 'education').length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">التعليم</h2>
                {cvSections
                  .filter(s => s.type === 'education')
                  .map((edu) => (
                    <div key={edu.id} className="mb-4">
                      <div className="flex justify-between">
                        <h3 className="font-bold text-gray-800">{edu.title}</h3>
                        <span className="text-gray-600 text-sm">
                          {new Date(edu.start_date).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' })}
                          {edu.end_date 
                            ? ` - ${new Date(edu.end_date).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' })}` 
                            : ' - حتى الآن'
                          }
                        </span>
                      </div>
                      <p className="text-gray-700">{edu.organization}{edu.location ? ` | ${edu.location}` : ''}</p>
                      <p className="text-gray-600 mt-1">{edu.description}</p>
                    </div>
                  ))}
              </div>
            )}
            
            {/* Experience Section */}
            {cvSections.filter(s => s.type === 'experience').length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">الخبرات العملية</h2>
                {cvSections
                  .filter(s => s.type === 'experience')
                  .map((exp) => (
                    <div key={exp.id} className="mb-4">
                      <div className="flex justify-between">
                        <h3 className="font-bold text-gray-800">{exp.title}</h3>
                        <span className="text-gray-600 text-sm">
                          {new Date(exp.start_date).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' })}
                          {exp.end_date 
                            ? ` - ${new Date(exp.end_date).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' })}` 
                            : ' - حتى الآن'
                          }
                        </span>
                      </div>
                      <p className="text-gray-700">{exp.organization}{exp.location ? ` | ${exp.location}` : ''}</p>
                      <p className="text-gray-600 mt-1">{exp.description}</p>
                    </div>
                  ))}
              </div>
            )}
            
            {/* Certifications Section */}
            {cvSections.filter(s => s.type === 'certification').length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">الشهادات والدورات</h2>
                {cvSections
                  .filter(s => s.type === 'certification')
                  .map((cert) => (
                    <div key={cert.id} className="mb-4">
                      <div className="flex justify-between">
                        <h3 className="font-bold text-gray-800">{cert.title}</h3>
                        <span className="text-gray-600 text-sm">
                          {new Date(cert.start_date).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' })}
                          {cert.end_date 
                            ? ` - ${new Date(cert.end_date).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' })}` 
                            : ''
                          }
                        </span>
                      </div>
                      <p className="text-gray-700">{cert.organization}{cert.location ? ` | ${cert.location}` : ''}</p>
                      <p className="text-gray-600 mt-1">{cert.description}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for add/edit section */}
      {isSectionModalOpen && currentSection && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center bg-gray-100 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">
                {isEditing ? `تعديل ${
                  currentSection.type === 'experience' ? 'خبرة عملية' :
                  currentSection.type === 'education' ? 'معلومات تعليمية' :
                  'شهادة'
                }` : `إضافة ${
                  currentSection.type === 'experience' ? 'خبرة عملية' :
                  currentSection.type === 'education' ? 'معلومات تعليمية' :
                  'شهادة'
                }`}
              </h3>
              <button 
                onClick={() => setIsSectionModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    {currentSection.type === 'experience' ? 'المسمى الوظيفي' :
                     currentSection.type === 'education' ? 'الدرجة العلمية/التخصص' :
                     'اسم الشهادة/الدورة'}
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={currentSection.title || ''}
                    onChange={handleSectionInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                    {currentSection.type === 'experience' ? 'اسم الشركة/المؤسسة' :
                     currentSection.type === 'education' ? 'اسم الجامعة/المؤسسة التعليمية' :
                     'الجهة المانحة'}
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={currentSection.organization || ''}
                    onChange={handleSectionInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    الموقع
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={currentSection.location || ''}
                    onChange={handleSectionInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                      تاريخ البدء
                    </label>
                    <input
                      type="date"
                      id="start_date"
                      name="start_date"
                      value={currentSection.start_date || ''}
                      onChange={handleSectionInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                      تاريخ الانتهاء (اتركه فارغًا إذا كان حاليًا)
                    </label>
                    <input
                      type="date"
                      id="end_date"
                      name="end_date"
                      value={currentSection.end_date || ''}
                      onChange={handleSectionInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    الوصف
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={currentSection.description || ''}
                    onChange={handleSectionInputChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 text-left">
              <button
                onClick={handleSaveSection}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                <Save size={18} className="ml-1" />
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for personal info */}
      {isInfoModalOpen && personalInfo && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center bg-gray-100 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">
                تعديل المعلومات الشخصية
              </h3>
              <button 
                onClick={() => setIsInfoModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={personalInfo.full_name || ''}
                    onChange={handleInfoInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    المسمى الوظيفي
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={personalInfo.title || ''}
                    onChange={handleInfoInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={personalInfo.email || ''}
                    onChange={handleInfoInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    رقم الهاتف
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={personalInfo.phone || ''}
                    onChange={handleInfoInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    العنوان
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={personalInfo.address || ''}
                    onChange={handleInfoInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
                    نبذة مختصرة
                  </label>
                  <textarea
                    id="summary"
                    name="summary"
                    value={personalInfo.summary || ''}
                    onChange={handleInfoInputChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 text-left">
              <button
                onClick={handleSaveInfo}
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

export default CVManager;