import React, { useState, useEffect } from 'react';

export default function App() {
  const [url, setUrl] = useState('');
  const [sites, setSites] = useState([]);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    fetchSites();
  }, []);

  async function fetchSites() {
    setLoad(true);
    let j = await fetch('http://localhost:5001/check-sites').then(r => r.json());
    setSites(j);
    setLoad(false);
  }

  async function addSite() {
    if (!url) return;
    setLoad(true);
    await fetch('http://localhost:5001/add-site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    setUrl('');
    fetchSites();
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl mb-2">SiteGuard</h1>
      <div className="flex gap-2 mb-4">
        <input
          className="border flex-1 p-2"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="URL"
        />
        <button className="bg-blue-600 text-white px-4" onClick={addSite}>
          Add
        </button>
      </div>
      {load ? (
        <p>Loading...</p>
      ) : (
        sites.map((s, i) => (
          <div key={i} className="border p-2 mb-2">
            <p>
              <b>{s.url}</b> - {s.status}
            </p>
            <p>
              Latency: {s.latency}s SSL: {s.ssl_valid ? 'OK' : 'NO'}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

