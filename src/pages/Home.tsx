import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code, Server, PenTool, Database, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 text-white overflow-hidden pt-24">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/4792731/pexels-photo-4792731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2 text-center md:text-right"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                م. مـبــــارك ســعـيـد 
                <h1>Eng Mubarak Saeed</h1>
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                متخصص في تطوير البرمجيات وتكنولوجيا المعلومات
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                <Link to="/contact" className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-md transition-colors duration-300">
                  تواصل معي
                </Link>
                <Link to="/projects" className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 text-white font-medium py-3 px-8 rounded-md transition-colors duration-300">
                  مشاريعي
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-12 md:mt-0 md:w-1/2 flex justify-center"
            >
              <div className="bg-blue-700/30 p-2 rounded-full">
                <img
                  src="src/pages/msm.jpg"
                  alt="Eng Mubarak Saeed"
                  className="w-64 h-64 object-cover rounded-full border-4 border-blue-400"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              خدماتي
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              whileInView={{ opacity: 1, width: '120px' }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="h-1 bg-blue-600 mx-auto mb-6"
            ></motion.div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              أقدم مجموعة متنوعة من الخدمات في مجال تكنولوجيا المعلومات وتطوير البرمجيات
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Code size={40} />,
                title: 'تطوير الويب',
                description: 'تصميم وتطوير مواقع ويب عصرية وتفاعلية تناسب احتياجاتك'
              },
              {
                icon: <PenTool size={40} />,
                title: 'تصميم واجهات المستخدم',
                description: 'تصميم واجهات مستخدم جذابة وسهلة الاستخدام لتحسين تجربة المستخدم'
              },
              {
                icon: <Server size={40} />,
                title: 'تطوير الخلفية',
                description: 'بناء أنظمة خلفية قوية وقابلة للتوسع لدعم تطبيقات الويب والموبايل'
              },
              {
                icon: <Database size={40} />,
                title: 'إدارة قواعد البيانات',
                description: 'تصميم وإدارة قواعد بيانات فعالة وآمنة لتخزين ومعالجة البيانات'
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow hover:-translate-y-1 duration-300"
              >
                <div className="text-blue-600 mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Link to="/services" className="text-blue-600 font-medium inline-flex items-center hover:text-blue-800">
                  المزيد
                  <ArrowRight size={16} className="mr-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              مهاراتي التقنية
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              whileInView={{ opacity: 1, width: '120px' }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="h-1 bg-blue-600 mx-auto mb-6"
            ></motion.div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              أمتلك مجموعة متنوعة من المهارات التقنية التي تمكنني من تنفيذ مشاريع متنوعة بكفاءة عالية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl mx-auto">
            {[
              { name: 'HTML/CSS', level: 95 },
              { name: 'JavaScript', level: 90 },
              { name: 'React', level: 85 },
              { name: 'Node.js', level: 85 },
              { name: 'Python', level: 90 },
              { name: 'SQL', level: 95 }
            ].map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="mb-2"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-800 font-medium">{skill.name}</span>
                  <span className="text-blue-600 font-medium">{skill.level}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="h-full bg-blue-600 rounded-full"
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/skills"
              className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 text-lg"
            >
              عرض جميع المهارات
              <ArrowRight size={20} className="mr-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Projects Preview */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              أحدث مشاريعي
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              whileInView={{ opacity: 1, width: '120px' }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="h-1 bg-blue-600 mx-auto mb-6"
            ></motion.div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              إليك نظرة على بعض المشاريع التي قمت بتطويرها مؤخرًا
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'موقع تجارة إلكترونية',
                category: 'تطوير الويب',
                image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
              },
              {
                title: 'تطبيق إدارة المهام',
                category: 'تطوير تطبيقات',
                image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
              },
              {
                title: 'نظام إدارة المخزون',
                category: 'برمجة النظم',
                image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
              }
            ].map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow-lg overflow-hidden group"
              >
                <div className="relative overflow-hidden h-56">
                  <img
                    src={project.image}
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
                  <span className="text-blue-600 text-sm font-medium block mb-2">{project.category}</span>
                  <h3 className="text-gray-900 text-xl font-bold mb-2">{project.title}</h3>
                  <Link
                    to="/projects"
                    className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
                  >
                    عرض التفاصيل
                    <ArrowRight size={16} className="mr-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/projects"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-colors duration-300"
            >
              عرض جميع المشاريع
            </Link>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            هل أنت مستعد لبدء مشروعك التالي؟
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl mb-8 max-w-2xl mx-auto"
          >
            دعنا نتعاون لتحويل أفكارك إلى واقع. تواصل معي اليوم لمناقشة مشروعك.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link
              to="/contact"
              className="inline-block bg-white text-blue-900 font-bold py-3 px-8 rounded-md hover:bg-blue-100 transition-colors duration-300"
            >
              تواصل معي
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;