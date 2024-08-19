import React, { Component } from "react";
import parse from "html-react-parser";
import { connect } from "react-redux";
import { addItem } from "../../reducers/cartSlice";
import "./productDetails.scss";

class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImageIndex: 0,
      selectedAttributes: {},
      allAttributesSelected: false,
    };
  }

  componentDidMount() {
    this.checkAllAttributesSelected();
  }

  handleImageClick = (index) => {
    this.setState({ selectedImageIndex: index });
  };

  handleNextImage = () => {
    const { selectedImageIndex } = this.state;
    const { currentItem } = this.props;
    if (currentItem.images && currentItem.images.length > 0) {
      this.setState({
        selectedImageIndex:
          (selectedImageIndex + 1) % currentItem.images.length,
      });
    }
  };

  handlePrevImage = () => {
    const { selectedImageIndex } = this.state;
    const { currentItem } = this.props;
    if (currentItem.images && currentItem.images.length > 0) {
      this.setState({
        selectedImageIndex:
          (selectedImageIndex - 1 + currentItem.images.length) %
          currentItem.images.length,
      });
    }
  };

  handleAttributeClick = (attributeName, value) => {
    this.setState(
      (prevState) => ({
        selectedAttributes: {
          ...prevState.selectedAttributes,
          [attributeName]: value,
        },
      }),
      this.checkAllAttributesSelected
    );
  };

  checkAllAttributesSelected = () => {
    const { currentItem } = this.props;
    const { selectedAttributes } = this.state;

    const allAttributesSelected = currentItem.attributes.every(
      (attribute) => selectedAttributes[attribute.attribute.name]
    );

    this.setState({ allAttributesSelected });
  };

  handleAddToCart = () => {
    const { currentItem, addItem, toggleCartVisibility, isCartVisible } =
      this.props;
    const { selectedAttributes } = this.state;

    const allAttributes = currentItem.attributes.reduce((acc, attr) => {
      const attributeName = attr.attribute.name;
      if (!acc[attributeName]) {
        acc[attributeName] = [];
      }
      if (!acc[attributeName].includes(attr.display_value)) {
        acc[attributeName].push(attr.display_value);
      }
      return acc;
    }, {});

    const item = {
      id: currentItem.id,
      name: currentItem.name,
      price: currentItem.price[0].amount,
      currency_symbol: currentItem.price[0].currency_symbol,
      attributes: selectedAttributes,
      allAttributes,
      image: currentItem.images[0].image_url,
    };

    addItem(item);
    if (!isCartVisible) {
      toggleCartVisibility();
    }
  };

  renderDescription = (description) => {
    return <div className="custom-list">{parse(description)}</div>;
  };

  render() {
    const { currentItem } = this.props;
    const { selectedImageIndex, allAttributesSelected } = this.state;

    if (!currentItem) return null;

    const images =
      currentItem.images && currentItem.images.length === 1
        ? Array(5).fill(currentItem.images[0].image_url)
        : currentItem.images.map((image) => image.image_url);

    const uniqueAttributes = currentItem.attributes.reduce((acc, attr) => {
      const existingAttr = acc.find(
        (a) => a.attribute.id === attr.attribute.id
      );
      if (existingAttr) {
        existingAttr.items.push(attr);
      } else {
        acc.push({ ...attr, items: [attr] });
      }
      return acc;
    }, []);

    const isButtonDisabled =
      !currentItem.in_stock ||
      (currentItem.attributes.length > 0 && !allAttributesSelected);

    return (
      <div className="container product-details">
        <div className="row">
          <div className="col-md-2">
            <div
              className="thumbnail-images d-flex flex-column"
              data-testid="product-gallery"
            >
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={currentItem.name}
                  onClick={() => this.handleImageClick(index)}
                  className={`img-thumbnail mb-2 ${
                    selectedImageIndex === index ? "border-detail-img" : ""
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="col-md-6">
            <div className="product-gallery">
              <div className="main-image position-relative">
                <button
                  className="custom-button position-absolute left-button"
                  onClick={this.handlePrevImage}
                >
                  &lt;
                </button>
                {currentItem.images.length > 0 && (
                  <img
                    src={currentItem.images[selectedImageIndex].image_url}
                    alt={currentItem.name}
                    className="img-fluid"
                  />
                )}
                <button
                  className="custom-button position-absolute right-button"
                  onClick={this.handleNextImage}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="product-info">
              <h1 className="h2">{currentItem.name}</h1>
              <div className="product-attributes">
                {uniqueAttributes.map((attributeSet) => (
                  <div
                    key={attributeSet.attribute.id}
                    className="attribute-set mb-3"
                    data-testid={`product-attribute-${attributeSet.attribute.name
                      .toLowerCase()
                      .replace(/ /g, "-")}`}
                  >
                    <h3>{attributeSet.attribute.name}</h3>
                    <div className="attribute-items">
                      {attributeSet.items.map((item) => (
                        <button
                          key={item.id}
                          className={`custom-attribute-button ${
                            this.state.selectedAttributes[
                              attributeSet.attribute.name
                            ] === item.display_value
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            this.handleAttributeClick(
                              attributeSet.attribute.name,
                              item.display_value
                            )
                          }
                        >
                          {item.display_value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="product-price mt-4">
                <h3 className="text-dark">PRICE</h3>
                {currentItem.price.map((price) => (
                  <p key={price.currency_label}>
                    {price.currency_symbol}
                    {price.amount} {price.currency_label}
                  </p>
                ))}
              </div>
              <button
                className="btn btn-add"
                data-testid="add-to-cart"
                onClick={this.handleAddToCart}
                disabled={isButtonDisabled}
              >
                ADD TO CART
              </button>
              <div
                data-testid="product-description"
                className="product-description"
              >
                {this.renderDescription(currentItem.description)}
              </div>
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

export default connect(null, mapDispatchToProps)(ProductDetails);
