let provider, signer, userAddress;

document.addEventListener('DOMContentLoaded', function() {
    const connectBtn = document.querySelector('.btn-primary');
    if (connectBtn && connectBtn.textContent.includes('Connect')) {
        connectBtn.addEventListener('click', connectWallet);
    }
});

async function connectWallet() {
    try {
        if (typeof window.ethereum === 'undefined') {
            alert('Please install MetaMask!');
            return;
        }

        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        
        const network = await provider.getNetwork();
        
        if (network.chainId !== CONFIG.CHAIN_ID_DECIMAL) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: CONFIG.CHAIN_ID }],
                });
            } catch (switchError) {
                if (switchError.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: CONFIG.CHAIN_ID,
                            chainName: 'Base Sepolia',
                            nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                            rpcUrls: ['https://sepolia.base.org'],
                            blockExplorerUrls: ['https://sepolia.basescan.org']
                        }]
                    });
                }
            }
            provider = new ethers.providers.Web3Provider(window.ethereum);
        }
        
        signer = provider.getSigner();
        userAddress = await signer.getAddress();
        
        updateUI();
        
        alert('Connected successfully!');
        
    } catch (error) {
        console.error('Connection error:', error);
        alert('Failed to connect: ' + error.message);
    }
}

async function updateUI() {
    const shortAddress = userAddress.slice(0, 6) + '...' + userAddress.slice(-4);
    
    const walletAddressEl = document.querySelector('.wallet-address');
    if (walletAddressEl) {
        walletAddressEl.textContent = shortAddress;
    }
    
    const connectBtn = document.querySelector('.btn-primary');
    if (connectBtn) {
        connectBtn.textContent = 'Connected ✓';
        connectBtn.style.cursor = 'default';
    }
    
    try {
        const reputationContract = new ethers.Contract(
            CONFIG.CONTRACTS.ReputationSystem,
            CONFIG.ABI.Reputation,
            provider
        );
        
        const reputation = await reputationContract.getReputation(userAddress);
        
        const repValue = document.querySelector('.rep-value');
        if (repValue) {
            repValue.textContent = reputation.toString();
        }
        
    } catch (error) {
        console.error('Error fetching reputation:', error);
    }
}