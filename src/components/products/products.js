import React, { Component } from "react";
import "./products.scss";
import Product from "../product/product";
import { GET_PRODUCTS_QUERY } from "../../queries/queries";

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: true,
      error: null,
      hoveredProductId: null,
    };
  }

  componentDidMount() {
    fetch("http://localhost:8080/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(GET_PRODUCTS_QUERY),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.errors) {
          console.error("GraphQL errors:", result.errors);
          this.setState({ error: result.errors[0], loading: false });
        } else {
          this.setState({ data: result.data, loading: false });
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        this.setState({ error, loading: false });
      });
  }

  handleMouseEnter = (productId) => {
    this.setState({ hoveredProductId: productId });
  };

  handleMouseLeave = () => {
    this.setState({ hoveredProductId: null });
  };

  render() {
    const { data, loading, error, hoveredProductId } = this.state;
    const { currentCategory, showFullInfo } = this.props;

    if (loading) return <p>Loading...</p>;
    if (error) {
      console.error("Error fetching products:", error);
      return <p>Error: {error.message}</p>;
    }

    const filteredProducts =
      currentCategory === "All"
        ? data.products
        : data.products.filter(
            (product) =>
              product.category.name.toLowerCase() ===
              currentCategory.toLowerCase()
          );

    return (
      <div className="container products">
        <h1>{this.props.currentCategory}</h1>
        <div className="row">
          {filteredProducts.map((product) => (
            <Product
              key={product.id}
              product={product}
              showFullInfo={showFullInfo}
              hoveredProductId={hoveredProductId}
              handleMouseEnter={this.handleMouseEnter}
              handleMouseLeave={this.handleMouseLeave}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Products;
