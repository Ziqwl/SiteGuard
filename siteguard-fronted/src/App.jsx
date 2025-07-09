import React, { useState, useEffect } from 'react';

export default function App() {
  const [url, setUrl] = useState('');
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const API = 'http://localhost:5001';

  useEffect(() => {
    fetchSites();
  }, []);

  async function fetchSites() {
    setLoading(true);
    const resp = await fetch(`${API}/check-sites`);
    const data = await resp.json();
    setSites(data);
    setLoading(false);
  }

  async function addSite() {
    if (!url) return;
    setLoading(true);
    await fetch(`${API}/add-site`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    setUrl('');
    fetchSites();
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl mb-4 font-bold">SiteGuard</h1>
      <div className="flex gap-2 mb-4">
        <input
          className="border flex-1 p-2"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="Введите URL"
        />
        <button
          className="bg-blue-600 text-white px-4"
          onClick={addSite}
        >
          Добавить
        </button>
      </div>
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        sites.map((s, idx) => (
          <div key={idx} className="border p-2 mb-2 rounded">
            <p><b>{s.url}</b> — {s.status}</p>
            <p>Latency: {s.latency}s | SSL: {s.ssl_valid ? 'OK' : 'NO'}</p>
          </div>
        ))
      )}
    </div>
  );
}
