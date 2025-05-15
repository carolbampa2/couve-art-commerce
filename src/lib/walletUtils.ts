
type WalletProvider = 'phantom' | 'metamask' | 'trustwallet' | 'crypto_com' | 'exodus';

interface WalletInfo {
  name: string;
  icon: string;
  available: boolean;
  installed: () => boolean;
}

export const walletProviders: Record<WalletProvider, WalletInfo> = {
  phantom: {
    name: 'Phantom',
    icon: '👻',
    available: true,
    installed: () => window.solana !== undefined || !!window.phantom?.solana,
  },
  metamask: {
    name: 'MetaMask',
    icon: '🦊',
    available: true,
    installed: () => typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask,
  },
  trustwallet: {
    name: 'Trust Wallet',
    icon: '🔐',
    available: true, 
    installed: () => typeof window.ethereum !== 'undefined' && window.ethereum.isTrust,
  },
  crypto_com: {
    name: 'Crypto.com',
    icon: '🔷',
    available: true,
    installed: () => typeof window.ethereum !== 'undefined' && window.ethereum.isCrypto,
  },
  exodus: {
    name: 'Exodus',
    icon: '🚀',
    available: true,
    installed: () => typeof window.exodus !== 'undefined',
  },
};

export const connectWallet = async (walletType: WalletProvider): Promise<string | null> => {
  try {
    let accounts: string[] = [];
    
    switch (walletType) {
      case 'phantom':
        const provider = window.phantom?.solana || window.solana;
        if (provider) {
          await provider.connect();
          return provider.publicKey?.toString() || null;
        }
        break;
        
      case 'metamask':
      case 'trustwallet':
      case 'crypto_com':
      case 'exodus':
        if (window.ethereum) {
          accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          return accounts[0] || null;
        }
        break;
    }
    
    return null;
  } catch (error) {
    console.error("Error connecting to wallet:", error);
    return null;
  }
};
