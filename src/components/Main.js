import React, { Component } from 'react';
import './App.css';

class Main extends Component {

  render() {
    return (
      <div id="content">
        <h1>SympMarket</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.productName.value
          const price = this.productPrice.value.toString()
          this.props.createProduct(name, price)
        }}>
          <div className="product-name-tab">
            <input
              id="productName"
              type="text"
              ref={(input) => { this.productName = input }}
              className="form-control"
              placeholder="Your Task?"
              required />
          </div>
          <div className="product-price-tab">
            <input
              id="productPrice"
              type="text"
              ref={(input) => { this.productPrice = input }}
              className="form-control"
              placeholder="Your Price?"
              required />
          </div>
          <button type="submit" className="button-28">Add Product</button>
        </form>
        <p>&nbsp;</p>
        <h2>Listings</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Task</th>
              <th scope="col">Price</th>
              <th scope="col">Sympeep</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            { this.props.products.map((product, key) => {
              return(
                <tr key={key}>
                  <td>{product.name}</td>
                  <td>{product.price.toString()} SympCoin</td>
                  <td>{product.owner}</td>
                  <td>
                    { !product.purchased
                      ? <button
                          name={product.id}
                          value={product.price}
                          onClick={(event) => {
                            this.props.purchaseProduct(event.target.name, event.target.value)
                          }}
                        >
                          Buy
                        </button>
                      : null
                    }
                    </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;
