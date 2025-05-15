
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { walletProviders, connectWallet } from "@/lib/walletUtils";
import { useLanguage } from "@/context/LanguageContext";

interface WalletConnectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (address: string) => void;
}

const WalletConnectModal = ({ open, onOpenChange, onConnect }: WalletConnectModalProps) => {
  const [connecting, setConnecting] = useState(false);
  const { t } = useLanguage();

  const handleConnectWallet = async (walletType: string) => {
    setConnecting(true);
    try {
      const address = await connectWallet(walletType as any);
      if (address) {
        onConnect(address);
        onOpenChange(false);
      }
    } finally {
      setConnecting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("Select Wallet")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {Object.entries(walletProviders).map(([id, wallet]) => (
            <Button
              key={id}
              variant="outline"
              className="flex justify-start gap-4"
              disabled={connecting}
              onClick={() => handleConnectWallet(id)}
            >
              <span className="text-xl">{wallet.icon}</span>
              <span>{wallet.name}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnectModal;
