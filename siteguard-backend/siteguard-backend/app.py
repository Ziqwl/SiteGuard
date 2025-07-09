from flask import Flask, request, jsonify
from flask_cors import CORS
import requests, os, ssl, socket, logging
from dotenv import load_dotenv
import psycopg2
from datetime import datetime
from urllib.parse import urlparse

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Загрузка переменных окружения
load_dotenv()

# Инициализация Flask и CORS
app = Flask(__name__)
CORS(app)

# Конфигурация БД и Telegram из .env
DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST', 'localhost')
BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
CHAT_ID = os.getenv('TELEGRAM_CHAT_ID')

# Подключение к базе данных
conn = psycopg2.connect(
    dbname=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST
)
cur = conn.cursor()
# Создание таблицы при первом запуске
cur.execute(
    """
    CREATE TABLE IF NOT EXISTS sites (
        id SERIAL PRIMARY KEY,
        url TEXT UNIQUE,
        status TEXT DEFAULT 'UNKNOWN',
        latency REAL DEFAULT 0,
        ssl_valid BOOLEAN DEFAULT FALSE,
        ssl_expiry DATE
    )
    """
)
conn.commit()

# Функция отправки уведомлений в Telegram
def send_tg(msg: str):
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    try:
        r = requests.post(url, json={'chat_id': CHAT_ID, 'text': msg}, timeout=5)
        r.raise_for_status()
    except Exception as e:
        logger.error(f"Telegram send error: {e}")

# Эндпоинт добавления сайта
@app.route('/add-site', methods=['POST'])
def add_site():
    data = request.get_json(force=True)
    url = data.get('url', '').strip()
    if not url:
        return jsonify({'error': 'URL is required'}), 400
    try:
        cur.execute(
            "INSERT INTO sites(url) VALUES(%s) ON CONFLICT DO NOTHING", (url,)
        )
        conn.commit()
        return jsonify({'message': 'Site added'}), 200
    except Exception as e:
        conn.rollback()
        logger.error(f"Add site error: {e}")
        return jsonify({'error': 'Failed to add site'}), 500

# Эндпоинт проверки
@app.route('/check-sites', methods=['GET'])
def check_sites():
    cur.execute("SELECT id, url FROM sites")
    rows = cur.fetchall()
    results = []
    for sid, url in rows:
        status = 'DOWN'; latency = 0; ssl_valid = False; ssl_expiry = None
        try:
            start = datetime.now()
            resp = requests.get(url, timeout=10)
            latency = (datetime.now() - start).total_seconds()
            status = 'UP' if resp.status_code == 200 else 'DOWN'
            if url.startswith('https://'):
                dom = urlparse(url).netloc
                ctx = ssl.create_default_context()
                with socket.create_connection((dom, 443), timeout=10) as sock:
                    with ctx.wrap_socket(sock, server_hostname=dom) as ssock:
                        cert = ssock.getpeercert()
                        ssl_valid = True
                        ssl_expiry = datetime.strptime(cert['notAfter'], '%b %d %H:%M:%S %Y %Z').date()
        except Exception as e:
            logger.error(f"Check error {url}: {e}")
        # Обновление записи
        cur.execute(
            "UPDATE sites SET status=%s, latency=%s, ssl_valid=%s, ssl_expiry=%s WHERE id=%s",
            (status, latency, ssl_valid, ssl_expiry, sid)
        )
        conn.commit()
        if status == 'DOWN':
            send_tg(f"⚠️ Site DOWN: {url}")
        results.append({
            'url': url,
            'status': status,
            'latency': latency,
            'ssl_valid': ssl_valid,
            'ssl_expiry': ssl_expiry.isoformat() if ssl_expiry else None
        })
    return jsonify(results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
