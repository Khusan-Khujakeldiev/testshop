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
      isCartVisible: false,
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
  };

  toggleCartVisibility = () => {
    this.setState((prevState) => ({
      isCartVisible: !prevState.isCartVisible,
    }));
  };

  render() {
    const { currentCategory, showFullItem, isCartVisible } = this.state;

    return (
      <div className="wrapper">
        {isCartVisible && (
          <div
            data-testid="cart-overlay"
            className="overlay-backdrop"
            onClick={this.toggleCartVisibility}
          ></div>
        )}

        <Header
          chooseCategory={this.chooseCategory}
          currentCategory={currentCategory}
          showFullInfo={this.showFullInfo}
          showFullItem={showFullItem}
          toggleCartVisibility={this.toggleCartVisibility}
          isCartVisible={isCartVisible}
        />

        {showFullItem ? (
          <ProductDetails
            toggleCartVisibility={this.toggleCartVisibility}
            currentItem={this.state.currentItem}
            isCartVisible={isCartVisible}
          />
        ) : (
          <Products
            showFullInfo={this.showFullInfo}
            currentCategory={currentCategory}
            toggleCartVisibility={this.toggleCartVisibility}
          />
        )}
      </div>
    );
  }
}

export default App;
