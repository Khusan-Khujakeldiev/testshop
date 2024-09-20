import React, { Component } from "react";
import { connect } from "react-redux";
import {
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  updateItemAttributes,
  clearCart,
} from "../../reducers/cartSlice";
import CartItemAttributes from "./CartItemAttributes";
import { createOrder } from "../../services/orderService";
import "./cart.scss";

class Cart extends Component {
  handleAttributeClick = (itemIndex, attributeName, option) => {
    const updatedAttributes = { ...this.props.cartItems[itemIndex].attributes };
    updatedAttributes[attributeName] = option;
    this.props.updateItemAttributes({
      index: itemIndex,
      attributes: updatedAttributes,
    });
  };

  handleDecreaseQuantity = (index) => {
    const item = this.props.cartItems[index];
    if (item.quantity > 1) {
      this.props.decreaseQuantity(index);
    } else {
      this.props.removeItem(index);
    }
  };

  handlePlaceOrder = async () => {
    const { cartItems } = this.props;

    if (cartItems.length === 0) return;

    try {
      const result = await createOrder(cartItems);
      if (result.errors) {
        console.error("Failed to place order:", result.errors);
      } else {
        console.log("Order placed successfully:", result.data.createOrder);
        this.props.clearCart();
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  render() {
    const { cartItems, totalAmount } = this.props;

    return (
      <div className="cart-overlay">
        <h2 className="cart-title">
          My Bag,{" "}
          <span className="fw-normal">
            {" "}
            {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items
          </span>
        </h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item, index) => (
                <div className="cart-item" key={index}>
                  <div className="cart-item-info">
                    <div className="cart-item-name fw-normal">{item.name}</div>
                    <p className="cart-item-price">
                      {item.currency_symbol}
                      {item.price}
                    </p>
                    <CartItemAttributes
                      attributes={item.attributes}
                      allAttributes={item.allAttributes}
                      onAttributeClick={(attrName, option) =>
                        this.handleAttributeClick(index, attrName, option)
                      }
                    />
                  </div>
                  <div className="cart-item-controls">
                    <button
                      className="quantity-button mb-4"
                      onClick={() => this.props.increaseQuantity(index)}
                    >
                      +
                    </button>
                    <span className="quantity fw-bold">{item.quantity}</span>
                    <button
                      className="quantity-button mt-4"
                      onClick={() => this.handleDecreaseQuantity(index)}
                    >
                      -
                    </button>
                  </div>
                  <div className="cart-product-img">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-image"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total:</span>
                <span className="total-amount">
                  {totalAmount.toFixed(2)} {cartItems[0]?.currency_symbol}
                </span>
              </div>
              <button
                className="cart-checkout"
                onClick={this.handlePlaceOrder}
                disabled={cartItems.length === 0 || totalAmount <= 0}
              >
                PLACE ORDER
              </button>
            </div>
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  cartItems: state.cart.items,
  totalAmount: state.cart.totalAmount,
});

const mapDispatchToProps = {
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  updateItemAttributes,
  clearCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
