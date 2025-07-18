import React from 'react';

const Documentation = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Документация SiteGuard Pro+</h1>

          {/* Quick Start */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">🚀 Быстрый старт</h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Начать за 2 минуты</h3>
              <ol className="space-y-2 text-blue-800">
                <li>1. Зарегистрируйтесь в системе</li>
                <li>2. Добавьте ваш первый сайт</li>
                <li>3. Настройте уведомления</li>
                <li>4. Запустите мониторинг</li>
              </ol>
            </div>
          </section>

          {/* Site Monitoring */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">🔍 Мониторинг сайтов</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Добавление сайта</h3>
                <p className="text-gray-700 mb-4">
                  Для начала мониторинга добавьте URL вашего сайта в дашборде:
                </p>
                <div className="bg-white rounded border p-4">
                  <code className="text-sm text-gray-800">
                    1. Перейдите в "Дашборд"<br/>
                    2. Нажмите "Добавить сайт"<br/>
                    3. Введите название и URL<br/>
                    4. Нажмите "Сохранить"
                  </code>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Автоматические проверки</h3>
                <p className="text-gray-700 mb-4">
                  Система автоматически проверяет ваши сайты каждые 5 минут:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>HTTP/HTTPS статус коды</li>
                  <li>Время ответа сервера</li>
                  <li>SSL-сертификаты</li>
                  <li>Доступность DNS</li>
                </ul>
              </div>
            </div>
          </section>

          {/* API Documentation */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">🔌 API Documentation</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Аутентификация</h3>
                <p className="text-gray-700 mb-4">
                  Все API-запросы требуют авторизации через Bearer Token:
                </p>
                <div className="bg-gray-900 rounded p-4">
                  <code className="text-green-400 text-sm">
                    curl -H "Authorization: Bearer YOUR_TOKEN" \<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;https://api.siteguard.pro/api/sites
                  </code>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Основные эндпоинты</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-gray-900">GET /api/sites</h4>
                    <p className="text-gray-700">Получить список всех сайтов</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-gray-900">POST /api/add-site</h4>
                    <p className="text-gray-700">Добавить новый сайт для мониторинга</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold text-gray-900">POST /api/check-sites</h4>
                    <p className="text-gray-700">Запустить проверку всех сайтов</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-semibold text-gray-900">GET /api/stats/{'{site_id}'}</h4>
                    <p className="text-gray-700">Получить статистику конкретного сайта</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* AI Chat */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">🤖 AI-помощник</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Возможности AI-чата</h3>
              <p className="text-gray-700 mb-4">
                Наш AI-помощник может помочь с:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Настройкой мониторинга сайтов</li>
                <li>Генерацией конфигураций</li>
                <li>Решением проблем с доступностью</li>
                <li>Оптимизацией настроек</li>
                <li>Объяснением метрик и статистики</li>
              </ul>
            </div>
          </section>

          {/* Troubleshooting */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">🔧 Устранение неполадок</h2>
            
            <div className="space-y-6">
              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3">Сайт показывает статус "Offline"</h3>
                <ul className="list-disc list-inside text-yellow-800 space-y-2">
                  <li>Проверьте доступность сайта из браузера</li>
                  <li>Убедитесь, что URL указан правильно</li>
                  <li>Проверьте настройки firewall</li>
                  <li>Обратитесь к AI-помощнику за диагностикой</li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-3">Проблемы с SSL-сертификатом</h3>
                <ul className="list-disc list-inside text-red-800 space-y-2">
                  <li>Проверьте дату истечения сертификата</li>
                  <li>Убедитесь в правильности доменного имени</li>
                  <li>Проверьте цепочку сертификатов</li>
                  <li>Обновите сертификат у вашего провайдера</li>
                </ul>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">❓ Часто задаваемые вопросы</h2>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Как часто проверяются сайты?</h3>
                <p className="text-gray-700">
                  По умолчанию проверки выполняются каждые 5 минут. В Pro-версии можно настроить интервал до 1 минуты.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Сколько сайтов можно мониторить?</h3>
                <p className="text-gray-700">
                  Бесплатная версия: до 5 сайтов. Pro: до 50 сайтов. Enterprise: без ограничений.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Как настроить уведомления?</h3>
                <p className="text-gray-700">
                  Перейдите в настройки профиля и добавьте email, Telegram или Slack webhook для получения уведомлений.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">📞 Поддержка</h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="text-blue-900 mb-4">
                Нужна помощь? Свяжитесь с создателем:
              </p>
              <div className="flex space-x-6">
                <a href="mailto:ziqwl.0@gmail.com" className="text-blue-600 hover:text-blue-800">
                  📧 ziqwl.0@gmail.com
                </a>
                <a href="https://t.me/Ziqwl0" className="text-blue-600 hover:text-blue-800">
                  📱 @Ziqwl0
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Documentation;