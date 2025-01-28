import Dashboard from '../pages/dashboard.js';


let wallet = null;
const WALLET_SESSION_KEY = 'ember_wallet_connected';

export async function initWallet() {
    try {
        console.log('Initializing wallet...');
        
        if (!window.phantom) {
            throw new Error('Phantom is not installed');
        }

        const phantom = window.phantom?.solana;

        if (!phantom?.isPhantom) {
            throw new Error('Phantom wallet is not installed');
        }

        wallet = phantom;
        console.log('Wallet initialized successfully');

        const isSessionActive = localStorage.getItem(WALLET_SESSION_KEY) === 'true';
        
        if (isSessionActive) {
            try {
                const resp = await wallet.connect({ onlyIfTrusted: true });
                if (resp.publicKey) {
                    const publicKey = resp.publicKey.toString();
                    console.log('Restored session for:', publicKey);
                    updateWalletButton(publicKey, true);
                }
            } catch (err) {
                console.log('No trusted connection found');
                await forceDisconnect();
            }
        }

    } catch (error) {
        console.error('Wallet initialization error:', error);
        updateWalletButton(null, false, true);
    }
}


async function forceDisconnect() {
    try {
        if (wallet && wallet.disconnect) {
            await wallet.disconnect();
        }
        localStorage.removeItem(WALLET_SESSION_KEY);
        updateWalletButton(null, false);
    } catch (error) {
        console.error('Force disconnect error:', error);
    }
}

export async function disconnectWallet() {
    try {
        if (!wallet) {
            throw new Error('Wallet is not initialized');
        }

        await wallet.disconnect();
        localStorage.removeItem(WALLET_SESSION_KEY);
        updateWalletButton(null, false);
        
    } catch (error) {
        console.error('Disconnect error:', error);
        await forceDisconnect();
    }
}

function updateWalletButton(publicKey = null, isConnected = false, error = false) {
    const button = document.getElementById('connect-wallet');
    if (!button) return;

    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);

    if (error) {
        newButton.innerHTML = `
            <i class="fas fa-wallet mr-2"></i>
            <span>Wallet Error</span>
        `;
        newButton.classList.add('error');
        newButton.classList.remove('connected');
        return;
    }

    if (isConnected && publicKey) {
        newButton.innerHTML = `
            <div class="flex items-center gap-2">
                <i class="fas fa-wallet"></i>
                <span>${publicKey.slice(0, 4)}...${publicKey.slice(-4)}</span>
                <button class="disconnect-btn">
                    <i class="fas fa-sign-out-alt hover:text-red-500"></i>
                </button>
            </div>
        `;
        newButton.classList.add('connected');
        
        const disconnectBtn = newButton.querySelector('.disconnect-btn');
        if (disconnectBtn) {
            disconnectBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                await disconnectWallet();
            });
        }
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = Dashboard();
        }
    } else {
        newButton.innerHTML = `
            <div class="flex items-center gap-2">
                <i class="fas fa-wallet"></i>
                <span>Connect Wallet</span>
            </div>
        `;
        newButton.classList.remove('connected', 'error');
        newButton.addEventListener('click', connectWallet);
    }
}
export async function connectWallet() {
    console.log('Connect wallet clicked');
    
    try {
        if (!wallet) {
            throw new Error('Wallet is not initialized');
        }

        console.log('Requesting connection...');
        
        const response = await wallet.connect();
        const publicKey = response.publicKey.toString();
        
        localStorage.setItem(WALLET_SESSION_KEY, 'true');
        
        updateWalletButton(publicKey, true);
        return publicKey;

    } catch (error) {
        console.error('Connection error:', error);
        updateWalletButton(null, false, true);
        throw error;
    }
}


export function setupWalletListeners() {
    console.log('Setting up wallet listeners');
    if (!wallet) return;

    wallet.on('connect', (publicKey) => {
        console.log('Wallet connected:', publicKey.toString());
        updateWalletButton(publicKey.toString(), true);
    });

    wallet.on('disconnect', () => {
        console.log('Wallet disconnected');
        updateWalletButton(null, false);
    });

    wallet.on('accountChanged', (publicKey) => {
        console.log('Account changed:', publicKey ? publicKey.toString() : 'null');
        if (publicKey) {
            updateWalletButton(publicKey.toString(), true);
        } else {
            updateWalletButton(null, false);
        }
    });
}