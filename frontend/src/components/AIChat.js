import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AIChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Привет! Я AI-помощник SiteGuard Pro+. Могу помочь с настройкой мониторинга, конфигурацией и решением проблем. Какой у вас вопрос?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Здесь будет интеграция с локальным LM Studio
      // Пока используем моковый ответ
      const response = await mockAIResponse(inputMessage);
      
      const aiMessage = {
        id: messages.length + 2,
        text: response,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: 'Извините, произошла ошибка при обработке вашего запроса. Попробуйте еще раз.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const mockAIResponse = async (message) => {
    // Моковые ответы для демонстрации
    const responses = {
      'мониторинг': 'Для настройки мониторинга сайта:\n\n1. Добавьте URL вашего сайта в дашборде\n2. Настройте интервалы проверки\n3. Выберите уведомления (email, Telegram)\n4. Задайте пороговые значения для времени ответа\n\nНужна помощь с конкретным шагом?',
      'ssl': 'Для мониторинга SSL-сертификатов:\n\n- Автоматически проверяем истечение сертификатов\n- Отправляем уведомления за 30, 7 и 1 день до истечения\n- Показываем детали сертификата в дашборде\n\nХотите настроить дополнительные уведомления?',
      'api': 'Документация API SiteGuard Pro+:\n\n**Основные эндпоинты:**\n- GET /api/sites - получить список сайтов\n- POST /api/add-site - добавить сайт\n- POST /api/check-sites - запустить проверку\n- GET /api/stats/{site_id} - статистика сайта\n\n**Аутентификация:** Bearer Token\n\nНужен пример запроса?',
      'webhook': 'Настройка webhooks для уведомлений:\n\n```json\n{\n  "url": "https://your-webhook-url.com",\n  "events": ["site_down", "site_up", "ssl_expiry"],\n  "headers": {\n    "Authorization": "Bearer your-token"\n  }\n}\n```\n\nПоддерживаемые события: site_down, site_up, ssl_expiry, high_response_time'
    };

    // Простой поиск по ключевым словам
    const lowerMessage = message.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }

    return 'Я могу помочь с:\n\n• Настройкой мониторинга сайтов\n• Конфигурацией SSL-проверок\n• Работой с API\n• Настройкой webhooks\n• Устранением неполадок\n\nЗадайте более конкретный вопрос, и я постараюсь помочь!';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md h-96 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">AI-помощник</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p className="text-xs opacity-75 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 max-w-xs px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">Печатаю...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Задайте вопрос..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;