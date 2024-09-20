// apiUtils.js
export const fetchGraphQLData = async (query) => {
  const response = await fetch(
    "https://www.scandiwebtestshop.wuaze.com/graphql",
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
