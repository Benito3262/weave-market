let provider, signer, userAddress;

window.addEventListener('load', () => {
    if (typeof window.ethereum === 'undefined') {
        document.getElementById('walletAlert').innerHTML = 
            '<strong>MetaMask not detected!</strong> Please install MetaMask.';
        document.getElementById('walletAlert').className = 'alert alert-error';
    }
    
    const connectBtn = document.getElementById('connectBtn');
    if (connectBtn) {
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
        
        const walletAlert = document.getElementById('walletAlert');
        const appContent = document.getElementById('appContent');
        const connectBtn = document.getElementById('connectBtn');
        const repBadge = document.getElementById('reputationBadge');
        
        if (walletAlert) walletAlert.style.display = 'none';
        if (appContent) appContent.style.display = 'block';
        if (connectBtn) connectBtn.textContent = 'Connected';
        if (repBadge) repBadge.style.display = 'block';
        
        alert('Connected successfully!');
        
    } catch (error) {
        console.error('Connection error:', error);
        alert('Failed to connect: ' + error.message);
    }
}

async function updateUI() {
    const shortAddress = userAddress.slice(0, 6) + '...' + userAddress.slice(-4);
    
    const userAddressEl = document.getElementById('userAddress');
    if (userAddressEl) {
        userAddressEl.textContent = shortAddress;
    }
    
    try {
        const reputationContract = new ethers.Contract(
            CONFIG.CONTRACTS.ReputationSystem,
            CONFIG.ABIS.ReputationSystem,
            provider
        );
        
        const reputation = await reputationContract.getReputation(userAddress);
        
        const headerRep = document.getElementById('headerReputation');
        const userRep = document.getElementById('userReputation');
        
        if (headerRep) headerRep.textContent = reputation.toString();
        if (userRep) userRep.textContent = reputation.toString();
        
    } catch (error) {
        console.error('Error fetching reputation:', error);
        const userRep = document.getElementById('userReputation');
        if (userRep) userRep.textContent = 'Error loading';
    }
}

function showCreateModal() {
    const modal = document.getElementById('createModal');
    if (modal) modal.style.display = 'flex';
}

function closeCreateModal() {
    const modal = document.getElementById('createModal');
    if (modal) modal.style.display = 'none';
}

function disconnectWallet() {
    provider = null;
    signer = null;
    userAddress = null;
    
    window.location.reload();
}