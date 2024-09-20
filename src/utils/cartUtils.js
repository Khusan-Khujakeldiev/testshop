// This utility creates a cart item object from a product
export const createCartItemFromProduct = (product) => {
  // Creating default attributes
  const defaultAttributes = product.attributes.reduce((acc, attribute) => {
    const attributeName = attribute.attribute.name;
    if (!acc[attributeName]) {
      acc[attributeName] = attribute.display_value;
    }
    return acc;
  }, {});

  // Creating object for adding to cart
  return {
    id: product.id,
    name: product.name,
    price: product.price[0].amount,
    currency_symbol: product.price[0].currency_symbol,
    attributes: defaultAttributes,
    allAttributes: product.attributes.reduce((acc, attribute) => {
      const attributeName = attribute.attribute.name;
      if (!acc[attributeName]) {
        acc[attributeName] = [];
      }
      if (!acc[attributeName].includes(attribute.display_value)) {
        acc[attributeName].push(attribute.display_value);
      }
      return acc;
    }, {}),
    image: product.images[0].image_url,
  };
};
