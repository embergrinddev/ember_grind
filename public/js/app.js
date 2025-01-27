import { initWallet, connectWallet, setupWalletListeners } from './services/wallet.js';

export class App {
    constructor() {
        console.log('App constructor called');
        this.currentPage = 'dashboard';
        this.init();
    }

    async init() {
        console.log('Init called');
        try {
            await initWallet();
            console.log('Wallet initialized');
            
            setupWalletListeners();
            console.log('Wallet listeners setup');
            
            this.addEventListeners();
            console.log('Event listeners added');
            
            this.loadPage(window.location.hash.slice(1) || 'dashboard');
            console.log('Page loaded');
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    addEventListeners() {
        const connectWalletBtn = document.getElementById('connect-wallet');
        if (connectWalletBtn) {
            console.log('Connect wallet button found');
            connectWalletBtn.addEventListener('click', async () => {
                console.log('Connect wallet button clicked');
                try {
                    await connectWallet();
                } catch (error) {
                    console.error('Wallet connection failed:', error);
                }
            });
        }

        window.addEventListener('hashchange', () => {
            this.loadPage(window.location.hash.slice(1));
        });
    }

    async loadPage(pageName) {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        try {
            mainContent.innerHTML = '<div class="flex justify-center items-center h-full"><div class="loader"></div></div>';
            
            const pageModule = await import(`./pages/${pageName}.js`);
            const pageContent = await pageModule.default();
            mainContent.innerHTML = pageContent;
        } catch (error) {
            console.error('Error loading page:', error);
            mainContent.innerHTML = '<div class="text-red-500">Error loading page</div>';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    new App();
});