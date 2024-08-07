import React, { Component } from "react";
import "./product.scss";
import ShoppingCart from "../../img/Vector.svg";

class Product extends Component {
  render() {
    const {
      product,
      hoveredProductId,
      handleMouseEnter,
      handleMouseLeave,
      showFullInfo,
    } = this.props;

    return (
      <div className="col-md-4 mb-4">
        <div
          className={`product-card ${product.in_stock ? "" : "out_stock"}`}
          onMouseLeave={() => handleMouseLeave(null)}
          onMouseEnter={() => handleMouseEnter(product.id)}
          onClick={() => showFullInfo(product)}
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
              <button className="add-to-cart">
                <img src={ShoppingCart} alt="Cart" className="cart-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Product;
