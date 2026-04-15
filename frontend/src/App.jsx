import React, { useState } from 'react';
import { motion } from 'framer-motion';

function App() {
  const [configOpen, setConfigOpen] = useState(false);

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

      {/* Settings Modal (Placeholder for now) */}
      {configOpen && (
        <div className="modal-overlay">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel modal-content"
          >
            <h2>System Configuration</h2>
            <div className="input-group">
              <label>Location (City Search)</label>
              <input type="text" placeholder="Type city name..." />
            </div>
            <div className="input-group">
              <label>Astrometry API Key</label>
              <input type="password" placeholder="Key..." />
            </div>
            <button className="glass-btn btn-primary mt-2" onClick={() => setConfigOpen(false)}>Save & Close</button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default App;
