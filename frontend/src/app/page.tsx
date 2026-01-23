export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #1e293b, #7c3aed, #1e293b)',
      color: 'white',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <header style={{
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          Weave Market
        </h1>
        <div style={{
          padding: '0.5rem 1rem',
          background: '#3b82f6',
          borderRadius: '0.5rem',
          cursor: 'pointer'
        }}>
          Connect Wallet
        </div>
      </header>

      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Predict the Future
        </h1>
        
        <p style={{
          fontSize: '1.5rem',
          color: '#d1d5db',
          marginBottom: '2rem'
        }}>
          Decentralized prediction markets on Base Sepolia
        </p>

        <div style={{
          display: 'inline-block',
          padding: '1rem 2rem',
          background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
          borderRadius: '0.5rem',
          fontSize: '1.125rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginBottom: '4rem'
        }}>
          Get Started
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginTop: '4rem'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '2rem',
            borderRadius: '1rem'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#60a5fa' }}>
              Live
            </div>
            <div style={{ color: '#9ca3af', marginTop: '0.5rem' }}>
              Markets Running
            </div>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '2rem',
            borderRadius: '1rem'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#a78bfa' }}>
              0.01 ETH
            </div>
            <div style={{ color: '#9ca3af', marginTop: '0.5rem' }}>
              Min Stake
            </div>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '2rem',
            borderRadius: '1rem'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#34d399' }}>
              2%
            </div>
            <div style={{ color: '#9ca3af', marginTop: '0.5rem' }}>
              Platform Fee
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '6rem',
          padding: '3rem',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '1rem'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Your Platform is Live
          </h2>
          <p style={{ color: '#d1d5db', fontSize: '1.125rem' }}>
            Smart contracts deployed on Base Sepolia testnet
          </p>
          <p style={{ color: '#9ca3af', marginTop: '1rem' }}>
            Connect your wallet to start predicting and earning
          </p>
        </div>
      </main>
    </div>
  );
}