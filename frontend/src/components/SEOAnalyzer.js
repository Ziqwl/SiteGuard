import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SEOAnalyzer = () => {
  const [selectedSite, setSelectedSite] = useState('');
  const [seoData, setSeoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sites, setSites] = useState([]);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/sites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSites(response.data);
    } catch (error) {
      console.error('Error fetching sites:', error);
    }
  };

  const analyzeSEO = async (siteUrl) => {
    setLoading(true);
    
    // Мокаем SEO анализ
    const mockSEOData = {
      url: siteUrl,
      score: 78,
      title: {
        content: "Example Website - Your Best Solution",
        length: 37,
        status: "good"
      },
      description: {
        content: "This is a great example website that provides excellent solutions for your business needs.",
        length: 98,
        status: "good"
      },
      keywords: ["example", "website", "solutions", "business"],
      headings: {
        h1: 1,
        h2: 4,
        h3: 8,
        h4: 2,
        status: "good"
      },
      images: {
        total: 12,
        withAlt: 8,
        withoutAlt: 4,
        status: "warning"
      },
      links: {
        internal: 24,
        external: 6,
        broken: 1,
        status: "warning"
      },
      performance: {
        loadTime: 2.3,
        pageSize: 1.2,
        requests: 45,
        status: "good"
      },
      technical: {
        https: true,
        mobile: true,
        sitemap: true,
        robots: true,
        structured: false,
        status: "good"
      },
      recommendations: [
        {
          category: "Images",
          issue: "4 images missing alt text",
          priority: "high",
          fix: "Add descriptive alt text to all images for better accessibility and SEO"
        },
        {
          category: "Links",
          issue: "1 broken link found",
          priority: "high",
          fix: "Fix or remove broken links to improve user experience and SEO"
        },
        {
          category: "Technical",
          issue: "Missing structured data",
          priority: "medium",
          fix: "Add JSON-LD structured data to help search engines understand your content"
        },
        {
          category: "Performance",
          issue: "Page load time could be improved",
          priority: "medium",
          fix: "Optimize images and reduce HTTP requests to improve load times"
        }
      ]
    };

    // Имитируем задержку анализа
    setTimeout(() => {
      setSeoData(mockSEOData);
      setLoading(false);
    }, 2000);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SEO Analyzer
          </h1>
          <p className="text-gray-600 mt-2">Comprehensive SEO analysis and optimization recommendations</p>
        </div>

        {/* Site Selection */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Site to Analyze</h2>
          <div className="flex space-x-4">
            <select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a site...</option>
              {sites.map((site) => (
                <option key={site.id} value={site.url}>
                  {site.name} ({site.url})
                </option>
              ))}
            </select>
            <button
              onClick={() => analyzeSEO(selectedSite)}
              disabled={!selectedSite || loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Analyze SEO'}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing SEO metrics...</p>
          </div>
        )}

        {/* SEO Results */}
        {seoData && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Overall Score */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">SEO Score</h2>
                  <p className="text-gray-600">{seoData.url}</p>
                </div>
                <div className="text-center">
                  <div className={`text-6xl font-bold ${getScoreColor(seoData.score)}`}>
                    {seoData.score}
                  </div>
                  <div className="text-sm text-gray-600">out of 100</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${getScoreBackground(seoData.score)}`}
                  style={{ width: `${seoData.score}%` }}
                ></div>
              </div>
            </div>

            {/* Meta Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Meta Information</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Title Tag</span>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(seoData.title.status)}`}>
                        {seoData.title.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{seoData.title.content}</p>
                    <p className="text-xs text-gray-500">Length: {seoData.title.length} characters</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Meta Description</span>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(seoData.description.status)}`}>
                        {seoData.description.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{seoData.description.content}</p>
                    <p className="text-xs text-gray-500">Length: {seoData.description.length} characters</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700">Keywords</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {seoData.keywords.map((keyword, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Analysis</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Headings</span>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(seoData.headings.status)}`}>
                        {seoData.headings.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{seoData.headings.h1}</div>
                        <div className="text-gray-600">H1</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{seoData.headings.h2}</div>
                        <div className="text-gray-600">H2</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{seoData.headings.h3}</div>
                        <div className="text-gray-600">H3</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{seoData.headings.h4}</div>
                        <div className="text-gray-600">H4</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Images</span>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(seoData.images.status)}`}>
                        {seoData.images.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{seoData.images.total}</div>
                        <div className="text-gray-600">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-green-600">{seoData.images.withAlt}</div>
                        <div className="text-gray-600">With Alt</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-red-600">{seoData.images.withoutAlt}</div>
                        <div className="text-gray-600">Without Alt</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical SEO */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical SEO</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700">Security & Protocol</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">HTTPS</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      seoData.technical.https ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {seoData.technical.https ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Mobile Friendly</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      seoData.technical.mobile ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {seoData.technical.mobile ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700">Search Engine Files</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sitemap</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      seoData.technical.sitemap ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {seoData.technical.sitemap ? 'Found' : 'Missing'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Robots.txt</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      seoData.technical.robots ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {seoData.technical.robots ? 'Found' : 'Missing'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700">Structured Data</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Schema Markup</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      seoData.technical.structured ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {seoData.technical.structured ? 'Found' : 'Missing'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{seoData.performance.loadTime}s</div>
                  <div className="text-sm text-gray-600">Load Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{seoData.performance.pageSize}MB</div>
                  <div className="text-sm text-gray-600">Page Size</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{seoData.performance.requests}</div>
                  <div className="text-sm text-gray-600">HTTP Requests</div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
              <div className="space-y-4">
                {seoData.recommendations.map((rec, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-900">{rec.category}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {rec.priority} priority
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{rec.issue}</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <strong>Fix:</strong> {rec.fix}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SEOAnalyzer;