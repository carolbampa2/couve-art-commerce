
import { useState } from 'react';
import { CreditCard, Bitcoin, Wallet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CreditCardForm from "./CreditCardForm";

// Payment network icons
const PaymentIcons = {
  Ethereum: () => (
    <svg className="h-4 w-4" viewBox="0 0 256 417" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
      <path fill="#343434" d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"/>
      <path fill="#8C8C8C" d="M127.962 0L0 212.32l127.962 75.639V154.158z"/>
      <path fill="#3C3C3B" d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z"/>
      <path fill="#8C8C8C" d="M127.962 416.905v-104.72L0 236.585z"/>
      <path fill="#141414" d="M127.961 287.958l127.96-75.637-127.96-58.162z"/>
      <path fill="#393939" d="M0 212.32l127.96 75.638v-133.8z"/>
    </svg>
  ),
  Solana: () => (
    <svg className="h-4 w-4" width="22" height="22" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
      <path d="M93.94 42.63H13.78c-1.75 0-2.66 2.24-1.44 3.59l11.46 12.01a2.56 2.56 0 0 0 1.86.76h80.16c1.75 0 2.66-2.24 1.44-3.59L95.8 43.39a2.56 2.56 0 0 0-1.86-.76z" fill="#9945FF"/>
      <path d="M93.94 69.45H13.78c-1.75 0-2.66 2.24-1.44 3.59l11.46 12.01a2.56 2.56 0 0 0 1.86.76h80.16c1.75 0 2.66-2.24 1.44-3.59L95.8 70.21a2.56 2.56 0 0 0-1.86-.76z" fill="#9945FF"/>
      <path d="M13.78 56.04h80.16c1.75 0 2.66-2.24 1.44-3.59L83.92 40.44a2.56 2.56 0 0 0-1.86-.76H1.9c-1.75 0-2.66 2.24-1.44 3.59l11.46 12.01a2.56 2.56 0 0 0 1.86.76z" fill="#9945FF"/>
    </svg>
  ),
  Bitcoin: () => <Bitcoin className="h-4 w-4" />,
  Base: () => (
    <svg className="h-4 w-4" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 0C9.85 0 0 9.85 0 22s9.85 22 22 22 22-9.85 22-22S34.15 0 22 0z" fill="#0052FF"/>
      <path d="M22.2 33a11 11 0 1 0 0-22 11 11 0 0 0 0 22z" fill="white"/>
    </svg>
  )
};

interface PaymentMethodsProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  cryptoNetwork: string;
  setCryptoNetwork: (network: string) => void;
  form: any;
}

const PaymentMethods = ({ 
  paymentMethod, 
  setPaymentMethod, 
  cryptoNetwork, 
  setCryptoNetwork,
  form
}: PaymentMethodsProps) => {
  // Crypto network options
  const cryptoNetworks = [
    { id: "ethereum", name: "Ethereum (ETH)", icon: <PaymentIcons.Ethereum /> },
    { id: "bitcoin", name: "Bitcoin (BTC)", icon: <PaymentIcons.Bitcoin /> },
    { id: "solana", name: "Solana (SOL)", icon: <PaymentIcons.Solana /> },
    { id: "base", name: "Base (ETH)", icon: <PaymentIcons.Base /> },
  ];

  return (
    <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="card" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Credit Card
        </TabsTrigger>
        <TabsTrigger value="crypto" className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          Cryptocurrency
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="card" className="mt-6">
        <CreditCardForm form={form} />
      </TabsContent>
      
      <TabsContent value="crypto" className="mt-6">
        <div className="space-y-4">
          <div>
            <FormLabel>Select Cryptocurrency Network</FormLabel>
            <div className="relative mt-1">
              <Select value={cryptoNetwork} onValueChange={setCryptoNetwork}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent>
                  {cryptoNetworks.map((network) => (
                    <SelectItem key={network.id} value={network.id} className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        {network.icon}
                        <span>{network.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <FormLabel>Wallet Address</FormLabel>
            <div className="relative">
              <Input 
                value="wallet connected"
                readOnly
                className="bg-muted"
              />
              <Button 
                variant="ghost" 
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 text-xs"
              >
                Change
              </Button>
            </div>
          </div>
          
          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm">
              You'll be prompted to approve this transaction in your connected wallet.
              Payments are processed securely through Crossmint.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 p-4 rounded-md">
            <h4 className="font-medium text-purple-800 mb-1">Supported Networks</h4>
            <div className="flex flex-wrap gap-2">
              {cryptoNetworks.map((network) => (
                <div key={network.id} 
                     className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs
                                ${cryptoNetwork === network.id ? 
                                  'bg-purple-700 text-white' : 
                                  'bg-purple-100 text-purple-700'}`}>
                  {network.icon}
                  <span>{network.name.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default PaymentMethods;
