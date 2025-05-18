import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSupabase } from '../context/SupabaseContext';
import { Link } from 'react-router-dom';
import { Filter, ArrowRight } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  created_at: string;
}

const Projects: React.FC = () => {
  const { supabase } = useSupabase();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        const projectsData = data || [];
        setProjects(projectsData);
        setFilteredProjects(projectsData);
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(projectsData.map(project => project.category))
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [supabase]);

  // Filter projects by category
  const filterByCategory = (category: string | null) => {
    setSelectedCategory(category);
    if (category === null) {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === category));
    }
  };

  if (loading) {
    return (
      <div className="pt-24 pb-12 min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="pt-24 pb-12 min-h-screen">
  //       <div className="container mx-auto px-4">
  //         <div className="bg-red-50 text-red-700 p-4 rounded-md">
  //           <p>{error}</p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">معرض المشاريع</h1>
          <div className="h-1 w-24 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            استعرض أحدث المشاريع التي قمت بتطويرها في مختلف المجالات والتقنيات
          </p>
        </motion.div>

        {/* Filter Section */}
        <div className="mb-8">
          <div className="flex items-center justify-center flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => filterByCategory(null)}
            >
              الكل
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => filterByCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div hidden className="text-center py-12">
            <Filter size={48}  className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد مشاريع</h3>
            <p className="text-gray-600">
              لم يتم العثور على أي مشاريع في هذه الفئة
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden group"
              >
                <div className="relative overflow-hidden h-56">
                  <img 
                    src={project.image_url || 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-6">
                      <span className="text-blue-300 text-sm font-medium block mb-2">{project.category}</span>
                      <h3 className="text-white text-xl font-bold">{project.title}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-blue-600 text-sm font-medium block mb-1">{project.category}</span>
                      <h3 className="text-gray-900 text-xl font-bold">{project.title}</h3>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(project.created_at).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                  <Link 
                    to={`/projects/${project.id}`}
                    className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
                  >
                    عرض التفاصيل
                    <ArrowRight size={16} className="mr-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;