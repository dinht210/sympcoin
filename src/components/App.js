/*
* Adapted from Dapp University's Tutorial "How to Build a Blockchain App"
* https://www.dappuniversity.com/articles/how-to-build-a-blockchain-app
*/

import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import Main from './Main'
import SympMarket from '../abis/SympMarket.json'
import SympCoin from '../abis/SympCoin.json'

class App extends Component {
    async componentWillMount() {
      await this.loadWeb3()
      await this.loadBlockchainData()
    }

    async loadWeb3() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
      }
      else if (window.web3) {
        window.web3 = new Web3('https://sepolia.infura.io/v3/3c1ba2f0edc0418db37066e2274c1396')
      }
      else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    }

    async loadBlockchainData() {
      const web3 = window.web3
      const accounts = await web3.eth.getAccounts()
      this.setState({ account: accounts[0] })
      const marketAddress = '0xC38848B661c426A0af8D351E4dAB0ce50BF8AB60'
      const coinAddress = '0x5b49302940fF935250b0f24CD2Fb84B407e55398'
      const sympmarket = new web3.eth.Contract(SympMarket.abi, marketAddress)
      const sympcoin = new web3.eth.Contract(SympCoin.abi, coinAddress)
      this.setState({ sympmarket })
      this.setState({ sympcoin }) 
      const productCount = await sympmarket.methods.productCount().call()
      this.setState({ productCount })
      for (var i = 1; i <= productCount; i++) {
        const product = await sympmarket.methods.products(i).call()
        this.setState({
          products: [...this.state.products, product]
        })
      }
      this.setState({ loading: false})
    }

    constructor(props) {
      super(props)
      this.state = {
        account: '',
        productCount: 0,
        products: [],
        loading: true,
        sympmarket: null,
        sympcoin: null
      }

      this.createProduct = this.createProduct.bind(this)
      this.purchaseProduct = this.purchaseProduct.bind(this)
      this.mintCoin = this.mintCoin.bind(this)
    }

    createProduct(name, price) {
      this.setState({ loading: true })
      this.state.sympmarket.methods.createProduct(name, price).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      })
    }

    purchaseProduct(id, price) {
      this.setState({ loading: true })
      this.state.sympmarket.methods.purchaseProduct(id).send({ from: this.state.account, value: price })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      })
    }

    mintCoin() {
      this.setState({ loading: true })
      this.state.sympcoin.methods.mint(this.state.account, 1000000000000).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      })
    }
   
    render() {
      return (
              <main role="main" className="col-lg-12 d-flex">
                { this.state.loading
                  ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                  : <Main
                    products={this.state.products}
                    createProduct={this.createProduct}
                    purchaseProduct={this.purchaseProduct} 
                    mintCoin={this.mintCoin} />
                }
              </main>
      );
    }
}

export default App;
