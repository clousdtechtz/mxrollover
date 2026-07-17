import React, { useState } from 'react';

export default function App() {
  // Sample state for demonstration - tracking simple slip options
  const [selectedTab, setSelectedTab] = useState('home');

  // betPawa-inspired Color Palette constants
  const colors = {
    bgDark: '#0e1111',       // Main deep dark background
    cardBg: '#161a1a',       // Slightly lighter dark for components/cards
    pawaGreen: '#4caf50',    // Distinct vibrant green accent
    textMain: '#ffffff',     // Clean white body text
    textMuted: '#8a9292',    // Subdued gray text for labels
    border: '#242a2a'        // Clean dark borders
  };

  return (
    <div style={{
      backgroundColor: colors.bgDark,
      color: colors.textMain,
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      margin: 0,
      padding: 0
    }}>
      {/* Top Navigation Header */}
      <header style={{
        backgroundColor: colors.cardBg,
        padding: '15px 20px',
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ 
            fontSize: '22px', 
            fontWeight: 'bold', 
            color: colors.pawaGreen,
            letterSpacing: '0.5px'
          }}>
            MXROLLOVER
          </span>
        </div>
        <button style={{
          backgroundColor: colors.pawaGreen,
          color: colors.bgDark,
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '14px'
        }}>
          Join Now
        </button>
      </header>

      {/* Sub-navigation Tabs */}
      <div style={{
        display: 'flex',
        backgroundColor: colors.cardBg,
        borderBottom: `1px solid ${colors.border}`,
      }}>
        {['home', 'rollovers', 'history'].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            style={{
              flex: 1,
              padding: '12px 0',
              background: 'none',
              border: 'none',
              borderBottom: selectedTab === tab ? `3px solid ${colors.pawaGreen}` : '3px solid transparent',
              color: selectedTab === tab ? colors.pawaGreen : colors.textMuted,
              fontWeight: '600',
              textTransform: 'capitalize',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content Body */}
      <main style={{ padding: '20px', flex: 1, maxWidth: '600px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        
        {/* Welcome Banner Card */}
        <div style={{
          backgroundColor: colors.cardBg,
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          border: `1px solid ${colors.border}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>Welcome to MXRollover</h2>
          <p style={{ margin: 0, color: colors.textMuted, fontSize: '14px', lineHeight: '1.5' }}>
            Track, project, and execute your strategy seamlessly with our optimized interface.
          </p>
        </div>

        {/* Dynamic Context Render based on chosen tab */}
        {selectedTab === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h3 style={{ margin: '5px 0', color: colors.textMuted, fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>Active Targets</h3>
            
            {/* Quick Demo Item */}
            <div style={{
              backgroundColor: colors.cardBg,
              borderLeft: `4px solid ${colors.pawaGreen}`,
              borderRadius: '0 8px 8px 0',
              padding: '15px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>Target Session #1</div>
                <div style={{ color: colors.textMuted, fontSize: '12px' }}>Current Step: 2/5</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: colors.pawaGreen, fontWeight: 'bold', fontSize: '18px' }}>1.50x</span>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'rollovers' && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: colors.textMuted }}>
            <p>No active rollover sessions found. Start a new build!</p>
          </div>
        )}

        {selectedTab === 'history' && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: colors.textMuted }}>
            <p>Your settled sessions history will appear here.</p>
          </div>
        )}

      </main>

      {/* Footer Branding Note */}
      <footer style={{
        textAlign: 'center',
        padding: '20px',
        color: colors.textMuted,
        fontSize: '12px',
        backgroundColor: colors.cardBg,
        borderTop: `1px solid ${colors.border}`
      }}>
        &copy; 2026 MXRollover. All rights reserved.
      </footer>
    </div>
  );
      }
