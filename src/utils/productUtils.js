// productUtils.js

export const createCartItemFromProduct = (product, selectedAttributes) => {
  // Обработка всех атрибутов
  const allAttributes = product.attributes.reduce((acc, attr) => {
    const attributeName = attr.attribute.name;
    if (!acc[attributeName]) {
      acc[attributeName] = [];
    }
    if (!acc[attributeName].includes(attr.display_value)) {
      acc[attributeName].push(attr.display_value);
    }
    return acc;
  }, {});

  return {
    id: product.id,
    name: product.name,
    price: product.price[0].amount,
    currency_symbol: product.price[0].currency_symbol,
    attributes: selectedAttributes,
    allAttributes,
    image: product.images[0].image_url,
  };
};

export const checkAllAttributesSelected = (product, selectedAttributes) => {
  return product.attributes.every(
    (attribute) => selectedAttributes[attribute.attribute.name]
  );
};
