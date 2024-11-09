export const createOrder = async (cartItems) => {
  const mutationQuery = {
    query: `
        mutation CreateOrder($input: CreateOrderInput!) {
          createOrder(input: $input) {
            id
            product {
              id
              name
            }
            productName
            quantity
            createdAt
          }
        }
      `,
    variables: {
      input: {
        productId: cartItems[0].id,
        productName: cartItems[0].name,
        quantity: cartItems[0].quantity,
        attributes: cartItems[0].attributes
          ? Object.entries(cartItems[0].attributes).map(([name, value]) => ({
              name,
              value,
            }))
          : [],
      },
    },
  };

  const response = await fetch(
    "https://12c4-80-89-73-250.ngrok-free.app/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mutationQuery),
    }
  );

  return response.json();
};
