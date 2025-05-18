import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSupabase } from '../context/SupabaseContext';
import { Download, Briefcase, GraduationCap, Award } from 'lucide-react';
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

const CV: React.FC = () => {
  const { supabase } = useSupabase();
  const [cvSections, setCVSections] = useState<CVSection[]>([]);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cvRef = useRef<HTMLDivElement>(null);

  // Fetch CV data
  useEffect(() => {
    const fetchCVData = async () => {
      try {
        setLoading(true);

        // Fetch personal info
        const { data: infoData, error: infoError } = await supabase
          .from('personal_info')
          .select('*')
          .single();

        if (infoError && infoError.code !== 'PGRST116') {
          throw infoError;
        }

        setPersonalInfo(infoData && {
          id: '',
          full_name: 'مبارك سعيد محمد سيف',
          title: 'مطور برمجيات',
          email: 'eng.mubarakai@gmail.com',
          phone: '779032862',
          address: 'اليمن',
          summary: 'متخصص في تطوير البرمجيات وتكنولوجيا المعلومات مع خبرة واسعة في مختلف التقنيات والمنصات.',
          user_id: ''
        });

        // Fetch CV sections
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('cv_sections')
          .select('*')
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

    fetchCVData();
  }, [supabase]);

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

  // Fallback data if no CV sections are available
  const fallbackEducation: CVSection[] = [
    {
      id: '1',
      type: 'education',
      title: 'بكالوريوس تكنولوجيا المعلومات',
      organization: 'جامعة سبأ',
      location: 'اليمن - صنعاء',
      start_date: '2022-09-01',
      end_date: '2026-05-01',
      description: 'دراسة متخصصة في مجال تكنولوجيا المعلومات وعلوم الحاسوب. تضمنت المناهج البرمجية، قواعد البيانات، شبكات الحاسوب، وهندسة البرمجيات.',
      user_id: ''
    }
  ];

  const fallbackExperience: CVSection[] = [
    {
      id: '2',
      type: 'experience',
      title: 'مطور واجهات أمامية',
      organization: 'شركة تقنية المعلومات',
      location: 'اليمن',
      start_date: '2022-08-01',
      end_date: null,
      description: 'تطوير واجهات المستخدم باستخدام React.js وNext.js. العمل على مشاريع متعددة وتطبيق أفضل الممارسات في تطوير الويب.',
      user_id: ''
    },
    {
      id: '3',
      type: 'experience',
      title: 'مطور ويب متكامل',
      organization: 'شركة البرمجيات المتطورة',
      location: 'اليمن',
      start_date: '2021-06-01',
      end_date: '2022-07-31',
      description: 'تطوير تطبيقات الويب باستخدام MERN Stack (MongoDB, Express.js, React.js, Node.js). تصميم وتنفيذ واجهات المستخدم وتطوير خدمات الواجهة الخلفية.',
      user_id: ''
    }
  ];

  const fallbackCertifications: CVSection[] = [
    {
      id: '4',
      type: 'certification',
      title: 'Full Stack Web Development',
      organization: 'Udemy',
      location: 'عبر الإنترنت',
      start_date: '2023-01-01',
      end_date: '2023-03-01',
      description: 'شهادة متخصصة في تطوير الويب المتكامل باستخدام أحدث التقنيات والأدوات.',
      user_id: ''
    },
    {
      id: '5',
      type: 'certification',
      title: 'React & Node.js Development',
      organization: 'Coursera',
      location: 'عبر الإنترنت',
      start_date: '2022-05-01',
      end_date: '2022-08-01',
      description: 'شهادة متخصصة في تطوير تطبيقات الويب باستخدام React.js وNode.js.',
      user_id: ''
    }
  ];

  // Use fallback data if there are no CV sections from the database
  const displayEducation = cvSections.filter(s => s.type === 'education').length > 0
    ? cvSections.filter(s => s.type === 'education')
    : fallbackEducation;

  const displayExperience = cvSections.filter(s => s.type === 'experience').length > 0
    ? cvSections.filter(s => s.type === 'experience')
    : fallbackExperience;

  const displayCertifications = cvSections.filter(s => s.type === 'certification').length > 0
    ? cvSections.filter(s => s.type === 'certification')
    : fallbackCertifications;

  if (loading) {
    return (
      <div className="pt-24 pb-12 min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">السيرة الذاتية</h1>
          <div className="h-1 w-24 bg-blue-600 mx-auto mb-6"></div>
        </motion.div>

        {/* Download Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={generatePDF}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Download size={18} className="ml-2" />
            تحميل PDF
          </button>
        </div>

        {/* CV Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-10">
          <div ref={cvRef} className="cv-preview">
            {/* Personal Info Section */}
            <div className="border-b-2 border-gray-200 pb-6 mb-8">
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

            {/* Experience Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Briefcase size={22} className="text-blue-600 ml-2" />
                <h2 className="text-2xl font-bold text-gray-900">الخبرات العملية</h2>
              </div>
              <div className="space-y-6">
                {displayExperience.map((exp) => (
                  <div key={exp.id} className="border-r-2 border-blue-600 pr-4">
                    <div className="flex justify-between mb-1">
                      <h3 className="font-bold text-gray-800 text-lg">{exp.title}</h3>
                      <span className="text-blue-600 text-sm">
                        {new Date(exp.start_date).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' })}
                        {exp.end_date
                          ? ` - ${new Date(exp.end_date).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' })}`
                          : ' - حتى الآن'
                        }
                      </span>
                    </div>
                    <p className="text-gray-700 font-medium mb-2">{exp.organization}{exp.location ? ` | ${exp.location}` : ''}</p>
                    <p className="text-gray-600">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <GraduationCap size={22} className="text-blue-600 ml-2" />
                <h2 className="text-2xl font-bold text-gray-900">التعليم</h2>
              </div>
              <div className="space-y-6">
                {displayEducation.map((edu) => (
                  <div key={edu.id} className="border-r-2 border-blue-600 pr-4">
                    <div className="flex justify-between mb-1">
                      <h3 className="font-bold text-gray-800 text-lg">{edu.title}</h3>
                      <span className="text-blue-600 text-sm">
                        {new Date(edu.start_date).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' })}
                        {edu.end_date
                          ? ` - ${new Date(edu.end_date).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' })}`
                          : ' - حتى الآن'
                        }
                      </span>
                    </div>
                    <p className="text-gray-700 font-medium mb-2">{edu.organization}{edu.location ? ` | ${edu.location}` : ''}</p>
                    <p className="text-gray-600">{edu.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Award size={22} className="text-blue-600 ml-2" />
                <h2 className="text-2xl font-bold text-gray-900">الشهادات والدورات</h2>
              </div>
              <div className="space-y-6">
                {displayCertifications.map((cert) => (
                  <div key={cert.id} className="border-r-2 border-blue-600 pr-4">
                    <div className="flex justify-between mb-1">
                      <h3 className="font-bold text-gray-800 text-lg">{cert.title}</h3>
                      <span className="text-blue-600 text-sm">
                        {new Date(cert.start_date).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' })}
                        {cert.end_date
                          ? ` - ${new Date(cert.end_date).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' })}`
                          : ''
                        }
                      </span>
                    </div>
                    <p className="text-gray-700 font-medium mb-2">{cert.organization}{cert.location ? ` | ${cert.location}` : ''}</p>
                    <p className="text-gray-600">{cert.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">المهارات</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {[
                  { name: 'HTML/CSS', level: 95 },
                  { name: 'JavaScript', level: 90 },
                  { name: 'React', level: 85 },
                  { name: 'TypeScript', level: 80 },
                  { name: 'Node.js', level: 85 },
                  { name: 'MySQL', level: 90 },
                  { name: 'Oracle', level: 95 },
                  { name: 'Git & Github', level: 90 },
                ].map((skill, index) => (
                  <div key={index} className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-800 font-medium">{skill.name}</span>
                      <span className="text-blue-600 font-medium">{skill.level}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CV;