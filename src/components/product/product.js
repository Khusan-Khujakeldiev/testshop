import React, { Component } from "react";
import "./product.scss";
import ShoppingCart from "../../img/Vector.svg";
import { connect } from "react-redux";
import { addItem } from "../../reducers/cartSlice";
import { createCartItemFromProduct } from "../../utils/cartUtils";

class Product extends Component {
  handleClick = (e) => {
    const { showFullInfo, product } = this.props;

    if (!e.target.closest(".add-to-cart")) {
      showFullInfo(product);
    }
  };

  handleAddToCart = () => {
    const { product, addItem } = this.props;

    const item = createCartItemFromProduct(product);
    addItem(item);
  };

  render() {
    const { product, hoveredProductId, handleMouseEnter, handleMouseLeave } =
      this.props;

    return (
      <div
        className="col-md-4 mb-4"
        data-testid={`product-${product.name
          .toLowerCase()
          .replace(/\s+/g, "-")}`}
      >
        <div
          className={`product-card ${product.in_stock ? "" : "out_stock"}`}
          onMouseLeave={() => handleMouseLeave(null)}
          onMouseEnter={() => handleMouseEnter(product.id)}
          onClick={this.handleClick}
        >
          <div className="product-image">
            {product.images.length > 0 ? (
              <img src={product.images[0].image_url} alt={product.name} />
            ) : (
              <p className="no-image">No image available</p>
            )}
            {!product.in_stock && (
              <div className="out-of-stock-overlay">
                <p>Out of Stock</p>
              </div>
            )}
          </div>
          <div className="product-card-desc">
            <div className="product-details">
              <h5 className="product-title">{product.name}</h5>
              {product.price.length > 0 ? (
                <p className="product-price">
                  {product.price[0].currency_symbol}
                  {product.price[0].amount}{" "}
                </p>
              ) : (
                <p className="product-price">No price available</p>
              )}
            </div>
            <div
              className={`product-cart ${
                hoveredProductId === product.id && product.in_stock
                  ? " "
                  : "d-none"
              }`}
            >
              <button
                className="add-to-cart"
                onClick={(event) => {
                  event.stopPropagation(); // Stopping Propagation
                  this.handleAddToCart(); // Adding goods to cart
                }}
                data-testid="add-to-cart"
              >
                <img src={ShoppingCart} alt="Cart" className="cart-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  addItem,
};

export default connect(null, mapDispatchToProps)(Product);
