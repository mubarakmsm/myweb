import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSupabase } from '../context/SupabaseContext';

interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  created_at: string;
}

const Skills: React.FC = () => {
  const { supabase } = useSupabase();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch skills
  useEffect(() => {
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

    fetchSkills();
  }, [supabase]);

  // Fallback data if no skills are available
  const fallbackSkills = [
    { id: '1', name: 'HTML/CSS', level: 95, category: 'تطوير الواجهة الأمامية', created_at: new Date().toISOString() },
    { id: '2', name: 'JavaScript', level: 90, category: 'تطوير الواجهة الأمامية', created_at: new Date().toISOString() },
    { id: '3', name: 'React', level: 85, category: 'تطوير الواجهة الأمامية', created_at: new Date().toISOString() },
    { id: '4', name: 'Flutter', level: 90, category: 'تطوير الواجهة الأمامية', created_at: new Date().toISOString() },
    { id: '5', name: 'Node.js', level: 85, category: 'تطوير الخلفية', created_at: new Date().toISOString() },
    { id: '6', name: 'PHP & Laravel', level: 90, category: 'تطوير الخلفية', created_at: new Date().toISOString() },
    { id: '7', name: 'Oracle', level: 95, category: 'قواعد البيانات', created_at: new Date().toISOString() },
    { id: '8', name: 'MySQL', level: 90, category: 'قواعد البيانات', created_at: new Date().toISOString() },
    { id: '9', name: 'Git & Github', level: 90, category: 'أدوات وتقنيات', created_at: new Date().toISOString() },
    { id: '10', name: 'Figma & Adobe xd', level: 85, category: 'أدوات وتقنيات', created_at: new Date().toISOString() },
    { id: '11', name: '++C', level: 95, category: 'لغات البرمجة', created_at: new Date().toISOString() },
    { id: '12', name: '#C', level: 95, category: 'لغات البرمجة', created_at: new Date().toISOString() },
    { id: '13', name: 'Python', level: 90, category: 'لغات البرمجة', created_at: new Date().toISOString() },
    { id: '14', name: 'Dart', level: 85, category: 'لغات البرمجة', created_at: new Date().toISOString() },
    { id: '15', name: 'TypeScript', level: 90, category: 'لغات البرمجة', created_at: new Date().toISOString() },
  ];

  // Use fallback data if there are no skills from the database
  const displaySkills = skills.length > 0 ? skills : fallbackSkills;

  // Group skills by category
  const groupedSkills = displaySkills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

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
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">مهاراتي التقنية</h1>
          <div className="h-1 w-24 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            أمتلك مجموعة متنوعة من المهارات التقنية في مجال تطوير البرمجيات وتكنولوجيا المعلومات
          </p>
        </motion.div>

        {/* Skills Categories */}
        <div className="space-y-12">
          {Object.entries(groupedSkills).map(([category, skills], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6 md:p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, x: skillIndex % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: (categoryIndex * 0.1) + (skillIndex * 0.05) }}
                    className="mb-2"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-800 font-medium">{skill.name}</span>
                      <span className="text-blue-600 font-medium">{skill.level}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                      ></motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-6 text-center">المهارات الشخصية</h2>
            <div className="h-1 w-24 bg-blue-300 mx-auto mb-8"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                'مهارات التواصل',
                'العمل ضمن فريق',
                'حل المشكلات',
                'إدارة الوقت',
                'التفكير النقدي',
                'القدرة على التكيف',
                'التعلم الذاتي',
                'إدارة المشاريع',
                'الإبداع والابتكار'
              ].map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="bg-blue-800/30 rounded-lg p-4 text-center backdrop-blur-sm"
                >
                  <p className="text-lg font-medium">{skill}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Education & Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">التعليم والشهادات</h2>
            <div className="h-1 w-24 bg-blue-600 mx-auto mb-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">التعليم</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between">
                    <h4 className="font-bold text-gray-800">بكالوريوس تكنولوجيا المعلومات</h4>
                    <span className="text-blue-600 text-sm">2025 - 2022</span>
                  </div>
                  <p className="text-gray-600">جامعة سبأ</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">بعض الشهادات الحاصل عليها</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between">
                    <h4 className="font-bold text-gray-800">Full Stack Web Development</h4>
                    <span className="text-blue-600 text-sm">2025</span>
                  </div>
                  <p className="text-gray-600">Udemy</p>
                </div>
                <div>
                  <div className="flex justify-between">
                    <h4 className="font-bold text-gray-800">React & Node.js Development</h4>
                    <span className="text-blue-600 text-sm">2024</span>
                  </div>
                  <p className="text-gray-600">Coursera</p>
                </div>
                <div>
                  <div className="flex justify-between">
                    <h4 className="font-bold text-gray-800">App Development With Flutter</h4>
                    <span className="text-blue-600 text-sm">2023</span>
                  </div>
                  <p className="text-gray-600">Udemy</p>
                </div>
                <div>
                  <div className="flex justify-between">
                    <h4 className="font-bold text-gray-800">HTML/CSS/JS Development</h4>
                    <span className="text-blue-600 text-sm">2022</span>
                  </div>
                  <p className="text-gray-600">Coursera</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Skills;