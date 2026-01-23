'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import Link from 'next/link';

export default function MarketsPage() {
  const { isConnected } = useAccount();

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
        <Link href="/" style={{ textDecoration: 'none', color: 'white' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            Weave Market
          </h1>
        </Link>
        <ConnectButton />
      </header>

      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem' }}>
          Active Markets
        </h1>

        {!isConnected ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '1rem',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              Connect Your Wallet
            </h2>
            <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
              Connect your wallet to view and participate in prediction markets
            </p>
            <ConnectButton />
          </div>
        ) : (
          <div style={{
            padding: '3rem',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '1rem',
            border: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              Markets Coming Soon!
            </h2>
            <p style={{ color: '#9ca3af' }}>
              Your smart contracts are deployed and ready. Market interface will be added next.
            </p>
            <p style={{ color: '#60a5fa', marginTop: '1rem' }}>
              For now, you can interact with contracts directly on Basescan
            </p>
          </div>
        )}
      </main>
    </div>
  );
}