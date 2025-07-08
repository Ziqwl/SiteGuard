from flask import Flask, request, jsonify
from flask_cors import CORS
import requests, os, ssl, socket, logging
from dotenv import load_dotenv
from psycopg2 import connect, sql
from datetime import datetime
from urllib.parse import urlparse

# Настройка логов
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()

# Загрузка .env
load_dotenv()

# Инициализация Flask + CORS
app = Flask(__name__)
CORS(app)

# Переменные из .env
DB_PARAMS = {
    'dbname': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST', 'localhost')
}
TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
CHAT_ID = os.getenv('TELEGRAM_CHAT_ID')

# Подключение к БД
conn = connect(**DB_PARAMS)
cur = conn.cursor()
# Создание таблицы
cur.execute("""
CREATE TABLE IF NOT EXISTS sites (
  id SERIAL PRIMARY KEY,
  url TEXT UNIQUE,
  status TEXT,
  latency REAL,
  ssl_valid BOOLEAN,
  ssl_expiry DATE
)
""")
conn.commit()

# Отправка в Telegram
def send_tg(msg):
    url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
    try:
        r = requests.post(url, json={'chat_id': CHAT_ID, 'text': msg}, timeout=5)
        r.raise_for_status()
    except Exception as e:
        logger.error(f"Telegram error: {e}")

@app.route('/add-site', methods=['POST'])
def add_site():
    data = request.get_json()
    url = data.get('url','').strip()
    if not url: return jsonify({'error':'URL required'}),400
    try:
        cur.execute("INSERT INTO sites(url,status,latency,ssl_valid,ssl_expiry) VALUES(%s,'UNKNOWN',0,False,NULL) ON CONFLICT DO NOTHING",(url,))
        conn.commit()
        return jsonify({'message':'added'}),200
    except Exception as e:
        conn.rollback()
        return jsonify({'error':str(e)}),500

@app.route('/check-sites', methods=['GET'])
def check_sites():
    cur.execute("SELECT id,url FROM sites")
    rows = cur.fetchall()
    res=[]
    for id,url in rows:
        status='DOWN';latency=0;ssl_valid=False;ssl_expiry=None
        try:
            start=datetime.now(); r=requests.get(url,timeout=5);
            latency=(datetime.now()-start).total_seconds(); status='UP' if r.status_code==200 else 'DOWN'
            if url.startswith('https://'):
                dom=urlparse(url).netloc
                ctx=ssl.create_default_context()
                with socket.create_connection((dom,443),timeout=5) as s:
                    with ctx.wrap_socket(s,server_hostname=dom) as ss:
                        cert=ss.getpeercert()
                        ssl_valid=True
                        ssl_expiry=datetime.strptime(cert['notAfter'],'%b %d %H:%M:%S %Y %Z').date()
        except Exception as e:
            logger.info(f"Error {url}: {e}")
        # Обновляем БД
        cur.execute(
            "UPDATE sites SET status=%s,latency=%s,ssl_valid=%s,ssl_expiry=%s WHERE id=%s",
            (status,latency,ssl_valid,ssl_expiry,id)
        )
        conn.commit()
        if status=='DOWN': send_tg(f"⚠️ {url} is DOWN")
        res.append({'url':url,'status':status,'latency':latency,'ssl_valid':ssl_valid,'ssl_expiry':str(ssl_expiry)})
    return jsonify(res)

if __name__=='__main__':
    app.run(host='0.0.0.0',port=5001)
