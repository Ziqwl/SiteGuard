import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({
    email: true,
    telegram: false,
    slack: false,
    discord: false,
    webhooks: []
  });
  const [newWebhook, setNewWebhook] = useState({ url: '', name: '' });
  const [telegramBot, setTelegramBot] = useState({ token: '', chatId: '' });

  useEffect(() => {
    fetchNotifications();
    fetchSettings();
  }, []);

  const fetchNotifications = async () => {
    // Мокаем уведомления
    const mockNotifications = [
      {
        id: 1,
        type: 'error',
        title: 'Site Down Alert',
        message: 'example.com is not responding',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        severity: 'high'
      },
      {
        id: 2,
        type: 'warning',
        title: 'SSL Certificate Expiry',
        message: 'SSL certificate for test.com expires in 7 days',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false,
        severity: 'medium'
      },
      {
        id: 3,
        type: 'info',
        title: 'Performance Alert',
        message: 'Response time increased to 2.5s for demo.com',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        read: true,
        severity: 'low'
      },
      {
        id: 4,
        type: 'success',
        title: 'Site Restored',
        message: 'shop.com is back online',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
        severity: 'info'
      }
    ];
    setNotifications(mockNotifications);
  };

  const fetchSettings = async () => {
    // Мокаем настройки
    const mockSettings = {
      email: true,
      telegram: false,
      slack: false,
      discord: false,
      webhooks: [
        { id: 1, name: 'Production Alerts', url: 'https://hooks.slack.com/services/...', active: true },
        { id: 2, name: 'Development', url: 'https://discord.com/api/webhooks/...', active: false }
      ]
    };
    setSettings(mockSettings);
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'error':
        return (
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        );
      case 'info':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'success':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const addWebhook = () => {
    if (newWebhook.url && newWebhook.name) {
      const webhook = {
        id: Date.now(),
        name: newWebhook.name,
        url: newWebhook.url,
        active: true
      };
      setSettings(prev => ({
        ...prev,
        webhooks: [...prev.webhooks, webhook]
      }));
      setNewWebhook({ url: '', name: '' });
    }
  };

  const toggleWebhook = (id) => {
    setSettings(prev => ({
      ...prev,
      webhooks: prev.webhooks.map(webhook =>
        webhook.id === id ? { ...webhook, active: !webhook.active } : webhook
      )
    }));
  };

  const setupTelegramBot = async () => {
    // Здесь будет интеграция с Telegram Bot API
    console.log('Setting up Telegram bot:', telegramBot);
    setSettings(prev => ({ ...prev, telegram: true }));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Notification Center
          </h1>
          <p className="text-gray-600 mt-2">Manage your alerts and integrations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Notifications List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Recent Notifications
                    {unreadCount > 0 && (
                      <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </h2>
                  <button
                    onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Mark all as read
                  </button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className={`text-sm font-medium ${
                              !notification.read ? 'text-gray-900' : 'text-gray-600'
                            }`}>
                              {notification.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(notification.timestamp)}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <p className={`text-sm mt-1 ${
                            !notification.read ? 'text-gray-700' : 'text-gray-500'
                          }`}>
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          <div className="space-y-6">
            {/* Notification Channels */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Channels</h3>
              
              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">Email</span>
                  </div>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, email: !prev.email }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.email ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.email ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Telegram */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                    <span className="text-sm font-medium text-gray-900">Telegram</span>
                  </div>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, telegram: !prev.telegram }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.telegram ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.telegram ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Slack */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52-2.523A2.528 2.528 0 0 1 5.042 10.12h2.52v2.523a2.528 2.528 0 0 1-2.52 2.522zm1.271-6.744a2.528 2.528 0 0 1 2.52-2.52 2.528 2.528 0 0 1 2.523 2.52v6.305a2.528 2.528 0 0 1-2.523 2.523 2.528 2.528 0 0 1-2.52-2.523V8.421z"/>
                      <path d="M8.833 5.042a2.528 2.528 0 0 1-2.52-2.52A2.528 2.528 0 0 1 8.833 0a2.528 2.528 0 0 1 2.52 2.522v2.52H8.833zm6.594 1.271a2.528 2.528 0 0 1 2.523-2.52 2.528 2.528 0 0 1 2.52 2.52 2.528 2.528 0 0 1-2.52 2.523h-6.306a2.528 2.528 0 0 1-2.523-2.523 2.528 2.528 0 0 1 2.523-2.52h6.306z"/>
                      <path d="M18.958 8.833a2.528 2.528 0 0 1 2.523 2.52 2.528 2.528 0 0 1-2.523 2.52h-2.52v-2.52a2.528 2.528 0 0 1 2.52-2.52zm-1.271 6.744a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.523-2.523v-6.305a2.528 2.528 0 0 1 2.523-2.523 2.528 2.528 0 0 1 2.52 2.523v6.305z"/>
                      <path d="M15.167 18.958a2.528 2.528 0 0 1 2.523 2.523 2.528 2.528 0 0 1-2.523 2.52 2.528 2.528 0 0 1-2.52-2.52v-2.523h2.52zm-6.594-1.271a2.528 2.528 0 0 1-2.523 2.523 2.528 2.528 0 0 1-2.52-2.523 2.528 2.528 0 0 1 2.52-2.52h6.306a2.528 2.528 0 0 1 2.523 2.52 2.528 2.528 0 0 1-2.523 2.523H8.573z"/>
                    </svg>
                    <span className="text-sm font-medium text-gray-900">Slack</span>
                  </div>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, slack: !prev.slack }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.slack ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.slack ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Webhook Configuration */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Webhooks</h3>
              
              <div className="space-y-4">
                {settings.webhooks.map((webhook) => (
                  <div key={webhook.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{webhook.name}</h4>
                      <p className="text-xs text-gray-500 truncate">{webhook.url}</p>
                    </div>
                    <button
                      onClick={() => toggleWebhook(webhook.id)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        webhook.active ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        webhook.active ? 'translate-x-5' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                ))}
                
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Webhook name"
                    value={newWebhook.name}
                    onChange={(e) => setNewWebhook(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="url"
                    placeholder="Webhook URL"
                    value={newWebhook.url}
                    onChange={(e) => setNewWebhook(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={addWebhook}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Webhook
                  </button>
                </div>
              </div>
            </div>

            {/* Telegram Bot Setup */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Telegram Bot Setup</h3>
              
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Bot Token"
                  value={telegramBot.token}
                  onChange={(e) => setTelegramBot(prev => ({ ...prev, token: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Chat ID"
                  value={telegramBot.chatId}
                  onChange={(e) => setTelegramBot(prev => ({ ...prev, chatId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={setupTelegramBot}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Setup Bot
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;