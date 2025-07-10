const API = process.env.REACT_APP_API_URL || 'http://localhost:5001';
export async function fetchSites() { return fetch(`${API}/sites`).then(r=>r.json()); }
export async function addSite(data) { return fetch(`${API}/sites`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)}); }
// ...updateSite, fetchChecks
