import React, { Component } from "react";
import "./header.scss";
import CartIcon from "../../img/cart-icon.svg";
import EmptyCart from "../../img/empty-cart.svg";
import { firstLetterToUppercase } from "../../utils/stringUtils";

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

    fetch("http://localhost:8080/graphql", {
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
    const { currentCategory, chooseCategory } = this.props;

    if (loading) return <p>Loading categories...</p>;
    if (error) return <p>Error loading categories: {error.message}</p>;

    return (
      <header className="header">
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col d-flex justify-content-start">
              <nav className="categories-list">
                <ul className="nav">
                  {categories.map((i) => (
                    <li
                      className={`nav-item mx-2 ${
                        currentCategory === firstLetterToUppercase(i.name)
                          ? "active"
                          : ""
                      }`}
                      key={i.id}
                      onClick={() =>
                        chooseCategory(firstLetterToUppercase(i.name))
                      }
                    >
                      {firstLetterToUppercase(i.name)}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="col d-flex justify-content-center">
              <img role="button" tabIndex="0" src={CartIcon} alt="Home" />
            </div>
            <div className="col d-flex justify-content-end">
              <img role="button" tabIndex="0" src={EmptyCart} alt="Cart" />
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
