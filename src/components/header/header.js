import React, { Component } from "react";
import { connect } from "react-redux";
import "./header.scss";
import CartIcon from "../../img/cart-icon.svg";
import EmptyCart from "../../img/empty-cart.svg";
import { firstLetterToUppercase } from "../../utils/stringUtils";
import Cart from "../cart/cart";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    const query = {
      query: `
        query GetCategories {
          categories {
            id
            name
          }
        }
      `,
    };
    // Localhost::8080
    fetch("https://www.scandiwebtestshop.wuaze.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.errors) {
          this.setState({ error: result.errors[0], loading: false });
        } else {
          this.setState({ categories: result.data.categories, loading: false });
        }
      })
      .catch((error) => {
        this.setState({ error, loading: false });
      });
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
                      <li>
                        <a
                          href={`/${i.name}`}
                          className={`nav-item mx-2 ${
                            isActive ? "active" : ""
                          }`}
                          key={i.id}
                          data-testid={
                            isActive ? "active-category-link" : "category-link"
                          }
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
              <img role="button" tabIndex="0" src={CartIcon} alt="Home" />
            </div>
            <div
              className="col d-flex justify-content-end position-relative"
              onClick={() => toggleCartVisibility()}
            >
              <img
                role="button"
                data-testid="cart-btn"
                tabIndex="0"
                src={EmptyCart}
                alt="Cart"
              />
              {cartItemCount >= 0 && (
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
