import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import ProductDetails from "./components/productDetails/ProductDetails";
import Products from "./components/products/products";
import Header from "./components/header/header";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCategory: "All",
      showFullItem: false,
      currentItem: {},
    };
  }

  chooseCategory = (category) => {
    this.setState({ currentCategory: category });
  };

  showFullInfo = (product) => {
    this.setState({ currentItem: product });
    this.setState({
      showFullItem: !this.state.showFullItem,
    });
    console.log(product);
  };

  render() {
    const { currentCategory } = this.state;

    return (
      <div className="wrapper">
        <Header
          chooseCategory={this.chooseCategory}
          currentCategory={currentCategory}
        />
        {this.state.showFullItem ? (
          <ProductDetails
            currentItem={this.state.currentItem}
            showFullInfo={this.showFullInfo}
          />
        ) : (
          <Products
            showFullInfo={this.showFullInfo}
            currentCategory={currentCategory}
          />
        )}
      </div>
    );
  }
}

export default App;
