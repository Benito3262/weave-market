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
            alert('Please install MetaMask to use this application!');
            return;
        }

        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        
        const network = await provider.getNetwork();
        console.log('Connected to network:', network.chainId);
        
        // Check if on correct network
        if (network.chainId !== CONFIG.CHAIN_ID_DECIMAL) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: CONFIG.CHAIN_ID }],
                });
            } catch (switchError) {
                // Network doesn't exist, add it
                if (switchError.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: CONFIG.CHAIN_ID,
                            chainName: 'Base Sepolia',
                            nativeCurrency: { 
                                name: 'ETH', 
                                symbol: 'ETH', 
                                decimals: 18 
                            },
                            rpcUrls: ['https://sepolia.base.org'],
                            blockExplorerUrls: ['https://sepolia.basescan.org']
                        }]
                    });
                } else {
                    throw switchError;
                }
            }
            // Reconnect after network switch
            provider = new ethers.providers.Web3Provider(window.ethereum);
        }
        
        signer = provider.getSigner();
        userAddress = await signer.getAddress();
        
        console.log('Connected wallet:', userAddress);
        
        await updateUI();
        
    } catch (error) {
        console.error('Connection error:', error);
        alert('Failed to connect wallet: ' + error.message);
    }
}

async function updateUI() {
    const shortAddress = userAddress.slice(0, 6) + '...' + userAddress.slice(-4);
    
    // Update wallet address display
    const walletAddressEl = document.querySelector('.wallet-address');
    if (walletAddressEl) {
        walletAddressEl.textContent = shortAddress;
        walletAddressEl.style.display = 'inline';
    }
    
    // Update connect button
    const connectBtn = document.querySelector('.btn-primary');
    if (connectBtn) {
        connectBtn.textContent = '✓ Connected';
        connectBtn.style.cursor = 'default';
        connectBtn.onclick = null;
    }
    
    // Fetch and display reputation
    try {
        const reputationContract = new ethers.Contract(
            CONFIG.CONTRACTS.ReputationSystem,
            CONFIG.ABI.Reputation,
            provider
        );
        
        const reputation = await reputationContract.getReputation(userAddress);
        console.log('User reputation:', reputation.toString());
        
        const repValue = document.querySelector('.rep-value');
        if (repValue) {
            repValue.textContent = reputation.toString();
        }
        
        const reputationDisplay = document.getElementById('reputationDisplay');
        if (reputationDisplay) {
            reputationDisplay.style.display = 'inline-block';
        }
        
    } catch (error) {
        console.error('Error fetching reputation:', error);
        // Default to 1000 if error
        const repValue = document.querySelector('.rep-value');
        if (repValue) {
            repValue.textContent = '1000';
        }
    }
}