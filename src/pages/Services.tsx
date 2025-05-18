import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSupabase } from '../context/SupabaseContext';
import { Code, PenTool, Server, Database, Globe, BarChart3, Smartphone, Settings, ShoppingCart, Search } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  created_at: string;
}

const Services: React.FC = () => {
  const { supabase } = useSupabase();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map icon strings to components
  const iconMap: Record<string, React.ReactNode> = {
    'Code': <Code size={40} />,
    'Globe': <Globe size={40} />,
    'Database': <Database size={40} />,
    'PenTool': <PenTool size={40} />,
    'Server': <Server size={40} />,
    'Smartphone': <Smartphone size={40} />,
    'BarChart': <BarChart3 size={40} />,
    'Settings': <Settings size={40} />,
    'Search': <Search size={40} />,
    'ShoppingCart': <ShoppingCart size={40} />,
  };

  // Fetch services
  useEffect(() => {
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

    fetchServices();
  }, [supabase]);

  // Fallback data if no services are available
  const fallbackServices = [
    {
      id: '1',
      title: 'تطوير مواقع الويب',
      description: 'تصميم وتطوير مواقع ويب عصرية وتفاعلية تناسب احتياجاتك الشخصية أو التجارية، مع التركيز على تجربة المستخدم وسرعة التحميل وتحسين محركات البحث.',
      icon: 'Code',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'تصميم واجهات المستخدم',
      description: 'تصميم واجهات مستخدم جذابة وسهلة الاستخدام لتحسين تجربة المستخدم وزيادة معدلات التحويل، مع مراعاة أحدث اتجاهات التصميم والمعايير.',
      icon: 'PenTool',
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      title: 'تطوير الخلفية',
      description: 'بناء أنظمة خلفية قوية وقابلة للتوسع لدعم تطبيقات الويب والموبايل، باستخدام أحدث التقنيات وأفضل الممارسات.',
      icon: 'Server',
      created_at: new Date().toISOString()
    },
    {
      id: '4',
      title: 'إدارة قواعد البيانات',
      description: 'تصميم وإدارة قواعد بيانات فعالة وآمنة لتخزين ومعالجة البيانات، مع ضمان الأداء الأمثل والنسخ الاحتياطي والاسترداد.',
      icon: 'Database',
      created_at: new Date().toISOString()
    }
  ];

  // Use fallback data if there are no services from the database
  const displayServices = services.length > 0 ? services : fallbackServices;

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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">خدماتي</h1>
          <div className="h-1 w-24 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            أقدم مجموعة متنوعة من الخدمات في مجال تكنولوجيا المعلومات وتطوير البرمجيات لتلبية احتياجاتك
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              <div className="text-blue-600 mb-4">
                {iconMap[service.icon] || <Code size={40} />}
              </div>
              <img
                src="/path/to/image.jpg"
                alt="Service"
                loading="lazy"
                className="rounded-lg"
              />
              <h3 className="text-xl font-bold mb-4 text-gray-900">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Process Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">كيف أعمل</h2>
            <div className="h-1 w-24 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              منهجية عملي تضمن تقديم خدمات عالية الجودة تلبي احتياجاتك
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: 'المناقشة والتحليل',
                description: 'مناقشة متطلباتك وتحليلها لفهم أهدافك واحتياجاتك بشكل دقيق'
              },
              {
                step: 2,
                title: 'التخطيط والتصميم',
                description: 'وضع خطة عمل مفصلة وتصميم الحلول المناسبة لتحقيق أهدافك'
              },
              {
                step: 3,
                title: 'التنفيذ والتطوير',
                description: 'تنفيذ الحلول وتطويرها باستخدام أحدث التقنيات وأفضل الممارسات'
              },
              {
                step: 4,
                title: 'الاختبار والتسليم',
                description: 'اختبار الحلول للتأكد من جودتها وكفاءتها قبل التسليم النهائي'
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow p-6 text-center relative"
              >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 mt-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Why Choose Me Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">لماذا تختارني؟</h2>
              <div className="h-1 w-24 bg-blue-300 mx-auto mb-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'الخبرة والمهارة',
                  description: 'خبرة واسعة في مجال تطوير البرمجيات وتكنولوجيا المعلومات تضمن تقديم حلول احترافية'
                },
                {
                  title: 'الالتزام بالمواعيد',
                  description: 'التزام كامل بالمواعيد المتفق عليها لتسليم المشاريع في الوقت المحدد'
                },
                {
                  title: 'الدعم المستمر',
                  description: 'توفير الدعم الفني المستمر بعد تسليم المشروع لضمان سير العمل بشكل سلس'
                },
                {
                  title: 'الجودة العالية',
                  description: 'الالتزام بأعلى معايير الجودة في جميع مراحل العمل لتقديم منتج نهائي متميز'
                },
                {
                  title: 'أحدث التقنيات',
                  description: 'استخدام أحدث التقنيات والأدوات في تنفيذ المشاريع لضمان الكفاءة والفعالية'
                },
                {
                  title: 'التواصل الفعال',
                  description: 'تواصل مستمر وفعال طوال فترة العمل على المشروع لضمان تلبية جميع المتطلبات'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-blue-800/30 rounded-lg p-6 backdrop-blur-sm"
                >
                  <h3 className="text-xl font-bold mb-3 text-blue-200">{item.title}</h3>
                  <p className="text-gray-200">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">مستعد لبدء مشروعك التالي؟</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            تواصل معي اليوم لمناقشة مشروعك وكيف يمكنني مساعدتك في تحقيق أهدافك
          </p>
          <a
            href="/contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-colors duration-300"
          >
            تواصل معي
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;