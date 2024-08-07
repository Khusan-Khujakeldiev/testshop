import React, { Component } from "react";
import "./productDetails.scss";

class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImageIndex: 0,
      selectedAttributes: {}, // Для хранения выбранных атрибутов
    };
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

  handleAttributeClick = (attributeId, itemId) => {
    this.setState((prevState) => ({
      selectedAttributes: {
        ...prevState.selectedAttributes,
        [attributeId]: itemId,
      },
    }));
  };

  render() {
    const { currentItem, showFullInfo } = this.props;
    const { selectedImageIndex, selectedAttributes } = this.state;

    if (!currentItem) return null;

    // Создаем массив изображений для отображения
    const images =
      currentItem.images && currentItem.images.length === 1
        ? Array(5).fill(currentItem.images[0].image_url)
        : currentItem.images.map((image) => image.image_url);

    // Создаем уникальный список атрибутов
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

    return (
      <div className="container product-details">
        <button className="btn btn-back mb-3" onClick={showFullInfo}>
          Back to Products
        </button>
        <div className="row">
          <div className="col-md-2">
            <div className="thumbnail-images d-flex flex-column">
              {images &&
                images.map((image, index) => (
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
                {currentItem.images && currentItem.images.length > 0 && (
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
              <p
                dangerouslySetInnerHTML={{ __html: currentItem.description }}
              ></p>
              <div className="product-attributes">
                {uniqueAttributes.map((attributeSet) => (
                  <div
                    key={attributeSet.attribute.id}
                    className="attribute-set mb-3"
                  >
                    <h3 className="h5">{attributeSet.attribute.name}</h3>
                    <div className="attribute-items">
                      {attributeSet.items.map((item) => (
                        <button
                          key={item.id}
                          className={`custom-attribute-button ${
                            selectedAttributes[attributeSet.attribute.id] ===
                            item.id
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            this.handleAttributeClick(
                              attributeSet.attribute.id,
                              item.id
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
                {currentItem.price &&
                  currentItem.price.length > 0 &&
                  currentItem.price.map((price) => (
                    <p key={price.currency_label} className="h4">
                      {price.currency_symbol}
                      {price.amount} {price.currency_label}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductDetails;
