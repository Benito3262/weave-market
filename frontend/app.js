let provider, signer, userAddress;

document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for wallet extensions to load
    setTimeout(() => {
        const connectBtn = document.querySelector('.btn-primary');
        if (connectBtn && connectBtn.textContent.includes('Connect')) {
            connectBtn.addEventListener('click', connectWallet);
        }
    }, 500);
});

async function connectWallet() {
    try {
        // Check for ethereum provider
        let ethereum = window.ethereum;
        
        // If multiple wallets, try to get MetaMask specifically
        if (window.ethereum?.providers) {
            ethereum = window.ethereum.providers.find(p => p.isMetaMask);
        }
        
        if (!ethereum) {
            alert('Please install MetaMask to use this application!');
            return;
        }

        // First, request accounts
        await ethereum.request({ method: 'eth_requestAccounts' });
        
        // Create provider
        provider = new window.ethers.providers.Web3Provider(ethereum);
        const network = await provider.getNetwork();
        console.log('Current network:', network.chainId);
        
        // Check if on correct network
        if (network.chainId !== CONFIG.CHAIN_ID_DECIMAL) {
            console.log('Wrong network, switching to Base Sepolia...');
            try {
                // First try to switch
                await ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: CONFIG.CHAIN_ID }],
                });
                console.log('Switched to Base Sepolia');
            } catch (switchError) {
                console.log('Switch error:', switchError);
                // If network doesn't exist (error 4902), add it
                if (switchError.code === 4902 || switchError.code === -32603) {
                    console.log('Adding Base Sepolia network...');
                    try {
                        await ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: CONFIG.CHAIN_ID,
                                chainName: 'Base Sepolia Testnet',
                                nativeCurrency: { 
                                    name: 'Sepolia Ether', 
                                    symbol: 'ETH', 
                                    decimals: 18 
                                },
                                rpcUrls: ['https://sepolia.base.org'],
                                blockExplorerUrls: ['https://sepolia.basescan.org']
                            }]
                        });
                        console.log('Base Sepolia added successfully');
                    } catch (addError) {
                        console.error('Error adding network:', addError);
                        throw new Error('Failed to add Base Sepolia network. Please add it manually in MetaMask.');
                    }
                } else {
                    throw switchError;
                }
            }
            
            // Recreate provider after network change
            provider = new window.ethers.providers.Web3Provider(ethereum);
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
        const reputationContract = new window.ethers.Contract(
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