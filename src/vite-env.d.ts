
/// <reference types="vite/client" />

interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    isTrust?: boolean;
    isCrypto?: boolean;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
  };
  solana?: {
    connect: () => Promise<{ publicKey: { toString: () => string } }>;
    publicKey?: { toString: () => string };
  };
  phantom?: {
    solana?: {
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      publicKey?: { toString: () => string };
    };
  };
  exodus?: any;
}
