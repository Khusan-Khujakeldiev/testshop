import React, { Component } from "react";
import { connect } from "react-redux";
import "./header.scss";
import CartIcon from "../../img/cart-icon.svg";
import EmptyCart from "../../img/empty-cart.svg";
import { firstLetterToUppercase } from "../../utils/stringUtils";
import Cart from "../cart/cart";
import { fetchCategories } from "../../services/categoryService";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      loading: true,
      error: null,
    };
  }

  async componentDidMount() {
    try {
      const result = await fetchCategories();
      this.setState({
        categories: result.data.categories,
        loading: false,
        error: null,
      });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  }

  render() {
    const { categories, loading, error } = this.state;
    const {
      currentCategory,
      chooseCategory,
      showFullInfo,
      showFullItem,
      cartItemCount,
      toggleCartVisibility,
      isCartVisible,
    } = this.props;

    if (loading) return <p>Loading categories...</p>;
    if (error) return <p>Error loading categories: {error.message}</p>;

    return (
      <header className="header">
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col d-flex justify-content-start">
              <nav className="categories-list">
                <ul className="nav">
                  {categories.map((i) => {
                    const isActive =
                      currentCategory === firstLetterToUppercase(i.name);
                    return (
                      <li key={i.id}>
                        <a
                          href={`/${i.name}`}
                          className={`nav-item mx-2 ${
                            isActive ? "active" : ""
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            chooseCategory(firstLetterToUppercase(i.name));
                            if (showFullItem) {
                              showFullInfo();
                            }
                          }}
                        >
                          {firstLetterToUppercase(i.name)}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
            <div
              className="col d-flex justify-content-center"
              onClick={() => (showFullItem ? showFullInfo() : "")}
            >
              <img tabIndex="0" src={CartIcon} alt="Home" />
            </div>
            <div
              className="col d-flex justify-content-end position-relative"
              onClick={() => toggleCartVisibility()}
            >
              <button data-testid="cart-btn">
                <img tabIndex="0" src={EmptyCart} alt="Cart" />
              </button>

              {cartItemCount > 0 && (
                <div className="cart-item-count">{cartItemCount}</div>
              )}
            </div>
          </div>
        </div>
        {isCartVisible && <Cart />}
      </header>
    );
  }
}

const mapStateToProps = (state) => ({
  cartItemCount: state.cart.items.reduce((acc, item) => acc + item.quantity, 0),
});

export default connect(mapStateToProps)(Header);
