// Contract addresses and ABIs
const CONTRACTS = {
    MARKET_FACTORY: 0x51a9c60cE0aAf5a65DeCEae78723d75715bdcd7b
    USER_PROFILE: 0x3DF13D3B413B816546d42b2f82b48461EfACffF9,
    REPUTATION_SYSTEM: 0xBb457F9Fe0F817b6E86533Aa10A57CD668404Eb0
};

// Simplified ABIs (only the functions we need)
const FACTORY_ABI = [
    'function marketCount() view returns (uint256)',
    'function getMarket(uint256) view returns (address)',
    'function createOfficialMarket(string, uint256, string) returns (address)',
    'function minimumStake() view returns (uint256)'
];

const PROFILE_ABI = [
    'function createProfile(string, string)',
    'function getProfile(address) view returns (tuple(address, string, string, uint256, uint256, bool, uint256, uint256, uint256))',
    'function hasProfile(address) view returns (bool)'
];

const REPUTATION_ABI = [
    'function getReputation(address) view returns (uint256)'
];

// Global variables
let provider;
let signer;
let userAddress;

// Initialize Web3
async function init() {
    console.log('Initializing Web3...');
    
    // Setup button listeners
    const connectBtn = document.getElementById('connectWallet');
    const ctaBtn = document.getElementById('ctaConnect');
    
    if (connectBtn) {
        connectBtn.addEventListener('click', connectWallet);
    }
    
    if (ctaBtn) {
        ctaBtn.addEventListener('click', connectWallet);
    }
    
    // Check if already connected
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ 
                method: 'eth_accounts' 
            });
            
            if (accounts.length > 0) {
                await connectWallet();
            }
        } catch (error) {
            console.log('Not connected yet');
        }
    }
}

// Connect wallet
async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask to use this app!');
        https://t.co/kIfCfxAOdt('https://t.co/RDxFeTzjCV', '_blank');
        return;
    }

    try {
        console.log('Connecting wallet...');
        
        // Request account access
        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
        
        userAddress = accounts[0];
        console.log('Connected:', userAddress);
        
        // Initialize ethers
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        
        // Check network
        const network = await provider.getNetwork();
        const baseSepoliaChainId = 84532;
        
        if (network.chainId !== baseSepoliaChainId) {
            await switchToBaseSepolia();
        }
        
        // Update UI
        updateWalletUI();
        
        // Show success message
        showNotification('Wallet connected successfully!', 'success');
        
    } catch (error) {
        console.error('Connection error:', error);
        showNotification('Failed to connect wallet: ' + error.message, 'error');
    }
}

// Switch to Base Sepolia network
async function switchToBaseSepolia() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x14a34' }], // 84532 in hex
        });
    } catch (switchError) {
        // Network not added, add it
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0x14a34',
                        chainName: 'Base Sepolia',
                        nativeCurrency: {
                            name: 'Ethereum',
                            symbol: 'ETH',
                            decimals: 18
                        },
                        rpcUrls: ['https://t.co/5sMzlF92wT'],
                        blockExplorerUrls: ['https://t.co/y9D2y9VQHf']
                    }]
                });
            } catch (addError) {
                throw new Error('Please add Base Sepolia network to MetaMask');
            }
        } else {
            throw switchError;
        }
    }
}

// Update UI after wallet connection
function updateWalletUI() {
    const connectBtn = document.getElementById('connectWallet');
    const ctaBtn = document.getElementById('ctaConnect');
    
    if (connectBtn) {
        connectBtn.textContent = formatAddress(userAddress);
        connectBtn.classList.add('wallet-info');
    }
    
    if (ctaBtn) {
        https://t.co/GWh6jkoCg1.display = 'none';
    }
}

// Format address for display
function formatAddress(address) {
    return `${address.substring(0, 6)}...${address.substring(38)}`;
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    https://t.co/WtOAH4dDlU.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        https://t.co/WtOAH4dDlU.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Listen for account changes
if (typeof window.ethereum !== 'undefined') {
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
            // User disconnected
            location.reload();
        } else {
            // Account changed
            userAddress = accounts[0];
            updateWalletUI();
        }
    });
    
    window.ethereum.on('chainChanged', () => {
        // Reload on network change
        location.reload();
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', init);

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);