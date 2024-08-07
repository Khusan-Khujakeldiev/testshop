export const GET_PRODUCTS_QUERY = {
  query: `
      query GetProducts {
        products {
          id
          name
          description
          in_stock
          brand
          category {
            id
            name
          }
          price {
            amount
            currency_label
            currency_symbol
          }
          attributes {
            id
            display_value
            value
            attribute {
              id
              name
              type
            }
          }
          images {
            image_url
          }
        }
      }
    `,
};
