import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const EnhancedLanding = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [animatedCounters, setAnimatedCounters] = useState({
    users: 0,
    sites: 0,
    uptime: 0,
    checks: 0
  });

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "DevOps Engineer",
      company: "TechCorp",
      image: "https://i.pravatar.cc/100?u=alex",
      text: "SiteGuard Pro+ saved us hours of manual monitoring. The AI assistant is incredibly helpful!"
    },
    {
      name: "Sarah Chen",
      role: "CTO",
      company: "StartupXYZ",
      image: "https://i.pravatar.cc/100?u=sarah",
      text: "Best investment for our infrastructure. The real-time alerts prevented 3 major outages this month."
    },
    {
      name: "Mike Rodriguez",
      role: "System Administrator",
      company: "CloudNet",
      image: "https://i.pravatar.cc/100?u=mike",
      text: "Professional monitoring solution that scales with our business. Highly recommended!"
    }
  ];

  const features = [
    {
      icon: "🚀",
      title: "Real-time Monitoring",
      description: "Monitor your websites 24/7 with instant alerts via Telegram, Email, Slack",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: "📊",
      title: "Advanced Analytics",
      description: "Deep insights with performance metrics, SEO analysis, and conversion tracking",
      color: "from-green-500 to-green-600"
    },
    {
      icon: "🤖",
      title: "AI-Powered Assistant",
      description: "Smart recommendations for optimization and automated issue resolution",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: "🔒",
      title: "Security Monitoring",
      description: "SSL certificate tracking, malware detection, and security vulnerability scanning",
      color: "from-red-500 to-red-600"
    },
    {
      icon: "⚡",
      title: "Performance Optimization",
      description: "Core Web Vitals monitoring, speed optimization tips, and performance budgets",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: "🌍",
      title: "Global Network",
      description: "Monitor from multiple locations worldwide with detailed geographic insights",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: [
        "Up to 5 websites",
        "Basic monitoring",
        "Email alerts",
        "24h data retention"
      ],
      popular: false
    },
    {
      name: "Pro",
      price: "$29",
      description: "For growing businesses",
      features: [
        "Up to 50 websites",
        "Advanced monitoring",
        "All alert types",
        "30-day data retention",
        "API access",
        "Priority support"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Unlimited websites",
        "Custom integrations",
        "Dedicated support",
        "Unlimited data retention",
        "Custom reporting",
        "SLA guarantee"
      ],
      popular: false
    }
  ];

  // Анимация счетчиков
  useEffect(() => {
    const targetValues = {
      users: 12543,
      sites: 89231,
      uptime: 99.9,
      checks: 1234567
    };

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const timer = setInterval(() => {
      setAnimatedCounters(prev => ({
        users: Math.min(prev.users + Math.ceil(targetValues.users / steps), targetValues.users),
        sites: Math.min(prev.sites + Math.ceil(targetValues.sites / steps), targetValues.sites),
        uptime: Math.min(prev.uptime + (targetValues.uptime / steps), targetValues.uptime),
        checks: Math.min(prev.checks + Math.ceil(targetValues.checks / steps), targetValues.checks)
      }));
    }, interval);

    setTimeout(() => clearInterval(timer), duration);

    return () => clearInterval(timer);
  }, []);

  // Автоматическая смена отзывов
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  SiteGuard Pro+
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Автоматизированная платформа мониторинга с AI-помощником для современных DevOps команд
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 animate-fade-in-up animation-delay-300">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Начать бесплатно
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/demo"
                className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border border-gray-200"
              >
                Смотреть демо
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a1.5 1.5 0 001.5-1.5V9a1.5 1.5 0 00-1.5-1.5H9m0 0V9a1.5 1.5 0 011.5-1.5H12m-3 4.5V12a1.5 1.5 0 013 0v1.5M9 16.5h.01" />
                </svg>
              </Link>
            </div>

            {/* Stats Counter */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center animate-fade-in-up animation-delay-600">
              <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-blue-600">{animatedCounters.users.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Happy Users</div>
              </div>
              <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-green-600">{animatedCounters.sites.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Sites Monitored</div>
              </div>
              <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-purple-600">{animatedCounters.uptime.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
              <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-orange-600">{animatedCounters.checks.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Checks Today</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Мощные возможности</h2>
            <p className="text-xl text-gray-600">Все, что нужно для профессионального мониторинга</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center text-white text-2xl mb-4 group-hover:rotate-6 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Профессиональная аналитика</h2>
            <p className="text-xl text-gray-600">Получайте детальные инсайты о производительности</p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl transform rotate-3 opacity-20"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/16053029/pexels-photo-16053029.jpeg"
                alt="Dashboard Analytics"
                className="w-full h-96 object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Real-time Analytics</h3>
                <p className="text-lg opacity-90">Мониторинг в реальном времени с детальной аналитикой</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Что говорят наши пользователи</h2>
            <p className="text-xl text-gray-600">Присоединяйтесь к тысячам довольных клиентов</p>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white text-center">
              <div className="flex justify-center mb-6">
                <img 
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full border-4 border-white"
                />
              </div>
              <blockquote className="text-xl mb-6 italic">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              <div className="font-semibold">{testimonials[currentTestimonial].name}</div>
              <div className="opacity-90">{testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}</div>
            </div>

            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Выберите свой план</h2>
            <p className="text-xl text-gray-600">Начните бесплатно, растите вместе с нами</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index}
                className={`relative p-8 rounded-3xl shadow-lg transition-all duration-300 hover:scale-105 ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white' 
                    : 'bg-white text-gray-900'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-2">{plan.price}</div>
                  <p className={`mb-8 ${plan.popular ? 'text-blue-100' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <button className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-white text-blue-600 hover:bg-gray-100' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}>
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creator Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">О создателе</h2>
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-xl">
              <span className="text-4xl font-bold text-white">Z</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">@Ziqwl</h3>
            <p className="text-lg text-gray-600 mb-6">Создатель SiteGuard Pro+</p>
            <div className="flex space-x-6">
              <a 
                href="mailto:ziqwl.0@gmail.com" 
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819l6.545 4.91 6.545-4.91h3.819c.904 0 1.636.732 1.636 1.636z"/>
                </svg>
                <span>ziqwl.0@gmail.com</span>
              </a>
              <a 
                href="https://t.me/Ziqwl0" 
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                <span>@Ziqwl0</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Готовы начать мониторинг?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Присоединяйтесь к тысячам пользователей, которые доверяют SiteGuard Pro+
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Начать бесплатно
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
};

export default EnhancedLanding;