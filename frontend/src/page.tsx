'use client';
export default function Home() {
return (
<div style={{
minHeight: '100vh',
background: 'linear-gradient(135deg, #1e293b 0%, #581c87 50%, #1e293b 100%)',
display: 'flex',
flexDirection: 'column',
alignItems: 'center',
justifyContent: 'center',
color: 'white',
padding: '20px'
}}>
<h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
Weave Market

<p style={{ fontSize: '20px', marginBottom: '30px' }}>
Decentralized Prediction Markets on Base Sepolia

<div style={{
padding: '15px 30px',
background: '#3b82f6',
borderRadius: '8px',
cursor: 'pointer'
}}>
Connect Wallet

<div style={{ marginTop: '50px', textAlign: 'center' }}>
    <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>
      Your Contracts Are Live!
    </h2>
    <p style={{ color: '#9ca3af' }}>
      Smart contracts deployed on Base Sepolia testnet
    </p>
  </div>
</div>
);
}