// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PaisagemSales {
    address public owner;

    event SaleRecorded(
        address indexed buyer,
        uint256 quantity,
        uint256 totalPrice,
        string productId,
        string customData
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function recordSale(
        address buyer,
        uint256 quantity,
        uint256 totalPrice,
        string calldata productId,
        string calldata customData
    ) public payable {
        // In a real scenario, you might add checks here, e.g.,
        // - require(quantity > 0, "Quantity must be positive");
        // - require(totalPrice > 0, "Total price must be positive");
        // - require(bytes(productId).length > 0, "Product ID cannot be empty");

        emit SaleRecorded(buyer, quantity, totalPrice, productId, customData);
    }

    function withdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    // Fallback function to receive Ether
    receive() external payable {}

    // Fallback function for plain Ether transfers (if send is used)
    fallback() external payable {}
}
