import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function App() {
  const [configOpen, setConfigOpen] = useState(false);
  const [settings, setSettings] = useState({ lat: -21.7878, lon: -46.5614, mag_dec: -22.0, api_key: '' });

  const [targetName, setTargetName] = useState('');
  const [targetData, setTargetData] = useState(null);
  const [targetLoading, setTargetLoading] = useState(false);

  // Carrega as configuracoes (API Key) do backend assim que abrir a pagina
  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data && data.api_key !== undefined) {
          setSettings(s => ({...s, ...data}));
        }
      })
      .catch(e => console.error("Error loading settings:", e));
  }, []);

  const saveSettings = async (newData) => {
    setSettings(newData);
    await fetch('/api/settings', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newData)
    });
  };

  const handleTargetCalculate = async () => {
    if (!targetName) return;
    setTargetLoading(true);
    try {
        const res = await fetch('/api/target/calculate', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                target_name: targetName,
                lat: settings.lat,
                lon: settings.lon
            })
        });
        if (res.ok) {
            const data = await res.json();
            setTargetData(data);
        } else {
            alert('Alvo sideral não foi encontrado na base do Simbad. Digite nome reconhecido (ex: M42).');
        }
    } catch(e) {
        console.error(e);
    }
    setTargetLoading(false);
  };

  const handleClear = async () => {
     const empty = { lat: -21.7878, lon: -46.5614, mag_dec: -22.0, api_key: '' };
     await saveSettings(empty);
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
            <input type="text" value={targetName} onChange={e => setTargetName(e.target.value)} placeholder="e.g., M42, Orion Nebula" />
            <button className="glass-btn" onClick={handleTargetCalculate} disabled={targetLoading}>
                {targetLoading ? "Calculating..." : "Calculate RA/Dec"}
            </button>
          </div>
          <div className="results">
            <div className="stat-box">
              <span>RA J2000</span>
              <strong>{targetData ? targetData.ra_str : "--h --m --s"}</strong>
            </div>
            <div className="stat-box">
              <span>DEC J2000</span>
              <strong>{targetData ? targetData.dec_str : "--° --' --\""}</strong>
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
            
            <div className="input-group" style={{ marginBottom: '16px' }}>
              <label>Localização do Observatório (Travada fisicamente para evitar quedas)</label>
              <div style={{fontSize: '0.85rem', color: '#00f2fe', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(0, 242, 254, 0.2)'}}>
                  📍 <strong>Poços de Caldas - MG, Brasil</strong> <br/>
                  <strong>Lat:</strong> -21.7878 | <strong>Lon:</strong> -46.5614 | <strong>Mag Dec:</strong> -22.0°
              </div>
            </div>

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
