import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function App() {
  const [configOpen, setConfigOpen] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [settings, setSettings] = useState({ lat: null, lon: null, mag_dec: null, api_key: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (configOpen) {
      fetch('/api/settings')
        .then(r => r.json())
        .then(data => {
          if (data) setSettings(data);
        })
        .catch(e => console.error("Error loading settings:", e));
    }
  }, [configOpen]);

  const saveSettings = async (newData) => {
    setSettings(newData);
    await fetch('/api/settings', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newData)
    });
  };

  const handleCitySearch = async () => {
    if (!citySearch) return;
    setLoading(true);
    try {
        const res = await fetch('/api/location/search', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({city_name: citySearch})
        });
        if (res.ok) {
            const data = await res.json();
            const newSettings = {...settings, lat: data.lat, lon: data.lon, mag_dec: data.mag_dec};
            await saveSettings(newSettings);
        } else {
            alert('Cidade não encontrada.');
        }
    } catch (e) {
        console.error(e);
    }
    setLoading(false);
  };

  const handleClear = async () => {
     const empty = { lat: null, lon: null, mag_dec: null, api_key: '' };
     await saveSettings(empty);
     setCitySearch('');
  };

  return (
    <div className="app-container">
      <header className="glass-header">
        <div className="logo-container">
          <h1>VLTTECH</h1>
          <span className="subtitle">OBSERVATORY CONTROL</span>
        </div>
        <button className="glass-btn btn-primary" onClick={() => setConfigOpen(true)}>
          Settings
        </button>
      </header>

      <main className="main-content">
        {/* Section 1: Target Search */}
        <section className="glass-panel target-section">
          <h2>Celestial Target</h2>
          <div className="input-group">
            <input type="text" placeholder="e.g., M42, Orion Nebula" />
            <button className="glass-btn">Calculate RA/Dec</button>
          </div>
          <div className="results">
            <div className="stat-box">
              <span>RA</span>
              <strong>--h --m --s</strong>
            </div>
            <div className="stat-box">
              <span>DEC</span>
              <strong>--° --' --"</strong>
            </div>
          </div>
        </section>

        {/* Section 2: Dual Cameras */}
        <section className="camera-grid">
          <div className="glass-panel camera-window">
            <div className="camera-header">
              <h3>DSLR Primary</h3>
              <span className="badge offline">No Device</span>
            </div>
            <div className="camera-feed dslr-feed">
              <div className="placeholder-overlay">
                <p>Waiting for capture...</p>
              </div>
            </div>
          </div>

          <div className="glass-panel camera-window">
            <div className="camera-header">
              <h3>Live Guiding</h3>
              <span className="badge offline">No Device</span>
            </div>
            <div className="camera-feed live-feed">
               <div className="placeholder-overlay">
                <p>Stream offline</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Capture Controls */}
        <section className="glass-panel control-section">
          <h2>Sequence Setup</h2>
          <div className="control-grid">
            <div className="flex-col">
              <label>Exposure (s)</label>
              <input type="number" defaultValue={30} />
            </div>
            <div className="flex-col">
              <label>Photos (#)</label>
              <input type="number" defaultValue={10} />
            </div>
            <div className="flex-col">
              <label>ISO</label>
              <select defaultValue="800">
                <option value="400">400</option>
                <option value="800">800</option>
                <option value="1600">1600</option>
                <option value="3200">3200</option>
              </select>
            </div>
            <div className="flex-col">
              <label>Delay (s)</label>
              <input type="number" defaultValue={2} />
            </div>
            <div className="flex-col">
              <label>Session Name</label>
              <input type="text" placeholder="Orion_Run_1" />
            </div>
          </div>
          
          <div className="action-buttons">
            <button className="glass-btn btn-success focus-glow">RUN SESSION</button>
            <button className="glass-btn btn-warning focus-glow">1-SHOT PLATE SOLVE</button>
          </div>
        </section>
      </main>

      {/* Settings Modal */}
      {configOpen && (
        <div className="modal-overlay">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel modal-content"
          >
            <h2>System Configuration</h2>
            
            <div className="input-group" style={{ alignItems: 'flex-end', flexDirection: 'row' }}>
              <div className="flex-col" style={{flex: 1}}>
                 <label>Location (City Search)</label>
                 <input type="text" value={citySearch} onChange={e => setCitySearch(e.target.value)} placeholder="Type city name..." />
              </div>
              <button className="glass-btn" onClick={handleCitySearch} disabled={loading}>
                 {loading ? "..." : "Search"}
              </button>
            </div>
            
            {settings.lat !== null && (
                <div style={{fontSize: '0.85rem', color: '#00f2fe', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(0, 242, 254, 0.2)'}}>
                  📍 <strong>Lat:</strong> {settings.lat} | <strong>Lon:</strong> {settings.lon} | <strong>Mag Dec:</strong> {settings.mag_dec}°
                </div>
            )}

            <div className="input-group flex-col">
              <label>Astrometry API Key</label>
              <input type="password" 
                     value={settings.api_key || ''} 
                     onChange={e => setSettings(s => ({...s, api_key: e.target.value}))} 
                     onBlur={() => saveSettings(settings)}
                     placeholder="Your nova.astrometry.net Key..." />
              {settings.api_key && <small style={{color: '#86efac', marginTop: '4px'}}>✓ API Key está cadastrada no sistema.</small>}
            </div>

            <div style={{display: 'flex', gap: '10px', marginTop: '16px'}}>
                <button className="glass-btn btn-primary" style={{flex: 1}} onClick={() => setConfigOpen(false)}>Close & Save</button>
                <button className="glass-btn" style={{backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)'}} onClick={handleClear}>Limpar Dados</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default App;
