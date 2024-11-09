export const fetchCategories = async () => {
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

  const response = await fetch(
    "https://12c4-80-89-73-250.ngrok-free.app/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    }
  );

  return response.json();
};
