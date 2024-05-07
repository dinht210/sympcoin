/*
* Adapted from Dapp University's Tutorial "How to Build a Blockchain App"
* https://www.dappuniversity.com/articles/how-to-build-a-blockchain-app
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./SympCoin.sol"; 

contract SympMarket2 {
    uint public productCount = 0;
    SympCoin public sympCoin;
    mapping(uint => Product) public products;

    struct Product {
        uint id;
        string name;
        uint price;
        address owner;
        bool purchased;
    }

    event ProductCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    constructor(address _sympCoin) {
        sympCoin = SympCoin(_sympCoin);
    }

    function createProduct(string memory _name, uint _price) public payable {
        require(bytes(_name).length > 0);
        require(_price > 0);
        productCount++;
        products[productCount] = Product(productCount, _name, _price, msg.sender, false);
        emit ProductCreated(productCount, _name, _price, payable(msg.sender), false);
    }

    function purchaseProduct(uint _id) public payable {
        Product storage _product = products[_id];
        address payable _seller = payable(_product.owner);
        require(_product.id > 0 && _product.id <= productCount);
        require(!_product.purchased);
        require(_seller != msg.sender);
        _product.owner = msg.sender;
        _product.purchased = true;
        sympCoin.transfer(_seller, _product.price);
        emit ProductPurchased(productCount, _product.name, _product.price, payable(msg.sender), true);
    }
}