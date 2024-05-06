import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import Main from './Main'
import SympMarket from '../abis/SympMarket.json'


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
      const address = '0xC38848B661c426A0af8D351E4dAB0ce50BF8AB60'
      const sympmarket = new web3.eth.Contract(SympMarket.abi, address)
      this.setState({ sympmarket })
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
        loading: true
      }

      this.createProduct = this.createProduct.bind(this)
      this.purchaseProduct = this.purchaseProduct.bind(this)
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
   
    render() {
      return (
              <main role="main" className="col-lg-12 d-flex">
                { this.state.loading
                  ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                  : <Main
                    products={this.state.products}
                    createProduct={this.createProduct}
                    purchaseProduct={this.purchaseProduct} />
                }
              </main>
      );
    }
}

export default App;
