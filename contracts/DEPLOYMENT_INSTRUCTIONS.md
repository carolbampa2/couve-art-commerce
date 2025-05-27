# PaisagemSales Smart Contract Deployment Instructions

This document provides instructions on how to deploy the `PaisagemSales.sol` smart contract to the Base Goerli testnet using Remix IDE and MetaMask.

## Prerequisites

1.  **MetaMask Wallet**: Install the MetaMask browser extension and create a wallet.
2.  **Base Goerli Test ETH**: Obtain test ETH for the Base Goerli network. You can find faucets by searching "Base Goerli faucet" online.
3.  **Base Goerli Network in MetaMask**: Add the Base Goerli testnet to MetaMask:
    *   Network Name: Base Goerli
    *   RPC URL: `https://goerli.base.org`
    *   Chain ID: `84531`
    *   Symbol: `ETH`
    *   Block Explorer URL: `https://goerli.basescan.org`

## Files

*   **Contract Source Code**: `PaisagemSales.sol` (located in this directory)
*   **Contract ABI**: `PaisagemSales.abi` (located in this directory, for use after deployment if needed for integrations)

## Deployment Steps using Remix IDE

1.  **Open Remix IDE**: Go to [https://remix.ethereum.org/](https://remix.ethereum.org/).

2.  **Create New File**:
    *   In the "File Explorers" tab on the left, click the "Create New File" icon.
    *   Name the file `PaisagemSales.sol`.

3.  **Paste Contract Code**:
    *   Open the `PaisagemSales.sol` file from this repository.
    *   Copy its entire content.
    *   Paste the code into the `PaisagemSales.sol` file you created in Remix.

4.  **Compile the Contract**:
    *   Go to the "Solidity Compiler" tab (the third icon from the top on the left sidebar).
    *   **Compiler Version**: Select a compiler version compatible with `^0.8.0` (e.g., `0.8.20` or the latest 0.8.x). The contract uses `pragma solidity ^0.8.0;`.
    *   **Auto compile**: You can enable this for convenience.
    *   Click the "Compile PaisagemSales.sol" button.
    *   Ensure there are no compilation errors (a green checkmark should appear next to the "Solidity Compiler" tab icon).

5.  **Deploy the Contract**:
    *   Go to the "Deploy & Run Transactions" tab (the fourth icon from the top on the left sidebar).
    *   **Environment**:
        *   Select "Injected Provider - MetaMask" from the dropdown.
        *   MetaMask will prompt you to connect your wallet. Make sure your MetaMask is connected to the "Base Goerli" network.
    *   **Account**: Your MetaMask wallet address connected to Base Goerli should be displayed.
    *   **Contract**: Ensure "PaisagemSales" is selected in the contract dropdown.
    *   **Deploy**:
        *   Click the orange "Deploy" button.
        *   MetaMask will pop up asking you to confirm the transaction (this will involve a gas fee in Base Goerli ETH).
        *   Confirm the transaction in MetaMask.

6.  **Get Contract Address and ABI**:
    *   Once the transaction is confirmed on the blockchain, the deployed contract will appear under "Deployed Contracts" at the bottom of the "Deploy & Run Transactions" tab in Remix.
    *   **Contract Address**: You can copy the deployed contract's address from here. This is one of your key deliverables.
    *   **ABI**: You can copy the ABI directly from Remix (look for the "Copy ABI" button usually next to the contract details) or use the `PaisagemSales.abi` file provided.

## After Deployment

*   **Save the Contract Address**: Keep the deployed contract address safe. This is crucial for interacting with your contract.
*   **Verify on Basescan (Optional but Recommended)**:
    *   Go to [https://goerli.basescan.org/](https://goerli.basescan.org/).
    *   Search for your contract address.
    *   You can verify and publish your contract source code there for transparency. Remix has a plugin ("Sourcify") or you can do it manually on Basescan by pasting your code.

You have now successfully deployed the `PaisagemSales` smart contract.
